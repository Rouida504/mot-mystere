import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  // Variable d'état pour stocker le pseudo tapé par l'utilisateur
  const [pseudo, setPseudo] = useState('');
  
  // Hook de React Router pour changer de page
  const navigate = useNavigate();

  // Fonction appelée quand on valide le formulaire
  function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // On vérifie que le champ n'est pas vide
    if (pseudo !== '') {
      // Sauvegarde du pseudo dans le navigateur
      localStorage.setItem('pseudo', pseudo);
      
      // Redirection vers la page du jeu
      navigate('/jeu');
    }
  }

  return (
    <div>
      <h1>Le Mot Mystère</h1>
      <p>Devinez le mot secret en 6 essais !</p>

      {/* Formulaire de saisie du pseudo */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Entrez votre pseudo" 
          value={pseudo} 
          onChange={(e) => setPseudo(e.target.value)} 
        />
        <button type="submit">Jouer</button>
      </form>
    </div>
  );
}

export default Home;