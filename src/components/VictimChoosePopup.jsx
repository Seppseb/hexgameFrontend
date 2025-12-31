import { motion } from "framer-motion";
export default function VictimChoosePopup({ possibleVictims, onChoose }) {
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
        className="bg-emerald-700 p-8 rounded-xl shadow-2xl text-white w-96 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-3xl font-bold mb-6">Choose a Victim</h2>

        <div className="flex flex-col gap-3">
          {possibleVictims &&
            Array.from(possibleVictims).map((player) => (
              <button
                key={player.userId}
                onClick={() => onChoose(player.userId)}
                className="w-full py-3 rounded-lg font-semibold transition-colors bg-slate-200 hover:bg-slate-300 text-black flex items-center justify-center gap-3"
              >
                <span
                  className="w-4 h-4 rounded-full"
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: palette[player.color],
                    borderRadius: "50%"
                  }}
                />
                {player.name}
              </button>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
