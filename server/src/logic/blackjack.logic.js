const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const SUITS = ["hearts", "diamonds", "clubs", "spades"];

export function drawCard() {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  return { rank, suit };
}

function cardValue(rank) {
  if (typeof rank === "number") {
    return rank;
  }
  if (rank === "A") {
    return 11;
  }
  return 10;
}

export function calculateHandValue(cards) {
  let total = cards.reduce((sum, card) => sum + cardValue(card.rank), 0);
  let aces = cards.filter((card) => card.rank === "A").length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total; 
}

export function decideRoundStatus(playerTotal, dealerTotal) {
  if (dealerTotal > 21) return "dealer_bust";
  if (dealerTotal > playerTotal) return "dealer_win";
  if (playerTotal > dealerTotal) return "player_win";
  return "push";
}

export function calculatePayout(status, bet) {
  if (status === "player_win" || status === "dealer_bust") return bet * 2;
  if (status === "push") return bet;
  return 0;
}

export function playDealerTurn(dealerCards) {
  const cards = [...dealerCards];

  while (calculateHandValue(cards) < 17) {
    cards.push(drawCard());
  }

  return cards;
}
