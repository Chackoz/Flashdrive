"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/app/(services)/hooks/useAuth";
import GameOverModal from "@/app/components/GameOverModal";

const PixelArtCreator: React.FC = () => {
  const [pixels, setPixels] = useState<string[][]>(
    Array(20).fill(Array(16).fill("#FFFFFF"))
  );
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const user = useAuth();

  const handlePixelClick = (rowIdx: number, colIdx: number) => {
    const updatedPixels = pixels.map((row, rIdx) =>
      row.map((pixel, cIdx) =>
        rIdx === rowIdx && cIdx === colIdx ? currentColor : pixel
      )
    );
    setPixels(updatedPixels);
  };

  const handleSaveArt = () => {
    setIsSaveModalOpen(true);
    // Here, you can add functionality to save the pixel art to a database
  };

  const colorPalette = [
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#E6E6FA",
    "#3d3d3d",
  ];

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-screen">
      <Navbar />
      <div className="flex flex-col items-center w-full h-full justify-center gap-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center w-full md:w-[90%] justify-between">
          <div className="text-2xl mb-4">
            <div className="text-3xl font-semibold">
              {user ? user.displayName : "Anonymous"}
            </div>
            <span className="font-bold">Pixel Art Creator</span>
          </div>
          <div className="bg-[#2d2d2d] p-4 rounded-md shadow-md w-full md:hidden ">
            <div
              className="grid gap-1 bg-[#cdcdcd] rounded-md p-2 "
              style={{
                gridTemplateColumns: "repeat(16, 1fr)",
                gridTemplateRows: "repeat(16, 1fr)",
                display: "grid",
              }}
            >
              {pixels.map((row, rowIdx) =>
                row.map((color, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="w-4 h-4 sm:w-8 sm:h-8 rounded-sm"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePixelClick(rowIdx, colIdx)}
                  />
                ))
              )}
            </div>
          </div>
          <div className="bg-[#2d2d2d] p-2 rounded-md shadow-md w-fit md:flex hidden ">
            <div
              className="md:grid gap-1 bg-[#ededed] rounded-md p-2 hidden "
              style={{
                gridTemplateColumns: "repeat(32, 1fr)",
                gridTemplateRows: "repeat(8, 1fr)",
                display: "grid",
              }}
            >
              {pixels.map((row, rowIdx) =>
                row.map((color, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="w-4 h-4 sm:w-8 sm:h-8 rounded-sm"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePixelClick(rowIdx, colIdx)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-4 flex-wrap justify-center">
          {colorPalette.map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded-full shadow-md hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
            />
          ))}
         
        </div>
      </div>

      <GameOverModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        score={0} // No score, but you could replace this with "Art saved!"
        highscore={0}
        isNewHighscore={false}
      />
    </div>
  );
};

export default PixelArtCreator;
