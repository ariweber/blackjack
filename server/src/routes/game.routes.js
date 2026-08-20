import express from "express";
import * as gameController from "../controllers/game.controller.js";
import { identifyPlayer } from "../midddlweare/identify.middleware.js";


const router = express.Router();

router.post("/start-game", gameController.startGame);

router.post("/start-round", identifyPlayer, gameController.startRound);

router.post("/hit", identifyPlayer, gameController.hit);

router.post("/stand",  identifyPlayer, gameController.stand);

router.get("/my-round", identifyPlayer, gameController.getRound)

export default router
