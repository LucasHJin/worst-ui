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
      for (let _ = 0; _ < 20; _++) {
        const randomCell = Math.floor(Math.random() * tilesCount);
        const randomOpacity = (Math.random()).toFixed(2);

        const tile = containerRef.current?.children[randomCell];
        if (tile) {
          opacityRef.current[randomCell] = parseFloat(randomOpacity);
          tile.style.backgroundColor = `rgba(0, 0, 0, ${randomOpacity})`;
        }
      }
    }, 2000); // Make longer so it progressively gets more difficult over time
    return () => clearInterval(interval);
  }, [tilesCount]);

  // Handling opacity (coloring)
  const handleMouseOut = (index, e) => {
    if (mouseDown) {
      let opacity = opacityRef.current[index] || 0;
      opacity = Math.min(opacity + 0.15, 1);
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
    ctx.clearRect(0, 0, size, size);
    // Creates the image to draw on -> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData
    const imageData = ctx.createImageData(size, size);

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

  // Get data from grids (maybe not necesary)
  const getGridData = () => {
    // Get all data from the divs
    const numberData = opacityRef.current.map((opacity) =>
      Math.min(Math.max(opacity, 0), 1)
    );

    return numberData;
  };

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
          console.log(getGridData());
          console.log(getBase64Image());
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