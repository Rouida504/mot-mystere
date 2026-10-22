import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import home from './pages/home';
import Game from './Game';
import Rules from './pages/Rules';
import Scores from './pages/Scores';
import Stats from './pages/Stats';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation globale */}
        <nav style={{ padding: '15px', display: 'flex', gap: '15px', background: '#e0e0e0', justifyContent: 'center' }}>
          <Link to="/">Accueil</Link> |
          <Link to="/game">Jouer</Link> |
          <Link to="/rules">Règles</Link> |
          <Link to="/scores">Scores</Link> |
          <Link to="/stats">Stats</Link>
        </nav>

        {/* Définition des adresses */}
        <Routes>
          <Route path="/" element={<home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;