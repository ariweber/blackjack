import { MongoClient } from "mongodb";
import "dotenv/config"

const URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const clinet = new MongoClient(URI);

await clinet.connect()
console.log("connect to mongodb");

const db = clinet.db("blackjack")
export const playersCollection = db.collection("players")
export const roundsCollection = db.collection("rounds")




