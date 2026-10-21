import { useState, useEffect } from 'react';
import { compareWords } from './gameLogic';
import WORDS from './mots_solutions.json';[cite: 2]
import './Game.css';

// Fonction pour choisir un mot aléatoire dans le fichier JSON
const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[randomIndex].toUpperCase(); // On met en majuscules pour correspondre au jeu
};

function Game() {
  const [pseudo, setPseudo] = useState('');
  const [guesses, setGuesses] = useState([]); // Tableau des mots déjà validés
  const [currentGuess, setCurrentGuess] = useState(''); // Mot en cours de frappe
  const [gameOver, setGameOver] = useState(false); // État de fin de partie
  const [isWin, setIsWin] = useState(false); // État de victoire ou défaite
  
  // Utilisation d'un state pour le mot mystère pioché aléatoirement
  const [targetWord, setTargetWord] = useState(getRandomWord);

  // Récupération du pseudo dans le localStorage au chargement
  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo');
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  // Fonction pour réinitialiser le jeu et changer de mot mystère
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setIsWin(false);
    setTargetWord(getRandomWord()); // Change de mot mystère à chaque nouvelle partie !
  };

  // Gestion de la saisie au clavier
  useEffect(() => {
    function handleKeyDown(e) {
      if (gameOver) return; // Bloque le clavier si la partie est finie

      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        // Valider le mot si 5 lettres et qu'il reste des essais
        if (currentGuess.length === 5 && guesses.length < 6) {
          const newGuesses = [...guesses, currentGuess];
          setGuesses(newGuesses);
          setCurrentGuess('');

          // Victoire : le mot proposé est égal au mot mystère
          if (currentGuess === targetWord) {
            setGameOver(true);
            setIsWin(true);
          } 
          // Défaite : 6 essais atteints sans trouver le mot
          else if (newGuesses.length === 6) {
            setGameOver(true);
            setIsWin(false);
          }
        }
      } else if (key === 'BACKSPACE') {
        // Effacer la dernière lettre
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        // Ajouter la lettre si on n'a pas dépassé 5 lettres
        if (currentGuess.length < 5) {
          setCurrentGuess(currentGuess + key);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, targetWord]);

  return (
    <div className="game-container">
      <h2>Partie de {pseudo || 'Joueur'}</h2>

      {/* Grille de 6 lignes */}
      <div className="grid">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const isCurrentRow = rowIndex === guesses.length;
          const guess = guesses[rowIndex];

          // Si la ligne a déjà été jouée, on calcule les couleurs des lettres
          const colors = guess ? compareWords(guess, targetWord) : [];

          return (
            <div key={rowIndex} className="row">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                let letter = '';
                let colorClass = '';

                if (guess) {
                  // Ligne déjà validée : on affiche la lettre et sa couleur (vert, jaune, gris)
                  letter = guess[colIndex];
                  colorClass = colors[colIndex];
                } else if (isCurrentRow && !gameOver) {
                  // Ligne en cours de frappe : on affiche la lettre tapée
                  letter = currentGuess[colIndex] || '';
                }

                return (
                  <div key={colIndex} className={`cell ${colorClass}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Message de fin de partie et bouton Rejouer */}
      {gameOver && (
        <div className="game-over-message" style={{ marginTop: '20px', textAlign: 'center' }}>
          {isWin ? (
            <h3>Bravo ! Vous avez trouvé le mot mystère ! 🎉</h3>
          ) : (
            <h3>Dommage ! Le mot mystère était : <strong>{targetWord}</strong> 😞</h3>
          )}
          <button onClick={resetGame} className="btn-replay" style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}>
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;