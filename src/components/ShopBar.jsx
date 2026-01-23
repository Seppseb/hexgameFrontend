import { useEffect, useState } from "react";

import { buyDevelopment, endTurn, throwDiceForTurn } from "../api/gamesApi";

export default function ShopBar({ gameId, bank, log, isPlayerTurn, isBuildPhase, game }) {

    const [logMessage, setLogMessage] = useState("");
    const [stateMessage, setStateMessage] = useState("");

    const palette = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#eab308",
      beige: "#d6d3d1",
  };

    useEffect(() => {
      if (!log) return;
      if (log.type === "THREW_DICE") {
        const dice1 = Number(log.message[0]);
        const dice2 = Number(log.message[1]);
        const diceValue = dice1 + dice2;
        setLogMessage(log.playerName + " threw: " + diceValue);
      }
    }, [log]);

    useEffect(() => {
      console.log(game);
      if (!game) return;
      let message = "Wating for ";
      if (game.currentPlayer && !game.isWaitingForPlayerRessourceChange && game.state !== "ROLL_FOR_POSITION") {
        message+= game.currentPlayer.name;
      }
      if (game.state === "ROLL_FOR_POSITION") {
        message+= "player(s) to throw dice";
      } else if (game.state === "PLACEMENT") {
        if (game.isInitialIsPlacingRoad) {
          message+= " to place road";
        } else {
          message+= " to place village";
        }
      } else {
        if (game.isWaitingForPlayerRessourceChange) {
          message+= "player(s) to trade with Bank";
        } else if (game.isWaitingForMovingRobber) {
          message+= " to move robber";
        } else if (game.isWaitingForChoosingVictim) {
          message+= " to choose victim";
        } else if (game.isWaitingForFreeRoadPlacement) {
          message+= " to place road";
        } else if (isBuildPhase) {
          message+= " to finish turn";
        } else {
          message+= " to throw dice";
        }

      }
      setStateMessage(message);
    }, [game]);

    const handleBuyDevelopment = () => {
      buyDevelopment(gameId);
    };

    const handleThrowDice = () => {
      throwDiceForTurn(gameId);
    };

    const handleEndTurn = () => {
      endTurn(gameId);
    };

    const parseRes = (res) => {
      if (!bank || !bank.resBalance) return "";
      return bank.showExactRes ? bank.resBalance[res] : bank.resBalance[res] === 0 ? 0 : "≥" + bank.resBalance[res]; 
    }


    return (
      <div className="flex justify-around items-center h-full px-6">
          <p className="font-semibold">{logMessage}</p>
          <p className="font-semibold">{stateMessage}</p>
          <p className="font-semibold">Bank wood: {parseRes("wood")} clay: {parseRes("clay")} wheat: {parseRes("wheat")} wool: {parseRes("wool")} stone: {parseRes("stone")} developments: {bank?.numberDevelopments}</p>
        {isPlayerTurn && isBuildPhase && <button onClick={handleBuyDevelopment} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          Buy Development Card
        </button>}
        {isPlayerTurn && !isBuildPhase && <button onClick={handleThrowDice} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          Throw Dice
        </button>}
        {isPlayerTurn && isBuildPhase && <button onClick={handleEndTurn} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
          End Turn
        </button>}
      </div>
    );
  }
  