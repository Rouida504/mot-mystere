import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { compareWords, generateShareText } from "../logic/gameLogic";
import { getDailyWord, getTodayKey } from '../logic/daily';
import { getRandomWord, WORDS_BY_LENGTH } from '../logic/words';
import Keyboard from '../components/Keyboard';
import Timer from '../components/Timer';
import '../styles/game.css'; 

function Game() {
  const [isDaily, setIsDaily] = useState(true); // Mot du jour vs Partie Libre

  // Configuration des variantes (Palier 5)
  const [wordLength, setWordLength] = useState(() => {
    return parseInt(localStorage.getItem('wordle_length')) || 5;
  });
  const [isHardMode, setIsHardMode] = useState(() => {
    return localStorage.getItem('wordle_hard_mode') === 'true';
  });

  const [motMystere, setMotMystere] = useState('');
  const [messageErreur, setMessageErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState({});

  // Sauvegarde des préférences dans localStorage
  useEffect(() => {
    localStorage.setItem('wordle_length', wordLength);
  }, [wordLength]);

  useEffect(() => {
    localStorage.setItem('wordle_hard_mode', isHardMode);
  }, [isHardMode]);

  // Charger le pseudo et initialiser la partie
  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo') || localStorage.getItem('player_pseudo');
    if (savedPseudo) setPseudo(savedPseudo);

    if (isDaily) {
      const todayKey = getTodayKey();
      const target = getDailyWord();
      setMotMystere(target);

      const savedGame = localStorage.getItem(`wordle_daily_${todayKey}`);
      if (savedGame) {
        const parsed = JSON.parse(savedGame);
        setGuesses(parsed.guesses || []);
        setGameOver(parsed.gameOver || false);
        setIsWin(parsed.isWin || false);
        if (parsed.guesses) {
          updateKeyboardStatuses(parsed.guesses, target);
        }
      } else {
        setGuesses([]);
        setGameOver(false);
        setIsWin(false);
        setLetterStatuses({});
      }
    } else {
      // Partie libre avec la longueur choisie
      const randomWord = getRandomWord(wordLength);
      setMotMystere(randomWord);
      setGuesses([]);
      setGameOver(false);
      setIsWin(false);
      setLetterStatuses({});
    }
  }, [isDaily, wordLength]);

  // Validation du Mode Difficile
  const validateHardMode = (guess) => {
    if (!isHardMode || guesses.length === 0) return { valid: true };

    const lastGuess = guesses[guesses.length - 1];
    const lastResult = compareWords(lastGuess, motMystere);

    // 1. Vérification des lettres VERTES (position exacte)
    for (let i = 0; i < lastResult.length; i++) {
      if (lastResult[i] === 'correct' && guess[i] !== lastGuess[i]) {
        return { 
          valid: false, 
          message: `La ${i + 1}e lettre doit être '${lastGuess[i]}' !` 
        };
      }
    }

    // 2. Vérification des lettres JAUNES (réutilisation obligatoire)
    for (let i = 0; i < lastResult.length; i++) {
      if (lastResult[i] === 'present' && !guess.includes(lastGuess[i])) {
        return { 
          valid: false, 
          message: `La lettre '${lastGuess[i]}' doit être réutilisée !` 
        };
      }
    }

    return { valid: true };
  };

  // Enregistrer le résultat avec multiplicateur de score
  const saveGameResult = (winStatus, attemptsCount) => {
    const history = JSON.parse(localStorage.getItem('wordle_history')) || [];
    
    // Calcul de base
    let basePoints = winStatus ? (7 - attemptsCount) * 100 : 0;
    
    // Multiplicateurs de difficulté
    let multiplier = 1;
    if (wordLength === 6) multiplier *= 1.5;
    if (wordLength === 7) multiplier *= 2;
    if (isHardMode) multiplier *= 1.5;

    const points = Math.round(basePoints * multiplier);

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      pseudo: pseudo || 'Joueur',
      word: motMystere,
      length: wordLength,
      hardMode: isHardMode,
      attempts: attemptsCount,
      points: points,
      win: winStatus,
      isDaily: isDaily
    };

    localStorage.setItem('wordle_history', JSON.stringify([newEntry, ...history]));

    if (isDaily) {
      const todayKey = getTodayKey();
      localStorage.setItem(`wordle_daily_${todayKey}`, JSON.stringify({
        guesses: guesses,
        gameOver: true,
        isWin: winStatus
      }));
    }
  };

  const updateKeyboardStatuses = (newGuesses, currentTarget = motMystere) => {
    const newStatuses = { ...letterStatuses };
    newGuesses.forEach(guess => {
      const couleurs = compareWords(guess, currentTarget);
      guess.split('').forEach((char, index) => {
        const status = couleurs[index]; 
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

  const triggerShake = (msg) => {
    setMessageErreur(msg);
    setInvalidWord(true);
    setTimeout(() => setInvalidWord(false), 500);
  };

  const relancerPartieLibre = () => {
    const randomWord = getRandomWord(wordLength);
    setMotMystere(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setIsWin(false);
    setMessageErreur('');
    setLetterStatuses({});
  };

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
    } else if (isDaily) {
      const todayKey = getTodayKey();
      localStorage.setItem(`wordle_daily_${todayKey}`, JSON.stringify({
        guesses: nouvellesPropositions,
        gameOver: false,
        isWin: false
      }));
    }
  };

  const handleInputKey = (touche) => {
    if (gameOver || isLoading) return;

    if (touche === 'ENTER') {
      const currentWordLength = isDaily ? 5 : wordLength;

      if (currentGuess.length < currentWordLength) {
        triggerShake(`Le mot doit faire ${currentWordLength} lettres !`);
        return;
      }

      // Vérification des règles du Mode Difficile
      const hardModeCheck = validateHardMode(currentGuess);
      if (!hardModeCheck.valid) {
        triggerShake(hardModeCheck.message);
        return;
      }

      setIsLoading(true);
      setMessageErreur('');

      // Validation Wiktionnaire + Plan B local
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
          const list = WORDS_BY_LENGTH[currentWordLength] || [];
          if (list.map(w => w.toUpperCase()).includes(currentGuess.toUpperCase())) {
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
      const maxLen = isDaily ? 5 : wordLength;
      if (currentGuess.length < maxLen) {
        setCurrentGuess(prev => prev + touche);
      }
    }
  };

  useEffect(() => {
    function handleKeyDown(e) {
      const touche = e.key.toUpperCase();
      if (touche === 'ENTER' || touche === 'BACKSPACE' || (touche.length === 1 && touche >= 'A' && touche <= 'Z')) {
        handleInputKey(touche);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, isLoading, motMystere, letterStatuses, wordLength, isHardMode]);

  const activeLength = isDaily ? 5 : wordLength;

  return (
    <div className="game-container">
      <h2>Partie de {pseudo || 'Joueur'}</h2>

      {isDaily && <Timer />}

      {/* Modes de jeu et Variantes (Palier 5) */}
      <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsDaily(true)} 
            style={{ background: isDaily ? '#333' : '#ddd', color: isDaily ? '#fff' : '#000', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
          >
            Mot du Jour
          </button>
          <button 
            onClick={() => setIsDaily(false)} 
            style={{ background: !isDaily ? '#333' : '#ddd', color: !isDaily ? '#fff' : '#000', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
          >
            Partie Libre
          </button>
        </div>

        {/* Options de longueur et difficulté pour la Partie Libre */}
        {!isDaily && (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Longueur : 
              <select 
                value={wordLength} 
                onChange={(e) => setWordLength(Number(e.target.value))}
                style={{ marginLeft: '5px', padding: '4px 8px' }}
              >
                <option value={5}>5 Lettres</option>
                <option value={6}>6 Lettres (×1.5)</option>
                <option value={7}>7 Lettres (×2.0)</option>
              </select>
            </label>

            <label style={{ fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                type="checkbox" 
                checked={isHardMode} 
                onChange={(e) => setIsHardMode(e.target.checked)} 
              />
              Mode Difficile (×1.5)
            </label>
          </div>
        )}
      </div>

      {/* Grille de jeu adaptée dynamiquement à la longueur */}
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
              {Array.from({ length: activeLength }).map((_, colIndex) => {
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

      {isLoading && (
        <p style={{ color: '#007bff', textAlign: 'center', marginTop: '10px' }}>
          Vérification sur le Wiktionnaire...
        </p>
      )}

      {messageErreur && (
        <p style={{ color: '#d9534f', textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
          {messageErreur}
        </p>
      )}

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
              (Voir sur le Wiktionnaire)
            </a>
          </p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                const textToShare = generateShareText(guesses, motMystere, isWin);
                navigator.clipboard.writeText(textToShare);
                alert("Résultat copié dans le presse-papiers !");
              }} 
              style={{ padding: '8px 16px', cursor: 'pointer', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              Partager
            </button>

            {!isDaily && (
              <button onClick={relancerPartieLibre} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                Rejouer (Libre)
              </button>
            )}
            <Link to="/scores"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Voir les scores</button></Link>
            <Link to="/stats"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Voir les stats</button></Link>
          </div>
        </div>
      )}

      <Keyboard onKeyPress={handleInputKey} letterStatuses={letterStatuses} />
    </div>
  );
}

export default Game;