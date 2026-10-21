import { useState, useEffect } from 'react';
import './Game.css';

function Game() {
  const [pseudo, setPseudo] = useState('');
  const [guesses, setGuesses] = useState([]); // Tableau des anciens essais (ex: ["POMME", "TREIN"])
  const [currentGuess, setCurrentGuess] = useState(''); // Essai en cours
  const targetWord = "ROUGE"; // Le mot mystère à deviner (pour l'instant en dur)

  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo');
    if (savedPseudo) setPseudo(savedPseudo);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        // Valider seulement si le mot fait exactement 5 lettres et qu'il reste des essais
        if (currentGuess.length === 5 && guesses.length < 6) {
          setGuesses((prev) => [...prev, currentGuess]);
          setCurrentGuess(''); // Réinitialiser pour le mot suivant
        }
      } else if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        if (currentGuess.length < 5 && guesses.length < 6) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses]);

  return (
    <div className="game-container">
      <h2>Partie de {pseudo || 'Joueur'}</h2>

      {/* Affichage des 6 lignes de la grille */}
      <div className="grid">
        {[0, 1, 2, 3, 4, 5].map((rowIndex) => {
          // Déterminer le mot de la ligne (soit un ancien essai, soit l'essai en cours, soit vide)
          const word = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');

          return (
            <div key={rowIndex} className="row">
              {[0, 1, 2, 3, 4].map((colIndex) => (
                <div key={colIndex} className="cell">
                  {word[colIndex] || ''}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Game;