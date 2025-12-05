import { useEffect, useState } from "react";
import { listGames, createGame } from "../api/gamesApi";
import GameTable from "../components/GameTable";
import GameFilter from "../components/GameFilter";
import { useNavigate } from "react-router-dom";


export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("notStarted");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await listGames();
      setGames(res.data);
    } catch (err) {
      console.error("Failed to load games:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleCreateGame = async () => {
    const res = await createGame();
    navigate(`/games/${res.data.id}`);
  };

  const filtered = games.filter(g => {
    if (filter === "notStarted") return g.state === "WAITING_FOR_PLAYERS";
    if (filter === "ongoing") return g.state === "IN_PROGRESS";
    if (filter === "past") return g.state === "FINISHED";
    return true;
  });

  return (
    <div>
      <h2>Available Games</h2>
      <GameFilter filter={filter} setFilter={setFilter} />
      <button onClick={handleCreateGame}>Create New Game</button>
      <GameTable games={filtered}/>
    </div>
  );
}
