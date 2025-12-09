import React, { useEffect, useState } from "react";
import { bankTrade } from "../api/gamesApi";

function ResourceControl({ label, isPlayer, isPlayerTurn, currentValue, changeValue, onChange }) {
  // Logic: Down arrow should be hidden if giving away more than you have, 
  // i.e., the current resource amount plus the change must be >= 0.
  // NOTE: Your current logic (>= 1) means you must keep at least 1 resource, which is a valid game rule.
  const downArrowVisible = (currentValue + changeValue) >= 1;
  
  // Up arrow always visible
  const upArrowVisible = true; 

  return (
    <div className="flex items-center justify-center text-sm mb-1">

      {/* Label: Fixed width + text-right ensures the colon : always lines up */}

      <span className="capitalize w-14 text-right mr-2" >{label}:&nbsp;</span>

      <div className="flex items-center gap-1">

        {label === "wood" && <span >&nbsp;&nbsp;&nbsp;</span>}

        {label === "clay" && <span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}

        {label === "wheat" && <span >&nbsp;&nbsp;</span>}

        {label === "wool" && <span >&nbsp;&nbsp;&nbsp;&nbsp;</span>}

        {label === "stone" && <span >&nbsp;&nbsp;&nbsp;</span>}

        {/* Current Amount */}

        <span className="font-mono w-4 text-center">{currentValue}&nbsp;</span>
      </div>
      
      {/* COLUMN 3: Interaction Area (Fixed width w-24 to RESERVE SPACE) */}
      <div className="w-24 flex items-center justify-center">
        {isPlayer && isPlayerTurn ? (
          <>
            {/* Down Arrow */}
            <button
              onClick={() => onChange(-1)}
              className={`
                p-0.5 rounded hover:bg-red-900/30 text-red-300 hover:text-red-200 transition-all
                ${downArrowVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* Change Display (Middle Text) */}
            <div className={`w-6 text-center font-bold text-xs ${changeValue !== 0 ? 'visible' : 'invisible'}`}>
              <span className={changeValue > 0 ? "text-green-300" : "text-red-300"}>
                {changeValue > 0 ? "+" : ""}{changeValue}
              </span>
            </div>

            {/* Up Arrow */}
            <button
              onClick={() => onChange(1)}
              className={`
                p-0.5 rounded hover:bg-green-900/30 text-green-300 hover:text-green-200 transition-all
                ${upArrowVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
          </>
        ) : (
          // When isPlayer is false, this container is empty but holds the w-24 space,
          // ensuring the whole row's width remains constant and aligned.
          <div className="h-full"></div> 
        )}
      </div>
    </div>
  );
}

export default function PlayerPanel({ side = "left", players, playerId, gameId, isPlayerTurn }) {
  const [pendingChanges, setPendingChanges] = useState({});
  const [canTradeBank, setCanTradeBank] = useState(false);
  const [canTradeMultipleRessourcesAtOnce, setCanTradeMultipleRessourcesAtOnce] = useState(false);

  const handleResourceChange = (resource, delta) => {

    setPendingChanges((prev) => {
      const currentChange = prev[resource] || 0;
      const newChange = currentChange + delta;
      return { ...prev, [resource]: newChange };
    });
  };

  //TODO switch logic: currentplayer right, rest all left, hide other cards, show knight, vicpoints, numcards, numdevs on hand, played devs

  useEffect(() => {
    if (!playerId) return;
    if (!players) return;
    if (!players[playerId]) return;
    if (!players[playerId].tradeFactor) return;


    let takenRessources = 0;
    let canTakeRessources = 0;
    let canTakeRessourcesFromOverFlow = 0;
    for (const res in pendingChanges) {
      let playerGetsAmount = pendingChanges[res];
      if (playerGetsAmount > 0) {
        takenRessources += playerGetsAmount;
      } else if (playerGetsAmount < 0) {
        let playerGivesAmount = -playerGetsAmount;
        let overflow = playerGivesAmount % players[playerId].tradeFactor[res];
        playerGivesAmount-= overflow;
        canTakeRessourcesFromOverFlow += overflow / players[playerId].tradeFactor[res];
        canTakeRessources += playerGivesAmount / players[playerId].tradeFactor[res];
      }
    }
    console.log();
    console.log(takenRessources);
    console.log(canTakeRessources);
    console.log(canTakeRessourcesFromOverFlow);
    if (canTradeMultipleRessourcesAtOnce) {
      canTakeRessources += canTakeRessourcesFromOverFlow;
    } else {
      if (canTakeRessourcesFromOverFlow != 0) {
        setCanTradeBank(false);
        return;
      }
    }
    setCanTradeBank(takenRessources == canTakeRessources);
  }, [pendingChanges]);

  const resetResourceChange = () => {
    for (const res in pendingChanges) {
      pendingChanges[res] = 0;
    }
  };

  useEffect(() => {
    resetResourceChange();
  }, [isPlayerTurn]);


  let playersOfThisSide = [];
  for (const id in players) {
    let player = players[id];
    if (side === "left") {
      if (player.playerIndex === 0) playersOfThisSide[0] = player;
      if (player.playerIndex === 2) playersOfThisSide[1] = player;
    } else {
      if (player.playerIndex === 1) playersOfThisSide[0] = player;
      if (player.playerIndex === 3) playersOfThisSide[1] = player;
    }
  }

  const palette = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    beige: "#d6d3d1",
  };

  const resources = ["wood", "clay", "wheat", "wool", "stone"];

  const onBankTrade = () => {
    if (!playerId) return;
    if (!players) return;
    if (!players[playerId]) return;
    if (!players[playerId].tradeFactor) return;
    
    if (!gameId) return;
    
    if (!canTradeBank) return;

    let wood = 0;
    let clay = 0;
    let wheat = 0;
    let wool = 0;
    let stone = 0;
    for (const res in pendingChanges) {
      let val = pendingChanges[res];
      if (res == "wood") wood = val;
      if (res == "clay") clay = val;
      if (res == "wheat") wheat = val;
      if (res == "wool") wool = val;
      if (res == "stone") stone = val;
    }
    bankTrade(gameId, wood, clay, wheat, wool, stone);
    resetResourceChange();
    setCanTradeBank(false);
  };

  return (
    <div className="h-full flex flex-col justify-center items-stretch">
      <div className="flex flex-col gap-3">
        {playersOfThisSide.map((player) => (
          player ? (
            <div
              key={player.name}
              className={`bg-emerald-700 rounded-xl p-3 shadow text-sm text-center text-white 
                ${player.userId === playerId ? 'border-2 border-yellow-400' : ''}`
              }
            >
              <p className="font-semibold mb-2 flex justify-center items-center gap-2">
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
              </p>

              <div className="flex flex-col">
                {resources.map((res) => {
                  const changeKey = `${res}`;
                  const currentChange = pendingChanges[changeKey] || 0;

                  return (
                    <ResourceControl
                      key={res}
                      isPlayer={player.userId === playerId}
                      isPlayerTurn={isPlayerTurn}
                      label={res}
                      currentValue={player.resBalance[res]}
                      changeValue={currentChange}
                      onChange={(delta) => handleResourceChange(res, delta)}
                    />
                  );
                })}
              </div>

              {
                player.userId === playerId && canTradeBank && isPlayerTurn && <div>
                  <button onClick={onBankTrade} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
                    Trade with Bank
                  </button>
                </div>
              }
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}