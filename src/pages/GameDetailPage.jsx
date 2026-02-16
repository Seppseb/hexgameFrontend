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
      <h2 style={{marginBottom: "0.5rem"}}>Game Lobby</h2>
      <p style={{color: "#888", fontSize: "0.9rem", marginBottom: "1rem"}}>Room Code: {gameId}</p>

      <div style={{marginBottom: "1.5rem", fontWeight: "bold"}}>
        {hasStarted ? "🟢 Game started" : "🟡 Waiting for players"}
      </div>

      <div style={{marginBottom: "1.5rem"}}>
        <h3>Players ({playerNumber}/4)</h3>
        <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center"}}>
          {game.players &&
            Object.values(game.players).map((p) => (
              <div key={p.id} style={{color: "#222", background: "#e8f0fe", padding: "0.4rem 0.6rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold"}}>
                {p.name}
              </div>
            ))}

          {Array.from({ length: 4 - playerNumber }).map((_, i) => (
            <div key={i} style={{background: "#f1f3f5", padding: "0.4rem 0.6rem", borderRadius: "8px", fontSize: "0.85rem", color: "#888"}}>
              ⬜ Empty
            </div>
          ))}
        </div>
      </div>

      {!hasStarted && (
        <div style={{marginBottom: "1.5rem"}}>
          <input
            style={{padding: "0.5rem", borderRadius: "8px", border: "1px solid #ddd", marginRight: "0.5rem"}}
            placeholder="Your name (max 15)"
            value={name}
            onChange={(e) => handleNameFieldChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={{padding: "0.5rem 0.8rem", borderRadius: "8px", border: "none", background: "#4c8bf5", color: "white", cursor: "pointer"}} onClick={handleJoin}>
            {playerId == null || !game?.players?.hasOwnProperty(playerId) ? "Join Game" : "Change Name"}
          </button>
        </div>
      )}

      {!hasStarted && game && Object.keys(game?.players).length >= 2 && isOwner && (
        <button style={{width: "100%", padding: "0.7rem", borderRadius: "10px", border: "none", background: "#22c55e", color: "white", fontWeight: "bold", cursor: "pointer", marginBottom: "1rem"}} onClick={handleStartGame}>
          ▶ Start Game
        </button>
      )}

      {!hasStarted && game && Object.keys(game?.players).length < 2 && (
        <p style={{color: "#666", marginBottom: "1rem"}}>
          Waiting for 2 players...
        </p>
      )}

      {!hasStarted && game && Object.keys(game?.players).length >= 2 && !isOwner && (
        <p style={{color: "#666", marginBottom: "1rem"}}>
          Waiting for <strong>{game.players?.[game.ownerId]?.name}</strong> to start...
        </p>
      )}

      {hasStarted && (
        <button style={{width: "100%", padding: "0.7rem", borderRadius: "10px", border: "none", background: "#22c55e", color: "white", fontWeight: "bold", cursor: "pointer", marginBottom: "1rem"}} onClick={handleContinue}>
          ↪ Continue to Game
        </button>
      )}

      <button style={{background: "transparent", border: "none", color: "#4c8bf5", cursor: "pointer"}} onClick={copyGameLink}>
        {copied ? "✔ Link copied!" : "Invite Friends"}
      </button>
    </div>
  );
}
