import { describe, test, expect } from 'vitest'; 
import { compareWords } from './gamelogic';

describe('Logique de comparaison compareWords', () => {
  
  test('Gère correctement une lettre proposée 2 fois alors qu\'elle n\'est présente qu\'1 seule fois dans le mot mystère', () => {
    // Mot mystère : ROUGE (1 seul 'O')
    // Proposition : ROBOT (2 'O', le 1er bien placé, le 2e n'existe pas en double)
    const result = compareWords('ROBOT', 'ROUGE');
    
    // Le 1er 'O' doit être 'correct' (vert), le 2e 'O' doit être 'absent' (gris)
    expect(result[1]).toBe('correct');
    expect(result[3]).toBe('absent');
  });

  test('Gère correctement une lettre en double mal placée puis bien placée', () => {
    // Mot mystère : ALLER (2 'L')
    // Proposition : LILAS (2 'L')
    const result = compareWords('LILAS', 'ALLER');
    
    // 1er L (index 0) -> 'present' (jaune)
    // 2e L (index 2) -> 'correct' (vert)
    expect(result[0]).toBe('present');
    expect(result[2]).toBe('correct');
  });

});