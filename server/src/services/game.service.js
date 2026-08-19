import { drawCard, calculateHandValue } from "../logic/blackjack.logic.js";
import playerRepo from "../repos/player.repo.js";
import roundRepo from "../repos/round.repo.js";
import { createError } from "../utils/createError.js";

export function satrtGame() {
  return playerRepo.createPlayer();
}

export function getMyRound(player) {
  return roundRepo.findOpenRoundByPlayer(player._id.toString());
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
