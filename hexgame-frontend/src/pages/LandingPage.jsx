import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welcome to hexgame Online</h1>
      <p>Join or create games with your friends!</p>
      <Link to="/games">
        <button style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          View Games
        </button>
      </Link>
    </div>
  );
}
