import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Récupère l'historique enregistré ou initialise un tableau vide
    const history = JSON.parse(localStorage.getItem('wordle_history')) || [];
    
    // Trie par points décroissants pour garder le top 10 des victoires
    const sortedScores = history
      .filter(game => game.win)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    setScores(sortedScores);
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2> Tableau des scores (Top 10)</h2>

      {scores.length === 0 ? (
        <p>Aucun score enregistré pour le moment. Joue une partie pour commencer !</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '10px' }}>Rang</th>
              <th style={{ padding: '10px' }}>Joueur</th>
              <th style={{ padding: '10px' }}>Mot</th>
              <th style={{ padding: '10px' }}>Essais</th>
              <th style={{ padding: '10px' }}>Points</th>
              <th style={{ padding: '10px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id || index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>#{index + 1}</td>
                <td style={{ padding: '8px' }}>{score.pseudo}</td>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>{score.word}</td>
                <td style={{ padding: '8px' }}>{score.attempts}/6</td>
                <td style={{ padding: '8px', color: '#6aaa64', fontWeight: 'bold' }}>{score.points}</td>
                <td style={{ padding: '8px' }}>{score.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '25px' }}>
        <Link to="/"><button style={{ padding: '10px 20px', cursor: 'pointer' }}>Accueil</button></Link>
      </div>
    </div>
  );
}

export default Scores;