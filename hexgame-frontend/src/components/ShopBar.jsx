import { useEffect, useState } from "react";

import { buyDevelopment, endTurn } from "../api/gamesApi";

export default function ShopBar({ gameId, bank, log, isPlayerTurn }) {

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

    const handleBuyDevelopment = () => {
      buyDevelopment(gameId);
    };

    const handleEndTurn = () => {
      endTurn(gameId);
    };


    return (
      <div className="flex justify-around items-center h-full px-6">
          <p className="font-semibold">{logMessage}</p>
          <p className="font-semibold">Bank wood: {bank?.resBalance["wood"]} clay: {bank?.resBalance["clay"]} wheat: {bank?.resBalance["wheat"]} wool: {bank?.resBalance["wool"]} stone: {bank?.resBalance["stone"]}</p>
        {isPlayerTurn && <button onClick={handleBuyDevelopment} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          Buy Development Card
        </button>}
        {isPlayerTurn && <button onClick={handleEndTurn} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          End Turn
        </button>}
      </div>
    );
  }
  