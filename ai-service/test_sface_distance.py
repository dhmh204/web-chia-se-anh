import cv2
import numpy as np
import os
from sklearn.metrics.pairwise import cosine_similarity

# Path to the cropped faces directory
FACES_DIR = os.path.join("..", "public", "uploads", "faces")
SFACE_PATH = os.path.join("models", "face_recognition_sface_2021dec.onnx")

def main():
    if not os.path.exists(FACES_DIR):
        print(f"Directory {FACES_DIR} does not exist.")
        return
    if not os.path.exists(SFACE_PATH):
        print(f"Model {SFACE_PATH} does not exist.")
        return

    recognizer = cv2.FaceRecognizerSF.create(SFACE_PATH, "")

    # Load all face images
    face_files = [f for f in os.listdir(FACES_DIR) if f.endswith(".jpg")]
    if not face_files:
        print("No face images found.")
        return

    print(f"Found {len(face_files)} face images. Extracting features...")

    features = []
    names = []

    for file in face_files:
        path = os.path.join(FACES_DIR, file)
        img = cv2.imread(path)
        if img is None:
            continue
        
        # SFace expects 112x112 aligned face
        # The cropped images are already 112x112. Let's resize just in case.
        img_resized = cv2.resize(img, (112, 112))
        
        # Extract feature
        feat = recognizer.feature(img_resized)
        features.append(feat.flatten())
        names.append(file)

    if not features:
        print("No features extracted.")
        return

    features = np.array(features)
    
    # Compute pairwise cosine similarity
    sim_matrix = cosine_similarity(features)

    print("\nPairwise Cosine Similarity Matrix (higher is more similar, max 1.0):")
    print("---------------------------------------------------------------------")
    
    # Print header
    header = "Image".ljust(15) + " | " + " | ".join([f"{i:2d}" for i in range(len(face_files))])
    print(header)
    print("-" * len(header))

    for idx, name in enumerate(names):
        row_str = f"[{idx:2d}] {name[:10]}... | " + " | ".join([f"{sim_matrix[idx][j]:.2f}" for j in range(len(names))])
        print(row_str)

if __name__ == "__main__":
    main()
