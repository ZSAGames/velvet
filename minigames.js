const VelvetMinigames = {
getMinBet() {
return this.day * 50;
},
onCustomBetInput(gameKey, rawVal) {
if (this.isGameRoundActive(gameKey)) return;
this[gameKey].bet = Math.max(0, Math.min(this.cash, Math.floor(Number(rawVal) || 0)));
this.syncBetInputUI(gameKey);
},
modifyGameBet(gameKey, action) {
if (this.isGameRoundActive(gameKey)) return;
this.sfx.chip();
const minBet = this.getMinBet();
let current = this[gameKey].bet || 0;
if (action === 'clear') current = 0;
else if (action === 'min') current = Math.min(this.cash, minBet);
else if (action === 'max') current = this.cash;
else if (typeof action === 'number') current = Math.max(0, Math.min(this.cash, current + action));
this[gameKey].bet = Math.max(0, current);
this.syncBetInputUI(gameKey);
},
isGameRoundActive(gameKey) {
if (gameKey === 'bj') return this.bj.inProgress;
if (gameKey === 'slots') return this.slots.spinning;
if (gameKey === 'dice') return this.dice.rolling;
if (gameKey === 'crash') return this.crash.active;
if (gameKey === 'mines') return this.mines.active;
return false;
},
syncBetInputUI(gameKey) {
const minBet = this.getMinBet();
const inputEl = document.getElementById(`${gameKey}-bet-input`);
const badgeEl = document.getElementById(`${gameKey}-min-badge`);
if (inputEl) inputEl.value = this[gameKey].bet;
if (badgeEl) badgeEl.textContent = `MIN NOC ${this.day}: $${minBet}`;
},
validateGameWager(gameKey) {
const minBet = this.getMinBet();
const bet = this[gameKey].bet || 0;
if (bet <= 0) {
this.sfx.lose();
this.showToast(`Wpisz stawkę lub kliknij +$50 / +$150! (Min. w Nocy ${this.day}: $${minBet})`, 'amber');
return false;
}
if (bet < minBet && this.cash >= minBet) {
this.sfx.lose();
this.showToast(`Minimalny zakład w Nocy ${this.day} wynosi $${minBet}!`, 'red');
return false;
}
if (bet > this.cash) {
this.sfx.lose();
this.showToast('Nie masz tyle gotówki!', 'red');
return false;
}
return true;
},
initRouletteGrid() {
const grid = document.getElementById('roul-numbers-grid');
if (!grid) return;
grid.innerHTML = '';
const redNums = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
for (let n = 0; n <= 36; n++) {
const btn = document.createElement('button');
const isZero = n === 0;
const isRed = redNums.has(n);
const bgClass = isZero ? 'bg-emerald-700 hover:bg-emerald-600' : (isRed ? 'bg-red-700 hover:bg-red-600' : 'bg-zinc-800 hover:bg-zinc-700');
btn.className = `${bgClass} text-white font-extrabold text-[11px] py-1.5 rounded border border-white/10 flex flex-col items-center justify-center transition`;
btn.innerHTML = `<span>${n}</span><span id="bet-tag-NUM_${n}" class="text-[9px] text-amber-300 hidden">$0</span>`;
btn.onclick = () => this.placeRoulBet(`NUM_${n}`, `#${n} (36x)`);
grid.appendChild(btn);
}
},
openBlackjackModal() {
this.sfx.card();
this.bj.inProgress = false;
this.bj.playerHand = [];
this.bj.dealerHand = [];
this.bj.bet = 0;
this.syncBetInputUI('bj');
document.getElementById('bj-Banner').textContent = `WPISZ STAWKĘ (MIN. $${this.getMinBet()}) I KLIKNIJ ROZDAJ`;
this.renderBlackjackUI();
this.openModal('modal-blackjack');
},
toggleBjHelp() {
const drawer = document.getElementById('bj-help-drawer');
if (drawer) drawer.classList.toggle('hidden');
},
createDeck() {
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const deck = [];
for (const s of suits) {
for (const r of ranks) {
let val = parseInt(r, 10);
if (['J', 'Q', 'K'].includes(r)) val = 10;
if (r === 'A') val = 11;
deck.push({ rank: r, suit: s, val });
}
}
for (let i = deck.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[deck[i], deck[j]] = [deck[j], deck[i]];
}
return deck;
},
calcHandValue(hand) {
let total = 0, aces = 0;
for (const c of hand) {
total += c.val;
if (c.rank === 'A') aces++;
}
while (total > 21 && aces > 0) {
total -= 10;
aces--;
}
return total;
},
startBlackjackHand() {
if (this.bj.inProgress || !this.validateGameWager('bj')) return;
this.cash -= this.bj.bet;
this.bj.deck = this.createDeck();
this.bj.playerHand = [this.bj.deck.pop(), this.bj.deck.pop()];
this.bj.dealerHand = [this.bj.deck.pop(), this.bj.deck.pop()];
this.bj.inProgress = true;
this.bj.peeked = this.relics.has('xray_monocle') && Math.random() < 0.45;
this.sfx.card();
this.updateHUD();
this.renderBlackjackUI();
if (this.calcHandValue(this.bj.playerHand) === 21) this.bjStand();
},
bjHit() {
if (!this.bj.inProgress) return;
const card = this.bj.deck.pop();
this.bj.playerHand.push(card);
this.sfx.card();
let pVal = this.calcHandValue(this.bj.playerHand);
if (pVal > 21 && this.relics.has('sleight_gloves') && Math.random() < 0.35) {
card.rank = 'A';
card.val = 11;
pVal = this.calcHandValue(this.bj.playerHand);
this.showToast('🧤 Rękawice Szulera zamieniły kartę na Asa!', 'emerald');
}
this.renderBlackjackUI();
if (pVal > 21) this.finishBlackjackHand('BUST');
else if (pVal === 21) this.bjStand();
},
bjDouble() {
if (!this.bj.inProgress || this.bj.playerHand.length !== 2 || this.cash < this.bj.bet) return;
this.cash -= this.bj.bet;
this.bj.bet *= 2;
this.sfx.chip();
this.updateHUD();
const card = this.bj.deck.pop();
this.bj.playerHand.push(card);
let pVal = this.calcHandValue(this.bj.playerHand);
if (pVal > 21 && this.relics.has('sleight_gloves') && Math.random() < 0.35) {
card.rank = 'A';
card.val = 11;
pVal = this.calcHandValue(this.bj.playerHand);
}
this.renderBlackjackUI();
if (pVal > 21) this.finishBlackjackHand('BUST');
else this.bjStand();
},
bjStand() {
if (!this.bj.inProgress) return;
const standThreshold = this.currentModifier.dealerStand || 17;
while (this.calcHandValue(this.bj.dealerHand) < standThreshold) {
this.bj.dealerHand.push(this.bj.deck.pop());
}
const pVal = this.calcHandValue(this.bj.playerHand);
const dVal = this.calcHandValue(this.bj.dealerHand);
if (dVal > 21 || pVal > dVal) {
const isNatural = pVal === 21 && this.bj.playerHand.length === 2;
this.finishBlackjackHand(isNatural ? 'BLACKJACK' : 'WIN');
} else if (pVal === dVal) {
this.finishBlackjackHand('PUSH');
} else {
this.finishBlackjackHand('LOSE');
}
},
finishBlackjackHand(outcome) {
this.bj.inProgress = false;
const banner = document.getElementById('bj-Banner');
const pVal = this.calcHandValue(this.bj.playerHand);
const dVal = this.calcHandValue(this.bj.dealerHand);
if (outcome === 'BLACKJACK' || outcome === 'WIN') {
const baseMult = outcome === 'BLACKJACK' ? 2.5 : 2.0;
const payout = this.recordWinPayout(this.bj.bet, baseMult);
const netProfit = payout - this.bj.bet;
this.sfx.win();
banner.textContent = `${outcome === 'BLACKJACK' ? '★ BLACKJACK!' : 'WYGRANA!'} +$${payout.toLocaleString()} (${pVal} vs ${dVal})`;
banner.className = 'text-center py-2 px-4 rounded-xl bg-emerald-950/90 border border-emerald-500 font-extrabold text-sm sm:text-base text-emerald-300';
this.advanceChallenge('bj_wins_2', 1);
if (pVal <= 17) this.advanceChallenge('bj_low_win', 1);
if (netProfit >= 400) this.advanceChallenge('big_payout', 1);
} else if (outcome === 'PUSH') {
this.cash += this.bj.bet;
this.sfx.chip();
banner.textContent = `REMIS (ZWROT STAWKI $${this.bj.bet}) (${pVal} vs ${dVal})`;
banner.className = 'text-center py-2 px-4 rounded-xl bg-zinc-900 border border-zinc-600 font-extrabold text-sm sm:text-base text-zinc-200';
} else {
this.sfx.lose();
banner.textContent = outcome === 'BUST'
? `FURA! PRZEKROCZONO 21 (${pVal}) — PRZEGRANA -$${this.bj.bet}`
: `KRUPIER WYGRYWA (${dVal} vs ${pVal}) — PRZEGRANA -$${this.bj.bet}`;
banner.className = 'text-center py-2 px-4 rounded-xl bg-red-950/90 border border-red-600 font-extrabold text-sm sm:text-base text-red-300';
}
this.updateHUD();
this.renderBlackjackUI();
if (this.checkBankruptcy) this.checkBankruptcy();
},
renderBlackjackUI() {
this.syncBetInputUI('bj');
const pContainer = document.getElementById('bj-player-cards');
const dContainer = document.getElementById('bj-dealer-cards');
pContainer.innerHTML = '';
dContainer.innerHTML = '';
const renderCardEl = (c, hidden = false) => {
const div = document.createElement('div');
if (hidden) {
div.className = 'playing-card hidden-card items-center justify-center';
div.innerHTML = `<span class="text-amber-400 text-2xl font-extrabold">?</span>`;
return div;
}
const isRed = c.suit === '♥' || c.suit === '♦';
div.className = `playing-card ${isRed ? 'text-red-600' : 'text-zinc-900'}`;
div.innerHTML = `<div class="text-xs leading-none">${c.rank}${c.suit}</div><div class="text-2xl self-center">${c.suit}</div><div class="text-xs leading-none self-end rotate-180">${c.rank}${c.suit}</div>`;
return div;
};
this.bj.playerHand.forEach(c => pContainer.appendChild(renderCardEl(c, false)));
this.bj.dealerHand.forEach((c, idx) => {
dContainer.appendChild(renderCardEl(c, this.bj.inProgress && idx === 1 && !this.bj.peeked));
});
const pVal = this.calcHandValue(this.bj.playerHand);
const dVal = this.calcHandValue(this.bj.dealerHand);
document.getElementById('bj-player-score').textContent = `${pVal} / 21`;
document.getElementById('bj-dealer-score').textContent = (this.bj.inProgress && !this.bj.peeked && this.bj.dealerHand.length > 0)
? `${this.bj.dealerHand[0].val} + ?`
: (this.bj.dealerHand.length ? `${dVal}` : '?');
const fill = document.getElementById('bj-meter-fill');
const zoneLbl = document.getElementById('bj-hand-zone-label');
fill.style.width = `${Math.min(100, Math.round((pVal / 21) * 100))}%`;
if (pVal === 0) {
fill.className = 'h-full bg-zinc-600 rounded-full transition-all duration-300';
zoneLbl.textContent = this.t('bj_zone_ready');
} else if (pVal > 21) {
fill.className = 'h-full bg-red-600 rounded-full transition-all duration-300';
zoneLbl.textContent = this.t('bj_zone_bust');
} else if (pVal === 21) {
fill.className = 'h-full bg-amber-400 rounded-full transition-all duration-300';
zoneLbl.textContent = this.t('bj_zone_21');
} else if (pVal >= 17) {
fill.className = 'h-full bg-emerald-400 rounded-full transition-all duration-300';
zoneLbl.textContent = this.t('bj_zone_strong');
} else {
fill.className = 'h-full bg-sky-400 rounded-full transition-all duration-300';
zoneLbl.textContent = this.t('bj_zone_safe');
}
document.getElementById('bj-btn-deal').disabled = this.bj.inProgress;
document.getElementById('bj-btn-hit').disabled = !this.bj.inProgress;
document.getElementById('bj-btn-stand').disabled = !this.bj.inProgress;
document.getElementById('bj-btn-double').disabled = !(this.bj.inProgress && this.bj.playerHand.length === 2 && this.cash >= this.bj.bet);
this.updateBlackjackCoach(pVal);
},
updateBlackjackCoach(pVal) {
const coachText = document.getElementById('bj-coach-text');
const coachOdds = document.getElementById('bj-coach-odds');
if (!coachText || !coachOdds) return;
if (!this.bj.inProgress || pVal === 0) {
coachText.textContent = this.t('bj_coach_idle');
coachOdds.textContent = this.t('bj_safe_odds', { pct: 100 });
return;
}
const maxSafeCard = 21 - pVal;
let safeRanks = 0;
for (let v = 1; v <= 10; v++) {
if (v <= maxSafeCard) safeRanks += (v === 10 ? 4 : 1);
}
const safePct = Math.min(100, Math.max(0, Math.round((safeRanks / 13) * 100)));
coachOdds.textContent = this.t('bj_safe_odds', { pct: safePct });
const upCard = this.bj.dealerHand[0];
if (pVal === 10 || pVal === 11) coachText.textContent = this.t('bj_coach_double', { val: pVal });
else if (pVal <= 11) coachText.textContent = this.t('bj_coach_hit_safe', { val: pVal });
else if (pVal >= 17) coachText.textContent = this.t('bj_coach_stand_high', { val: pVal, risk: 100 - safePct });
else if (upCard && upCard.val >= 2 && upCard.val <= 6) coachText.textContent = this.t('bj_coach_dealer_weak', { rank: upCard.rank });
else coachText.textContent = this.t('bj_coach_hit_risk', { val: pVal, rank: upCard ? upCard.rank : '?', pct: safePct });
},
openRouletteModal() {
this.sfx.chip();
let refund = 0;
for (const k in this.roul.bets) refund += this.roul.bets[k];
if (refund > 0) this.cash += refund;
this.roul.bets = {};
const minBadge = document.getElementById('roul-min-badge');
if (minBadge) minBadge.textContent = `MIN NOC ${this.day}: $${this.getMinBet()}`;
const roulSlot = this.activeCasinoSlots.find(s => s.type === 'roul');
const subEl = document.getElementById('roul-variant-sub');
if (subEl && roulSlot) subEl.textContent = `${roulSlot.variantText} • Minimalna suma zakładów: $${this.getMinBet()}`;
this.updateRoulBetTags();
this.drawRouletteWheel();
this.updateHUD();
this.openModal('modal-roulette');
},
setRoulChip(val) {
if (this.roul.spinning) return;
const parsed = Math.max(10, Math.floor(Number(val) || 50));
this.roul.chip = parsed;
const inp = document.getElementById('roul-chip-input');
if (inp && document.activeElement !== inp) inp.value = parsed;
[50, 150, 500].forEach(c => {
const btn = document.getElementById(`chip-${c}`);
if (btn) {
btn.className = c === parsed
? 'roul-chip-btn px-2.5 py-1 rounded-lg text-xs font-extrabold border border-amber-400 bg-amber-500 text-zinc-950'
: 'roul-chip-btn px-2.5 py-1 rounded-lg text-xs font-extrabold border border-zinc-700 bg-zinc-800 text-zinc-200';
}
});
},
placeRoulBet(key) {
if (this.roul.spinning) return;
if (this.cash < this.roul.chip) {
this.sfx.lose();
this.showToast('Brak gotówki na ten żeton!', 'red');
return;
}
this.cash -= this.roul.chip;
this.roul.bets[key] = (this.roul.bets[key] || 0) + this.roul.chip;
this.sfx.chip();
this.updateRoulBetTags();
this.updateHUD();
},
clearRoulBets() {
if (this.roul.spinning) return;
let refund = 0;
for (const k in this.roul.bets) refund += this.roul.bets[k];
this.cash += refund;
this.roul.bets = {};
this.sfx.tick();
this.updateRoulBetTags();
this.updateHUD();
},
updateRoulBetTags() {
let total = 0;
for (const k in this.roul.bets) total += this.roul.bets[k];
const totEl = document.getElementById('roul-total-bet');
if (totEl) totEl.textContent = `$${total}`;
['RED', 'BLACK', 'ODD', 'EVEN', 'DOZ1', 'DOZ2', 'DOZ3'].forEach(k => {
const tag = document.getElementById(`bet-tag-${k}`);
if (tag) tag.textContent = `$${this.roul.bets[k] || 0}`;
});
for (let n = 0; n <= 36; n++) {
const tag = document.getElementById(`bet-tag-NUM_${n}`);
if (tag) {
const amt = this.roul.bets[`NUM_${n}`] || 0;
tag.textContent = `$${amt}`;
tag.classList.toggle('hidden', amt === 0);
}
}
},
drawRouletteWheel() {
const c = document.getElementById('rouletteWheelCanvas');
if (!c) return;
const ctx = c.getContext('2d');
const cx = c.width / 2, cy = c.height / 2;
ctx.clearRect(0, 0, c.width, c.height);
const redNums = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const slice = (Math.PI * 2) / 37;
ctx.save();
ctx.translate(cx, cy);
ctx.rotate(this.roul.wheelAngle);
for (let i = 0; i <= 36; i++) {
const a0 = i * slice, a1 = a0 + slice;
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.arc(0, 0, 92, a0, a1);
ctx.closePath();
ctx.fillStyle = i === 0 ? '#059669' : (redNums.has(i) ? '#dc2626' : '#18181b');
ctx.fill();
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 0.8;
ctx.stroke();
}
ctx.beginPath();
ctx.arc(0, 0, 44, 0, Math.PI * 2);
ctx.fillStyle = '#09090b';
ctx.fill();
ctx.strokeStyle = '#f59e0b';
ctx.lineWidth = 3;
ctx.stroke();
ctx.restore();
const bx = cx + Math.cos(this.roul.ballAngle) * this.roul.ballRadius;
const by = cy + Math.sin(this.roul.ballAngle) * this.roul.ballRadius;
ctx.beginPath();
ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
ctx.fillStyle = '#ffffff';
ctx.fill();
if (this.roul.lastNumber !== null) {
ctx.fillStyle = '#fbbf24';
ctx.font = '800 20px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(`${this.roul.lastNumber}`, cx, cy);
}
},
spinRoulette() {
if (this.roul.spinning) return;
let totalBet = 0;
for (const k in this.roul.bets) totalBet += this.roul.bets[k];
const minBet = this.getMinBet();
if (totalBet <= 0) {
this.sfx.lose();
this.showToast(`Postaw żetony na stole! (Min. w Nocy ${this.day}: $${minBet})`, 'amber');
return;
}
if (totalBet < minBet && (this.cash + totalBet) >= minBet) {
this.sfx.lose();
this.showToast(`Minimalna suma zakładów w Nocy ${this.day} to $${minBet}! (Obecnie: $${totalBet})`, 'red');
return;
}
this.roul.spinning = true;
document.getElementById('roul-spin-btn').disabled = true;
const winningNum = Math.floor(Math.random() * 37);
const redNums = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const startTime = performance.now(), duration = 1750;
const roulSlot = this.activeCasinoSlots.find(s => s.type === 'roul');
const singleMult = (roulSlot && roulSlot.variantIdx === 1) ? 40 : 36;
const animateSpin = (now) => {
const t = Math.min(1, (now - startTime) / duration);
const ease = 1 - Math.pow(1 - t, 3);
this.roul.wheelAngle += (1 - ease) * 0.28 + 0.01;
this.roul.ballAngle -= (1 - ease) * 0.42;
this.roul.ballRadius = 82 - ease * 18;
this.drawRouletteWheel();
if (t < 1) {
requestAnimationFrame(animateSpin);
} else {
this.roul.spinning = false;
this.roul.lastNumber = winningNum;
document.getElementById('roul-spin-btn').disabled = false;
this.drawRouletteWheel();
let rawWin = 0;
const isRed = redNums.has(winningNum);
const isBlack = winningNum !== 0 && !isRed;
for (const [k, amt] of Object.entries(this.roul.bets)) {
if (k === 'RED' && isRed) rawWin += amt * 2;
else if (k === 'BLACK' && isBlack) rawWin += amt * 2;
else if (k === 'ODD' && winningNum !== 0 && winningNum % 2 === 1) rawWin += amt * 2;
else if (k === 'EVEN' && winningNum !== 0 && winningNum % 2 === 0) rawWin += amt * 2;
else if (k === 'DOZ1' && winningNum >= 1 && winningNum <= 12) rawWin += amt * 3;
else if (k === 'DOZ2' && winningNum >= 13 && winningNum <= 24) rawWin += amt * 3;
else if (k === 'DOZ3' && winningNum >= 25 && winningNum <= 36) rawWin += amt * 3;
else if (k === `NUM_${winningNum}`) rawWin += amt * singleMult;
}
const banner = document.getElementById('roul-result-banner');
const colName = winningNum === 0 ? 'ZIELONE 0' : (isRed ? `CZERWONE ${winningNum}` : `CZARNE ${winningNum}`);
if (rawWin > 0) {
const finalPayout = this.recordWinPayout(rawWin, 1.0);
this.sfx.win();
banner.textContent = `WYPADŁO ${colName}! WYGRANA +$${finalPayout.toLocaleString()}`;
this.advanceChallenge('roul_win_1', 1);
if (finalPayout - totalBet >= 400) this.advanceChallenge('big_payout', 1);
} else {
this.sfx.lose();
banner.textContent = `WYPADŁO ${colName} — BRAK TRAFIENIA`;
}
this.roul.bets = {};
this.updateRoulBetTags();
this.updateHUD();
if (this.checkBankruptcy) this.checkBankruptcy();
}
};
requestAnimationFrame(animateSpin);
},
openSlotsModal() {
this.sfx.chip();
this.slots.bet = 0;
this.syncBetInputUI('slots');
const slotCfg = this.activeCasinoSlots.find(s => s.type === 'slots');
const subEl = document.getElementById('slots-variant-sub');
if (subEl && slotCfg) subEl.textContent = `${slotCfg.variantText} • Minimalny zakład: $${this.getMinBet()}`;
this.openModal('modal-slots');
},
spinSlots() {
if (this.slots.spinning || !this.validateGameWager('slots')) return;
this.cash -= this.slots.bet;
this.slots.spinning = true;
this.updateHUD();
const reels = [0, 1, 2].map(i => document.getElementById(`slot-reel-${i}`));
reels.forEach(r => {
r.classList.remove('slot-reel-landed');
r.classList.add('slot-reel-spinning');
});
const pickWeighted = () => {
const pool = ['🍒', '🍒', '🍒', '🔔', '🔔', '💎', '💎', '7️⃣', '💀', '💀'];
return pool[Math.floor(Math.random() * pool.length)];
};
const slotCfg = this.activeCasinoSlots.find(s => s.type === 'slots');
const results = [pickWeighted(), pickWeighted(), pickWeighted()];
setTimeout(() => {
reels.forEach((r, idx) => {
r.classList.remove('slot-reel-spinning');
r.classList.add('slot-reel-landed');
r.textContent = results[idx];
});
this.slots.spinning = false;
const [a, b, c] = results;
let mult = 0;
if (a === b && b === c) {
if (a === '7️⃣') mult = (slotCfg && slotCfg.variantIdx === 2) ? 18 : 15;
else if (a === '💎') mult = (slotCfg && slotCfg.variantIdx === 1) ? 10 : 8;
else if (a === '🔔') mult = 5;
else if (a === '🍒') mult = 3.5;
} else if ((a === b && a !== '💀') || (b === c && b !== '💀') || (a === c && a !== '💀')) {
mult = 1.8;
}
const st = document.getElementById('slot-status');
if (mult > 0) {
const payout = this.recordWinPayout(this.slots.bet, mult);
if (mult >= 8) this.sfx.jackpot(); else this.sfx.win();
st.textContent = `WYGRANA! +$${payout.toLocaleString()} (${mult}x)`;
this.advanceChallenge('slots_win_2', 1);
if (payout - this.slots.bet >= 400) this.advanceChallenge('big_payout', 1);
} else {
this.sfx.lose();
st.textContent = 'BRAK UKŁADU — SPRÓBUJ PONOWNIE';
}
this.updateHUD();
if (this.checkBankruptcy) this.checkBankruptcy();
}, 480);
},
openDiceModal() {
this.sfx.chip();
this.dice.bet = 0;
this.syncBetInputUI('dice');
this.openModal('modal-dice');
},
rollCyberDice(choice) {
if (this.dice.rolling || !this.validateGameWager('dice')) return;
this.cash -= this.dice.bet;
this.dice.rolling = true;
this.updateHUD();
const b1 = document.getElementById('dice-box-1');
const b2 = document.getElementById('dice-box-2');
b1.classList.add('dice-rolling');
b2.classList.add('dice-rolling');
const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const d1 = 1 + Math.floor(Math.random() * 6);
const d2 = 1 + Math.floor(Math.random() * 6);
const sum = d1 + d2;
const diceSlot = this.activeCasinoSlots.find(s => s.type === 'dice');
const sevenMult = (diceSlot && diceSlot.variantIdx === 1) ? 5.0 : 4.5;
setTimeout(() => {
b1.classList.remove('dice-rolling');
b2.classList.remove('dice-rolling');
b1.textContent = faces[d1 - 1];
b2.textContent = faces[d2 - 1];
document.getElementById('dice-sum-badge').textContent = `SUMA KOŚCI: ${sum}`;
this.dice.rolling = false;
let mult = 0;
if (choice === 'UNDER' && sum < 7) mult = 2.2;
else if (choice === 'SEVEN' && sum === 7) mult = sevenMult;
else if (choice === 'OVER' && sum > 7) mult = 2.2;
const st = document.getElementById('dice-status');
if (mult > 0) {
const payout = this.recordWinPayout(this.dice.bet, mult);
this.sfx.win();
st.textContent = `TRAFIONE (${sum})! WYGRANA +$${payout.toLocaleString()}`;
this.advanceChallenge('dice_win_2', 1);
if (payout - this.dice.bet >= 400) this.advanceChallenge('big_payout', 1);
} else {
this.sfx.lose();
st.textContent = `WYPADŁO ${sum} — PRZEGRANA -$${this.dice.bet}`;
}
this.updateHUD();
if (this.checkBankruptcy) this.checkBankruptcy();
}, 420);
},
openCrashModal() {
this.sfx.chip();
this.crash.bet = 0;
this.crash.active = false;
this.crash.crashed = false;
this.crash.cashedOut = false;
this.crash.mult = 1.00;
this.syncBetInputUI('crash');
const crashSlot = this.activeCasinoSlots.find(s => s.type === 'crash');
const subEl = document.getElementById('crash-variant-sub');
if (subEl && crashSlot) subEl.textContent = `${crashSlot.variantText} • Minimalny zakład: $${this.getMinBet()}`;
this.updateCrashUI();
this.renderCrashCanvas();
this.openModal('modal-crash');
},
launchCrashRocket() {
if (this.crash.active || !this.validateGameWager('crash')) return;
this.cash -= this.crash.bet;
this.crash.active = true;
this.crash.crashed = false;
this.crash.cashedOut = false;
this.crash.mult = 1.00;
if (Math.random() < 0.14) {
this.crash.crashPoint = 1.02 + Math.random() * 0.22;
} else {
this.crash.crashPoint = Math.max(1.12, Math.min(50, +(0.96 / (1 - Math.random() * 0.96)).toFixed(2)));
}
this.sfx.playTone(180, 'sawtooth', 0.25, 0.08, 420);
this.updateHUD();
this.updateCrashUI();
},
cashoutCrashRocket() {
if (!this.crash.active || this.crash.crashed || this.crash.cashedOut) return;
this.crash.cashedOut = true;
this.crash.active = false;
const crashSlot = this.activeCasinoSlots.find(s => s.type === 'crash');
const varBoost = (crashSlot && crashSlot.variantIdx === 2) ? 1.15 : 1.0;
const payout = this.recordWinPayout(this.crash.bet, this.crash.mult * varBoost);
this.sfx.jackpot();
this.showToast(`🚀 KATAPULTA PRZY ${this.crash.mult.toFixed(2)}x! +$${payout.toLocaleString()}`, 'emerald');
if (payout - this.crash.bet >= 400) this.advanceChallenge('big_payout', 1);
this.updateHUD();
this.updateCrashUI();
this.renderCrashCanvas();
},
updateCrashGame(dt) {
if (!this.crash.active) return;
const growthRate = (0.36 + Math.pow(this.crash.mult - 0.99, 0.72) * 0.48) * (this.crash.speed || 1.0);
this.crash.mult += growthRate * dt;
if (this.crash.mult >= this.crash.crashPoint) {
this.crash.mult = this.crash.crashPoint;
this.crash.active = false;
this.crash.crashed = true;
this.sfx.lose();
this.sfx.blood();
if (this.checkBankruptcy) this.checkBankruptcy();
}
this.updateCrashUI();
this.renderCrashCanvas();
},
updateCrashUI() {
const multEl = document.getElementById('crash-mult-display');
const payEl = document.getElementById('crash-live-payout');
const launchBtn = document.getElementById('crash-launch-btn');
const cashBtn = document.getElementById('crash-cashout-btn');
if (!multEl || !payEl) return;
if (this.crash.crashed) {
multEl.textContent = `💥 CRASH @ ${this.crash.mult.toFixed(2)}x`;
multEl.className = 'text-3xl sm:text-5xl font-extrabold text-red-500 font-display drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]';
payEl.textContent = `RAKIETA EKSPLODOWAŁA (-$${this.crash.bet})`;
payEl.className = 'text-xs sm:text-sm font-extrabold text-red-400 mt-1';
} else if (this.crash.cashedOut) {
multEl.textContent = `✓ ${this.crash.mult.toFixed(2)}x`;
multEl.className = 'text-4xl sm:text-6xl font-extrabold text-emerald-400 font-display';
payEl.textContent = `WYPŁACONO BEZPIECZNIE: +$${Math.round(this.crash.bet * this.crash.mult).toLocaleString()}`;
payEl.className = 'text-xs sm:text-sm font-extrabold text-emerald-300 mt-1';
} else if (this.crash.active) {
multEl.textContent = `${this.crash.mult.toFixed(2)}x`;
multEl.className = 'text-4xl sm:text-6xl font-extrabold text-fuchsia-300 font-display drop-shadow-[0_0_20px_rgba(217,70,239,0.85)]';
payEl.textContent = `DO WYPŁATY TERAZ: $${Math.round(this.crash.bet * this.crash.mult).toLocaleString()}`;
payEl.className = 'text-xs sm:text-sm font-extrabold text-emerald-400 mt-1';
} else {
multEl.textContent = '1.00x';
multEl.className = 'text-4xl sm:text-6xl font-extrabold text-white font-display';
payEl.textContent = `USTAW STAWKĘ (MIN. $${this.getMinBet()}) I WYSTRZEL`;
payEl.className = 'text-xs sm:text-sm font-extrabold text-zinc-400 mt-1';
}
if (launchBtn) launchBtn.disabled = this.crash.active;
if (cashBtn) cashBtn.disabled = !this.crash.active;
},
renderCrashCanvas() {
const c = document.getElementById('crashCanvas');
if (!c) return;
const ctx = c.getContext('2d');
const w = c.width, h = c.height;
ctx.clearRect(0, 0, w, h);
ctx.strokeStyle = 'rgba(217, 70, 239, 0.12)';
ctx.lineWidth = 1;
for (let x = 40; x < w; x += 65) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
for (let y = 35; y < h; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
ctx.fillStyle = 'rgba(248, 250, 252, 0.55)';
for (const st of this.crash.stars) {
if (this.crash.active) {
st.x -= 45 * 0.016;
st.y += 22 * 0.016;
if (st.x < 0) st.x = w;
if (st.y > h) st.y = 0;
}
ctx.fillRect(st.x, st.y, st.s, st.s);
}
const progress = Math.min(1, Math.log10(Math.max(1, this.crash.mult)) / 1.15);
const startX = 42, startY = h - 28;
const rx = startX + progress * (w - 110);
const ry = startY - Math.pow(progress, 1.35) * (h - 68);
ctx.beginPath();
ctx.moveTo(startX, startY);
ctx.quadraticCurveTo(startX + (rx - startX) * 0.55, startY, rx, ry);
ctx.strokeStyle = this.crash.crashed ? '#ef4444' : '#e879f9';
ctx.lineWidth = 4;
ctx.stroke();
ctx.save();
ctx.translate(rx, ry);
if (this.crash.crashed) {
ctx.fillStyle = '#ef4444';
ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
ctx.fillStyle = '#fbbf24';
ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
} else {
ctx.rotate(-0.55 - progress * 0.35);
if (this.crash.active) {
ctx.fillStyle = '#f59e0b';
ctx.beginPath();
ctx.moveTo(-14, -4);
ctx.lineTo(-26 - Math.random() * 10, 0);
ctx.lineTo(-14, 4);
ctx.fill();
}
this.drawRoundedRect(ctx, -12, -6, 24, 12, 5);
ctx.fillStyle = '#f8fafc';
ctx.fill();
ctx.strokeStyle = '#d946ef';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = '#38bdf8';
ctx.beginPath(); ctx.arc(4, 0, 3, 0, Math.PI * 2); ctx.fill();
}
ctx.restore();
},
openMinesModal() {
this.sfx.chip();
this.mines.bet = 0;
this.mines.active = false;
this.mines.revealedCount = 0;
this.mines.mult = 1.00;
this.syncBetInputUI('mines');
const minesSlot = this.activeCasinoSlots.find(s => s.type === 'mines');
const subEl = document.getElementById('mines-variant-sub');
if (subEl && minesSlot) {
subEl.textContent = `${minesSlot.variantText} (${this.mines.mineCount}💣 / ${16 - this.mines.mineCount}💎) • Min. zakład: $${this.getMinBet()}`;
}
this.initEmptyMinesGrid();
this.renderMinesUI();
this.openModal('modal-mines');
},
initEmptyMinesGrid() {
this.mines.grid = Array.from({ length: 16 }, () => ({ isMine: false, revealed: false }));
},
startCyberMines() {
if (this.mines.active || !this.validateGameWager('mines')) return;
this.cash -= this.mines.bet;
this.mines.active = true;
this.mines.revealedCount = 0;
this.mines.mult = 1.00;
this.initEmptyMinesGrid();
let placed = 0;
while (placed < this.mines.mineCount) {
const idx = Math.floor(Math.random() * 16);
if (!this.mines.grid[idx].isMine) {
this.mines.grid[idx].isMine = true;
placed++;
}
}
this.sfx.chip();
document.getElementById('mines-status').textContent = 'KLIKAJ KAFELKI, ABY SZUKAĆ DIAMENTÓW 💎!';
this.updateHUD();
this.renderMinesUI();
},
clickMineTile(idx) {
if (!this.mines.active) return;
const cell = this.mines.grid[idx];
if (!cell || cell.revealed) return;
cell.revealed = true;
if (cell.isMine) {
this.mines.active = false;
this.mines.grid.forEach(c => { if (c.isMine) c.revealed = true; });
this.sfx.lose();
this.sfx.blood();
document.getElementById('mines-status').textContent = `💥 EKSPLOZJA MINY! PRZEGRANA -$${this.mines.bet}`;
this.renderMinesUI();
if (this.checkBankruptcy) this.checkBankruptcy();
} else {
this.mines.revealedCount++;
const stepFactor = 1.18 + (this.mines.mineCount * 0.05);
this.mines.mult = +(Math.pow(stepFactor, this.mines.revealedCount)).toFixed(2);
this.sfx.win();
document.getElementById('mines-status').textContent = `💎 CZYSTO! MNOŻNIK: ${this.mines.mult.toFixed(2)}x — WYPŁAĆ LUB RYZYKUJ DALEJ!`;
this.renderMinesUI();
if (this.mines.revealedCount >= 16 - this.mines.mineCount) this.cashoutCyberMines();
}
},
cashoutCyberMines() {
if (!this.mines.active || this.mines.revealedCount <= 0) return;
this.mines.active = false;
const payout = this.recordWinPayout(this.mines.bet, this.mines.mult);
this.sfx.jackpot();
document.getElementById('mines-status').textContent = `💰 WYPŁACONO ŁUP: +$${payout.toLocaleString()} (${this.mines.mult.toFixed(2)}x)!`;
this.showToast(`💎 Saper: Wypłacono +$${payout.toLocaleString()}!`, 'emerald');
if (payout - this.mines.bet >= 400) this.advanceChallenge('big_payout', 1);
this.updateHUD();
this.renderMinesUI();
},
renderMinesUI() {
this.syncBetInputUI('mines');
document.getElementById('mines-mult-label').textContent = `${this.mines.mult.toFixed(2)}x`;
const livePay = this.mines.active ? Math.round(this.mines.bet * this.mines.mult) : 0;
document.getElementById('mines-payout-label').textContent = `$${livePay.toLocaleString()}`;
document.getElementById('mines-start-btn').disabled = this.mines.active;
document.getElementById('mines-cashout-btn').disabled = !(this.mines.active && this.mines.revealedCount > 0);
const gridEl = document.getElementById('mines-grid');
if (!gridEl) return;
gridEl.innerHTML = '';
this.mines.grid.forEach((cell, idx) => {
const btn = document.createElement('button');
if (!cell.revealed) {
btn.className = 'btn-gritty h-14 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 rounded-xl flex items-center justify-center text-lg font-extrabold text-zinc-400';
btn.textContent = '?';
btn.disabled = !this.mines.active;
btn.onclick = () => this.clickMineTile(idx);
} else if (cell.isMine) {
btn.className = 'h-14 bg-red-950 border-2 border-red-500 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(239,68,68,0.6)]';
btn.textContent = '💣';
} else {
btn.className = 'h-14 bg-emerald-950 border-2 border-lime-400 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(163,230,53,0.4)]';
btn.textContent = '💎';
}
gridEl.appendChild(btn);
});
},
openAtmModal() {
this.sfx.tick();
this.refreshAtmModalUI();
this.openModal('modal-atm');
},
refreshAtmModalUI() {
const baseLoan = Math.round((300 + (this.day - 1) * 75) * (this.currentModifier.bloodBonus || 1.0));
const timeCost = this.currentModifier.bloodCost || 60;
const badge = document.getElementById('atm-usage-badge');
const costLbl = document.getElementById('atm-cost-label');
const loanBtn = document.getElementById('btn-blood-loan');
const pawnBtn = document.getElementById('btn-pawn-token');
if (costLbl) costLbl.textContent = this.t('atm_cost_dyn', { cost: timeCost });
if (this.bloodPumpedThisNight) {
if (badge) badge.textContent = this.t('atm_badge_used');
if (loanBtn) {
loanBtn.disabled = true;
loanBtn.textContent = this.t('atm_btn_depleted');
}
} else {
if (badge) badge.textContent = this.t('atm_badge_avail');
if (loanBtn) {
loanBtn.disabled = false;
loanBtn.textContent = this.t('atm_btn_pump', { amt: baseLoan });
}
}
if (pawnBtn) pawnBtn.disabled = this.tokens <= 0;
},
takeBloodLoan() {
if (this.bloodPumpedThisNight) return;
const timeCost = this.currentModifier.bloodCost || 60;
if (this.timeLeft <= timeCost + 5) {
this.sfx.lose();
this.showToast('Za mało czasu na zegarze na ekstrakcję krwi!', 'red');
return;
}
const baseLoan = Math.round((300 + (this.day - 1) * 75) * (this.currentModifier.bloodBonus || 1.0));
this.bloodPumpedThisNight = true;
this.timeLeft -= timeCost;
if (this.rumble) this.rumble(0.8, 1.0, 380);
this.cash += baseLoan;
this.sfx.blood();
this.showToast(`🩸 Oddano krew! +$${baseLoan} (-${timeCost}s)`, 'red');
this.refreshAtmModalUI();
this.updateHUD();
},
pawnTokenForCash() {
if (this.tokens <= 0) return;
this.tokens -= 1;
this.cash += 350;
this.sfx.chip();
this.showToast('🪙 Sprzedano 1 Żeton za +$350!', 'amber');
this.refreshAtmModalUI();
this.updateHUD();
},
recordWinPayout(baseBetOrWin, multiplier = 1.0) {
const relicBonus = this.relics.has('golden_cufflinks') ? 1.2 : 1.0;
const modBonus = this.currentModifier.payoutMult || 1.0;
const total = Math.round(baseBetOrWin * multiplier * relicBonus * modBonus);
this.cash += total;
if (this.rumble) this.rumble(0.45, 0.75, 220);
return total;
},
advanceChallenge(id, amount = 1) {
if (!this.currentChallenge || this.currentChallenge.completed || this.currentChallenge.id !== id) return;
this.currentChallenge.progress = Math.min(this.currentChallenge.target, this.currentChallenge.progress + amount);
if (this.currentChallenge.progress >= this.currentChallenge.target) {
this.currentChallenge.completed = true;
this.tokens += this.currentChallenge.reward;
this.sfx.jackpot();
this.showToast(`★ KONTRAKT UKOŃCZONY! +${this.currentChallenge.reward} 🪙`, 'emerald');
}
}
};
Object.assign(VelvetPitGame.prototype, VelvetMinigames);