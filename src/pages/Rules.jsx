import { Link } from 'react-router-dom';

function Rules() {
  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>📖 Règles du jeu</h2>
      <p>Devine le mot mystère en 6 essais maximum.</p>

      <h3>Signification des couleurs :</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '35px', height: '35px', background: '#6aaa64', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>T</div>
        <p><strong>Vert :</strong> Lettre bien placée.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '35px', height: '35px', background: '#c9b458', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
        <p><strong>Jaune :</strong> Lettre présente mais mal placée.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '35px', height: '35px', background: '#787c7e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>X</div>
        <p><strong>Gris :</strong> Lettre absente du mot.</p>
      </div>

      <Link to="/"><button style={{ padding: '8px 16px', cursor: 'pointer' }}>Retour à l'accueil</button></Link>
    </div>
  );
}

export default Rules;