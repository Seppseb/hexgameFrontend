import { useEffect, useState } from "react";
import { createGame } from "../api/gamesApi";
import { useNavigate } from "react-router-dom";

const NUMBER_ORDER = {
  FAIREST_FIXED: 0,
  RANDOM: 1,
  RANDOM_OPTIMIZED: 2,
};

export default function CreateGamePage() {
  const navigate = useNavigate();

  const [showBank, setShowBank] = useState(false);
  const [numberOrder, setNumberOrder] = useState(NUMBER_ORDER.FAIREST_FIXED);

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [boardSize, setBoardSize] = useState(5);
  const [villageNumber, setVillageNumber] = useState(5);
  const [cityNumber, setCityNumber] = useState(4);
  const [roadNumber, setRoadNumber] = useState(15);
  const [neededVictoryPoints, setNeededVictoryPoints] = useState(10);
  
  const minBoardSize = 3;
  const maxBoardSize = 11;

  const minVillageNumber = 2;
  const maxVillageNumber = 999;

  const minCityNumber = 0;
  const maxCityNumber = 999;

  const minRoads = Math.max((cityNumber + villageNumber) * 2 - 3, 5);
  const maxRoads = 9999;

  const minVps = 3;
  const maxVps = cityNumber * 2 + villageNumber + 2;

  useEffect(() => {
    setNeededVictoryPoints((v) =>
      Math.min(Math.max(v, minVps), maxVps)
    );
  }, [cityNumber, villageNumber]);

  useEffect(() => {
    setRoadNumber((r) =>
      Math.min(Math.max(r, minRoads), maxRoads)
    );
  }, [cityNumber, villageNumber]);

  const handleBoardSizeChange = (value) => {
    let num = Number(value);
    num = Math.max(minBoardSize, num);
    num = Math.min(maxBoardSize, num);
    if (num % 2 === 1) {
      setBoardSize(num);
    } else {
      setBoardSize(num-1);
    }
  };

  const handleVillageNumberChange = (value) => {
    let num = Number(value);
    num = Math.max(minVillageNumber, num);
    num = Math.min(maxVillageNumber, num);
    setVillageNumber(num);
  };

  const handleCityNumberChange = (value) => {
    let num = Number(value);
    num = Math.max(minCityNumber, num);
    num = Math.min(maxCityNumber, num);
    setCityNumber(num);
  };

  const handleRoadNumberChange = (value) => {
    let num = Number(value);
    num = Math.max(minRoads, num);
    num = Math.min(maxRoads, num);
    setRoadNumber(num);
  };

  const handleNeedeVictoryPointsChange = (value) => {
    let num = Number(value);
    num = Math.max(minVps, num);
    num = Math.min(maxVps, num);
    setNeededVictoryPoints(num);
  };

  const handleCreateGame = async () => {
    const res = await createGame({
      numberOrder,
      showBank,
      boardSize,
      villageNumber,
      cityNumber,
      roadNumber,
      neededVictoryPoints,
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

      <fieldset style={{ marginBottom: "1rem" }}>
        <legend>Resource Info</legend>
        <label>
          <input
            type="checkbox"
            checked={showBank}
            onChange={(e) => setShowBank(e.target.checked)}
          />{" "}
          Show resource cards in bank
        </label>
      </fieldset>

      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        style={{ marginBottom: "1rem" }}
      >
        {advancedOpen ? "Hide" : "Show"} Advanced Settings
      </button>

      {advancedOpen && (
        <fieldset style={{ marginBottom: "1rem" }}>
          <legend>Advanced Settings</legend>

          <label>
            Board Size (odd {minBoardSize}-{maxBoardSize}):{" "}
            <input
              type="number"
              min={minBoardSize}
              max={maxBoardSize}
              step={2}
              value={boardSize}
              onChange={(e) => handleBoardSizeChange(e.target.value)}
            />
          </label>

          <br />

          <label>
            Villages ({minVillageNumber}-{maxVillageNumber}):{" "}
            <input
              type="number"
              min={minVillageNumber}
              max={maxVillageNumber}
              value={villageNumber}
              onChange={(e) => handleVillageNumberChange(e.target.value)}
            />
          </label>

          <br />

          <label>
            Cities ({minCityNumber}-{maxCityNumber}):{" "}
            <input
              type="number"
              min={minCityNumber}
              max={maxCityNumber}
              value={cityNumber}
              onChange={(e) => handleCityNumberChange(e.target.value)}
            />
          </label>

          <br />

          <label>
            Roads ({minRoads}-{maxRoads}):{" "}
            <input
              type="number"
              min={minRoads}
              max={maxRoads}
              value={roadNumber}
              onChange={(e) => handleRoadNumberChange(e.target.value)}
            />
          </label>

          <br />

          <label>
            Needed Victory Points ({minVps}-{maxVps}):{" "}
            <input
              type="number"
              min={minVps}
              max={maxVps}
              value={neededVictoryPoints}
              onChange={(e) => handleNeedeVictoryPointsChange(e.target.value)}
            />
          </label>
        </fieldset>
      )}

      <button onClick={handleCreateGame}>Create New Game</button>
    </div>
  );
}
