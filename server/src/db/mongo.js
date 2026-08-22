import { MongoClient } from "mongodb";
import "dotenv/config";

const URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(URI);

let db;

export async function connectDb() {
  await client.connect();
  console.log("connected to mongodb");
  db = client.db("blackjack");
}

export function getCollection(name) {
  if (!db) throw new Error("Database not connected - call connectDb first");
  return db.collection(name);
}
