import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { compareWords } from '../logic/gamelogic'; 
import mots from '../mots-solutions.json'; 
import '../styles/game.css'; 

const KEYBOARD_ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DELETE']
];

function Game() {
  // Choisir un mot au hasard au démarrage
  const [motMystere, setMotMystere] = useState(() => {
    const index = Math.floor(Math.random() * mots.length);
    return mots[index].toUpperCase();
  });

  const [messageErreur, setMessageErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState({});

  // Charger le pseudo stocké
  useEffect(() => {
    const saved = localStorage.getItem('pseudo') || localStorage.getItem('player_pseudo');
    if (saved) setPseudo(saved);
  }, []);

  // Fonction pour enregistrer le résultat de la partie[cite: 5]
  const saveGameResult = (winStatus, attemptsCount) => {
    const history = JSON.parse(localStorage.getItem('wordle_history')) || [];
    const points = winStatus ? (7 - attemptsCount) * 100 : 0;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      pseudo: pseudo || 'Joueur',
      word: motMystere,
      attempts: attemptsCount,
      points: points,
      win: winStatus
    };

    localStorage.setItem('wordle_history', JSON.stringify([newEntry, ...history]));
  };

  // Mettre à jour les couleurs des touches du clavier virtuel[cite: 5]
  const updateKeyboardStatuses = (newGuesses) => {
    const newStatuses = { ...letterStatuses };
    newGuesses.forEach(guess => {
      const couleurs = compareWords(guess, motMystere);
      guess.split('').forEach((char, index) => {
        const status = couleurs[index]; // 'correct', 'present', ou 'absent'
        if (status === 'correct') {
          newStatuses[char] = 'correct';
        } else if (status === 'present' && newStatuses[char] !== 'correct') {
          newStatuses[char] = 'present';
        } else if (status === 'absent' && !newStatuses[char]) {
          newStatuses[char] = 'absent';
        }
      });
    });
    setLetterStatuses(newStatuses);
  };

  // Déclencher le tremblement de la ligne si le mot est invalide[cite: 5]
  const triggerShake = (msg) => {
    setMessageErreur(msg);
    setInvalidWord(true);
    setTimeout(() => setInvalidWord(false), 500);
  };

  // Fonction pour recommencer une partie avec un nouveau mot
  const relancerPartie = () => {
    const index = Math.floor(Math.random() * mots.length);
    setMotMystere(mots[index].toUpperCase());
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setIsWin(false);
    setMessageErreur('');
    setLetterStatuses({});
  };

  // Validation de la proposition
  const validerProposition = () => {
    setMessageErreur('');
    const nouvellesPropositions = [...guesses, currentGuess];
    setGuesses(nouvellesPropositions);
    updateKeyboardStatuses(nouvellesPropositions);
    setCurrentGuess('');

    if (currentGuess === motMystere) {
      setGameOver(true);
      setIsWin(true);
      saveGameResult(true, nouvellesPropositions.length);
    } else if (nouvellesPropositions.length === 6) {
      setGameOver(true);
      setIsWin(false);
      saveGameResult(false, 6);
    }
  };

  // Traitement de la touche appuyée
  const handleInputKey = (touche) => {
    if (gameOver || isLoading) return;

    if (touche === 'ENTER') {
      if (currentGuess.length < 5) {
        triggerShake('Le mot doit faire 5 lettres !');
        return;
      }

      setIsLoading(true);
      setMessageErreur('');

      // 1. Validation via l'API du Wiktionnaire[cite: 3]
      fetch(`https://fr.wiktionary.org/api/rest_v1/page/definition/${currentGuess.toLowerCase()}`)
        .then(response => {
          if (response.ok) return response.json();
          throw new Error("Mot introuvable sur le Wiktionnaire");
        })
        .then(() => {
          setIsLoading(false);
          validerProposition();
        })
        .catch(() => {
          // 2. Plan de secours local[cite: 3]
          if (mots.includes(currentGuess.toLowerCase())) {
            setIsLoading(false);
            validerProposition();
          } else {
            setIsLoading(false);
            triggerShake("Ce mot n'existe pas dans le dictionnaire !");
          }
        });

    } else if (touche === 'BACKSPACE' || touche === 'DELETE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (touche.length === 1 && touche >= 'A' && touche <= 'Z') {
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => prev + touche);
      }
    }
  };

  // Écouteur de clavier physique
  useEffect(() => {
    function handleKeyDown(e) {
      const touche = e.key.toUpperCase();
      if (touche === 'ENTER' || touche === 'BACKSPACE' || (touche.length === 1 && touche >= 'A' && touche <= 'Z')) {
        handleInputKey(touche);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, isLoading, motMystere, letterStatuses]);

  return (
    <div className="game-container">
      <h2>Partie de {pseudo || 'Joueur'}</h2>

      {/* Grille de jeu */}
      <div className="grid">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const ligneActuelle = rowIndex === guesses.length;
          const motSaisi = guesses[rowIndex];
          const couleurs = motSaisi ? compareWords(motSaisi, motMystere) : [];

          return (
            <div 
              key={rowIndex} 
              className={`row ${ligneActuelle && invalidWord ? 'shake' : ''}`}
            >
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

      {/* État de chargement[cite: 3] */}
      {isLoading && (
        <p style={{ color: '#007bff', textAlign: 'center', marginTop: '10px' }}>
          Vérification sur le Wiktionnaire...
        </p>
      )}

      {/* Message d'erreur */}
      {messageErreur && (
        <p style={{ color: '#d9534f', textAlign: 'center', marginTop: '10px' }}>
          {messageErreur}
        </p>
      )}

      {/* Message de fin de partie */}
      {gameOver && (
        <div className="game-over-message" style={{ marginTop: '20px', textAlign: 'center' }}>
          {isWin ? <h3>Bravo, tu as gagné ! 🎉</h3> : <h3>Perdu ! 😢</h3>}
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
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={relancerPartie} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Rejouer
            </button>
            <Link to="/scores"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Voir les scores</button></Link>
            <Link to="/stats"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Voir les stats</button></Link>
          </div>
        </div>
      )}

      {/* Clavier virtuel interactif[cite: 5] */}
      <div className="keyboard" style={{ marginTop: '20px' }}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '5px' }}>
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleInputKey(key)}
                className={`key ${letterStatuses[key] || ''}`}
                style={{
                  padding: key.length > 1 ? '10px 12px' : '10px 15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  border: 'none'
                }}
              >
                {key === 'DELETE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;