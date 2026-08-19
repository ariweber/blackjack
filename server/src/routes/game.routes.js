import express from "express";
import * as gameController from "../controllers/game.controller.js";
import { identifyPlayer } from "../midddlweare/identify.middleware.js";


const router = express.Router();

router.post("/start-game", gameController.startGame);

router.post("/start-round", identifyPlayer, gameController.startRound);

// router.post("/hit");

// router.post("/stand");

// router.get("/my-round")

export default router
