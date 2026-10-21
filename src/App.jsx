import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Game from './Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil (URL racine) */}
        <Route path="/" element={<Home />} />
        
        {/* Page de jeu (URL /jeu) */}
        <Route path="/jeu" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;