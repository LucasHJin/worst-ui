"use client"
import React, { useState, useEffect, useRef } from "react";

export const Board = () => {
  const [blocks, setBlocks] = useState(28);
  const [mouseDown, setMouseDown] = useState(false);
  const containerRef = useRef(null);

  const tilesCount = blocks * blocks;

  const sizeSpace = blocks * 0.05 * 2;
  const remaining = 75 - sizeSpace;
  const tileSize = remaining / blocks;

  const opacityRef = useRef(Array(tilesCount).fill(0));

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

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "#fdc3c3";
  };

  return (
    <>
      <div
        ref={containerRef}
        className="container"
        style={{
          width: "75vh",
          display: "grid",
          gridTemplateColumns: `repeat(${blocks}, ${tileSize}vh)`,
          gridTemplateRows: `repeat(${blocks}, ${tileSize}vh)`,
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
    </>
  );
};
