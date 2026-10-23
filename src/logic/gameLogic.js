/**
 
Compare le mot proposé (guess) au mot mystère (targetWord)
@param {string} guess - Le mot entré par le joueur (ex: "RADIO")
@param {string} targetWord - Le mot mystère à trouver (ex: "ROUGE")
@returns {string[]} Un tableau de 5 statuts : ['green', 'yellow', 'gray', ...]*/
export function compareWords(guess, targetWord) {
  const guessUpper = guess.toUpperCase();
  const targetUpper = targetWord.toUpperCase();

  // Tableau de résultats initialisé à 'gray' pour chaque lettre
  const statuses = ['gray', 'gray', 'gray', 'gray', 'gray'];

  // Tableau pour suivre les lettres du mot mystère déjà associées (pour les doublons)
  const targetLetters = targetUpper.split('');

  // 1ère passe : Vérification des lettres bien placées (VERT)
  for (let i = 0; i < 5; i++) {
    if (guessUpper[i] === targetUpper[i]) {
      statuses[i] = 'green';
      targetLetters[i] = null; // On consomme la lettre
    }
  }

  // 2ème passe : Vérification des lettres mal placées (JAUNE) ou absentes (GRISE)
  for (let i = 0; i < 5; i++) {
    // Si la lettre est déjà verte, on passe à la suivante
    if (statuses[i] === 'green') continue;

    const currentLetter = guessUpper[i];
    const targetIndex = targetLetters.indexOf(currentLetter);

    // Si la lettre existe encore dans le mot mystère non-marqué
    if (targetIndex !== -1) {
      statuses[i] = 'yellow';
      targetLetters[targetIndex] = null; // On consomme cette occurrence
    } else {
      statuses[i] = 'gray';
    }
  }

  return statuses;
}