import { useState, useEffect } from 'react';
import { compareWords } from './gameLogic';
import mots from './mots-solutions.json';
import './Game.css';

function Game() {
  // Choisir un mot au hasard dans le fichier au démarrage
  const [motMystere, setMotMystere] = useState(() => {
    const index = Math.floor(Math.random() * mots.length);
    return mots[index].toUpperCase();
  });

  const [messageErreur, setMessageErreur] = useState(''); // pour le msg d'erreur 
  const [isLoading, setIsLoading] = useState(false); // État de chargement pour l'API
  const [pseudo, setPseudo] = useState(''); 
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // Charger le pseudo stocké
  useEffect(() => {
    const saved = localStorage.getItem('pseudo');
    if (saved) setPseudo(saved);
  }, []);

  // Fonction pour recommencer une partie avec un nouveau mot
  const relancerPartie = () => {
    const index = Math.floor(Math.random() * mots.length);
    setMotMystere(mots[index].toUpperCase());
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setIsWin(false);
    setMessageErreur('');
  };

  // Fonction commune pour valider la proposition acceptée
  const validerProposition = () => {
    setMessageErreur('');
    const nouvellesPropositions = [...guesses, currentGuess];
    setGuesses(nouvellesPropositions);
    setCurrentGuess('');

    if (currentGuess === motMystere) {
      setGameOver(true);
      setIsWin(true);
    } else if (nouvellesPropositions.length === 6) {
      setGameOver(true);
      setIsWin(false);
    }
  };

  // Gestion des touches du clavier
  useEffect(() => {
    function handleKeyDown(e) {
      if (gameOver || isLoading) return;

      const touche = e.key.toUpperCase();

      if (touche === 'ENTER') {
        if (currentGuess.length === 5 && guesses.length < 6) {
          setIsLoading(true); // L'application travaille, on bloque les nouveaux envois[cite: 3]
          setMessageErreur('');

          // 1. Validation via l'API du Wiktionnaire[cite: 3]
          fetch(`https://fr.wiktionary.org/api/rest_v1/page/definition/${currentGuess.toLowerCase()}`)
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Mot introuvable sur le Wiktionnaire");
              }
            })
            .then(() => {
              setIsLoading(false);
              validerProposition();
            })
            .catch(() => {
              // 2. Plan de secours (Fallback) : Si l'API échoue, on utilise le fichier JSON local[cite: 3]
              if (mots.includes(currentGuess.toLowerCase())) {
                setIsLoading(false);
                validerProposition();
              } else {
                setIsLoading(false);
                setMessageErreur("Ce mot n'existe pas dans le dictionnaire !");
              }
            });
        }
      } else if (touche === 'BACKSPACE') {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (touche.length === 1 && touche >= 'A' && touche <= 'Z') {
        if (currentGuess.length < 5) {
          setCurrentGuess(currentGuess + touche);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, isLoading, motMystere]);

  return (
    <div className="game-container">
      <h2>Partie de {pseudo || 'Joueur'}</h2>

      {/* Affichage de la grille de jeu */}
      <div className="grid">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const ligneActuelle = rowIndex === guesses.length;
          const motSaisi = guesses[rowIndex];
          const couleurs = motSaisi ? compareWords(motSaisi, motMystere) : [];

          return (
            <div key={rowIndex} className="row">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                let lettre = '';
                let classeCouleur = '';

                if (motSaisi) {
                  lettre = motSaisi[colIndex];
                  classeCouleur = couleurs[colIndex];
                } else if (ligneActuelle && !gameOver) {
                  lettre = currentGuess[colIndex] || '';
                }

                return (
                  <div key={colIndex} className={`cell ${classeCouleur}`}>
                    {lettre}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Indicateur de chargement de l'API[cite: 3] */}
      {isLoading && (
        <p style={{ color: 'blue', textAlign: 'center', marginTop: '10px' }}>
          Vérification sur le Wiktionnaire en cours...
        </p>
      )}

      {/* Message d'erreur */}
      {messageErreur && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
          {messageErreur}
        </p>
      )} 

      {/* Message de fin avec lien vers le Wiktionnaire[cite: 3] */}
      {gameOver && (
        <div className="game-over-message" style={{ marginTop: '20px', textAlign: 'center' }}>
          {isWin ? (
            <h3>Bravo, tu as gagné ! 🎉</h3>
          ) : (
            <h3>Perdu ! 😢</h3>
          )}
          <p>
            Le mot mystère était : <strong>{motMystere}</strong>{' '}
            <a 
              href={`https://fr.wiktionary.org/wiki/${motMystere.toLowerCase()}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              (Voir sur le Wiktionnaire 📖)
            </a>
          </p>
          <button onClick={relancerPartie} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;