import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { useNavigate } from "react-router-dom";
import PlayerPanel from "../components/PlayerPanel";
import ShopBar from "../components/ShopBar";
import HexBoard from "../components/HexBoard";
import { getGame, sendReady, build, buildRoad, endTurn } from "../api/gamesApi";
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
  const [log, setLog] = useState("");
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerId, setPlayerId] = useState(getCookie("userId"));
  const [isOwner, setisOwner] = useState(false);
  
  
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [diceValues, setDiceValues] = useState([0, 0]); // To hold the values from the server


  //TODO handle show player order, make player page dynamic -> spit player pannels in quadrands, change backgroudncolor of whos turn, show own cars but not of other players
  


  //TODO IMPORTANT fix bug, first placing of initital village isnt notified, maybe only if not owner? works on reload

  //TODO add color to playername in board
  //TODO add logging
  //TODO upgrade to city
  //TODO only let some spots build for initital roads -> array of possible spots for roads after placing?, after that villages and roads -> each spot has can build map of player to boolean in backend for frontend to decide color
  //TODO add bank buying
  //TODO add autoplay after some seconds
  //TODO add special card buying
  //TODO add scoring, winning
  //TODO hide some infos
  //TODO push to server pipeline

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
    else if (event.type === 'INITIAL_PLACE' && event.playerId === playerId) {
      //setIsPlacingVillage(true);
    }
    else if (event.type === 'START_TURN' && event.playerId === playerId) {
      // Assume the dice values are in the event payload
      if (event.message) {
        const dice1 = event.message[0];
        const dice2 = event.message[1];
        setDiceValues([dice1, dice2]);
        setShowDicePopup(true); // <--- Function call to open the popup
      }
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
    if (!game || !game.state || game.state !== "ROLL_FOR_POSITION") {
      sendReady(gameId);
    }
  };

  const handleBuild = (row, col) => {
    build(gameId, row, col);
  };

  const handleBuildRoad = (row, col) => {
    buildRoad(gameId, row, col);
  };

  const handleEndTurn = () => {
    endTurn(gameId);
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-emerald-900 text-white">
      {/* ... existing layout ... */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-emerald-800 border-r border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="left" players={game && game.players ? game.players : null}/>
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
          <PlayerPanel side="right" players={game && game.players ? game.players : null} />
        </div>
      </div>
      <div className="h-32 bg-emerald-950 border-t border-emerald-800">
        <ShopBar 
          onEndTurn= {handleEndTurn}
          bank = {game?.bank}
          log = {log}
        />
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