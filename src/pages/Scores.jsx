import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Scores() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('daily'); // 'daily' ou 'free'

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('wordle_history')) || [];
    setHistory(savedHistory);
  }, []);

  // Filtrer les scores selon le mode sélectionné
  const filteredHistory = history.filter(item => {
    if (filter === 'daily') return item.isDaily === true;
    return item.isDaily === false || item.isDaily === undefined;
  });

  // Tri : par victoires, puis par nombre d'essais (du plus petit au plus grand)
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (b.win !== a.win) return b.win - a.win;
    return a.attempts - b.attempts;
  });

  return (
    <div className="scores-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Tableau des Scores</h2>

      {/* Onglets de filtrage */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('daily')}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            background: filter === 'daily' ? '#333' : '#ddd',
            color: filter === 'daily' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Mot du Jour
        </button>
        <button
          onClick={() => setFilter('free')}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            background: filter === 'free' ? '#333' : '#ddd',
            color: filter === 'free' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          ♾️ Partie Libre
        </button>
      </div>

      {/* Tableau des résultats */}
      {sortedHistory.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Aucune partie enregistrée dans ce mode.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '8px' }}>Joueur</th>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Mot</th>
              <th style={{ padding: '8px' }}>Essais</th>
              <th style={{ padding: '8px' }}>Résultat</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{entry.pseudo}</td>
                <td style={{ padding: '8px' }}>{entry.date}</td>
                <td style={{ padding: '8px' }}>{entry.word}</td>
                <td style={{ padding: '8px' }}>{entry.win ? `${entry.attempts}/6` : 'X/6'}</td>
                <td style={{ padding: '8px' }}>{entry.win ? 'Gagné' : ' Perdu'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Retour au jeu</button></Link>
      </div>
    </div>
  );
}

export default Scores;