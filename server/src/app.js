import express from "express"
import gameRouter from "./routes/game.routes.js"

export const app = express()

app.use(express.json())
// app/use(express.static())
app.use("", gameRouter)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

