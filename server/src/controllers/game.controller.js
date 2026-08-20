import * as gameService from "../services/game.service.js";

export async function startGame(req, res, next) {
  try {
    const playerId = await gameService.satrtGame();
    res.status(201).json({ playerId, chips: 1000 });
  } catch (e) {
    next(e);
  }
}

export async function startRound(req, res, next) {
  try {
    const result = await gameService.startRound(req.player, req.body.bet);
    res.status(201).json(result)
  } catch (error) {
    next(error);
  }
}

export async function hit(req, res, next) {
  try {
    const result = await gameService.hit(req.player);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

export async function stand(req, res, next) {
  try {
    const result = await gameService.stand(req.player);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}


export async function getRound(req, res, next) {
  try {
    const result = await gameService.getMyRound(req.player);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}
