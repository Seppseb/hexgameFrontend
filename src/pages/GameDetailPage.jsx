import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getGame, joinGame, startGame } from "../api/gamesApi";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { useNavigate } from "react-router-dom";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [name, setName] = useState(getCookie("username"));
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerId, setPlayerId] = useState(getCookie("userId"));
  const [isOwner, setisOwner] = useState(false);

  const navigate = useNavigate();
  
  function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  const handleWebSocketMessage = useCallback((event) => {
    if (event.game) {
      setGame(event.game);
    }
    if (event.type === 'STARTED_GAME') {
      handleGameStart();
    }
  }, []);

  useGameWebSocket(gameId, handleWebSocketMessage);

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
    setPlayers(names.join(", "));
    setPlayerNumber(names.length);
  }

  const handleJoin = async () => {
    if (!name || name.length < 1) return;
    const res = await joinGame(gameId, name);
    if (res && res.data && res.data.userId)
      setPlayerId(res.data.userId);
  };

  const handleStartGame = async () => {
    if (isOwner) {
      const res = await startGame(gameId, playerId);
    }
  };

  const handleGameStart = async () => {
    navigate(`/games/${gameId}/board`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleJoin();
    }
  }

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    setisOwner(playerId && game && game.ownerId && playerId === game.ownerId);
  }, [playerId, game]);

  if (!game) return <p>Loading...</p>;

  return (
    <div>
      <h2>Game {gameId}</h2>
      <p>State: {game.state}</p>
      <p>
        Players {playerNumber}/4: {players}
      </p>

      <div style={{ marginTop: "1rem" }}>
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleJoin}>Join Game</button>

      {isOwner && (
        <button
          onClick={handleStartGame}
          style={{
            marginLeft: "0.5rem",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Start Game
        </button>
      )}
      {!isOwner && game && game.players && game.ownerId && game.players[game.ownerId] && game.players[game.ownerId].name && (
        <button
          style={{
            marginLeft: "0.5rem",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Wait for {game.players[game.ownerId].name} to start the game
        </button>
      )}
    </div>
    </div>
  );
}
