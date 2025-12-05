export default function GameFilter({ filter, setFilter }) {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setFilter("notStarted")} disabled={filter === "notStarted"}>Not Started</button>
        <button onClick={() => setFilter("ongoing")} disabled={filter === "ongoing"} style={{ marginLeft: "1rem" }}>Ongoing</button>
        <button onClick={() => setFilter("past")} disabled={filter === "past"} style={{ marginLeft: "1rem" }}>Past</button>
      </div>
    );
  }
  