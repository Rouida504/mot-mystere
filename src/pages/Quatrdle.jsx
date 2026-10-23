import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRandomWord } from '../logic/words';

function Quatrdle() {
  const [targetWords, setTargetWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const maxAttempts = 9;

  // 1. Initialisation des 4 mots au chargement
  useEffect(() => {
    const words = new Set();
    while (words.size < 4) {
      words.add(getRandomWord(5));
    }
    setTargetWords(Array.from(words));
  }, []);

  // Vérifier si tous les mots ont été trouvés
  const allWon = targetWords.length > 0 && targetWords.every(target => guesses.includes(target));

  // 2. Gestion de la saisie au clavier physique
  useEffect(() => {
    if (gameOver || targetWords.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (currentGuess.length !== 5) {
          alert("Le mot doit faire 5 lettres !");
          return;
        }
        // Ajout de la proposition
        const newGuesses = [...guesses, currentGuess.toUpperCase()];
        setGuesses(newGuesses);
        setCurrentGuess('');

        // Vérification de fin de partie (9 essais ou 4 mots résolus)
        const isAllFound = targetWords.every(target => newGuesses.includes(target));
        if (newGuesses.length >= maxAttempts || isAllFound) {
          setGameOver(true);
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
        setCurrentGuess(prev => prev + e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, targetWords]);

  // Fonction pour calculer les couleurs d'une lettre dans une grille spécifique
  const getLetterStatus = (letter, index, targetWord) => {
    if (!letter) return '#fff';
    if (targetWord[index] === letter) return '#6aaa64'; // Vert
    if (targetWord.includes(letter)) return '#c9b458'; // Jaune
    return '#787c7e'; // Gris
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>Mode Quatrdle (4 Grilles)</h2>
      <p>Essai global : {guesses.length} / {maxAttempts}</p>

      {/* Affichage des 4 grilles en 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '600px', margin: '20px auto' }}>
        {targetWords.map((target, gridIndex) => {
          // Vérifie si cette grille est résolue et à quel essai elle l'a été
          const isGridWon = guesses.includes(target);
          const solvedIndex = guesses.findIndex(g => g === target);

          return (
            <div key={gridIndex} style={{ 
              border: `2px solid ${isGridWon ? '#6aaa64' : '#ccc'}`, 
              padding: '10px', 
              borderRadius: '8px', 
              background: isGridWon ? '#e6f4ea' : '#fff' 
            }}>
              <h4>Grille {gridIndex + 1} {isGridWon ? '🎉 Trouvé !' : ''}</h4>
              
              {/* Génération des lignes de la grille (9 essais max) */}
              {Array.from({ length: maxAttempts }).map((_, rowIndex) => {
                // Si la grille est gagnée, on fige les lignes après la trouvaille
                const isFrozenAfterWin = isGridWon && solvedIndex !== -1 && rowIndex > solvedIndex;
                const guess = isFrozenAfterWin ? '' : (guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : ''));
                const isSubmitted = rowIndex < guesses.length && (!isGridWon || rowIndex <= solvedIndex);

                return (
                  <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '4px', opacity: isFrozenAfterWin ? 0.3 : 1 }}>
                    {Array.from({ length: 5 }).map((_, colIndex) => {
                      const letter = guess[colIndex] || '';
                      let bgColor = '#fff';
                      let textColor = '#000';

                      if (isSubmitted && guesses[rowIndex]) {
                        bgColor = getLetterStatus(guesses[rowIndex][colIndex], colIndex, target);
                        textColor = '#fff';
                      }

                      return (
                        <div key={colIndex} style={{
                          width: '35px',
                          height: '35px',
                          border: '2px solid #d3d6da',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          backgroundColor: bgColor,
                          color: textColor,
                          borderRadius: '4px'
                        }}>
                          {letter}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div style={{ margin: '20px 0', padding: '15px', background: allWon ? '#d4edda' : '#ffebee', borderRadius: '5px' }}>
          <h3>{allWon ? '🏆 Victoire éclatante ! Les 4 grilles sont résolues !' : 'Fin de partie !'}</h3>
          <p>Les mots mystères étaient : <strong>{targetWords.join(', ')}</strong></p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Retour à l'accueil</button></Link>
      </div>
    </div>
  );
}

export default Quatrdle;