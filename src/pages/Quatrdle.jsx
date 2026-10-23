import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRandomWord } from '../logic/words';

function Quatrdle() {
  // Tirage de 4 mots secrets de 5 lettres
  const [targetWords, setTargetWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');

  useEffect(() => {
    // Génère 4 mots différents de 5 lettres
    const words = new Set();
    while (words.size < 4) {
      words.add(getRandomWord(5));
    }
    setTargetWords(Array.from(words));
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Mode Quatrdle (4 Grilles)</h2>
      <p>9 essais pour trouver les 4 mots mystères !</p>

      {/* Zone temporaire pour vérifier les 4 mots générés */}
      <div style={{ margin: '20px 0', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <strong>Mots à trouver (Mode dev) :</strong> {targetWords.join(' - ')}
      </div>

      <Link to="/"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Retour au menu</button></Link>
    </div>
  );
}

export default Quatrdle;