import React, { useEffect, useState } from "react";
import { acceptPlayerTrade, askPlayerTrade, bankTrade, cancelPlayerTrade, declinePlayerTrade, finishPlayerTrade, playDevelopment, settleDebt } from "../api/gamesApi";

function ResourceControl({ label, isPlayer, isPlayerTurn, currentValue, changeValue, onChange }) {
  const downArrowVisible = (currentValue + changeValue) >= 1;
  const upArrowVisible = true;

  return (
    <div className="flex items-center justify-center text-sm mb-1">
      <span className="capitalize w-14 text-right mr-2" >{label}:&nbsp;</span>

      <div className="flex items-center gap-1">
        {label === "wood" && <span >&nbsp;&nbsp;&nbsp;</span>}
        {label === "clay" && <span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
        {label === "wheat" && <span >&nbsp;&nbsp;</span>}
        {label === "wool" && <span >&nbsp;&nbsp;&nbsp;&nbsp;</span>}
        {label === "stone" && <span >&nbsp;&nbsp;&nbsp;</span>}

        <span className="font-mono w-4 text-center">{currentValue}&nbsp;</span>
      </div>

      <div className="w-24 flex items-center justify-center">
        {isPlayer && isPlayerTurn ? (
          <>
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

            <div className={`w-6 text-center font-bold text-xs ${changeValue !== 0 ? 'visible' : 'invisible'}`}>
              <span className={changeValue > 0 ? "text-green-300" : "text-red-300"}>
                {changeValue > 0 ? "+" : ""}{changeValue}
              </span>
            </div>

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
          <div className="h-full"></div>
        )}
      </div>
    </div>
  );
}

export default function PlayerPanel({
  side = "left",
  players,
  playerId,
  gameId,
  isPlayerTurn,
  currentTradeOffer,
}) {
  const [pendingChanges, setPendingChanges] = useState({});
  const [canTradeBank, setCanTradeBank] = useState(false);
  const [canTradePlayer, setCanTradePlayer] = useState(false);
  const [canAcceptTrade, setCanAcceptTrade] = useState(false);
  const [canTradeMultipleRessourcesAtOnce, setCanTradeMultipleRessourcesAtOnce] = useState(false);
  const [playerDebt, setPlayerDebt] = useState(0);
  const [canSettleDebt, setCanSettleDebt] = useState(false); //TODO set

  const handleResourceChange = (resource, delta) => {
    setPendingChanges((prev) => {
      const currentChange = prev[resource] || 0;
      const newChange = currentChange + delta;
      return { ...prev, [resource]: newChange };
    });
  };

  const resetResourceChange = () => {
    setPendingChanges({});
  };

  useEffect(() => {
    if (!playerId) return;
    if (!players) return;
    if (!players[playerId]) return;
    if (!players[playerId].tradeFactor) return;

    if (players[playerId].resDebt !== null) {
      setPlayerDebt(players[playerId].resDebt);
    }

    let takenRessources = 0;
    let givenRessources = 0;
    let canTakeRessources = 0;
    let canTakeRessourcesFromOverFlow = 0;
    let change = false;

    for (const res in pendingChanges) {
      let playerGetsAmount = pendingChanges[res];
      if (playerGetsAmount > 0) {

        takenRessources += playerGetsAmount;
        change = true;
        
      } else if (playerGetsAmount < 0) {
        change = true;
        let playerGivesAmount = -playerGetsAmount;
        givenRessources += playerGivesAmount;

        let overflow = playerGivesAmount % players[playerId].tradeFactor[res];
        playerGivesAmount -= overflow;
        canTakeRessourcesFromOverFlow += overflow / players[playerId].tradeFactor[res];
        canTakeRessources += playerGivesAmount / players[playerId].tradeFactor[res];

      }
    }

    if (playerDebt != 0) {
      setCanTradeBank(false);
      setCanTradePlayer(false);
      if (playerDebt < 0) {
        setCanSettleDebt(-playerDebt === takenRessources && givenRessources === 0)
      } else {
        setCanSettleDebt(playerDebt === givenRessources && takenRessources === 0)
      }
      return;
    }

    setCanTradePlayer(change);
    if (takenRessources == 0) {
      setCanTradeBank(false);
      return;
    }
    if (canTradeMultipleRessourcesAtOnce) {
      canTakeRessources += canTakeRessourcesFromOverFlow;
    } else {
      if (canTakeRessourcesFromOverFlow !== 0) {
        setCanTradeBank(false);
        return;
      }
    }
    setCanTradeBank(takenRessources === canTakeRessources);

    
  }, [pendingChanges, players, playerId, canTradeMultipleRessourcesAtOnce]);

  useEffect(() => {
    resetResourceChange();
  }, [isPlayerTurn]);

  let playersOfThisSide = [];
  if (playerId && players && players[playerId]) {
    if (side === "left") {
      playersOfThisSide[0] = players[playerId];
    } else {
      for (const id in players) {
        let player = players[id];
        if (id == playerId) continue;
        let index = player.playerIndex;
        if (index > players[playerId].playerIndex) index--;
        playersOfThisSide[index] = player;
      }
    }
  } else if (players) {
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
  }

  const palette = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    beige: "#d6d3d1",
  };

  const resources = ["wood", "clay", "wheat", "wool", "stone"];

  const resEmojis = {"wood": "🌲", "desert": "🏜️", "clay": "🧱", "wheat": "🌾", "stone": "⛰️", "wool": "🐑"};

  const devEmojis = {
    knight: "🛡️",
    development: "📜",
    roadwork: "🛣️",
    monopoly: "💰",
    victoryPoint: "⭐",
  };

  const onBankTrade = () => {
    if (!playerId) return;
    if (!players) return;
    if (!players[playerId]) return;
    if (!players[playerId].tradeFactor) return;

    if (!gameId) return;

    if (!isPlayerTurn) return;
    if (!canTradeBank) return;

    let wood = 0;
    let clay = 0;
    let wheat = 0;
    let wool = 0;
    let stone = 0;
    for (const res in pendingChanges) {
      let val = pendingChanges[res];
      if (res === "wood") wood = val;
      if (res === "clay") clay = val;
      if (res === "wheat") wheat = val;
      if (res === "wool") wool = val;
      if (res === "stone") stone = val;
    }
    bankTrade(gameId, wood, clay, wheat, wool, stone);
    resetResourceChange();
    setCanTradeBank(false);
    setCanSettleDebt(false);
  };

  const onAskPlayerTrade = () => {
    if (!playerId) return;

    if (!gameId) return;

    if (!isPlayerTurn) return;

    let wood = 0;
    let clay = 0;
    let wheat = 0;
    let wool = 0;
    let stone = 0;
    for (const res in pendingChanges) {
      let val = pendingChanges[res];
      if (res === "wood") wood = val;
      if (res === "clay") clay = val;
      if (res === "wheat") wheat = val;
      if (res === "wool") wool = val;
      if (res === "stone") stone = val;
    }
    askPlayerTrade(gameId, wood, clay, wheat, wool, stone);
  };

  //TODO player also can have debt if not player turn-> change layout
  const onSettleDebt = () => {
    if (!playerId) return;
    if (!players) return;
    if (!players[playerId]) return;
    if (!gameId) return;

    if (!canSettleDebt) return;

    let wood = 0;
    let clay = 0;
    let wheat = 0;
    let wool = 0;
    let stone = 0;
    for (const res in pendingChanges) {
      let val = pendingChanges[res];
      if (res === "wood") wood = val;
      if (res === "clay") clay = val;
      if (res === "wheat") wheat = val;
      if (res === "wool") wool = val;
      if (res === "stone") stone = val;
    }
    //TODO implement backend
    settleDebt(gameId, wood, clay, wheat, wool, stone);
    resetResourceChange();
    setCanSettleDebt(false);
    setCanTradeBank(false);
  };

  const devTypeFromItem = (item) => {
    if (!item) return null;
    if (typeof item === "string") return item;
    if (typeof item === "object" && item.type) return item.type;
    return null;
  };

  //todo open menu on dev cardclick instead of instand send?

  const renderDevEmoji = (dev) => {
    const type = devTypeFromItem(dev);
    if (!type) return "❓";
    return devEmojis[type] || "❓";
  };

  const handleUseDevelopment = (playerUserId, development) => {
    if (!isPlayerTurn) return;
    playDevelopment(gameId, devTypeFromItem(development));
  };

  // helper: produce a simple "wood x, clay y" string for either positive or negative values
  const listResources = (offer, predicate /* fn(value) => boolean */) => {
    if (!offer) return [];
    return resources
      .map((r) => ({ key: r, val: offer[r] || 0 }))
      .filter(({ val }) => predicate(val))
      .map(({ key, val }) => `${resEmojis[key]} ${Math.abs(val)}`);
  };

  // Called when the viewer accepts/denies the current offer
  const handleRespondToTrade = (accept) => {
    if (!currentTradeOffer) return;
    if (!gameId) return;
    const accepterId = playerId;
    if (!accepterId) return;
    if (accept) {
      acceptPlayerTrade(gameId, currentTradeOffer.wood, currentTradeOffer.clay, currentTradeOffer.wheat, currentTradeOffer.wool, currentTradeOffer.stone);
    } else {
      declinePlayerTrade(gameId, currentTradeOffer.wood, currentTradeOffer.clay, currentTradeOffer.wheat, currentTradeOffer.wool, currentTradeOffer.stone);
    }
  };

  // Called when the offerer finalizes the trade (only shown to offerer when isPlayerTurn)
  const handleFinalizeTrade = (partnerId) => {
    if (!currentTradeOffer) return;
    if (!gameId) return;
    if (!partnerId) return;
    finishPlayerTrade(gameId, partnerId)
    resetResourceChange();
  };

  const handleCancelTrade = () => {
    if (!currentTradeOffer) return;
    if (!gameId) return;
    cancelPlayerTrade(gameId);
  };

  useEffect(() => {
    setCanAcceptTrade(false);
    if (!currentTradeOffer) return;
    if (isPlayerTurn) return;
    if (!playerId) return;
    if (!players) return;
    if (!players[playerId]) return;
    const p = players[playerId];
    if (!p.resBalance) return;
    if (currentTradeOffer.wood === null || p.resBalance["wood"] === null || currentTradeOffer.wood > p.resBalance["wood"]) return;
    if (currentTradeOffer.clay === null || p.resBalance["clay"] === null || currentTradeOffer.clay > p.resBalance["clay"]) return;
    if (currentTradeOffer.wheat === null || p.resBalance["wheat"] === null || currentTradeOffer.wheat > p.resBalance["wheat"]) return;
    if (currentTradeOffer.wool === null || p.resBalance["wool"] === null || currentTradeOffer.wool > p.resBalance["wool"]) return;
    if (currentTradeOffer.stone === null || p.resBalance["stone"] === null || currentTradeOffer.stone > p.resBalance["stone"]) return;

    setCanAcceptTrade(true);
  }, [currentTradeOffer]);

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
                {player.name}:&nbsp;
                <span className="text-xs tracking-wide">{(player.victoryPoints ?? 0)} VPs</span>
              </p>

              {player.userId === playerId && playerDebt != 0 && (
                <>
                {(
                  playerDebt <= 0 ? (
                    <>
                      <span className="text-xs tracking-wide">Choose {-playerDebt} Cards</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs tracking-wide">Give {playerDebt} Cards</span>
                    </>
                  )
                )}
                </>

              )}

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
                      currentValue={player.resBalance ? player.resBalance[res] || 0 : 0}
                      changeValue={currentChange}
                      onChange={(delta) => handleResourceChange(res, delta)}
                    />
                  );
                })}
              </div>

              <div className="mt-2 flex justify-center items-center gap-2 flex-wrap">
                {(player.usedDevelopments && player.usedDevelopments.length > 0) && (
                  player.usedDevelopments.map((dev, idx) => (
                    <span key={`used-${idx}`} title={devTypeFromItem(dev)} className="text-xl">
                      {renderDevEmoji(dev)}
                    </span>
                  ))
                )}
              </div>

              {player.userId === playerId && player.developments && player.developments.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs mb-1">Unused developments:</div>
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {(
                      player.developments.map((dev, idx) => {
                        const type = devTypeFromItem(dev);
                        return isPlayerTurn ? (
                          <button
                            key={`dev-${idx}`}
                            onClick={() => handleUseDevelopment(player.userId, dev)}
                            className="px-2 py-1 rounded-md bg-emerald-800/30 hover:bg-emerald-800/50 transition text-sm"
                            title={type || "development"}
                          >
                            <span className="text-lg">{renderDevEmoji(dev)}</span>
                          </button>
                        ) : (
                          <span key={`dev-${idx}`} title={type || "development"} className="text-xl">{renderDevEmoji(dev)}</span>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {
                player.userId === playerId && canTradeBank && isPlayerTurn && <div className="mt-3">
                  <button onClick={onBankTrade} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
                    Trade with Bank
                  </button>
                </div>
              }
              {
                player.userId === playerId && canTradePlayer && isPlayerTurn && <div className="mt-3">
                  <button onClick={onAskPlayerTrade} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
                    Offer Trade for other Players
                  </button>
                </div>
              }

              {player.userId === playerId && playerDebt != 0 && canSettleDebt && (
                <>
                {(
                  playerDebt <= 0 ? (
                    <div className="mt-3">
                    <button onClick={onSettleDebt} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
                      Take Cards from Bank
                    </button>
                  </div>
                  ) : (
                    <div className="mt-3">
                    <button onClick={onSettleDebt} className="bg-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-600">
                      Give Cards to Bank
                    </button>
                  </div>
                  )
                )}
                </>

              )}

              {/* ---- NEW: Render currentTradeOffer under the current player's box (only for the current player) ---- */}
              {player.userId === playerId && currentTradeOffer && (
                <div className="mt-4 bg-emerald-800/30 p-2 rounded-md text-left">
                  <div className="text-xs mb-2 font-semibold">Active Trade Offer</div>

                  {/* Determine lists depending on viewer's turn */}
                  {isPlayerTurn ? (
                    <>
                      {/* Viewer is offerer (their turn): show wants and gives from offerer's POV */}
                      <div className="text-sm">
                        <div className="text-xs">you want:</div>
                        <div className="text-sm mb-1">
                          {listResources(currentTradeOffer, (v) => v > 0).length > 0
                            ? listResources(currentTradeOffer, (v) => v > 0).join(", ")
                            : <span className="text-gray-300">none</span>}
                        </div>

                        <div className="text-xs">you give:</div>
                        <div className="text-sm mb-2">
                          {listResources(currentTradeOffer, (v) => v < 0).length > 0
                            ? listResources(currentTradeOffer, (v) => v < 0).join(", ")
                            : <span className="text-gray-300">none</span>}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Viewer is not the current turn player: show you get / you give */}
                      <div className="text-sm">
                        <div className="text-xs">you get:</div>
                        <div className="text-sm mb-1">
                          {listResources(currentTradeOffer, (v) => v < 0).length > 0
                            ? listResources(currentTradeOffer, (v) => v < 0).join(", ")
                            : <span className="text-gray-300">none</span>}
                        </div>

                        <div className="text-xs">you give:</div>
                        <div className="text-sm mb-2">
                          {listResources(currentTradeOffer, (v) => v > 0).length > 0
                            ? listResources(currentTradeOffer, (v) => v > 0).join(", ")
                            : <span className="text-gray-300">none</span>}
                        </div>
                      </div>
                    </>
                  )}

                  { !isPlayerTurn && (
                    <div className="flex gap-1">
                      { canAcceptTrade && (
                        <button
                        onClick={() => handleRespondToTrade(true)}
                        className="px-2 py-1 text-xs rounded bg-green-700 hover:bg-green-600"
                        >
                        Accept
                        </button>
                      )}
                      <button
                        onClick={() => handleRespondToTrade(false)}
                        className="px-2 py-1 text-xs rounded bg-red-700 hover:bg-red-600"
                      >
                        Deny
                      </button>
                    </div>
                  )}

                  {/* Accepter status: show each accepter and their current bool/null */}
                  <div className="mt-2">
                    <div className="flex flex-col gap-1">
                      {currentTradeOffer.acceptersId && players && (
                        Object.keys(players).map((accepterId) => accepterId !== currentTradeOffer.offererId && (
                          <div key={`acc-${accepterId}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {players[accepterId] && (
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor: palette[players[accepterId].color],
                                    borderRadius: "50%"
                                  }}
                                />
                              )}
                              <span className="text-xs">
                                {players && players[accepterId] ? players[accepterId].name : accepterId}
                              </span>
                              {currentTradeOffer.acceptersId[accepterId] === true && <span className="text-green-300">✅</span>}
                              {currentTradeOffer.acceptersId[accepterId] === false && <span className="text-red-300">❌</span>}
                              {(currentTradeOffer.acceptersId[accepterId] === null || currentTradeOffer.acceptersId[accepterId] === undefined) && <span className="text-gray-400">🔘</span>}
                            </div>

                            {/* If the current viewer is the player whose panel this is, allow Accept/Deny buttons */}
                            { isPlayerTurn && currentTradeOffer.acceptersId[accepterId] === true && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    handleFinalizeTrade(accepterId);
                                  }}
                                  className="px-3 py-1 rounded bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
                                >
                                  Finish Trade
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* If the current viewer is the offerer and it's their turn show Finalize */}
                  {currentTradeOffer.offererId === player.userId && isPlayerTurn && (
                    <div className="mt-3 flex gap-2 justify-center">
                      

                      <button
                        onClick={() => {
                          handleCancelTrade();
                        }}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500"
                      >
                        Cancel Offer
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}
