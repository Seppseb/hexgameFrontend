export default function HexTile({ type, number, hasRobber = false, isPlacingRobber, onClick }) {
  const colors = { "wood": "#A8D5BA", "desert": "#F7E97E", "water": "#A9CBE8", "clay": "#D7A59A", "wheat": "#DDE48A", "stone": "#D3D4D9", "wool": "#E8F5E4" };
  const emojis = { "wood": "🌲", "desert": "🏜️", "clay": "🧱", "wheat": "🌾", "stone": "⛰️", "wool": "🐑" };
  const robberEmoji = "🥷";

  return (
    <div 
      // 1. Added transition and duration for smooth scaling
      // 2. Added conditional hover scale and cursor pointer
      className={`
        clip-hexagon border border-emerald-900 flex flex-col items-center justify-center font-bold text-emerald-950
        transition-transform duration-200 ease-in-out
        ${isPlacingRobber ? "hover:scale-110 cursor-pointer hover:z-10" : ""}
      `}
      style={{
        backgroundColor: colors[type],
        width: "6rem",
        height: "6rem",
        position: "relative",
        display: "inline-flex",
        margin: "-0.2rem",
        color: "black",
        fontSize: "2rem",
        lineHeight: "1",
      }}
      // 3. Trigger the parent function only if we are in "placing" mode
      onClick={() => isPlacingRobber && onClick?.()}
    >
      {number !== "0" && <div className="mb-1">{number}</div>}

      <div className="flex items-center justify-center gap-1">
        <span>{emojis[type]}</span>
        {hasRobber && <span>{robberEmoji}</span>}
      </div>
    </div>
  );
}