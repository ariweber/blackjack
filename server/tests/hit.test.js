import { describe, it } from "node:test";
import assert from "node:assert";
import roundRepo from "../src/repos/round.repo.js";
import * as gameService from "../src/services/game.service.js";

const c = (rank) => ({ rank, suit: "spades" });
const player = { _id: "p1", chips: 900 };

function mockOpenRound(t, playerCards) {
  t.mock.method(roundRepo, "findOpenRoundByPlayer", async () => ({
    _id: "r1",
    bet: 100,
    playerCards,
    status: "in_progress",
  }));
  t.mock.method(roundRepo, "addPlayerCard", async () => {});
}

describe("hit", () => {
  it("busts on a hard 21 hand", async (t) => {
    mockOpenRound(t, [c("A"), c("K"), c("Q")]);

    const result = await gameService.hit(player);

    assert.equal(result.status, "player_bust");
    assert.equal(result.playerCards.length, 4);
    assert.ok(result.playerTotal > 21);
  });

  it("keeps a multi-ace hand at 21 or less", async (t) => {
    mockOpenRound(t, [c("A"), c("A")]);

    const result = await gameService.hit(player);

    assert.equal(result.status, "in_progress");
    assert.ok(result.playerTotal >= 12 && result.playerTotal <= 21);
  });

  it("stays in progress on a low hand", async (t) => {
    mockOpenRound(t, [c(2), c(3)]);

    const result = await gameService.hit(player);

    assert.equal(result.status, "in_progress");
    assert.equal(result.playerCards.length, 3);
  });

  it("throws 404 when there is no open round", async (t) => {
    t.mock.method(roundRepo, "findOpenRoundByPlayer", async () => null);

    await assert.rejects(() => gameService.hit(player), { status: 404 });
  });
});
