import mots from '../mots-solutions.json'; 
export function getDailyWord() {
  const today = new Date();
  
  // Format YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  // On crée un nombre unique à partir de la date 
  const dateSeed = parseInt(`${year}${month}${day}`, 10);
  
  // On utilise le modulo pour obtenir un index valide dans le tableau de mots
  const index = dateSeed % mots.length;
  
  return mots[index].toUpperCase();
}

export function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Retourne '2026-10-23'
}