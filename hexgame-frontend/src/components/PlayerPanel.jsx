export default function PlayerPanel({ side = "left", players }) {
  // players 1 & 3 on left, 2 & 4 on right
  const playerNumber = side === "left" ? [1, 3] : [2, 4];

  let playersOfThisSide = [];
  for (const id in players) {
    let player = players[id];
    if (side === "left") {
      if (player.playerIndex == 0) playersOfThisSide[0] = player;
      if (player.playerIndex == 2) playersOfThisSide[1] = player;
    } else {
      if (player.playerIndex == 1) playersOfThisSide[0] = player;
      if (player.playerIndex == 3) playersOfThisSide[1] = player;
    }
  }

  const palette = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    beige: "#d6d3d1", // Ghost color
  };

  return (
    <div className="h-full flex flex-col justify-center items-stretch">

      <div className="flex flex-col gap-3">
        {playersOfThisSide.map((player) => (
          <div
            key={player.name}
            className="bg-emerald-700 rounded-xl p-3 shadow text-sm text-center"
          >
            <p className="font-semibold">
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: palette[player.color]
                }}
              />
              {player.name}
            </p>
            <p>wood: {player.wood}</p>
            <p>clay: {player.clay}</p>
            <p>wheat: {player.wheat}</p>
            <p>wool: {player.wool}</p>
            <p>stone: {player.stone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
