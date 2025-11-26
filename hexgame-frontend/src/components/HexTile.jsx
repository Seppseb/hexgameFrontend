
export default function HexTile({ type, number }) {
  const colors = {"wood": "#A8D5BA", "desert": "#F7E97E", "water": "#A9CBE8", "clay": "#D7A59A", "wheat": "#DDE48A", "stone": "#D3D4D9", "wool": "#E8F5E4"};
  const emojis = {"wood": "🌲", "desert": "🏜️", "clay": "🧱", "wheat": "🌾", "stone": "⛰️", "wool": "🐑"};

  //#A8D5BA  (mint green)
  //#F7E97E  (soft bright yellow)
  //#A9CBE8  (pastel blue)
  //#D7A59A  (soft terracotta/red-brown)
  //#DDE48A  (pear yellow-green)
  //#D3D4D9  (light silver grey)
  //#E8F5E4  (white-green seafoam)

  return (
    <div 
      className={`bg-yellow-500 clip-hexagon border border-emerald-900 flex items-center justify-center text-8xl font-bold text-emerald-950`}
      style={{
        backgroundColor: colors[type],
        width: "6rem",
        height: "6rem",
        position: "relative",
        display: "inline-block",
        margin: "-0.2rem",
        color: "black",
        fontSize: "2rem",
        lineHeight: "1",
      }}
    >
      {<> {number == "0" ? "" : number} <br /></>}
      {emojis[type]}
    </div>
  );
}
