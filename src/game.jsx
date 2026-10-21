import { useState, useEffect } from 'react';
import './Game.css';

function Game() {
  const [pseudo] = useState(() => localStorage.getItem('pseudo') ?? '');
  const [currentGuess, setCurrentGuess] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        setCurrentGuess((prev) => (prev.length < 5 ? prev + key : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="game-container">
      <h2>Partie de {pseudo ? pseudo : 'Joueur'}</h2>
      <p>Tape un mot de 5 lettres au clavier !</p>

      <div className="grid">
        <div className="row">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="cell">
              {currentGuess[i]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;