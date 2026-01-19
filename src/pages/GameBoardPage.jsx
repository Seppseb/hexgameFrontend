import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import PlayerPanel from "../components/PlayerPanel";
import ShopBar from "../components/ShopBar";
import HexBoard from "../components/HexBoard";
import VictimChoosePopup from "../components/VictimChoosePopup";
import { getGame, sendReady, build, buildRoad, getUserInfo, moveRobber, chooseVictim, confirmDice } from "../api/gamesApi";
import DiceRollPopup from "../components/DiceRollPopup";
import WinPopup from "../components/WinPopup";
import { AnimatePresence } from "framer-motion";

export default function GameBoardPage() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState(null);
  const [log, setLog] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [player, setPlayer] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isMovingRobber, setIsMovingRobber] = useState(false);
  const [showVictimPopup, setShowVictimPopup] = useState(false);
  
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(true);
  const [diceValues, setDiceValues] = useState([0, 0]); // To hold the values from the server


  const [isPlacingInitialVillage, setIsPlacingInitialVillage] = useState(false);
  const [isPlacingInitialRoad, setIsPlacingInitialRoad] = useState(false);


  const handleWebSocketMessage = useCallback((event) => {
    fetchGame();
    if (event.type === 'INITIAL_ROLL' && event.playerId === playerId) {
      if (event.message) {
        const dice1 = event.message[0];
        const dice2 = event.message[1];
        setDiceValues([dice1, dice2]);
        setShowDicePopup(true);
      }
    }
    else if (event.type === 'INITIAL_PLACE' && event.playerId === playerId) {

    }
    else if (event.type === 'START_TURN' && event.playerId === playerId) {
      
    }
    else if (event.type === 'DICE_RESULT' && event.playerId === playerId) {

    }
    else if (event.type === 'THREW_DICE' && event.playerId === playerId) {

    }
    setLog(event);
  }, [playerId]);

  const { isConnected } = useGameWebSocket(gameId, handleWebSocketMessage);


  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected — sending READY");
      sendReady(gameId);
    }
  }, [isConnected, gameId]);


  const handleChooseVictim = (chosenPlayerId) => {
    chooseVictim(gameId, chosenPlayerId);
    setShowVictimPopup(false);
  };


  useEffect(() => {
    fetchGame();
    fetchUserInfo();
  }, [gameId]);
  
  const fetchGame = async () => {
    const res = await getGame(gameId);
    setGame(res.data);
    if (res.data.players) {
      setPlayers(res.data.players);
    }
    if (res.data.you) {
      setPlayer(res.data.you);
    }
  };

  const fetchUserInfo = async () => {
    const res = await getUserInfo();
    if (!res || !res.data) return;
    const data = res.data.split(";");
    setPlayerId(data[0]);

  };
  
    
  useEffect(() => {
    setIsPlayerTurn(!!playerId && playerId === game?.currentPlayer?.userId);
    setIsMovingRobber(!!game && game?.isWaitingForMovingRobber);
    if (game?.isWaitingForChoosingVictim && isPlayerTurn) {
      setShowVictimPopup(true);
    } else {
      setShowVictimPopup(false);
    }

    if (!isPlayerTurn) {
      setIsPlacingInitialVillage(false);
      setIsPlacingInitialRoad(false);
    } else {
      if (game.state == 'PLACEMENT') {
        if (game.isInitialIsPlacingRoad) {
          setIsPlacingInitialVillage(false);
          setIsPlacingInitialRoad(true);
        } else {
          setIsPlacingInitialVillage(true);
          setIsPlacingInitialRoad(false);
        }
      } else {
        setIsPlacingInitialVillage(false);
        setIsPlacingInitialRoad(false);
      }
    }

    if (isPlayerTurn && game?.lastDiceRoll && game?.lastDiceRoll.length == 2) {
      const dice1 = game?.lastDiceRoll[0];
      const dice2 = game?.lastDiceRoll[1];
      setDiceValues([dice1, dice2]);
      setShowDicePopup(true);
    }
  }, [playerId, game, game?.currentPlayer, game?.state, game?.initialIsPlacingRoad, game?.isWaitingForMovingRobber, game?.isWaitingForChoosingVictim]);

  // center on load
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.4), 3));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleConfirmDice = () => {
    setShowDicePopup(false);
    if (!game || !game.state || game.state === "ROLL_FOR_POSITION") {
      sendReady(gameId);
    } else {
      confirmDice(gameId);
    }

  };

  const handleReturnToGame = () => {
    setShowWinPopup(false);
  };

  const handleBuild = (row, col) => {
    build(gameId, row, col);
  };

  const handleBuildRoad = (row, col) => {
    buildRoad(gameId, row, col);
  };

  const handleMoveRobber = (row, col) => {
    if (game?.board?.robber?.location?.rowIndex === null) return;
    if (game?.board?.robber?.location?.colIndex === null) return;
    moveRobber(gameId, game?.board?.robber?.location?.rowIndex, game?.board?.robber?.location?.colIndex, row, col);
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-emerald-900 text-white">
      {/* ... existing layout ... */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-emerald-800 border-r border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="left" players={players} you={player} gameId={gameId} isPlayerTurn={isPlayerTurn} currentTradeOffer={game?.currentTradeOffer} />
        </div>
        <div
          className="flex-1 bg-slate-900 relative overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute transition-transform duration-150 ease-in-out"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) translate(-50%, -50%)`,
              transformOrigin: "center",
              willChange: "transform",
            }}
          >
            <HexBoard 
              board ={ game && game.board ? game.board : null }
              onBuild={handleBuild}
              onBuildRoad={handleBuildRoad}
              onMoveRobber={handleMoveRobber}
              isPlacingInitialVillage={isPlacingInitialVillage}
              isPlacingInitialRoad={isPlacingInitialRoad}
              isPlayerTurn={isPlayerTurn}
              isMovingRobber={isMovingRobber}
              isBuildPhase={(game?.state === 'IN_PROGRESS' || game?.state === 'FINISHED') && isPlayerTurn && game?.isBuildPhase}
              player={player}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 border-4 border-emerald-950"></div>
        </div>
        <div className="w-1/5 bg-emerald-800 border-l border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="right" players={players} you={player} gameId={gameId} isPlayerTurn={isPlayerTurn} />
        </div>
      </div>
      <div className="h-32 bg-emerald-950 border-t border-emerald-800">
        <ShopBar 
          gameId = {gameId}
          bank = {game?.bank}
          log = {log}
          isPlayerTurn = {isPlayerTurn && (game?.state === 'IN_PROGRESS' || game?.state === 'FINISHED')}
          isBuildPhase = {game?.isBuildPhase}
        />
      </div>

      {/* *** NEW POPUP INTEGRATION *** */}
      <AnimatePresence>
        {showDicePopup && (
          <DiceRollPopup
            diceValues={diceValues}
            onConfirm={handleConfirmDice}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVictimPopup && (
          <VictimChoosePopup
            possibleVictims={game?.possibleVictims}
            onChoose={handleChooseVictim}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWinPopup && game?.winner && (
          <WinPopup
            winner={game.winner}
            singleDieStats={game.singleDieStats}
            doubleDieStats={game.doubleDieStats}
            onReturnToGame={handleReturnToGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}