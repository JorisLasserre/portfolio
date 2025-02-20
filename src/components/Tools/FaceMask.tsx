import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceMask: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image] = useState(new Image());

  useEffect(() => {
    image.src = "/apple.png"; // Remplace par l'image de ton choix
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Error accessing webcam: ", err));
  };

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    detectFaces();
    };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

      context?.clearRect(0, 0, canvas.width, canvas.height);
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      detections.forEach(detection => {
        const { x, y, width, height } = detection.box;
        context?.drawImage(image, x, y, width, height);
      });
    }, 100);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video ref={videoRef} autoPlay muted className="hidden" />
      <canvas ref={canvasRef} className="absolute" />
    </div>
  );
};

export default FaceMask;
