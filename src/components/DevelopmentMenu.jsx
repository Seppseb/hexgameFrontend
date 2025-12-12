import React from "react";

const resEmojis = { wood: "🌲", clay: "🧱", wheat: "🌾", stone: "⛰️", wool: "🐑" };

export default function DevelopmentMenu({ type, onConfirm, onCancel, style }) {
  const isMonopoly = type === "monopoly";

  return (
    <div
    className="absolute z-50 flex flex-col items-center bg-white/95 rounded-lg shadow-xl p-2 border border-slate-200 animate-in fade-in zoom-in duration-200"
    style={style}
    >
      <span className="text-xs font-bold text-slate-500 mb-1">Play {type}?</span>

      {isMonopoly ? (
        <div className="flex gap-2 mb-2">
          {Object.entries(resEmojis).map(([res, emoji]) => (
            <button
              key={res}
              onClick={() => onConfirm(res)}
              className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => onConfirm(null)}
            className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center font-bold"
          >
            ✓
          </button>
        </div>
      )}

      <button
        onClick={onCancel}
        className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center font-bold"
      >
        ✕
      </button>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
    </div>
  );
}
