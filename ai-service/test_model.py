import cv2
import os

detector_path = "models/face_detection_yunet_2023mar.onnx"
sface_path = "models/face_recognition_sface_2021dec.onnx"

print("Detector exists:", os.path.exists(detector_path))
print("Detector size:", os.path.getsize(detector_path) if os.path.exists(detector_path) else 0)

print("SFace exists:", os.path.exists(sface_path))
print("SFace size:", os.path.getsize(sface_path) if os.path.exists(sface_path) else 0)

detector = cv2.FaceDetectorYN.create(
    detector_path,
    "",
    (320, 320),
    0.9,
    0.3,
    5000
)

recognizer = cv2.FaceRecognizerSF.create(
    sface_path,
    ""
)

print("Models loaded successfully")