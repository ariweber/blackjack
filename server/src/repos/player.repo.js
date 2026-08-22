import { getCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

async function createPlayer() {
  const result = await getCollection("players").insertOne({
    chips: 1000,
    createAt: new Date(),
  });
  return result.insertedId;
}

function getPlayerById(playerId) {
  return getCollection("players").findOne({ _id: new ObjectId(playerId) });
}

function updatePlayerChips(playerId, amount) {
  return getCollection("players").updateOne(
    { _id: new ObjectId(playerId) },
    { $inc: { chips: amount } },
  );
}

const playerRepo = {
  createPlayer,
  getPlayerById,
  updatePlayerChips,
};

export default playerRepo;
