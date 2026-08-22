const chipsEl = document.getElementById("chips");
const betSection = document.getElementById("bet-section");
const gameSection = document.getElementById("game-section");
const playerCards = document.getElementById("player-cards");
const result = document.getElementById("result");
const betInput = document.getElementById("bet-input");
const startBtn = document.getElementById("start-btn");
const dealerCardsEl = document.getElementById("dealer-cards");
const playerTotalEl = document.getElementById("player-total");
const dealerTotalEl = document.getElementById("dealer-total");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");

const API_URL = "http://localhost:3000";

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      "x-player-id": localStorage.getItem("playerId"),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Request failed " + res.status);
  }
  return res.json();
}

function startGame() {
  return api("/start-game", { method: "POST" });
}

function getMyRound() {
  return api("/my-round");
}

function startRound(bet) {
  return api("/start-round", {
    method: "POST",
    body: JSON.stringify({ bet }),
  });
}

function hit() {
  return api("/hit", { method: "POST" });
}

function stand() {
  return api("/stand", { method: "POST" });
}

function handToText(cards) {
  return cards.map((card) => card.rank + card.suit[0]).join(" , ");
}

startBtn.addEventListener("click", async () => {
  try {
    const data = await startRound(Number(betInput.value));
    playerCards.textContent =
      handToText(data.playerCards) + " (" + data.playerTotal + ")";
    dealerCardsEl.textContent =
      data.dealerUpCard.rank + data.dealerUpCard.suit[0] + " , ?";

    betSection.classList.add("hidden");
    gameSection.classList.remove("hidden");
    result.classList.add("hidden");
    chipsEl.textContent = "💰 " + data.chips;
  } catch (error) {
    alert(error.message);
  }
});

hitBtn.addEventListener("click", async () => {
  try {
    const data = await hit();
    playerCards.textContent =
      handToText(data.playerCards) + " (" + data.playerTotal + ")";
    chipsEl.textContent = "💰 " + data.chips;

    if (data.status === "player_bust") {
      result.textContent = "התפוצצת! הפסדת את ההימור";
      result.classList.remove("hidden");
      betSection.classList.remove("hidden");
    }
  } catch (error) {
    alert(error.message);
  }
});

standBtn.addEventListener("click", async () => {
  try {
    const data = await stand();

    dealerCardsEl.textContent =
      handToText(data.dealerCards) + " (" + data.dealerTotal + ")";
    playerCards.textContent =
      handToText(data.playerCards) + " (" + data.playerTotal + ")";
    chipsEl.textContent = "💰 " + data.chips;

    const messages = {
      player_win: "ניצחת" ,
      dealer_bust: "הדילר התפוצץ! ניצחת!",
      dealer_win: "הדילר ניצח",
      push: "תיקו",
    };
    result.textContent = messages[data.status];
    result.classList.remove("hidden");
    betSection.classList.remove("hidden");
  } catch (error) {
    alert(error.message);
  }
});

async function init() {
  if (!localStorage.getItem("playerId")) {
    const data = await startGame();
    localStorage.setItem("playerId", data.playerId);
  }
  betSection.classList.remove("hidden");
}

init();
