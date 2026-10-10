
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#090909">
<title>SHIMONA CASINO — BLACK LABEL</title>
<style>
:root{--bg:#090909;--panel:#14130f;--gold:#d7b568;--light:#f4dda0;--line:#493b22;--muted:#aaa18d;--green:#48d6a0;--red:#f36a7b}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(ellipse at 50% 0,#302516,transparent 45%),var(--bg);color:#f8f3e8;font:15px system-ui,sans-serif}
button,input,select{font:inherit}
button{cursor:pointer;transition:.18s}
button:active{transform:scale(.98)}
button:disabled{opacity:.45;cursor:not-allowed}
.app{max-width:720px;margin:auto;padding:15px 14px 90px}
header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:7px 0 20px}
.brand{font-size:17px;font-weight:950;letter-spacing:1.5px}
.brand span{color:var(--gold)}
.brand small{display:block;font-size:9px;color:var(--muted);letter-spacing:2px}
.balance{padding:9px 11px;border:1px solid var(--line);border-radius:12px;background:#17140e;text-align:right;white-space:nowrap}
.balance small{display:block;color:var(--gold);font-size:9px}
.balance strong{font-size:18px;color:var(--light)}
.hero,.panel,.bonus{border:1px solid var(--line);border-radius:17px;background:linear-gradient(145deg,#1b1811,#111);padding:17px;margin-bottom:13px}
.hero{padding:21px;background:linear-gradient(120deg,#292115,#111)}
.eyebrow{color:var(--gold);font-size:10px;font-weight:800;letter-spacing:3px}
h1{font-size:27px;margin:9px 0}
h2{font-size:21px;margin:0 0 8px}
h3{font-size:15px;margin:0}
p{color:var(--muted);font-size:12px;line-height:1.55}
.section{display:flex;align-items:center;justify-content:space-between;margin:20px 2px 11px}
.section small{color:var(--muted)}
.games{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.game{min-height:102px;text-align:left;padding:13px;color:#f8f3e8;background:linear-gradient(145deg,#1a1812,#101010);border:1px solid #3a3020;border-radius:14px}
.game.active{border-color:var(--gold);background:#282115;box-shadow:0 0 16px #d7b56812}
.ico{font-size:25px;display:block;margin-bottom:7px}
.game b,.game small{display:block}
.game small{color:var(--muted);font-size:11px;margin-top:4px}
.panel{display:none;margin-top:15px}
.panel.active{display:block;animation:fade .2s ease}
@keyframes fade{from{opacity:.4;transform:translateY(4px)}to{opacity:1;transform:none}}
label{display:block;color:#d5c9ad;font-size:12px;margin:12px 0}
input,select{display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #493b26;border-radius:10px;background:#0b0b0b;color:white}
.controls{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.primary,.secondary{width:100%;padding:13px;border-radius:10px;font-weight:850}
.primary{background:linear-gradient(110deg,#b18b3e,#f0d28a);border:1px solid #f5dfa2;color:#191307}
.secondary{margin-top:9px;background:#211c12;border:1px solid var(--line);color:var(--light)}
.stats{display:flex;gap:8px;margin:12px 0}
.stat{flex:1;min-width:0;padding:10px;border:1px solid #332b1c;border-radius:10px;background:#0b0b0b}
.stat small{display:block;font-size:10px;color:var(--muted)}
.stat b{display:block;margin-top:5px;color:var(--light)}
.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin:15px 0}
.cell{aspect-ratio:1;min-width:0;border:1px solid #574526;border-radius:9px;background:linear-gradient(145deg,#302718,#17140e);color:var(--light);font-size:clamp(18px,5vw,26px);font-weight:900}
.cell.safe{background:#12382a;border-color:#48b88c}
.cell.mine{background:#451a21;border-color:var(--red)}
.cell:disabled{opacity:1}
.result{min-height:42px;white-space:pre-line;line-height:1.55;font-size:12px;padding:12px;margin-top:12px;border:1px solid #30291d;border-radius:10px;background:#0a0a0a;color:#d9ceb6}
.reels,.cards{display:flex;justify-content:center;gap:9px;margin:19px 0}
.reel{display:grid;place-items:center;width:29%;height:80px;border:1px solid var(--line);border-radius:12px;background:#090909;font-size:34px}
.wheel{width:145px;height:145px;margin:20px auto;border:7px solid #aa8744;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#a52b37 0 30deg,#171713 30deg 60deg,#a52b37 60deg 90deg,#171713 90deg 120deg,#a52b37 120deg 150deg,#171713 150deg 180deg,#a52b37 180deg 210deg,#171713 210deg 240deg,#a52b37 240deg 270deg,#171713 270deg 300deg,#a52b37 300deg 330deg,#16845e 330deg);font-weight:900;transition:transform 2s cubic-bezier(.1,.7,.1,1)}
.card{width:48px;height:68px;display:grid;place-items:center;border-radius:8px;background:#f4ead4;color:#17130b;font-size:20px;font-weight:900}
.bottom{position:fixed;z-index:5;bottom:0;left:0;right:0;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:#0b0b0bf2;border-top:1px solid #382e1d;backdrop-filter:blur(12px)}
.bottom-inner{max-width:680px;margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.bottom button{border:0;border-radius:9px;background:transparent;color:var(--muted);padding:7px;font-size:11px}
.bottom button span{display:block;font-size:19px;margin-bottom:3px}
.bottom button.active{background:#292114;color:var(--light)}
@media(min-width:560px){.games{grid-template-columns:repeat(4,minmax(0,1fr))}}
</style>
</head>
<body>
<div class="app">
<header>
  <div class="brand">SHIMONA <span>CASINO</span><small>BLACK LABEL · VIRTUAL ARCADE</small></div>
  <div class="balance"><small>ТВОЙ БАЛАНС</small><strong><span id="balance">...</span> SB</strong></div>
</header>

<section class="hero">
  <div class="eyebrow">PRIVATE GAME ROOM</div>
  <h1>BLACK LABEL</h1>
  <p>Чёрный стиль. Золотые детали. Четыре игры на виртуальных SB.</p>
</section>

<div class="section"><h3>Выбери игру</h3><small>4 режима</small></div>
<div class="games">
<button class="game active" data-tab="mines"><span class="ico">💣</span><b>Мины</b><small>Поле 5 × 5</small></button>
<button class="game" data-tab="slots"><span class="ico">🎰</span><b>Слоты</b><small>Барабаны</small></button>
<button class="game" data-tab="roulette"><span class="ico">🎡</span><b>Рулетка</b><small>Числа и цвета</small></button>
<button class="game" data-tab="blackjack"><span class="ico">🃏</span><b>Блэкджек</b><small>Карточный раунд</small></button>
</div>

<section class="panel active" id="mines">
<h2>💣 Мины</h2><p>Открывай безопасные клетки и забирай выплату до попадания на мину.</p>
<div class="controls">
<label>Количество мин<select id="mineCount"><option value="3">3 мины</option><option value="5">5 мин</option><option value="8">8 мин</option><option value="10">10 мин</option><option value="15">15 мин</option><option value="20">20 мин</option></select></label>
<label>Сумма SB<input id="minesBet" type="number" min="1" max="10000" value="10"></label>
</div>
<div class="stats"><div class="stat"><small>ОТКРЫТО</small><b id="openedCount">0</b></div><div class="stat"><small>МНОЖИТЕЛЬ</small><b id="multiplier">—</b></div></div>
<div class="grid" id="grid"></div>
<button class="primary" id="playMines">Начать раунд</button>
<button class="secondary" id="cashout" disabled>Забрать SB</button>
<div class="result" id="minesResult">Подключаем игру...</div>
</section>

<section class="panel" id="slots">
<h2>🎰 Слоты</h2><p>Три барабана и случайные комбинации.</p>
<label>Сумма SB<input id="slotsBet" type="number" min="1" max="10000" value="10"></label>
<div class="reels"><div class="reel" id="reel0">◆</div><div class="reel" id="reel1">◆</div><div class="reel" id="reel2">◆</div></div>
<button class="primary" id="playSlots">Крутить барабаны</button>
<div class="result" id="slotsResult">Готов к игре.</div>
</section>

<section class="panel" id="roulette">
<h2>🎡 Рулетка</h2><p>Выбери исход. Анимация показывает ход раунда.</p>
<label>Сумма SB<input id="rouletteBet" type="number" min="1" max="10000" value="10"></label>
<label>Выбор<select id="rouletteChoice"><option value="red">Красное</option><option value="black">Чёрное</option><option value="green">Зелёное (0)</option><option value="even">Чётное</option><option value="odd">Нечётное</option><option value="low">1–18</option><option value="high">19–36</option></select></label>
<div class="wheel" id="wheel">SB</div>
<button class="primary" id="playRoulette">Крутить рулетку</button>
<div class="result" id="rouletteResult">Сделай выбор.</div>
</section>

<section class="panel" id="blackjack">
<h2>🃏 Блэкджек</h2><p>Сервер проводит автоматический раунд и рассчитывает результат.</p>
<label>Сумма SB<input id="blackjackBet" type="number" min="1" max="10000" value="10"></label>
<div class="section"><h3>Твои карты</h3><small id="playerTotal">—</small></div>
<div class="cards" id="playerCards"></div>
<div class="section"><h3>Дилер</h3><small id="dealerTotal">—</small></div>
<div class="cards" id="dealerCards"></div>
<button class="primary" id="playBlackjack">Раздать карты</button>
<div class="result" id="blackjackResult">Готов к раунду.</div>
</section>

<section class="panel" id="history">
<h2>📜 История</h2><p>История раундов в текущем сеансе.</p>
<div id="historyList" class="result">Пока записей нет.</div>
</section>

<section class="panel" id="profile">
<h2>✦ BLACK LABEL</h2>
<div class="stat"><small>ТВОЙ БАЛАНС</small><b id="profileBalance">...</b></div>
<div class="result" id="bonusResult">Проверяем ежедневный бонус...</div>
<button class="primary" id="bonus">Забрать +100 SB</button>
<p>Только виртуальные очки. Нет денежных ставок, пополнений и выводов.</p>
</section>
</div>

<nav class="bottom"><div class="bottom-inner">
<button class="active" data-bottom="games"><span>♠</span>Игры</button>
<button data-bottom="history"><span>▤</span>История</button>
<button data-bottom="profile"><span>✦</span>Профиль</button>
</div></nav>

<script>
"use strict";
const $ = id => document.getElementById(id);
const PLAYER_KEY = "shimona_player_id";
let playerId = localStorage.getItem(PLAYER_KEY);
if (!playerId) {
  playerId = "p_" + (crypto.randomUUID ? crypto.randomUUID() : Date.now()+"_"+Math.random().toString(36).slice(2));
  localStorage.setItem(PLAYER_KEY,playerId);
}
let busy=false, roundActive=false, opened=new Set(), mineCount=3, mineBet=0, history=[];

async function api(url,body) {
  const options={method:body===undefined?"GET":"POST",headers:{"X-Player-Id":playerId}};
  if(body!==undefined){options.headers["Content-Type"]="application/json";options.body=JSON.stringify(body);}
  const response=await fetch(url,options);
  let data;
  try{data=await response.json();}catch{throw Error("Сервер вернул некорректный ответ.");}
  if(!response.ok||data.ok===false)throw Error(data.error||"Ошибка сервера ("+response.status+").");
  return data;
}
function setBalance(n){
  $("balance").textContent=Number(n).toLocaleString("ru-RU");
  $("profileBalance").textContent=Number(n).toLocaleString("ru-RU")+" SB";
}
function result(id,text){$(id).textContent=text;}
function record(text){
  history.unshift(new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})+" — "+text);
  history=history.slice(0,30);
  $("historyList").textContent=history.join("\n");
}
function showTab(tab){
  if(!["mines","slots","roulette","blackjack","history","profile"].includes(tab))return;
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id===tab));
  document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.querySelectorAll("[data-bottom]").forEach(b=>b.classList.toggle("active",b.dataset.bottom===((["mines","slots","roulette","blackjack"].includes(tab))?"games":tab)));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
document.querySelectorAll("[data-bottom]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.bottom==="games"?"mines":b.dataset.bottom)));

async function run(buttonIds,task){
  if(busy)return;
  busy=true;buttonIds.forEach(id=>$(id).disabled=true);
  try{await task();}
  catch(e){alert(e.message||"Не удалось выполнить действие.");}
  finally{
    busy=false;
    buttonIds.forEach(id=>$(id).disabled=false);
    if(roundActive){$("playMines").disabled=true;$("cashout").disabled=false;}
  }
}
function getBet(id){
  const n=Number($(id).value);
  if(!Number.isSafeInteger(n)||n<1||n>10000)throw Error("Введи целую сумму от 1 до 10 000 SB.");
  return n;
}
function renderGrid(mines=[],openedList=[]){
  const grid=$("grid");grid.innerHTML="";
  for(let i=0;i<25;i++){
    const b=document.createElement("button");b.className="cell";b.type="button";
    const isOpen=openedList.includes(i),isMine=mines.includes(i);
    b.textContent=isOpen?(isMine?"💣":"💎"):"✦";
    if(isOpen){b.disabled=true;b.classList.add(isMine?"mine":"safe");}
    b.addEventListener("click",()=>openMine(i));
    grid.appendChild(b);
  }
}
function emptyGrid(){renderGrid([],[]);}
async function refresh(){
  const d=await api("/api/me");
  setBalance(d.balance);
  $("bonus").disabled=!d.bonusReady;
  result("bonusResult",d.bonusReady?"Бонус доступен: +100 SB.":"Бонус уже получен. Повтори попытку через 24 часа.");
}
$("playMines").addEventListener("click",()=>run(["playMines"],async()=>{
  if(roundActive)throw Error("Сначала закончи текущий раунд.");
  mineBet=getBet("minesBet");mineCount=Number($("mineCount").value);
  const d=await api("/api/mines/start",{bet:mineBet,mines:mineCount});
  roundActive=true;opened=new Set();setBalance(d.balance);
  $("openedCount").textContent="0";$("multiplier").textContent="—";
  $("playMines").disabled=true;$("cashout").disabled=true;
  result("minesResult","Раунд начался. Открывай клетки.");
  renderGrid([],[]);record("Мины: начало раунда −"+mineBet+" SB");
}));
async function openMine(i){
  if(!roundActive||busy)return;
  await run(["playMines","cashout"],async()=>{
    const d=await api("/api/mines/open",{index:i});
    setBalance(d.balance);opened=new Set(d.opened||[]);
    if(d.hit){
      renderGrid(d.mines||[],d.opened||[]);
      result("minesResult","💥 Мина! Раунд окончен. −"+mineBet+" SB");
      record("Мины: проигрыш −"+mineBet+" SB");
      roundActive=false;$("playMines").disabled=false;$("cashout").disabled=true;
      $("multiplier").textContent="—";return;
    }
    $("openedCount").textContent=String(d.safe||opened.size);
    $("multiplier").textContent=Number(d.multiplier||1).toFixed(2)+"×";
    renderGrid([],d.opened||[]);
    result("minesResult","💎 Безопасно! Можешь открыть ещё клетку или забрать выплату.");
  });
}
$("cashout").addEventListener("click",()=>run(["cashout","playMines"],async()=>{
  if(!roundActive)throw Error("Сначала начни раунд.");
  const d=await api("/api/mines/cashout",{});
  setBalance(d.balance);roundActive=false;$("cashout").disabled=true;$("playMines").disabled=false;
  $("multiplier").textContent="—";result("minesResult","Забрано: +"+d.payout+" SB ("+d.multiplier+"×).");
  record("Мины: выплата +"+d.payout+" SB");emptyGrid();
}));
const symbols=["🍒","🍋","🔔","💎","7️⃣","🍀"];
$("playSlots").addEventListener("click",()=>run(["playSlots"],async()=>{
  const bet=getBet("slotsBet");
  const reels=[$("reel0"),$("reel1"),$("reel2")];
  for(let i=0;i<12;i++){
    reels.forEach(r=>r.textContent=symbols[Math.floor(Math.random()*symbols.length)]);
    await new Promise(resolve=>setTimeout(resolve,65+i*6));
  }
  const d=await api("/api/slots",{bet});
  d.reels.forEach((s,i)=>reels[i].textContent=s);
  setBalance(d.balance);
  result("slotsResult",d.message+"\n"+d.reels.join("  ")+"\n"+(d.net>=0?"+":"")+d.net+" SB");
  record("Слоты: "+(d.net>=0?"+":"")+d.net+" SB");
}));
$("playRoulette").addEventListener("click",()=>run(["playRoulette"],async()=>{
  const bet=getBet("rouletteBet"),choice=$("rouletteChoice").value,wheel=$("wheel");
  wheel.style.transform="rotate(0deg)";
  await new Promise(resolve=>setTimeout(resolve,30));
  wheel.style.transform="rotate(1440deg)";
  const d=await api("/api/roulette",{bet,choice});
  await new Promise(resolve=>setTimeout(resolve,2000));
  wheel.textContent=String(d.number);
  setBalance(d.balance);
  result("rouletteResult","Выпало: "+d.number+" · "+d.color+"\n"+d.message+"\n"+(d.net>=0?"+":"")+d.net+" SB");
  record("Рулетка: "+(d.net>=0?"+":"")+d.net+" SB");
}));
function drawCards(id,cards){
  const el=$(id);el.innerHTML="";
  (cards||[]).forEach(rank=>{
    const card=document.createElement("div");card.className="card";card.textContent=rank;el.appendChild(card);
  });
}
$("playBlackjack").addEventListener("click",()=>run(["playBlackjack"],async()=>{
  const bet=getBet("blackjackBet");
  const d=await api("/api/blackjack",{bet});
  drawCards("playerCards",d.playerCards);drawCards("dealerCards",d.dealerCards);
  $("playerTotal").textContent=d.playerTotal+" очков";
  $("dealerTotal").textContent=d.dealerTotal+" очков";
  setBalance(d.balance);
  result("blackjackResult",d.message+"\nСчёт: "+d.playerTotal+" : "+d.dealerTotal+"\n"+(d.net>=0?"+":"")+d.net+" SB");
  record("Блэкджек: "+(d.net>=0?"+":"")+d.net+" SB");
}));
$("bonus").addEventListener("click",()=>run(["bonus"],async()=>{
  const d=await api("/api/bonus",{});
  setBalance(d.balance);$("bonus").disabled=true;
  result("bonusResult","Получено +"+d.bonus+" SB. Возвращайся через 24 часа.");
  record("Ежедневный бонус: +"+d.bonus+" SB");
}));
refresh().then(()=>{emptyGrid();}).catch(e=>{
  result("minesResult","Не удалось подключиться к серверу: "+e.message);
  $("bonus").disabled=true;
});
</script>
</body>
</html>
  
