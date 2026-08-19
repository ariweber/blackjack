import { ObjectId } from 'mongodb';
import { roundsCollection } from '../db/mongo.js';

export async function createRound(playerId, bet, playerCards, dealerCards) {
  const result = await roundsCollection.insertOne({
    playerId,
    bet,
    playerCards,
    dealerCards,
    status: 'in_progress',
    createdAt: new Date(),
  });
  return result.insertedId;
}

export function findOpenRoundByPlayer(playerId) {
  return roundsCollection.findOne({ playerId, status: 'in_progress' });
}

export function addPlayerCard(roundId, card, newStatus) {
  return roundsCollection.updateOne(
    { _id: new ObjectId(roundId) },
    { $push: { playerCards: card }, $set: { status: newStatus } }
  );
}

export function closeRound(roundId, dealerCards, finalStatus) {
  return roundsCollection.updateOne(
    { _id: new ObjectId(roundId) },
    { $set: { dealerCards, status: finalStatus } }
  );
}

const roundRepo = {
  createRound,
  findOpenRoundByPlayer,
  addPlayerCard, 
  closeRound
}

export default roundRepo