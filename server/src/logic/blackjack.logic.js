const CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export function drawCard() {
  const index = Math.floor(Math.random() * CARDS.length);
  return CARDS[index];
}

export function calculateHandValue(cards) {
  return cards.reduce((total, card) => total + card, 0);
}

export function playDealerTurn(dealerCards) {
  const cards = [...dealerCards];

  while (calculateHandValue(cards) < 17) {
    cards.push(drawCard());
  }

  return cards;
}

