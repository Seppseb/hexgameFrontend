import React from 'react';

export default function BuildMenu({ onConfirm, onCancel, style }) {
  return (
    <div
      className="absolute z-50 rounded-lg shadow-xl p-2 border border-white/20 animate-in fade-in zoom-in duration-200"
      style={{
        ...style,
        // Using RGBA for that 75% opacity effect
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        backdropFilter: 'blur(3px)', // Blurs the game world behind the menu
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '90px'
      }}
    >
      <span style={{ 
        color: '#1e293b', 
        fontSize: '12px', 
        fontWeight: '800', 
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Build?
      </span>
      
      <div className="flex gap-3">
        {/* Cancel Button */}
        <button 
          onClick={onCancel}
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white', 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ✕
        </button>

        {/* Confirm Button */}
        <button 
          onClick={onConfirm}
          style={{ 
            backgroundColor: '#22c55e', 
            color: 'white', 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ✓
        </button>
      </div>
      
      {/* Triangle Pointer */}
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0',
        height: '0',
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid rgba(255, 255, 255, 0.85)'
      }}></div>
    </div>
  );
}