import { useState, useEffect } from 'react';
import './Game.css';

function Game() {
  const [pseudo, setPseudo] = useState('');

  // On récupère le pseudo dans le localStorage au chargement du composant
  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo');
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  // Grille de 6 lignes et 5 colonnes (vide pour l'instant)
  const rows = Array(6).fill('');
  const cols = Array(5).fill('');

  return (
    <div className="game-container">
      <h2>Partie de {pseudo || 'Joueur'}</h2>
      <p>Devinez le mot secret !</p>

      {/* Grille de jeu */}
      <div className="grid">
        {rows.map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {cols.map((_, colIndex) => (
              <div key={colIndex} className="cell">
                {/* La lettre s'affichera ici plus tard */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
export default Game;
 
