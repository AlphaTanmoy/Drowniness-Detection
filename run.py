# run.py

import numpy as np
import torch
from matplotlib import pyplot as plt
import cv2
import uuid
import os
import time

def main():
    model = torch.hub.load('ultralytics/yolov5', 'custom', path='runs/train/exp36/weights/last.pt', force_reload=True)

    cap = cv2.VideoCapture(0)
    start_time = time.time()
    duration = 10  # auto-stop after 10 seconds

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        cv2.imshow('YOLO', np.squeeze(results.render()))

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:  # q or ESC to quit
            break
        if time.time() - start_time > duration:
            print("Auto-closed after 10 seconds")
            break

    cap.release()
    cv2.destroyAllWindows()
