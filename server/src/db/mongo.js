
import { MongoClient } from "mongodb";
import "dotenv/config";

const URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(URI);

export let playersCollection;
export let roundsCollection;

export async function connectDb() {
  await client.connect();
  console.log("connected to mongodb");
  const db = client.db("blackjack");
  playersCollection = db.collection("players");
  roundsCollection = db.collection("rounds");
}
