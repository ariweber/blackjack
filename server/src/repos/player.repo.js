import { playersCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

async function createPlayer() {
  const reslut = await playersCollection.insertOne({
    chips: 1000,
    createAt: new Date(),
  });
  return reslut.insertedId;
}

function getPlayerById(playerId) {
  return playersCollection.findOne({ _id: new ObjectId(playerId) });
}

function updatePlayerChips(playerId, amount) {
  return playersCollection.updateOne(
    { _id: new ObjectId(playerId) },
    { $inc: { chips: amount } },
  );
  c;
}

const playerRepo = {
    createPlayer,
    getPlayerById,
    updatePlayerChips
};

export default playerRepo