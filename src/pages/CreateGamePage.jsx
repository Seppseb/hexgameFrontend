import { useState } from "react";
import { createGame } from "../api/gamesApi";
import { useNavigate } from "react-router-dom";

export default function CreateGamePage() {
  const navigate = useNavigate();
  const [showBank, setShowBank] = useState(false);

  const NUMBER_ORDER = {
    FAIREST_FIXED: 0,
    RANDOM: 1,
    RANDOM_OPTIMIZED: 2,
  }

  const [numberOrder, setNumberOrder] = useState(
    NUMBER_ORDER.FAIREST_FIXED
  );

  const handleCreateGame = async () => {
    const res = await createGame({
      numberOrder,
      showBank,
    });

    navigate(`/games/${res.data.id}`);
  };

  return (
    <div>
      <h2>Create Game</h2>

      <fieldset style={{ marginBottom: "1rem" }}>
        <legend>Number Order</legend>

        <label style={{ display: "block" }}>
          <input
            type="radio"
            name="numberOrder"
            value={NUMBER_ORDER.FAIREST_FIXED}
            checked={numberOrder === NUMBER_ORDER.FAIREST_FIXED}
            onChange={() => setNumberOrder(NUMBER_ORDER.FAIREST_FIXED)}
          />
          {" "}
          Fixed fairest order (always the same)
        </label>

        <label style={{ display: "block" }}>
          <input
            type="radio"
            name="numberOrder"
            value={NUMBER_ORDER.RANDOM}
            checked={numberOrder === NUMBER_ORDER.RANDOM}
            onChange={() => setNumberOrder(NUMBER_ORDER.RANDOM)}
          />
          {" "}
          Fully random order
        </label>

        <label style={{ display: "block" }}>
          <input
            type="radio"
            name="numberOrder"
            value={NUMBER_ORDER.RANDOM_OPTIMIZED}
            checked={numberOrder === NUMBER_ORDER.RANDOM_OPTIMIZED}
            onChange={() => setNumberOrder(NUMBER_ORDER.RANDOM_OPTIMIZED)}
          />
          {" "}
          Random (optimized for fairness)
        </label>
      </fieldset>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={showBank}
          onChange={(e) => setShowBank(e.target.checked)}
        />
        {" "}
        Show resource cards in bank
      </label>

      <button onClick={handleCreateGame}>Create New Game</button>
    </div>
  );
}
