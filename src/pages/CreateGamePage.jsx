import { useState } from "react";
import { createGame } from "../api/gamesApi";
import { useNavigate } from "react-router-dom";

export default function CreateGamePage() {
  const navigate = useNavigate();
  const [fairNumbers, setFairNumbers] = useState(false);
  const [showBank, setShowBank] = useState(false);

  const handleCreateGame = async () => {
    const res = await createGame([fairNumbers, showBank]);
    navigate(`/games/${res.data.id}`);
  };

  return (
    <div>
      <h2>Create Game</h2>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={fairNumbers}
          onChange={(e) => setFairNumbers(e.target.checked)}
        />
        {" "}Use fair numbers
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={showBank}
          onChange={(e) => setShowBank(e.target.checked)}
        />
        {" "}Show Ressource Cards in Bank
      </label>

      <button onClick={handleCreateGame}>Create New Game</button>
    </div>
  );
}
