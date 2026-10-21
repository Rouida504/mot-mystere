import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  // Variable d'état pour stocker et mettre à jour le pseudo tapé par l'utilisateur
  const [pseudo, setPseudo] = useState('');
  
  // Hook de React Router pour gérer la redirection vers la page du jeu
  const navigate = useNavigate();

  // Fonction appelée lors de la validation du formulaire (clic sur "Jouer" ou touche Entrée)
  function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement automatique de la page par le navigateur
    
    // On vérifie que le champ du pseudo n'est pas vide
    if (pseudo !== '') {
      // Sauvegarde du pseudo dans le localStorage pour les visites suivantes[cite: 2, 4]
      localStorage.setItem('pseudo', pseudo);
      
      // Redirection programmée vers la page de jeu (/jeu)
      navigate('/jeu');
    }
  }

  return (
    // Utilisation de la classe CSS spécifique pour la page d'accueil
    <div className="home-container">
      <h1>Le Mot Mystère</h1>
      <p>Devinez le mot secret en 6 essais !</p>

      {/* Formulaire de saisie du pseudo du joueur */}
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