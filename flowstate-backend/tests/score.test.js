const { bonusFocus } = require('../utils/score');

describe('bonusFocus', () => {
  test('retourne 1 pour une session courte (≤ 20 min)', () => {
    expect(bonusFocus(15)).toBe(1);
  });

  test('retourne 2 pour une session moyenne (21 à 50 min)', () => {
    expect(bonusFocus(30)).toBe(2);
  });

  test('retourne 3 pour une session longue (> 50 min)', () => {
    expect(bonusFocus(60)).toBe(3);
  });
  test('retourne 1 pour une session de 20min', () => {
    expect(bonusFocus(20)).toBe(1);
  });
  test('retourne 2 pour une session de 21min', () => {
    expect(bonusFocus(21)).toBe(2);
  });
});
