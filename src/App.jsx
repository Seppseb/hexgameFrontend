import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useMemo } from "react";

import LandingPage from "./pages/LandingPage";
import GamesPage from "./pages/GamesPage";
import GameDetailPage from "./pages/GameDetailPage";
import GameBoardPage from "./pages/GameBoardPage";
import Navbar from "./components/Navbar";
import CreateGamePage from "./pages/CreateGamePage";

function AppContent() {
  const location = useLocation();

  // Determine if we are on a GameBoard route
  const isGameBoard = useMemo(() => location.pathname.endsWith("/board"), [location.pathname]);

  return (
    <div
      id="root-wrapper"
      className={`${isGameBoard ? "p-0 max-w-none" : "p-8 max-w-[1280px] mx-auto"}`}
    >
      {!isGameBoard && <Navbar />} {/* Hide navbar on board page if desired */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/createGame" element={<CreateGamePage />} />
          <Route path="/games/:gameId" element={<GameDetailPage />} />
          <Route path="/games/:gameId/board" element={<GameBoardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router basename="/hexgameFrontend">
      <AppContent />
    </Router>
  );
}
