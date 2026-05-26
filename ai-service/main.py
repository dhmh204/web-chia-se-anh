from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import cv2
import numpy as np
import urllib.request
import os
import uuid
from sklearn.cluster import AgglomerativeClustering

app = FastAPI(title="NooFoto AI Face Clustering Service")

# Setup upload directory relative to the Next.js project root
UPLOAD_DIR = os.path.join("..", "public", "uploads", "faces")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ImageItem(BaseModel):
    ma_hinh_anh: str
    url_anh: str

class ProcessAlbumRequest(BaseModel):
    photos: List[ImageItem]
    threshold: float = 0.60

# Model URLs and Local Paths
YUNET_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
SFACE_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

yunet_path = os.path.join(MODELS_DIR, "face_detection_yunet_2023mar.onnx")
sface_path = os.path.join(MODELS_DIR, "face_recognition_sface_2021dec.onnx")

def download_file(url, dest_path):
    if not os.path.exists(dest_path):
        print(f"Downloading {url} to {dest_path}...")
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Successfully downloaded {dest_path}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")
            raise e

# Download models if they don't exist
download_file(YUNET_URL, yunet_path)
download_file(SFACE_URL, sface_path)

# Initialize YuNet detector and SFace recognizer
detector = cv2.FaceDetectorYN.create(yunet_path, "", (320, 320))
recognizer = cv2.FaceRecognizerSF.create(sface_path, "")

@app.post("/api/process-album")
async def process_album(request: ProcessAlbumRequest):
    all_detected_faces = []
    features_list = []

    for photo in request.photos:
        try:
            # 1. Download image
            resp = urllib.request.urlopen(photo.url_anh)
            image_bytes = np.asarray(bytearray(resp.read()), dtype="uint8")
            image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

            if image is None:
                continue

            height, width, _ = image.shape
            
            # Set input size dynamically for the image
            detector.setInputSize((width, height))

            # 2. Detect faces using YuNet
            retval, faces = detector.detect(image)

            if faces is not None:
                for face in faces:
                    # Confidence score is at index 14
                    confidence = float(face[14])
                    if confidence < 0.5:  # Filter out low confidence detections
                        continue

                    # 3. Align face using SFace (creates 112x112 crop)
                    aligned_face = recognizer.alignCrop(image, face)
                    if aligned_face is None or aligned_face.size == 0:
                        continue

                    # 4. Save aligned crop as avatar
                    face_uuid = str(uuid.uuid4())
                    filename = f"{face_uuid}.jpg"
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    cv2.imwrite(file_path, aligned_face)

                    # 5. Extract 112-d feature vector using SFace
                    feature = recognizer.feature(aligned_face)
                    flat_feature = feature.flatten().tolist()

                    # Bounding box coordinates (percentage of image)
                    # Clip coordinates to 0 - width/height boundary
                    x = max(0.0, float(face[0]))
                    y = max(0.0, float(face[1]))
                    w = min(float(width - x), float(face[2]))
                    h = min(float(height - y), float(face[3]))

                    all_detected_faces.append({
                        "ma_hinh_anh": photo.ma_hinh_anh,
                        "url_anh": photo.url_anh,
                        "avatar_path": f"/uploads/faces/{filename}",
                        "coordinates": {
                            "x": (x / width) * 100,
                            "y": (y / height) * 100,
                            "w": (w / width) * 100,
                            "h": (h / height) * 100
                        }
                    })
                    features_list.append(flat_feature)

        except Exception as e:
            print(f"Error processing image {photo.url_anh}: {e}")
            continue

    if not all_detected_faces:
        return {"success": True, "groups": []}

    # 6. Cluster faces using Agglomerative Clustering on Cosine distance
    # Linkage 'average' groups based on the average similarity of all faces in the group,
    # preventing the chaining effect of DBSCAN.
    if len(features_list) == 1:
        labels = np.array([0])
    else:
        clustering = AgglomerativeClustering(
            n_clusters=None,
            distance_threshold=request.threshold,
            metric="cosine",
            linkage="average"
        )
        labels = clustering.fit_predict(features_list)

    # 7. Group faces by cluster label
    groups_map = {}
    for idx, label in enumerate(labels):
        cluster_id = str(label) if label != -1 else f"outlier-{idx}"
        if cluster_id not in groups_map:
            groups_map[cluster_id] = []
        groups_map[cluster_id].append(idx)

    # 8. Format output response
    formatted_groups = []
    for g_id, indices in groups_map.items():
        # Select the first face in the group as the group's avatar/representative
        rep_face = all_detected_faces[indices[0]]
        
        group_faces = []
        for index in indices:
            face = all_detected_faces[index]
            group_faces.append({
                "ma_hinh_anh": face["ma_hinh_anh"],
                "avatar_path": face["avatar_path"],
                "vector": features_list[index],
                "coordinates": face["coordinates"]
            })

        formatted_groups.append({
            "ten_nhan_vat": "Người lạ",
            "anh_dai_dien": rep_face["avatar_path"],
            "faces": group_faces
        })

    return {"success": True, "groups": formatted_groups}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
