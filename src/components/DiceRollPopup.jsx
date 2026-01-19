import { motion } from "framer-motion";
import { useState } from "react";

const getDiceFace = (value) => {
  const faces = {
    1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
  };
  return faces[value] || '?';
};

const Dice = ({ value, isRolling, hasRolled }) => (
    <motion.div
      className={`dice-face ${isRolling ? 'rolling' : ''} bg-white text-black text-[7rem] font-bold flex items-center justify-center rounded-lg shadow-xl`}
      style={{ width: '100px', height: '100px', margin: '0 15px' }} 
      initial={false}
      animate={isRolling ? { rotate: [0, 360, 0, -360, 0] } : { rotate: 0 }}
      transition={isRolling ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0 }}
    >
      {!hasRolled ? '❓' : getDiceFace(value)}
    </motion.div>
  );

export default function DiceRollPopup({ diceValues, onConfirm }) {
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  const [dice1Value, dice2Value] = diceValues;

  const handleRollDice = () => {
    if (hasRolled) return;

    setIsRolling(true);

    setTimeout(() => {
      setIsRolling(false);
      setHasRolled(true);
    }, 1000);
  };

  const handleConfirm = () => {
    onConfirm();
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      // Use "fixed inset-0" to cover the whole viewport
      // Use "flex items-center justify-center" to center the child element
      className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-[100]" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-emerald-700 p-8 rounded-xl shadow-2xl text-white w-96 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-3xl font-bold mb-6">Your Turn to Roll!</h2>
        
        <div className="flex justify-center items-center mb-6">
          <Dice value={dice1Value} isRolling={isRolling} hasRolled={hasRolled} />
          <Dice value={dice2Value} isRolling={isRolling} hasRolled={hasRolled} />
        </div>

        <p className="mb-6 text-lg">
          {hasRolled ? `You rolled a total of: ${Number(dice1Value) + Number(dice2Value)}` : "Press the button to roll the dice."}
        </p>


        {!hasRolled && (
          <button
            onClick={handleRollDice}
            disabled={isRolling}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isRolling
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-black'
            }`}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        )}


        {hasRolled && (
          <button
            onClick={handleConfirm}
            className="mt-4 text-sm text-gray-300 hover:text-white"
          >
            Confirm
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}