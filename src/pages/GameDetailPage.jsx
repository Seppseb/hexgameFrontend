import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getGameInfo, getUserInfo, joinGame, startGame } from "../api/gamesApi";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { useNavigate } from "react-router-dom";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [isOwner, setisOwner] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const handleWebSocketMessage = useCallback((event) => {
    if (event.game) {
      setGame(event.game);
    }
    if (event.type === 'STARTED_GAME') {
      continueToGamePage();
    }
  }, []);

  useGameWebSocket(gameId, handleWebSocketMessage);

  const fetchGame = async () => {
    const res = await getGameInfo(gameId);
    setGame(res.data);
  };

  const fetchUserInfo = async () => {
    const res = await getUserInfo();
    if (!res || !res.data) return;
    const data = res.data.split(";");
    setPlayerId(data[0]);
    setName(data[1]);
  };

  useEffect(() => {
    if (game) parsePlayers();
    if (game) {
      setHasStarted(game.state && game.state != "WAITING_FOR_PLAYERS");
    }
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
    if (res?.data?.userId) {
      localStorage.setItem("userId", res.data.userId);
      setPlayerId(res.data.userId);
    }
  };
  
  const handleContinue = async () => {
    continueToGamePage();
  };

  const handleStartGame = async () => {
    if (isOwner) {
      const res = await startGame(gameId, playerId);
    }
  };

  const continueToGamePage = async () => {
    navigate(`/games/${gameId}/board`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleJoin();
    }
  }

  const handleNameFieldChange = (name) => {
    if (name && name.length > 15) return;
    setName(name);
  }

  useEffect(() => {
    fetchGame();
    fetchUserInfo();
  }, [gameId]);

  const copyGameLink = async () => {
    const link = `${window.location.origin}/games/${gameId}`;
  
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

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
      {!hasStarted && isOwner && (
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
      {!hasStarted && !isOwner && game && game.players && game.ownerId && game.players[game.ownerId] && game.players[game.ownerId].name && (
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

      {!hasStarted && (
        <div style={{ marginTop: "1rem" }}>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => handleNameFieldChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleJoin}>Join Game</button>
        </div>
      )}

      {hasStarted && (
        <div style={{ marginTop: "1rem" }}>
        <button onClick={handleContinue}>Continue to game</button>
        </div>
      )}

      <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={copyGameLink}
          style={{
            marginLeft: "0.5rem",
            padding: "0.25rem 0.5rem",
            cursor: "pointer"
          }}
        >
          {copied ? "Copied!" : "Copy game link"}
        </button>
      </div>

    </div>
  );
}
