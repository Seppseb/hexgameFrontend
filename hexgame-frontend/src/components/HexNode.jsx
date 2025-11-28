// HexNode.jsx
import React from 'react';

export default function HexNode({ 
  currentPlayerColor,
  color, 
  isPlacingVillage,
  isPlacingCity,
  buildFactor, 
  top, 
  left, 
  onClick 
}) {

  // --- 1. VISIBILITY CHECK ---
  // The User Requirement: "node should not show if the owner is null"
  if (color === null) return null;
  if (color == "beige" && !isPlacingVillage) return null;

  const palette = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    white: "#ffffff",
    black: "#000000",
    beige: "#d6d3d1" 
  };

  const fill = palette[color] || "#9ca3af";
  
  // --- 2. INTERACTIVITY CHECK ---
  // Only beige nodes are clickable
  const isInteractive = color === "beige" || (color === currentPlayerColor && buildFactor == 1 && isPlacingCity); 

  return (
    <div
      onClick={isInteractive ? onClick : undefined} 
      className={`absolute z-20 flex items-center justify-center 
        ${isInteractive ? "pointer-events-auto cursor-pointer hover:scale-125 transition-transform" : "pointer-events-none"}`}
      style={{
        top: top,
        left: left,
        width: '2rem', 
        height: '2rem',
        transform: 'translate(-50%, -50%)', 
      }}
    >
      <svg 
        viewBox="0 0 24 24" 
        style={{ 
            width: '2rem', 
            height: '2rem', 
            fill: fill, 
            stroke: isInteractive ? '#78716c' : 'black', 
            strokeWidth: '1px',
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))'
        }}
      >
        {/* --- 3. SHAPE LOGIC --- */}
        
        {/* CASE A: Owner is Beige (Construction Site) - Show Circle */}
        {color === "beige" && (
           <circle cx="12" cy="12" r="6" opacity="0.8" />
        )}

        {/* CASE B: Owner is a Player (Red/Blue/etc) - Show Buildings */}
        {color !== "beige" && (
          <>
            {buildFactor === 1 && <polygon points="12,2 22,20 2,20" />}
            {buildFactor === 2 && <polygon points="12,2 22,9 18,22 6,22 2,9" />}
          </>
        )}

      </svg>
    </div>
  );
}