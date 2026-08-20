import { describe, it } from "node:test";
import assert from "node:assert";
import { playDealerTurn, calculateHandValue } from "../src/logic/blackjack.logic.js";

const c = (rank) => ({ rank, suit: "spades" });

describe("playDealerTurn", () => {
  it("stands on exactly 17 without drawing", () => {
    const result = playDealerTurn([c(10), c(7)]);

    assert.equal(result.length, 2);
    assert.equal(calculateHandValue(result), 17);
  });


  it("draws on a low hand until reaching 17 or more", () => {
    const result = playDealerTurn([c(2), c(3)]);

    assert.ok(result.length > 2);
    assert.ok(calculateHandValue(result) >= 17);
  });

  it("counts an ace as 11 and stands on soft 17", () => {
    const result = playDealerTurn([c("A"), c(6)]);

    assert.equal(result.length, 2);
    assert.equal(calculateHandValue(result), 17);
  });

  it("does not mutate the original cards array", () => {
    const original = [c(2), c(3)];
    playDealerTurn(original);

    assert.equal(original.length, 2);
  });
});
