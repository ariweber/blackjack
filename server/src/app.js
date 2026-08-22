import express from "express"
import gameRouter from "./routes/game.routes.js"
import cors from "cors"

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("../client"))
app.use("", gameRouter)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

