
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(express.json({ limit: "50kb" }));

const PORT = process.env.PORT || 3000;
const DATA_FILE =
  process.env.DATA_FILE || path.join(__dirname, "casino-data.json");

const START_BALANCE = 500;
const BONUS_AMOUNT = 100;
const BONUS_COOLDOWN = 24 * 60 * 60 * 1000;
const MIN_BET = 1;
const MAX_BET = 10000;

let db = { users: {} };
const minesGames = new Map();
const blackjackGames = new Map();

try {
  if (fs.existsSync(DATA_FILE)) {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (saved.users) db = saved;
  }
} catch (e) {
  console.error("Database read error:", e.message);
}

function saveDB() {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function getId(req) {
  const id = String(
    req.header("x-demo-user") ||
    req.body?.userId ||
    req.query?.userId ||
    "demo"
  );
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) {
    throw new Error("Invalid user ID");
  }
  return id;
}

function getUser(id) {
  if (!db.users[id]) {
    db.users[id] = {
      balance: START_BALANCE,
      lastBonus: 0
    };
    saveDB();
  }
  return db.users[id];
}

function publicUser(id) {
  const u = getUser(id);
  return {
    userId: id,
    balance: u.balance,
    bonusAvailableAt: u.lastBonus
      ? u.lastBonus + BONUS_COOLDOWN
      : 0
  };
}

function validBet(n) {
  return Number.isSafeInteger(n) &&
    n >= MIN_BET && n <= MAX_BET;
}

function takeBet(id, amount) {
  if (!validBet(amount)) {
    throw new Error("Ставка должна быть от 1 до 10000 SB");
  }
  const u = getUser(id);
  if (u.balance < amount) throw new Error("Недостаточно SB");
  u.balance -= amount;
  saveDB();
}

function pay(id, amount) {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error("Некорректная выплата");
  }
  getUser(id).balance += amount;
  saveDB();
}

function route(fn) {
  return (req, res) => {
    try {
      const id = getId(req);
      const result = fn(req, id) || {};
      res.json({ ok: true, ...result, user: publicUser(id) });
    } catch (e) {
      res.status(400).json({
        ok: false,
        error: e.message || "Ошибка запроса"
      });
    }
  };
}

function int(n, min, max, name) {
  if (!Number.isSafeInteger(n) || n < min || n > max) {
    throw new Error(`${name}: выбери число от ${min} до ${max}`);
  }
  return n;
}

function rand(n) {
  return crypto.randomInt(n);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = [
    "A", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "J", "Q", "K"
  ];
  return shuffle(
    suits.flatMap(s =>
      ranks.map(r => ({ rank: r, suit: s }))
    )
  );
}

function points(cards) {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    if (c.rank === "A") {
      total += 11;
      aces++;
    } else if (["K", "Q", "J"].includes(c.rank)) {
      total += 10;
    } else {
      total += Number(c.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "SHIMONA Casino API", version: 2 });
});

app.get("/api/state", route((req, id) => ({
  games: ["mines", "slots", "roulette", "blackjack"],
  bonusAmount: BONUS_AMOUNT
})));

app.post("/api/bonus", route((req, id) => {
  const u = getUser(id);
  const now = Date.now();
  if (u.lastBonus && now < u.lastBonus + BONUS_COOLDOWN) {
    const hours = Math.ceil(
      (u.lastBonus + BONUS_COOLDOWN - now) / 3600000
    );
    throw new Error(`Бонус ещё недоступен. Осталось ${hours} ч.`);
  }
  u.lastBonus = now;
  u.balance += BONUS_AMOUNT;
  saveDB();
  return { message: `Получено ${BONUS_AMOUNT} SB` };
}));

// MINES
app.post("/api/mines/start", route((req, id) => {
  const bet = int(req.body.bet, MIN_BET, MAX_BET, "Ставка");
  const count = int(req.body.mineCount, 1, 24, "Количество мин");
  if (minesGames.has(id)) {
    throw new Error("Сначала закончи текущую игру");
  }
  takeBet(id, bet);
  const cells = shuffle(Array.from({ length: 25 }, (_, i) => i));
  minesGames.set(id, {
    bet,
    count,
    mines: new Set(cells.slice(0, count)),
    opened: new Set()
  });
  return { bet, mineCount: count, revealed: [], multiplier: 1 };
}));

app.post("/api/mines/reveal", route((req, id) => {
  const g = minesGames.get(id);
  if (!g) throw new Error("Нет активной игры");
  const cell = int(req.body.cell, 0, 24, "Клетка");
  if (g.opened.has(cell)) throw new Error("Клетка уже открыта");
  g.opened.add(cell);

  if (g.mines.has(cell)) {
    minesGames.delete(id);
    return {
      result: "mine",
      cell,
      revealed: [...g.opened],
      multiplier: 0,
      message: "Мина! Ставка потеряна."
    };
  }

  const multiplier = Number(
    (0.96 * Math.pow(25 / (25 - g.count), g.opened.size)).toFixed(2)
  );
  return {
    result: "safe",
    cell,
    revealed: [...g.opened],
    multiplier,
    potentialWin: Math.floor(g.bet * multiplier),
    message: "Безопасно!"
  };
}));

