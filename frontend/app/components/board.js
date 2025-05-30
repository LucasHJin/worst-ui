"use client";
import React, { useState, useEffect, useRef } from "react";

export const Board = () => {
  const [tiles, setTiles] = useState(28);
  const [mouseDown, setMouseDown] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Sizing of tile
  const tilesCount = tiles * tiles;
  const sizeSpace = tiles * 0.01 * 2;
  const remaining = 65 - sizeSpace;
  const tileSize = remaining / tiles;

  // Keeps track of opacity for each tile
  const opacityRef = useRef(Array(tilesCount).fill(0));

  // Global listeners for mouse being clicked/not
  useEffect(() => {
    const onMouseDown = () => setMouseDown(true);
    const onMouseUp = () => setMouseDown(false);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Changes random tiles colors
  useEffect(() => {
    const interval = setInterval(() => {
      for (let _ = 0; _ < 8; _++) {
        const randomCell = Math.floor(Math.random() * tilesCount);
        const randomOpacity = (Math.random()).toFixed(2);

        const tile = containerRef.current?.children[randomCell];
        if (tile) {
          opacityRef.current[randomCell] = parseFloat(randomOpacity);
          tile.style.backgroundColor = `rgba(0, 0, 0, ${randomOpacity})`;
        }
      }
    }, 3000); // Make longer so it progressively gets more difficult over time
    return () => clearInterval(interval);
  }, [tilesCount]);

  // Handling opacity (coloring)
  const handleMouseOut = (index, e) => {
    if (mouseDown) {
      let opacity = opacityRef.current[index] || 0;
      opacity = Math.min(opacity + 0.35, 1);
      opacityRef.current[index] = opacity;
      e.target.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    } else {
      e.target.style.backgroundColor = "#eee";
    }
  };

  // Handling erasing
  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "#fdc3c3";
  };

  // Get image to put into model (https://www.w3schools.com/graphics/canvas_drawing.asp)
  const getBase64Image = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d"); // Allows drawing on the canvas -> https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext

    // Set canvas to be 28x28 px (required dimensions)
    canvas.width = tiles;
    canvas.height = tiles;

    // Clear the drawing reference in case there is leftover color
    ctx.clearRect(0, 0, tiles, tiles);
    // Creates the image to draw on -> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData
    const imageData = ctx.createImageData(tiles, tiles);

    // Set each pixel's value to the grid tiles
    for (let pixel= 0; pixel < tilesCount; pixel++) {
      const opacity = Math.min(Math.max(opacityRef.current[pixel], 0), 1); // Needs to be 0 or 1 (round)
      const colorVal = Math.round(255 * (1 - opacity)); 

      // Each pixel value needs to be made up of 4 values (RGBA -> opacity is full)
      const pixelIndex = pixel * 4;
      imageData.data[pixelIndex] = colorVal;
      imageData.data[pixelIndex + 1] = colorVal;
      imageData.data[pixelIndex + 2] = colorVal;
      imageData.data[pixelIndex + 3] = 255;
    }

    // Populates the canvas with the image
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png"); // Return as base 64
  };

  // Get prediction from model
  async function predictDigit(base64Image) {
    // Convert to blob (https://medium.com/@nyoman.adi16/base64-vs-arraybuffer-vs-blob-the-battle-of-binary-which-one-should-you-use-9180148d8c38)
    const res = await fetch(base64Image);
    const blob = await res.blob();

    // Allows to then convert to a file (backend expects this) because file is a child subclass of blob
    const file = new File([blob], "digit.png", { type: "image/png" });

    // Structure to send data to backend under the key "file" (like json for imgs/files)
    const formData = new FormData();
    formData.append("file", file);

    // Send POST request to backend (sending data)
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Prediction failed");
    }
    const result = await response.json();
    return result.prediction;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="container"
        style={{
          width: "65vh",
          display: "grid",
          gridTemplateColumns: `repeat(${tiles}, ${tileSize}vh)`,
          gridTemplateRows: `repeat(${tiles}, ${tileSize}vh)`,
          gap: "0.1vh",
        }}
      >
        {Array.from({ length: tilesCount }).map((_, index) => (
          <div
            key={index}
            className="tile"
            style={{
              height: `${tileSize}vh`,
              width: `${tileSize}vh`,
              backgroundColor: "#eee",
              border: "1px solid black",
              userSelect: "none",
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={(e) => handleMouseOut(index, e)}
          />
        ))}
      </div>
      <button
        onClick={async () => {
          console.log(getBase64Image());
          const base64Img = getBase64Image();
          const prediction = await predictDigit(base64Img);
          console.log("Predicted digit:", prediction);
        }}
      >
        Predict
      </button>
      <canvas
        ref={canvasRef}
        width={tiles}
        height={tiles}
        style={{ display: "none" }}
      />
    </>
  );
};