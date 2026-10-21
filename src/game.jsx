import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { compareWords } from './gameLogic'; // Importation de votre fonction de logique
import './Game.css';

function Game() {
  const [pseudo, setPseudo] = useState('');
  const [guesses, setGuesses] = useState([]); // Tableau des mots déjà validés
  const [currentGuess, setCurrentGuess] = useState(''); // Mot en cours de frappe
  const targetWord = "ROUGE"; // Le mot mystère

  // Récupération du pseudo dans le localStorage au chargement
  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo');
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }
  }, []);

  // Gestion de la saisie au clavier
  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        // Valider le mot si 5 lettres et qu'il reste des essais
        if (currentGuess.length === 5 && guesses.length < 6) {
          setGuesses([...guesses, currentGuess]);
          setCurrentGuess('');
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
  }, [currentGuess, guesses]);

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
                  colorClass = colors[colIndex]; // 'green', 'yellow' ou 'gray'
                } else if (isCurrentRow) {
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
    </div>
  );
}

export default Game;