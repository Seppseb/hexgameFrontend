import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { useNavigate } from "react-router-dom";
import PlayerPanel from "../components/PlayerPanel";
import ShopBar from "../components/ShopBar";
import HexBoard from "../components/HexBoard";
import { getGame, sendReady, build, buildRoad } from "../api/gamesApi";
import DiceRollPopup from "../components/DiceRollPopup"; 
import { AnimatePresence } from "framer-motion";

export default function GameBoardPage() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerId, setPlayerId] = useState(getCookie("userId"));
  const [isOwner, setisOwner] = useState(false);
  
  
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [diceValues, setDiceValues] = useState([0, 0]); // To hold the values from the server


  //TODO handle show player order, make player page dynamic


  const [isPlacingVillage, setIsPlacingVillage] = useState(false);
  const [isPlacingRoad, setIsPlacingRoad] = useState(false);


  const handleWebSocketMessage = useCallback((event) => {
    if (event.game) {
      setGame(event.game);
    }
    // Check if it's a 'roll dice' message for the current player
    if (event.type === 'INITIAL_ROLL' && event.playerId === playerId) {
      // Assume the dice values are in the event payload
      if (event.message) {
        const dice1 = event.message[0];
        const dice2 = event.message[1];
        setDiceValues([dice1, dice2]);
        setShowDicePopup(true); // <--- Function call to open the popup
      }
    }
    if (event.type === 'INITIAL_PLACE' && event.playerId === playerId) {
      //setIsPlacingVillage(true);
      //TODO place road
    }
  }, [playerId]);

  const { isConnected } = useGameWebSocket(gameId, handleWebSocketMessage);


  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected — sending READY");
      sendReady(gameId);
    }
  }, [isConnected, gameId]);

  const navigate = useNavigate();

  function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

    
  
    const fetchGame = async () => {
      const res = await getGame(gameId);
      setGame(res.data);
    };
  
    useEffect(() => {
      if (game) parsePlayers();
    }, [game]);
  
    function parsePlayers() {
      if (!game || !game.players) return;
      const names = Object.values(game.players).map((p) => p.name);
      setPlayerNumber(names.length);
    }
  
    useEffect(() => {
      fetchGame();
    }, [gameId]);
  
    useEffect(() => {
      setisOwner(playerId && game && game.ownerId && playerId === game.ownerId);
      console.log(playerId);
      console.log(game);
      console.log(game?.currentPlayer);
      console.log(game?.currentPlayer?.userId);
      console.log(game?.currentPlayer?.userId === playerId);
      console.log("isPlacingRoad: " + game?.initialIsPlacingRoad);
      if (!playerId || playerId !== game?.currentPlayer?.userId) {
        setIsPlacingVillage(false);
        setIsPlacingRoad(false);
        console.log("case1");
      } else {
        if (game.state == 'PLACEMENT') {
          if (game.initialIsPlacingRoad) {
            setIsPlacingVillage(false);
            setIsPlacingRoad(true);
            console.log("case2");
          } else {
            setIsPlacingVillage(true);
            setIsPlacingRoad(false);
            console.log("case3");
          }
        } else {
          setIsPlacingVillage(true);
          setIsPlacingRoad(true);
          console.log("case4");
        }
      }
      console.log("village: " + isPlacingVillage)
      console.log("road: " + isPlacingRoad)
    }, [playerId, game, game?.currentPlayer, game?.state, game?.initialIsPlacingRoad]);

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
  
  const handlePopupClose = () => {
    setShowDicePopup(false);
    sendReady(gameId);
  };

  const handleBuild = (row, col) => {
    build(gameId, row, col);
  };

  const handleBuildRoad = (row, col) => {
    buildRoad(gameId, row, col);
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-emerald-900 text-white">
      {/* ... existing layout ... */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-emerald-800 border-r border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="left" />
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
              isPlacingVillage={isPlacingVillage}
              isPlacingRoad={isPlacingRoad}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 border-4 border-emerald-950"></div>
        </div>
        <div className="w-1/5 bg-emerald-800 border-l border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="right" />
        </div>
      </div>
      <div className="h-32 bg-emerald-950 border-t border-emerald-800">
        <ShopBar />
      </div>

      {/* *** NEW POPUP INTEGRATION *** */}
      <AnimatePresence>
        {showDicePopup && (
          <DiceRollPopup
            diceValues={diceValues}
            onClose={handlePopupClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}