app.post("/api/mines/cashout", route((req, id) => {
  const g = minesGames.get(id);
  if (!g) throw new Error("Нет активной игры");
  if (g.opened.size < 1) {
    throw new Error("Сначала открой безопасную клетку");
  }
  const multiplier = Number(
    (0.96 * Math.pow(25 / (25 - g.count), g.opened.size)).toFixed(2)
  );
  const win = Math.floor(g.bet * multiplier);
  pay(id, win);
  minesGames.delete(id);
  return { result: "cashout", win, multiplier };
}));

// SLOTS
app.post("/api/slots/play", route((req, id) => {
  const bet = int(req.body.bet, MIN_BET, MAX_BET, "Ставка");
  takeBet(id, bet);
  const symbols = ["🍒", "🍋", "🍇", "🔔", "⭐", "7️⃣"];
  const reels = [symbols[rand(6)], symbols[rand(6)], symbols[rand(6)]];
  let multiplier = 0;

  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    multiplier = reels[0] === "7️⃣" ? 10 :
      reels[0] === "⭐" ? 7 : 5;
  } else if (
    reels[0] === reels[1] ||
    reels[1] === reels[2] ||
    reels[0] === reels[2]
  ) {
    multiplier = 1.5;
  }

  const win = Math.floor(bet * multiplier);
  if (win) pay(id, win);
  return {
    reels,
    multiplier,
    win,
    message: win ? `Выигрыш ${win} SB` : "Попробуй ещё раз"
  };
}));

// ROULETTE
app.post("/api/roulette/play", route((req, id) => {
  const bet = int(req.body.bet, MIN_BET, MAX_BET, "Ставка");
  const choice = String(req.body.choice || "");
  const choices = ["red", "black", "odd", "even", "low", "high"];
  if (!choices.includes(choice)) throw new Error("Неверный выбор");

  takeBet(id, bet);
  const number = rand(37);
  const reds = new Set([
    1,3,5,7,9,12,14,16,18,
    19,21,23,25,27,30,32,34,36
  ]);
  const color = number === 0 ? "green" :
    reds.has(number) ? "red" : "black";

  const won =
    (choice === "red" && color === "red") ||
    (choice === "black" && color === "black") ||
    (choice === "odd" && number > 0 && number % 2 === 1) ||
    (choice === "even" && number > 0 && number % 2 === 0) ||
    (choice === "low" && number >= 1 && number <= 18) ||
    (choice === "high" && number >= 19 && number <= 36);

  const win = won ? bet * 2 : 0;
  if (win) pay(id, win);
  return {
    number, color, choice, win,
    multiplier: won ? 2 : 0,
    message: won ? `Выигрыш ${win} SB` : "В этот раз мимо"
  };
}));

// BLACKJACK
app.post("/api/blackjack/start", route((req, id) => {
  const bet = int(req.body.bet, MIN_BET, MAX_BET, "Ставка");
  if (blackjackGames.has(id)) {
    throw new Error("Сначала закончи текущую игру");
  }
  takeBet(id, bet);
  const cards = deck();
  const player = [cards.pop(), cards.pop()];
  const dealer = [cards.pop(), cards.pop()];
  const g = { bet, cards, player, dealer };
  blackjackGames.set(id, g);

  if (points(player) === 21) {
    while (points(dealer) < 17) dealer.push(cards.pop());
    blackjackGames.delete(id);
    const win = points(dealer) === 21 ? bet : Math.floor(bet * 2.5);
    pay(id, win);
    return {
      player, dealer,
      playerTotal: points(player),
      dealerTotal: points(dealer),
      result: points(dealer) === 21 ? "push" : "blackjack",
      win, finished: true
    };
  }

  return {
    player,
    dealer: [dealer[0], { rank: "?", suit: "?" }],
    playerTotal: points(player),
    dealerTotal: null,
    finished: false,
    message: "Твой ход"
  };
}));

app.post("/api/blackjack/hit", route((req, id) => {
  const g = blackjackGames.get(id);
  if (!g) throw new Error("Нет активной игры");
  g.player.push(g.cards.pop());
  const total = points(g.player);

  if (total > 21) {
    blackjackGames.delete(id);
    return {
      player: g.player, dealer: g.dealer,
      playerTotal: total, dealerTotal: null,
      result: "bust", win: 0, finished: true,
      message: "Перебор. Ставка потеряна."
    };
  }

  return {
    player: g.player,
    dealer: [g.dealer[0], { rank: "?", suit: "?" }],
    playerTotal: total,
    dealerTotal: null,
    finished: false
  };
}));

app.post("/api/blackjack/stand", route((req, id) => {
  const g = blackjackGames.get(id);
  if (!g) throw new Error("Нет активной игры");

  while (points(g.dealer) < 17) g.dealer.push(g.cards.pop());

  const p = points(g.player);
  const d = points(g.dealer);
  let win = 0;
  let result = "dealer";

  if (d > 21 || p > d) {
    win = g.bet * 2;
    result = "player";
  } else if (p === d) {
    win = g.bet;
    result = "push";
  }

  blackjackGames.delete(id);
  if (win) pay(id, win);

  return {
    player: g.player, dealer: g.dealer,
    playerTotal: p, dealerTotal: d,
    result, win, finished: true,
    message: result === "player" ? `Победа! ${win} SB` :
      result === "push" ? "Ничья — ставка возвращена" :
      "Дилер победил"
  };
}));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SHIMONA Casino listening on ${PORT}`);
});
          
