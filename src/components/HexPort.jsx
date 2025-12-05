import React from 'react';

export default function HexPort({
  port,
  angle,
  top,
  left,
}) {

  const emojis = {
    "wood": "🌲",
    "clay": "🧱",
    "wheat": "🌾",
    "stone": "⛰️",
    "wool": "🐑",
    "desert": "🏜️" // Added for completeness, although not a port type
  };


  if (!port) return null;

  // --- PORT CONFIGURATION ---
  const showPort = port !== null && typeof port === 'object';
  let portContent = null;
  let portRatio = null;

  if (showPort) {
    if (port.type === null) {
      portContent = "3:1"; // Generic 3:1 Port
      portRatio = "3:1";
    } else {
      portContent = `${emojis[port.type]}`; // Specific 2:1 Resource Port
      portRatio = "2:1";
    }
  }


  // --- RENDER ---
  return (
    <div
      className={`absolute z-10 flex items-center justify-center pointer-events-none`}
      style={{
        top: top,
        left: left,
        width: '0px',
        height: '0px',
        // Rotate the entire container so the road bar aligns correctly
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      {/* --- PORT VISUALIZATION (Appears on both sides if applicable) --- */}
      {showPort && (
        <>
          {/* Port 1 (Top/Left side of the rotated path) */}
          <div
            className={`absolute flex items-center justify-center rounded-full text-xs font-bold text-white bg-gray-800 border-2 ${portRatio === '3:1' ? 'border-gray-500' : 'border-yellow-400'}`}
            style={{
              // Position relative to the road segment (adjusting for path thickness/length)
              top: '-1.15rem',
              left: '-2.0rem',
              width: '1.6rem',
              height: '1.6rem',
              zIndex: -10, // behind the tile
              // Counter-rotate the port, adding 45deg to correct the clockwise offset
              transform: `rotate(${-angle}deg)`, // <--- FIX APPLIED HERE
            }}
          >
            {portContent}
          </div>

          {/* Port 2 (Bottom/Right side of the rotated path) */}
          <div
            className={`absolute flex items-center justify-center rounded-full text-xs font-bold text-white bg-gray-800 border-2 ${portRatio === '3:1' ? 'border-gray-500' : 'border-yellow-400'}`}
            style={{
              // Position relative to the road segment (adjusting for path thickness/length)
              top: '-1.15rem',
              left: '0.3rem',
              width: '1.6rem',
              height: '1.6rem',
              zIndex: -10, 
              // Counter-rotate the port, adding 45deg to correct the clockwise offset
              transform: `rotate(${-angle}deg)`, // <--- FIX APPLIED HERE
            }}
          >
            {portContent}
          </div>
        </>
      )}

    </div>
  );
}