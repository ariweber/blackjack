import { ObjectId } from 'mongodb';
import playerRepo from '../repos/player.repo.js';
import { createError } from '../utils/createError.js';

export async function identifyPlayer(req, res, next) {
  try {
    const playerId = req.headers['x-player-id'];

    if (!playerId || !ObjectId.isValid(playerId)) {
      throw createError(401, 'Missing or invalid x-player-id header');
    }

    const player = await playerRepo.getPlayerById(playerId);

    if (!player) {
      throw createError(401, 'Player not found');
    }

    req.player = player;
    next();
  } catch (err) {
    next(err);
  }
}