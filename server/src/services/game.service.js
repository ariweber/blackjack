import {
  drawCard,
  calculateHandValue,
  playDealerTurn,
  decideRoundStatus,
  calculatePayout,
} from "../logic/blackjack.logic.js";
import playerRepo from "../repos/player.repo.js";
import roundRepo from "../repos/round.repo.js";
import { createError } from "../utils/createError.js";

export function satrtGame() {
  return playerRepo.createPlayer();
}

export async function getMyRound(player) {
  const round = await roundRepo.findOpenRoundByPlayer(player._id.toString());
  if (!round) return;
  return {
    roundId: round._id,
    bet: round.bet,
    playerCards: round.playerCards,
    playerTotal: calculateHandValue(round.playerCards),
    dealerUpCard: round.dealerCards[0],
    status: round.status,
    chips: player.chips,
  };
}

export async function startRound(player, bet) {
  if (bet > player.chips) {
    throw createError(400, "Bet exceeds available chips");
  }
  const openRound = await roundRepo.findOpenRoundByPlayer(
    player._id.toString(),
  );

  if (openRound) {
    throw createError(409, "Player already has an open round");
  }
  await playerRepo.updatePlayerChips(player._id, -bet);
  const playerCards = [drawCard(), drawCard()];
  const dealerCards = [drawCard(), drawCard()];
  const roundId = await roundRepo.createRound(
    player._id.toString(),
    bet,
    playerCards,
    dealerCards,
  );

  return {
    roundId,
    bet,
    playerCards,
    playerTotal: calculateHandValue(playerCards),
    dealerUpCard: dealerCards[0],
    status: "in_progress",
    chips: player.chips - bet,
  };
}

export async function hit(player) {
  const round = await roundRepo.findOpenRoundByPlayer(player._id.toString());
  if (!round) throw createError(404, "No open round");
  const card = drawCard();
  const playerCards = [...round.playerCards, card];
  const playerTotal = calculateHandValue(playerCards);
  const status = playerTotal > 21 ? "player_bust" : "in_progress";
  await roundRepo.addPlayerCard(round._id, card, status);
  return { playerCards, playerTotal, status, chips: player.chips };
}

export async function stand(player) {
  const round = await roundRepo.findOpenRoundByPlayer(player._id.toString());
  if (!round) throw createError(404, "No open round");
  const dealerCards = playDealerTurn(round.dealerCards);
  const playerTotal = calculateHandValue(round.playerCards);
  const dealerTotal = calculateHandValue(dealerCards);
  const status = decideRoundStatus(playerTotal, dealerTotal);
  const payout = calculatePayout(status, round.bet);
  if (payout > 0) await playerRepo.updatePlayerChips(player._id, payout);
  await roundRepo.closeRound(round._id, dealerCards, status);
  return {
    playerCards: round.playerCards,
    playerTotal,
    dealerCards,
    dealerTotal,
    status,
    chips: player.chips + payout,
  };
}
