import { motion } from "framer-motion";

export default function WinPopup({
  winner,
  singleDieStats,
  doubleDieStats,
  onReturnToGame,
}) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const palette = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    beige: "#d6d3d1",
  };

  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-[100]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-emerald-700 p-8 rounded-xl shadow-2xl text-white w-[28rem] text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* 🎉 Title */}
        <h2 className="text-4xl font-bold mb-2">🎉 Victory!</h2>
        <p className="text-lg mb-6">
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            backgroundColor: palette[winner.color],
            borderRadius: "50%"
          }}
        />
          <span className="font-semibold">{winner.name}</span> wins the game!
        </p>

        {/* 📊 Roll statistics */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Dice Roll Statistics</h3>

          <div className="overflow-hidden rounded-lg border border-emerald-500">
            <table className="w-full text-sm">
              <thead className="bg-emerald-800">
                <tr>
                  <th className="py-2 px-3 text-left">Total</th>
                  <th className="py-2 px-3 text-right">Single Die Rolled</th>
                  <th className="py-2 px-3 text-right">Both Dies Rolled</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <tr
                    key={num}
                    className="odd:bg-emerald-700 even:bg-emerald-600"
                  >
                    <td className="py-1 px-3">{num}</td>
                    <td className="py-1 px-3 text-right">
                      {singleDieStats?.[num] ?? 0}
                    </td>
                    <td className="py-1 px-3 text-right">
                      {doubleDieStats?.[num] ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔁 Return button */}
        <button
          onClick={onReturnToGame}
          className="w-full py-3 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black transition-colors"
        >
          Return to Game Board
        </button>
      </motion.div>
    </motion.div>
  );
}
