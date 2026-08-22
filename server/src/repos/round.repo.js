import { ObjectId } from "mongodb";
import { getCollection } from "../db/mongo.js";

export async function createRound(playerId, bet, playerCards, dealerCards) {
  const result = await getCollection("rounds").insertOne({
    playerId,
    bet,
    playerCards,
    dealerCards,
    status: "in_progress",
    createdAt: new Date(),
  });
  return result.insertedId;
}

export function findOpenRoundByPlayer(playerId) {
  return getCollection("rounds").findOne({ playerId, status: "in_progress" });
}

export function addPlayerCard(roundId, card, newStatus) {
  return getCollection("rounds").updateOne(
    { _id: new ObjectId(roundId) },
    { $push: { playerCards: card }, $set: { status: newStatus } },
  );
}

export function closeRound(roundId, dealerCards, finalStatus) {
  return getCollection("rounds").updateOne(
    { _id: new ObjectId(roundId) },
    { $set: { dealerCards, status: finalStatus } },
  );
}

const roundRepo = {
  createRound,
  findOpenRoundByPlayer,
  addPlayerCard,
  closeRound,
};

export default roundRepo;
