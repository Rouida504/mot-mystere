import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        navigate('/game');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>🎮 Le Mot Mystère</h1>
      <p>Appuie sur <strong>Entrée</strong> ou clique ci-dessous pour jouer</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '220px', margin: '30px auto' }}>
        <Link to="/game">
          <button style={{ width: '100%', padding: '12px', cursor: 'pointer', fontSize: '16px' }}>
            Jouer (Entrée ↵)
          </button>
        </Link>
        <Link to="/rules">
          <button style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>Règles du jeu</button>
        </Link>
        <Link to="/scores">
          <button style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>Scores</button>
        </Link>
        <Link to="/stats">
          <button style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>Statistiques</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;