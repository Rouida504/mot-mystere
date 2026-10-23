import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Scores() {
  const [history, setHistory] = useState([]);
  const [type, setType] = useState('all');
  const [length, setLength] = useState('ALL');
  const [mode, setMode] = useState('ALL');

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('wordle_history')) || []);
  }, []);

  const filtered = history
    .filter(i => (type === 'all' || (type === 'daily' ? i.isDaily : !i.isDaily)) &&
                 (length === 'ALL' || (i.length || 5) === Number(length)) &&
                 (mode === 'ALL' || (mode === 'HARD' ? i.hardMode : !i.hardMode)))
    .sort((a, b) => (b.points || 0) - (a.points || 0) || a.attempts - b.attempts);

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Tableau des Scores</h2>

      {/* Filtres compacts */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <button onClick={() => setType('all')}>Tous</button>
        <button onClick={() => setType('daily')}>Mot du Jour</button>
        <button onClick={() => setType('free')}>Partie Libre</button>

        <select value={length} onChange={e => setLength(e.target.value)}>
          <option value="ALL">Toutes tailles</option>
          <option value="5">5 lettres</option>
          <option value="6">6 lettres</option>
          <option value="7">7 lettres</option>
        </select>

        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="ALL">Tous modes</option>
          <option value="NORMAL">Normal</option>
          <option value="HARD">Difficile</option>
        </select>
      </div>

      {/* Tableau */}
      {filtered.length === 0 ? <p>Aucun score trouvé.</p> : (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Mot</th>
              <th>Taille</th>
              <th>Mode</th>
              <th>Essais</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.pseudo}</td>
                <td><strong>{item.word}</strong></td>
                <td>{item.length || 5}L</td>
                <td>{item.hardMode ? '🔥' : 'Normal'}</td>
                <td>{item.win ? `${item.attempts}/6` : 'X'}</td>
                <td><strong>{item.points || 0} pts</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '15px' }}>
        <Link to="/"><button>Retour au jeu</button></Link>
      </div>
    </div>
  );
}

export default Scores;