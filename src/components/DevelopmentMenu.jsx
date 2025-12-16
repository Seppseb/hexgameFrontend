import React from "react";

const resEmojis = { wood: "🌲", clay: "🧱", wheat: "🌾", stone: "⛰️", wool: "🐑" };

export default function DevelopmentMenu({ type, onConfirm, onCancel, style }) {
  const isMonopoly = type === "monopoly";

  return (
    <div
      className="absolute z-50 rounded-lg shadow-xl p-3 border border-white/20 animate-in fade-in zoom-in duration-200"
      style={{
        ...style,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // 85% opacity white
        backdropFilter: 'blur(3px)',                // Blur for readability
        color: '#1e293b',                             // Force dark slate text
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '120px'
      }}
    >
      <span style={{ 
        fontSize: '12px', 
        fontWeight: '800', 
        marginBottom: '10px', 
        textTransform: 'uppercase' 
      }}>
        Play {type}?
      </span>

      <div className="flex flex-col gap-3 items-center">
        {isMonopoly ? (
          <div className="flex gap-2">
            {Object.entries(resEmojis).map(([res, emoji]) => (
              <button
                key={res}
                onClick={() => onConfirm(res)}
                style={{
                  backgroundColor: '#fef3c7', // amber-100
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => onConfirm(null)}
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
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✓
          </button>
        )}

        {/* Cancel Button - Always at the bottom */}
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
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ✕
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