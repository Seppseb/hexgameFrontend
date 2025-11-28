import React, { useState } from "react";

function ResourceControl({ label, isPlayer, currentValue, changeValue, onChange }) {
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
        {isPlayer ? (
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

export default function PlayerPanel({ side = "left", players, currentPlayerId }) {
  const [pendingChanges, setPendingChanges] = useState({});

  const handleResourceChange = (resource, delta) => {
    const key = `${resource}`;
    setPendingChanges((prev) => {
      const currentChange = prev[key] || 0;
      const newChange = currentChange + delta;
      return { ...prev, [key]: newChange };
    });
  };

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
    const tradeFactor = {
      wood: 4,
      clay: 4,
      wheat: 4,
      wool: 4,
      stone: 4,
    };
    
    let totalPlus = 0;
    let totalMinus = 0;
    for (const res in pendingChanges) {
      console.log(res);
      let val = pendingChanges[res];
      if (val > 0) {
        totalMinus+= val;
      } else {
        totalPlus+= val * tradeFactor[res];
      }
    }
    if (totalMinus === totalPlus) {
      console.log("send trade req");
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-stretch">
      <div className="flex flex-col gap-3">
        {playersOfThisSide.map((player) => (
          player ? (
            <div
              key={player.name}
              className={`bg-emerald-700 rounded-xl p-3 shadow text-sm text-center text-white 
                ${player.userId === currentPlayerId ? 'border-2 border-yellow-400' : ''}`
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
                      isPlayer={player.userId === currentPlayerId}
                      label={res}
                      currentValue={player[res]}
                      changeValue={currentChange}
                      onChange={(delta) => handleResourceChange(res, delta)}
                    />
                  );
                })}
              </div>

              {
                player.userId === currentPlayerId && <div>
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