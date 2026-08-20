import { describe, it } from "node:test";
import assert from "node:assert";
import roundRepo from "../src/repos/round.repo.js";
import playerRepo from "../src/repos/player.repo.js";
import * as gameService from "../src/services/game.service.js";

const c = (rank) => ({ rank, suit: "spades" });
const player = { _id: "p1", chips: 900 };

function mockOpenRound(t, playerCards, dealerCards) {
  t.mock.method(roundRepo, "findOpenRoundByPlayer", async () => ({
    _id: "r1",
    bet: 100,
    playerCards,
    dealerCards,
    status: "in_progress",
  }));
  t.mock.method(roundRepo, "closeRound", async () => {});
  t.mock.method(playerRepo, "updatePlayerChips", async () => {});
}

describe("stand", () => {
  it("player wins when his hand is higher", async (t) => {
    mockOpenRound(t, [c(10), c(10)], [c(10), c(9)]);

    const result = await gameService.stand(player);

    assert.equal(result.status, "player_win");
    assert.equal(result.playerTotal, 20);
    assert.equal(result.dealerTotal, 19);
    assert.equal(result.chips, 1100);
  });

  it("dealer wins when his hand is higher", async (t) => {
    mockOpenRound(t, [c(10), c(5)], [c(10), c(9)]);

    const result = await gameService.stand(player);

    assert.equal(result.status, "dealer_win");
    assert.equal(result.playerTotal, 15);
    assert.equal(result.dealerTotal, 19);
    assert.equal(result.chips, 900);
  });

  it("push when hands are equal", async (t) => {
    mockOpenRound(t, [c(10), c(9)], [c(10), c(9)]);

    const result = await gameService.stand(player);

    assert.equal(result.status, "push");
    assert.equal(result.chips, 1000);
  });

  it("player wins when dealer busts", async (t) => {
    mockOpenRound(t, [c(10), c(5)], [c(10), c(10), c(5)]);

    const result = await gameService.stand(player);

    assert.equal(result.status, "dealer_bust");
    assert.equal(result.dealerTotal, 25);
    assert.equal(result.chips, 1100);
  });

  it("throws 404 when there is no open round", async (t) => {
    t.mock.method(roundRepo, "findOpenRoundByPlayer", async () => null);

    await assert.rejects(() => gameService.stand(player), { status: 404 });
  });
});
