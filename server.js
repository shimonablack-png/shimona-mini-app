
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "players.json");
fs.mkdirSync(dataDir, { recursive: true });

let players = {};
try {
  players = JSON.parse(fs.readFileSync(dataFile, "utf8"));
} catch {
  players = {};
}

const rounds = new Map();

function save() {
  fs.writeFileSync(dataFile, JSON.stringify(players, null, 2));
}

function player(req) {
  const id = String(req.get("X-Player-Id") || "");
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) {
    throw Error("Не удалось определить игрока.");
  }

  if (!players[id]) {
    players[id] = { balance: 500, bonusAt: 0 };
    save();
  }
  return { id, data: players[id] };
}

function amount(value) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1 || n > 10000) {
    throw Error("Укажи целое число от 1 до 10000 SB.");
  }
  return n;
}

function charge(p, bet) {
  if (p.balance < bet) throw Error("Недостаточно SB.");
  p.balance -= bet;
}

function reply(res, data) {
  save();
  res.json({ ok: true, ...data });
}

app.get("/api/me", (req, res) => {
  try {
    const { data: p } = player(req);
    res.json({
      ok: true,
      balance: p.balance,
      bonusReady: Date.now() - p.bonusAt >= 86400000
    });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/bonus", (req, res) => {
  try {
    const { data: p } = player(req);
    if (Date.now() - p.bonusAt < 86400000) {
      throw Error("Бонус уже получен. Попробуй через 24 часа.");
    }
    p.bonusAt = Date.now();
    p.balance += 100;
    reply(res, { bonus: 100, balance: p.balance });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Мины: расположение поля определяется сервером.
app.post("/api/mines/start", (req, res) => {
  try {
    const { id, data: p } = player(req);
    if (rounds.has(id)) throw Error("Сначала закончи текущий раунд.");

    const bet = amount(req.body.bet);
    const mines = Number(req.body.mines);
    if (![3, 5, 8, 10, 15, 20].includes(mines)) {
      throw Error("Выбери допустимое количество мин.");
    }

    charge(p, bet);
    const positions = new Set();
    while (positions.size < mines) {
      positions.add(Math.floor(Math.random() * 25));
    }

    rounds.set(id, { bet, mines, positions, opened: new Set() });
    reply(res, { balance: p.balance, mines, opened: [] });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/mines/open", (req, res) => {
  try {
    const { id, data: p } = player(req);
    const round = rounds.get(id);
    if (!round) throw Error("Начни новый раунд.");

    const index = Number(req.body.index);
    if (!Number.isInteger(index) || index < 0 || index > 24) {
      throw Error("Неверная клетка.");
    }
    if (round.opened.has(index)) throw Error("Эта клетка уже открыта.");

    round.opened.add(index);

    if (round.positions.has(index)) {
      rounds.delete(id);
      reply(res, {
        balance: p.balance,
        hit: true,
        index,
        mines: [...round.positions],
        opened: [...round.opened]
      });
      return;
    }

    const safeOpened = round.opened.size;
    const multiplier = Number(
      (0.97 * Math.pow(25 / (25 - round.mines), safeOpened)).toFixed(2)
    );

    reply(res, {
      balance: p.balance,
      hit: false,
      index,
      opened: [...round.opened],
      multiplier,
      safe: safeOpened
    });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/mines/cashout", (req, res) => {
  try {
    const { id, data: p } = player(req);
    const round = rounds.get(id);
    if (!round || round.opened.size === 0) {
      throw Error("Открой хотя бы одну безопасную клетку.");
    }

    const multiplier = Number(
      (0.97 * Math.pow(25 / (25 - round.mines), round.opened.size)).toFixed(2)
    );
    const payout = Math.floor(round.bet * multiplier);
    p.balance += payout;
    rounds.delete(id);

    reply(res, { balance: p.balance, payout, multiplier });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/slots", (req, res) => {
  try {
    const { data: p } = player(req);
    const bet = amount(req.body.bet);
    charge(p, bet);

    const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
    const reels = Array.from({ length: 3 }, () =>
      symbols[Math.floor(Math.random() * symbols.length)]
    );

    let multiplier = 0;
    if (reels.every(s => s === reels[0])) {
      multiplier = reels[0] === "7️⃣" ? 8 : 5;
    } else if (
      reels[0] === reels[1] ||
      reels[1] === reels[2] ||
      reels[0] === reels[2]
    ) {
      multiplier = 1.5;
    }

    const payout = Math.floor(bet * multiplier);
    p.balance += payout;
    reply(res, {
      balance: p.balance, reels, payout, net: payout - bet,
      message: multiplier ? "Комбинация совпала!" : "В этот раз без совпадения."
    });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/roulette", (req, res) => {
  try {
    const { data: p } = player(req);
    const bet = amount(req.body.bet);
    const choice = String(req.body.choice);
    const choices = ["red", "black", "green", "even", "odd", "low", "high"];
    if (!choices.includes(choice)) throw Error("Неверный выбор.");

    charge(p, bet);
    const number = Math.floor(Math.random() * 37);
    const reds = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
    const color = number === 0 ? "green" : reds.has(number) ? "red" : "black";

    let win = false;
    if (choice === "red" || choice === "black" || choice === "green") {
      win = color === choice;
    } else if (number !== 0) {
      if (choice === "even") win = number % 2 === 0;
      if (choice === "odd") win = number % 2 === 1;
      if (choice === "low") win = number >= 1 && number <= 18;
      if (choice === "high") win = number >= 19 && number <= 36;
    }

    const multiplier = choice === "green" ? 14 : 2;
    const payout = win ? bet * multiplier : 0;
    p.balance += payout;
    reply(res, {
      balance: p.balance, number, color, payout, net: payout - bet,
      message: win ? "Совпадение!" : "Не совпало."
    });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/blackjack", (req, res) => {
  try {
    const { data: p } = player(req);
    const bet = amount(req.body.bet);
    charge(p, bet);

    const draw = () => {
      const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      return { rank, value: rank === "A" ? 11 :
        ["J","Q","K"].includes(rank) ? 10 : Number(rank) };
    };
    const total = cards => {
      let sum = cards.reduce((s, c) => s + c.value, 0);
      let aces = cards.filter(c => c.rank === "A").length;
      while (sum > 21 && aces-- > 0) sum -= 10;
      return sum;
    };

    const playerCards = [draw(), draw()];
    const dealerCards = [draw(), draw()];
    const pt = total(playerCards);
    const dt = total(dealerCards);
    const win = pt <= 21 && (dt > 21 || pt > dt);
    const tie = pt === dt || (pt > 21 && dt > 21);
    const payout = win ? bet * 2 : tie ? bet : 0;
    p.balance += payout;

    reply(res, {
      balance: p.balance,
      playerCards: playerCards.map(c => c.rank),
      dealerCards: dealerCards.map(c => c.rank),
      playerTotal: pt, dealerTotal: dt, payout, net: payout - bet,
      message: win ? "Ты выиграл!" : tie ? "Ничья!" : "Дилер выиграл."
    });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("SHIMONA CASINO server started");
});
                             
