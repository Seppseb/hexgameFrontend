import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background: "#1e293b",
      color: "white",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div><Link to="/" style={{ color: "white", textDecoration: "none" }}>🏠 hexgame</Link></div>
      <div>
        <Link to="/games" style={{ color: "white", marginLeft: "1rem" }}>Games</Link>
      </div>
    </nav>
  );
}
