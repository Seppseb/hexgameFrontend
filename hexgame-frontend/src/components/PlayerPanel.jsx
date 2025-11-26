export default function PlayerPanel({ side = "left" }) {
  // players 1 & 3 on left, 2 & 4 on right
  const players = side === "left" ? [1, 3] : [2, 4];

  return (
    <div className="h-full flex flex-col justify-center items-stretch">
      <h2 className="text-lg font-bold mb-3 text-center">
        {side === "left" ? "Players 1 & 3" : "Players 2 & 4"}
      </h2>

      <div className="flex flex-col gap-3">
        {players.map((num) => (
          <div
            key={num}
            className="bg-emerald-700 rounded-xl p-3 shadow text-sm text-center"
          >
            <p className="font-semibold">Player {num}</p>
            <p>Resources: 🪵 🌾 ⛰️</p>
          </div>
        ))}
      </div>
    </div>
  );
}
