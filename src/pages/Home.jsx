import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [pseudoInput, setPseudoInput] = useState('');

  // Charger un pseudo existant s'il y en a déjà un
  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo') || '';
    setPseudoInput(savedPseudo);

    // Écouter la touche Entrée pour lancer directement le jeu
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        sauvegarderEtJouer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pseudoInput]);

  // Enregistrer le pseudo et lancer la partie
  const sauvegarderEtJouer = () => {
    const pseudoFinal = pseudoInput.trim() || 'Joueur';
    localStorage.setItem('pseudo', pseudoFinal);
    navigate('/game');
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Le Mot Mystère</h1>
      <p>Bienvenue sur le jeu Wordle !</p>

      {/* Champ pour entrer le pseudo */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="pseudo" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Entre ton pseudo :
        </label>
        <input
          id="pseudo"
          type="text"
          value={pseudoInput}
          onChange={(e) => setPseudoInput(e.target.value)}
          placeholder="Ex: Clara, Thomas..."
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            textAlign: 'center',
            width: '200px'
          }}
        />
      </div>

      {/* Boutons de navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px', margin: '20px auto' }}>
        <button 
          onClick={sauvegarderEtJouer}
          style={{ padding: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#556B2F', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Jouer (Entrée)
        </button>
        <Link to="/rules"><button style={{ width: '100%', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>Règles du jeu</button></Link>
        <Link to="/scores"><button style={{ width: '100%', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>Scores</button></Link>
        <Link to="/stats"><button style={{ width: '100%', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>Statistiques</button></Link>
      </div>
    </div>
  );
}

export default Home;