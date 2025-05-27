"use client";
import React, { useState, useEffect, useRef } from "react";

export const Board = () => {
  const [tiles, setTiles] = useState(28);
  const [mouseDown, setMouseDown] = useState(false);
  const containerRef = useRef(null);

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
      for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * tilesCount);
        const randomOpacity = (Math.random() * 0.6).toFixed(2);

        const tile = containerRef.current?.children[randomIndex];
        if (tile) {
          opacityRef.current[randomIndex] = parseFloat(randomOpacity);
          tile.style.backgroundColor = `rgba(0, 0, 0, ${randomOpacity})`;
        }
      }
    }, 750);
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
    </>
  );
};
