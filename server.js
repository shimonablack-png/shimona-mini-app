
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "players.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "{}");
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function getPlayer(db, id) {
  if (!db[id]) {
    db[id] = { balance: 500, lastBonus: 0 };
  }
  return db[id];
}

function playerId(req) {
  return String(req.headers["x-player-id"] || "demo-player")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64) || "demo-player";
}

function validBet(value) {
  const bet = Number(value);
  return Number.isInteger(bet) && bet >= 1 && bet <= 10000
    ? bet
    : null;
}

function play(req, res, game) {
  const bet = validBet(req.body.bet);
  if (!bet) {
    return res.status(400).json({
      ok: false,
      error: "Ставка: от 1 до 10000 SB."
    });
  }

  const db = readDB();
  const player = getPlayer(db, playerId(req));

  if (player.balance < bet) {
    return res.status(400).json({
      ok: false,
      error: "Недостаточно SB."
    });
  }

  player.balance -= bet;

  const result = game(bet);
  const payout = Math.max(0, Math.floor(result.payout || 0));

  player.balance += payout;
  saveDB(db);

  res.json({
    ok: true,
    balance: player.balance,
    bet,
    payout,
    net: payout - bet,
    ...result.data
  });
}

app.get("/api/me", (req, res) => {
  const db = readDB();
  const p = getPlayer(db, playerId(req));
  saveDB(db);

  res.json({
    ok: true,
    balance: p.balance,
    bonusReady: Date.now() - p.lastBonus >= 86400000
  });
});

app.post("/api/bonus", (req, res) => {
  const db = readDB();
  const p = getPlayer(db, playerId(req));

  if (Date.now() - p.lastBonus < 86400000) {
    return res.status(429).json({
      ok: false,
      error: "Бонус будет доступен через 24 часа."
    });
  }

  p.balance += 100;
  p.lastBonus = Date.now();
  saveDB(db);

  res.json({ ok: true, balance: p.balance, bonus: 100 });
});

app.post("/api/mines", (req, res) => {
  const mines = Number(req.body.mines);
  const picks = Number(req.body.picks);

  if (
    !Number.isInteger(mines) || mines < 1 || mines > 24 ||
    !Number.isInteger(picks) || picks < 1 || picks > 25 - mines
  ) {
    return res.status(400).json({
      ok: false,
      error: "Некорректное количество мин или клеток."
    });
  }

  play(req, res, bet => {
    let safe = 0;
    for (let i = 0; i < picks; i++) {
      if (Math.random() < (25 - mines - i) / (25 - i)) safe++;
      else break;
    }

    const won = safe === picks;
    const multiplier = won
      ? Math.max(1.05, Math.pow(25 / (25 - mines), picks) * 0.92)
      : 0;

    return {
      payout: won ? bet * multiplier : 0,
      data: {
        won,
        safe,
        multiplier: Number(multiplier.toFixed(2)),
        message: won ? "Все клетки безопасны!" : "Раунд проигран."
      }
    };
  });
});

app.post("/api/slots", (req, res) => {
  const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];

  play(req, res, bet => {
    const reels = Array.from(
      { length: 3 },
      () => symbols[Math.floor(Math.random() * symbols.length)]
    );

    let multiplier = 0;

    if (reels.every(x => x === reels[0])) {
      multiplier = reels[0] === "7️⃣" ? 8 :
        reels[0] === "💎" ? 5 : 4;
    } else if (new Set(reels).size === 2) {
      multiplier = 1.5;
    }

    return {
      payout: bet * multiplier,
      data: {
        reels,
        message: multiplier ? `Выигрыш ${multiplier}x!` : "Не повезло!"
      }
    };
  });
});

app.post("/api/roulette", (req, res) => {
  const choice = String(req.body.choice || "");
  const allowed = ["red", "black", "green", "even", "odd", "low", "high"];

  if (!allowed.includes(choice)) {
    return res.status(400).json({
      ok: false,
      error: "Неизвестный вариант рулетки."
    });
  }

  play(req, res, bet => {
    const n = Math.floor(Math.random() * 37);
    const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const color = n === 0 ? "green" : reds.includes(n) ? "red" : "black";

    let multiplier = 0;

    if (choice === color) multiplier = color === "green" ? 14 : 2;
    else if (choice === "even" && n > 0 && n % 2 === 0) multiplier = 2;
    else if (choice === "odd" && n % 2 === 1) multiplier = 2;
    else if (choice === "low" && n >= 1 && n <= 18) multiplier = 2;
    else if (choice === "high" && n >= 19 && n <= 36) multiplier = 2;

    return {
      payout: bet * multiplier,
      data: {
        number: n,
        color,
        message: multiplier ? "Попадание!" : "Мимо!"
      }
    };
  });
});

app.post("/api/blackjack", (req, res) => {
  play(req, res, bet => {
    const card = () => 2 + Math.floor(Math.random() * 11);
    const player = [card(), card()];
    const dealer = [card(), card()];
    const p = player.reduce((a, b) => a + b, 0);
    const d = dealer.reduce((a, b) => a + b, 0);

    const won = p <= 21 && (d > 21 || p > d);
    const push = p === d && p <= 21;

    return {
      payout: won ? bet * 2 : push ? bet : 0,
      data: {
        playerCards: player,
        dealerCards: dealer,
        playerTotal: p,
        dealerTotal: d,
        message: won ? "Ты выиграл!" :
          push ? "Ничья!" : "Дилер выиграл."
      }
    };
  });
});

app.listen(PORT, () => {
  console.log(`SHIMONA CASINO запущен на порту ${PORT}`);
});
      
