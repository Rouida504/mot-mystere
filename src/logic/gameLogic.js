/**
 * Compare le mot proposé (guess) au mot mystère (targetWord)
 * @param {string} guess Le mot entré par le joueur (ex: "RADIO")
 * @param {string} targetWord Le mot mystère à trouver (ex: "ROUGE")
 * @returns {string[]} Un tableau de 5 statuts : ['correct', 'present', 'absent', ...]
 */
export function compareWords(guess, targetWord) {
  const guessUpper = guess.toUpperCase();
  const targetUpper = targetWord.toUpperCase();

  // Tableau de résultats initialisé à 'absent' pour chaque lettre
  const statuses = ['absent', 'absent', 'absent', 'absent', 'absent'];

  // Tableau pour suivre les lettres du mot mystère déjà associées (pour les doublons)
  const targetLetters = targetUpper.split('');

  // 1ère passe : Vérification des lettres bien placées (VERT / correct)
  for (let i = 0; i < 5; i++) {
    if (guessUpper[i] === targetUpper[i]) {
      statuses[i] = 'correct';
      targetLetters[i] = null; // On consomme la lettre
    }
  }

  // 2ème passe : Vérification des lettres mal placées (JAUNE / present) ou absentes (absent)
  for (let i = 0; i < 5; i++) {
    // Si la lettre est déjà correcte, on passe à la suivante
    if (statuses[i] === 'correct') continue;

    const currentLetter = guessUpper[i];
    const targetIndex = targetLetters.indexOf(currentLetter);

    // Si la lettre existe encore dans le mot mystère non-marqué
    if (targetIndex !== -1) {
      statuses[i] = 'present';
      targetLetters[targetIndex] = null; // On consomme cette occurrence
    } else {
      statuses[i] = 'absent';
    }
  }

  return statuses;
}

/**
 * Génère le texte formaté avec les émojis pour le partage (Palier 4)
 * @param {string[]} guesses Liste des mots essayés par le joueur
 * @param {string} motMystere Le mot mystère de la partie
 * @param {boolean} isWin Statut de victoire ou défaite
 * @returns {string} Texte formaté prêt à être copié dans le presse-papiers
 */
export function generateShareText(guesses, motMystere, isWin) {
  const scoreText = isWin ? guesses.length : 'X';
  let text = `Le Mot Mystère (${new Date().toLocaleDateString('fr-FR')}) - ${scoreText}/6\n\n`;

  guesses.forEach(guess => {
    const couleurs = compareWords(guess, motMystere);
    const line = couleurs.map(status => {
      if (status === 'correct') return '🟩';
      if (status === 'present') return '🟨';
      return '⬛';
    }).join('');
    text += line + '\n';
  });

  return text;
}