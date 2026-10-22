import { Link } from 'react-router-dom';

function Scores() {
  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2> Tableau des scores</h2>
      <p>À venir à l'étape suivante !</p>
      <Link to="/"><button style={{ marginTop: '15px' }}>Accueil</button></Link>
    </div>
  );
}

export default Scores;