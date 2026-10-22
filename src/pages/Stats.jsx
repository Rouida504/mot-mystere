import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Stats() {
  const [stats, setStats] = useState({
    played: 0,
    wins: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalPoints: 0
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('wordle_history')) || [];
    const played = history.length;
    const wins = history.filter(g => g.win).length;
    const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;
    const totalPoints = history.reduce((acc, g) => acc + (g.points || 0), 0);

    // Calcul de la série en cours et de la meilleure série
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Du plus ancien au plus récent pour calculer la série
    const reversedHistory = [...history].reverse();
    for (const game of reversedHistory) {
      if (game.win) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
    
    // Série en cours (en repartant du dernier jeu joué)
    for (const game of history) {
      if (game.win) currentStreak++;
      else break;
    }

    setStats({ played, wins, winRate, currentStreak, maxStreak, totalPoints });
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2>Statistiques du joueur</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', margin: '30px 0' }}>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.played}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Parties</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.winRate}%</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Victoires</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.currentStreak}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Série en cours</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.maxStreak}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Meilleure série</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>{stats.totalPoints}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Points totaux</p>
        </div>
      </div>

      <Link to="/"><button style={{ padding: '10px 20px', cursor: 'pointer' }}>Accueil</button></Link>
    </div>
  );
}

export default Stats;