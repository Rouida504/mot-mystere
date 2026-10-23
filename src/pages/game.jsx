import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { compareWords, generateShareText } from '../logic/gamelogic'; 
import { getDailyWord, getTodayKey } from '../logic/daily';
import Keyboard from '../components/Keyboard';
import Timer from '../components/Timer';
import mots from '../mots-solutions.json'; 
import '../styles/game.css'; 

function Game() {
  const [isDaily, setIsDaily] = useState(true); // Bascule Mode Mot du Jour et Partie Libre
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

  // Charger le pseudo et initialiser la partie (Mot du jour ou Partie libre)
  useEffect(() => {
    const savedPseudo = localStorage.getItem('pseudo') || localStorage.getItem('player_pseudo');
    if (savedPseudo) setPseudo(savedPseudo);

    if (isDaily) {
      const todayKey = getTodayKey();
      const target = getDailyWord();
      setMotMystere(target);

      // Charger la partie du jour si elle existe déjà dans le localStorage
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
        // Reset pour une nouvelle journée
        setGuesses([]);
        setGameOver(false);
        setIsWin(false);
        setLetterStatuses({});
      }
    } else {
      // Mode Partie libre (aléatoire)
      const randomWord = mots[Math.floor(Math.random() * mots.length)].toUpperCase();
      setMotMystere(randomWord);
      setGuesses([]);
      setGameOver(false);
      setIsWin(false);
      setLetterStatuses({});
    }
  }, [isDaily]);

  // Enregistrer le résultat de la partie
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
      win: winStatus,
      isDaily: isDaily
    };

    localStorage.setItem('wordle_history', JSON.stringify([newEntry, ...history]));

    // Si c'est le mode du jour, on sauvegarde l'état pour bloquer la rejouabilité
    if (isDaily) {
      const todayKey = getTodayKey();
      localStorage.setItem(`wordle_daily_${todayKey}`, JSON.stringify({
        guesses: guesses,
        gameOver: true,
        isWin: winStatus
      }));
    }
  };

  // Mettre à jour les couleurs des touches du clavier virtuel
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

  // Déclencher le tremblement de la ligne
  const triggerShake = (msg) => {
    setMessageErreur(msg);
    setInvalidWord(true);
    setTimeout(() => setInvalidWord(false), 500);
  };

  // Recommencer (uniquement dispo en mode Partie Libre)
  const relancerPartieLibre = () => {
    const randomWord = mots[Math.floor(Math.random() * mots.length)].toUpperCase();
    setMotMystere(randomWord);
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
    } else if (isDaily) {
      // Sauvegarde intermédiaire pour le mot du jour en cours
      const todayKey = getTodayKey();
      localStorage.setItem(`wordle_daily_${todayKey}`, JSON.stringify({
        guesses: nouvellesPropositions,
        gameOver: false,
        isWin: false
      }));
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

      // 1. Validation via l'API du Wiktionnaire
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
          // 2. Plan de secours local
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

      {/* Compte à rebours avant minuit pour le mot du jour */}
      {isDaily && <Timer />}

      {/* Bouton pour basculer entre Mot du Jour et Partie Libre */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
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

      {/* État de chargement */}
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
              (Voir sur le Wiktionnaire )
            </a>
          </p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            
            {/* Bouton de partage des émojis */}
            <button 
              onClick={() => {
                const textToShare = generateShareText(guesses, motMystere, isWin);
                navigator.clipboard.writeText(textToShare);
                alert("Résultat copié dans le presse-papiers ! ");
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

      {/* Clavier virtuel séparé dans un composant externe */}
      <Keyboard onKeyPress={handleInputKey} letterStatuses={letterStatuses} />
    </div>
  );
}

export default Game;