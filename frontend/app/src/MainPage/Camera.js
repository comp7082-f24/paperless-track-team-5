// src/MainPage/Camera.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture }) => {
    const webcamRef = useRef(null);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        onCapture(imageSrc); // Pass the captured image back to the Dashboard
    }, [webcamRef, onCapture]);

    return (
        <div className="camera-container">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
            />
            <button className="capture-button" onClick={capture}>Capture Photo</button>
        </div>
    );
};

export default CameraCapture;
