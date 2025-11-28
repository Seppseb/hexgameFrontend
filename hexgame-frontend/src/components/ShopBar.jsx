import { useEffect, useState } from "react";

export default function ShopBar({ onEndTurn, bank, log }) {

    const [logMessage, setLogMessage] = useState("");

    useEffect(() => {
      if (!log) return;
      if (log.type === "INITIAL_ROLL" || log.type === "START_TURN") {
        const dice1 = Number(log.message[0]);
        const dice2 = Number(log.message[1]);
        const diceValue = dice1 + dice2;
        setLogMessage(log.playerName + " threw: " + diceValue);
      }
    }, [log]);


    return (
      <div className="flex justify-around items-center h-full px-6">
          <p className="font-semibold">{logMessage}</p>
          <p className="font-semibold">Bank wood: {bank?.wood} clay: {bank?.clay} wheat: {bank?.wheat} wool: {bank?.wool} stone: {bank?.stone}</p>
        <button onClick={onEndTurn} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          End Turn
        </button>
      </div>
    );
  }
  