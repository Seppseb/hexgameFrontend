import React from 'react';

//TODO new atribute isPlaceable which contains array of users that can place road in backend, if placeable send color beige, remove isPlacing road , then same for village

export default function HexPath({ 
  color, 
  isPlacingRoad,
  angle, 
  top, 
  left, 
  onClick 
}) {
  // If no color/owner, the path doesn't exist or is not buildable
  if (color === null) return null;
  if (color == "beige" && !isPlacingRoad) return null;

  // --- CONFIG ---
  // Map server colors to display colors
  const palette = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    beige: "#d6d3d1", // Ghost color
  };

  const displayColor = palette[color] || "#9ca3af";
  const isInteractive = color === "beige";

  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      className={`absolute z-10 flex items-center justify-center
        ${isInteractive ? "pointer-events-auto cursor-pointer hover:brightness-110" : "pointer-events-none"}`}
      style={{
        top: top,
        left: left,
        width: '0px',
        height: '0px',
        // Rotate the entire container so the road bar aligns correctly
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      {/* THE ROAD SEGMENT */}
      <div 
        className="rounded-full shadow-sm flex-none"
        style={{
            backgroundColor: displayColor,
            // Dimensions of the road
            width: '0.4rem',  // Thickness
            height: '2.9rem', // Length (approx side length of hex)
            
            // Visual tweaks
            border: isInteractive ? '2px dashed #a8a29e' : '1px solid rgba(0,0,0,0.2)',
            opacity: isInteractive ? 0.6 : 1,
            boxShadow: isInteractive ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}