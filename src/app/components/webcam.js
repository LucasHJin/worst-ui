"use client";
import React, { useRef } from "react";
import Webcam from "react-webcam";

// https://www.npmjs.com/package/react-webcam

const videoConstraints = {
  width: 640,
  height: 360,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={640}
        height={360}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </div>
  );
};

export default WebcamCapture;