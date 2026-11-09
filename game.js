class VelvetPitGame {
constructor() {
this.canvas = document.getElementById('gameCanvas');
this.ctx = this.canvas.getContext('2d');
this.sfx = new SoundEngine();
this.lang = 'pl';
this.settings = {
lowEndMode: false,
glows: true,
weather: true,
crt: true,
coach: true,
showFps: false
};
this.fpsFrames = 0;
this.fpsLastTime = performance.now();
this.currentFps = 60;
this.day = 1;
this.phase = 'PREP'; // 'PREP' (Morning in Safehouse) or 'SHIFT' (6-Min Quota Rush)
this.cash = 500;
this.quota = 1000;
this.tokens = 1;
this.relics = new Set();
this.bloodPumpedThisNight = false;
this.maxTime = 360;
this.timeLeft = 360;
this.clockMultiplier = 1;
this.zone = 0;
this.player = {
x: 355,
y: 235,
vx: 0,
vy: 0,
r: 16,
speed: 245,
accel: 16,
friction: 11,
facing: 0,
targetFacing: 0,
walkCycle: 0,
moveAmount: 0,
stepTimer: 0,
trail: []
};
this.camera = {
x: 355,
y: 235,
vx: 0,
vy: 0,
zoom: 1.82
};
this.cachedZoneFloors = {};
this.isLoadingScreen = false;
this.renderGameWorld = false;
this.animTime = 0;
this.footsteps = [];
this.rainSplashes = [];
this.ambientDust = Array.from({ length: 28 }, () => ({
x: 100 + Math.random() * 800,
y: 100 + Math.random() * 400,
r: 1 + Math.random() * 1.8,
vx: (Math.random() - 0.5) * 14,
vy: (Math.random() - 0.5) * 14,
alpha: 0.15 + Math.random() * 0.35
}));
this.casinoNpcs = [
{ role: 'dealer', x: 275, y: 122, facing: Math.PI / 2, coat: '#450a0a', trim: '#fbbf24', hair: '#e2e8f0', name: 'KRUPIER VIP', barks: ['Postaw zakłady...', 'Kasyno zawsze wygrywa.', 'Dobierasz czy pas?', '21!'] },
{ role: 'dealer', x: 730, y: 122, facing: Math.PI / 2, coat: '#450a0a', trim: '#ef4444', hair: '#1e293b', name: 'KRUPIER RULETKI', barks: ['Koło się kręci!', 'Czerwone czy czarne?', 'Brak zakładów!'] },
{ role: 'dealer', x: 502, y: 252, facing: Math.PI / 2, coat: '#083344', trim: '#22d3ee', hair: '#cbd5e1', name: 'KRUPIER KOŚCI', barks: ['Rzuć kośćmi!', 'Szczęśliwa siódemka!', 'Poniżej czy powyżej?'] },
{ role: 'guard', x: 96, y: 185, facing: 0.3, coat: '#09090b', trim: '#dc2626', hair: '#09090b', visor: '#ef4444', name: 'OCHRONA', barks: ['Bez broni.', 'Syndykat patrzy.', 'Pilnuj zegara.'] },
{ role: 'guard', x: 842, y: 425, facing: Math.PI, coat: '#09090b', trim: '#dc2626', hair: '#09090b', visor: '#ef4444', name: 'EGZEKUTOR', barks: ['Masz dług do spłaty.', 'Bankomat bierze krew.', 'Nie ociągaj się.'] },
{ role: 'gambler', x: 210, y: 256, facing: -Math.PI / 2, coat: '#1e293b', trim: '#38bdf8', hair: '#fbbf24', barks: ['+$150!', 'Fura... cholera!', 'Jeszcze jedna karta!', 'Mam 20!'] },
{ role: 'gambler', x: 340, y: 256, facing: -Math.PI / 2, coat: '#31102f', trim: '#f472b6', hair: '#f8fafc', barks: ['Krupier znowu ma 21...', '+$300!', 'Podwajam!', 'Ostatni żeton...'] },
{ role: 'gambler', x: 665, y: 256, facing: -Math.PI / 2, coat: '#14261c', trim: '#34d399', hair: '#a1a1aa', barks: ['Wszystko na czarne!', 'Znowu zero?!', '+$500!', 'Prawie trafiłem!'] },
{ role: 'gambler', x: 800, y: 256, facing: -Math.PI / 2, coat: '#27173a', trim: '#a78bfa', hair: '#fde047', barks: ['Tylko czerwone!', '-$250...', 'Mój szczęśliwy numer!'] },
{ role: 'gambler', x: 405, y: 312, facing: 0, coat: '#1e1b4b', trim: '#60a5fa', hair: '#94a3b8', barks: ['Siódemka! +$450!', 'Dawaj powyżej 7!', 'Kości są gorące!'] },
{ role: 'gambler', x: 218, y: 482, facing: -Math.PI / 2, coat: '#3f2305', trim: '#f59e0b', hair: '#78350f', barks: ['Prawie 777!', 'Jeszcze jeden spin...', '🍒🍒🍒 +$175!', 'Automaty mnie zjedzą...'] },
{ role: 'gambler', x: 318, y: 482, facing: -Math.PI / 2, coat: '#1f2937', trim: '#fb7185', hair: '#e5e7eb', barks: ['💀 Znowu czaszki...', '💎💎💎 JACKPOT!', 'Oddałem już krew...'] }
];
this.casinoWaiter = {
x: 380,
y: 200,
facing: 0,
wpIdx: 0,
waypoints: [
{ x: 390, y: 210 },
{ x: 590, y: 210 },
{ x: 595, y: 375 },
{ x: 390, y: 375 }
]
};
this.npcBubbles = [];
this.npcBubbleTimer = 1.2;
this.lastHudCash = this.cash;
this.keys = {};
this.joy = { x: 0, y: 0, active: false, touchId: null };
this.isMobile = false;
this.mainMenuOpen = true;
this.introPlaying = true;
this.activeModal = null;
this.hoveredInteractable = null;
this.menuCashCanvas = document.getElementById('menuCashCanvas');
this.menuCashCtx = this.menuCashCanvas ? this.menuCashCanvas.getContext('2d') : null;
this.menuCashBills = Array.from({ length: 34 }, (_, idx) => this.spawnMenuCashBill(idx, true));
this.rain = Array.from({ length: 65 }, () => ({
x: Math.random() * 1000,
y: Math.random() * 600,
len: 10 + Math.random() * 12,
speed: 350 + Math.random() * 200
}));
this.bj = {
deck: [],
playerHand: [],
dealerHand: [],
bet: 0,
inProgress: false,
peeked: false
};
this.roul = {
chip: 50,
bets: {},
spinning: false,
wheelAngle: 0,
ballAngle: 0,
ballRadius: 82,
lastNumber: null
};
this.slots = {
bet: 0,
spinning: false,
symbols: ['🍒', '🔔', '💎', '7️⃣', '💀']
};
this.dice = {
bet: 0,
rolling: false,
d1: 3,
d2: 4
};
this.crash = {
bet: 0,
active: false,
crashed: false,
cashedOut: false,
mult: 1.00,
crashPoint: 1.00,
speed: 1.0,
stars: Array.from({ length: 28 }, () => ({
x: Math.random() * 560,
y: Math.random() * 224,
s: 1 + Math.random() * 2
}))
};
this.mines = {
bet: 0,
active: false,
grid: [],
revealedCount: 0,
mineCount: 3,
mult: 1.00
};
this.activeCasinoSlots = [];
this.currentModifier = NIGHTLY_MODIFIERS[0];
this.currentChallenge = null;
this.initZones();
this.initRouletteGrid();
this.assignNightlyModifier();
this.assignDailyChallenge();
this.randomizeNightlyCasinoFloor();
this.bindInputs();
this.bindGlobalUISounds();
this.updateMobileState();
this.resize();
window.addEventListener('resize', () => this.resize());
window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 80));
if (window.visualViewport) window.visualViewport.addEventListener('resize', () => this.resize());
if (window.matchMedia) {
const mq = window.matchMedia('(pointer: coarse)');
if (mq.addEventListener) mq.addEventListener('change', () => this.updateMobileState());
}
this.applyTranslations();
this.syncSettingsUI();
this.updateHUD();
this.enforceGameFocus();
this.playIntroSequence();
this.lastFrameTime = performance.now();
requestAnimationFrame((ts) => this.loop(ts));
}
randomizeNightlyCasinoFloor() {
const allGames = [
{
type: 'crash',
icon: '🚀',
title: '🚀 RAKIETA // CRASH',
color: '#e879f9',
bg: '#4a044e',
variants: ['WARIANT: ORBITA (DO 50x)', 'WARIANT: HIPER-NAPĘD (SZYBKI LOT)', 'WARIANT: KRWAWE PALIWO (+15% MNOŻNIKA)'],
open: () => this.openCrashModal()
},
{
type: 'mines',
icon: '💣',
title: '💣 SAPER SYNDYKATU',
color: '#a3e635',
bg: '#1a2e05',
variants: ['WARIANT: 3 MINY (BEZPIECZNY)', 'WARIANT: 4 MINY (WYSOKIE WYPŁATY)', 'WARIANT: SKARBIEC (5 MIN / 2.5x SZYBCIEJ)'],
open: () => this.openMinesModal()
},
{
type: 'bj',
icon: '♠',
title: '♠ VIP BLACKJACK',
color: '#6ee7b7',
bg: '#022c22',
variants: ['WARIANT: KLASYCZNY VIP', 'WARIANT: KRUPIER PASUJE NA 16+', 'WARIANT: ZŁOTY BLACKJACK (2.7x)'],
open: () => this.openBlackjackModal()
},
{
type: 'roul',
icon: '🎡',
title: '🎡 DIABELSKA RULETKA',
color: '#fca5a5',
bg: '#450a0a',
variants: ['WARIANT: EUROPEJSKI (0-36)', 'WARIANT: GORĄCE NUMERY (40x)', 'WARIANT: KRWAWE KOŁO'],
open: () => this.openRouletteModal()
},
{
type: 'dice',
icon: '🎲',
title: '🎲 CYBER KOŚCI',
color: '#67e8f9',
bg: '#083344',
variants: ['WARIANT: PONIŻEJ / POWYŻEJ 7', 'WARIANT: ZŁOTA SIÓDEMKA (5.0x)', 'WARIANT: SZYBKIE KOŚCI'],
open: () => this.openDiceModal()
},
{
type: 'slots',
icon: '🎰',
title: '🎰 AUTOMATY "TĘTNICA"',
color: '#fde68a',
bg: '#451a03',
variants: ['WARIANT: TĘTNICA TURBO', 'WARIANT: DIAMENTOWA GORĄCZKA (10x)', 'WARIANT: JACKPOT 777 (18x)'],
open: () => this.openSlotsModal()
}
];
const shuffled = [...allGames];
for (let i = shuffled.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}
let selected = shuffled.slice(0, 4);
if (!selected.some(g => g.type === 'crash')) {
selected[2] = allGames.find(g => g.type === 'crash');
}
const tableBoxes = [
{ x: 185, y: 135, w: 180, h: 110 },
{ x: 635, y: 135, w: 190, h: 110 },
{ x: 425, y: 265, w: 155, h: 95 },
{ x: 195, y: 385, w: 165, h: 85 }
];
this.activeCasinoSlots = selected.map((game, idx) => {
const variantIdx = (this.day + idx + Math.floor(Math.random() * game.variants.length)) % game.variants.length;
return {
...game,
variantIdx,
variantText: game.variants[variantIdx],
box: tableBoxes[idx]
};
});
const minesSlot = this.activeCasinoSlots.find(s => s.type === 'mines');
this.mines.mineCount = minesSlot ? (3 + (minesSlot.variantIdx % 3)) : 3;
const crashSlot = this.activeCasinoSlots.find(s => s.type === 'crash');
this.crash.speed = crashSlot && crashSlot.variantIdx === 1 ? 1.45 : 1.0;
if (this.zones && this.zones[2]) {
const streetDoor = this.zones[2].interactables[0];
const bloodAtm = this.zones[2].interactables[this.zones[2].interactables.length - 1];
this.zones[2].interactables = [
streetDoor,
...this.activeCasinoSlots.map(slot => ({
box: slot.box,
edgeDist: 54,
getPrompt: () => `${slot.title} — ${slot.variantText} (MIN: $${this.getMinBet()})`,
action: () => slot.open()
})),
bloodAtm
];
}
}
enforceGameFocus() {
const focusGame = () => {
try {
window.focus();
if (this.canvas && document.activeElement !== this.canvas && !this.activeModal) {
this.canvas.focus({ preventScroll: true });
}
this.sfx.init();
} catch (e) {}
};
focusGame();
setTimeout(focusGame, 80);
setTimeout(focusGame, 350);
window.addEventListener('load', focusGame);
}
transitionToZone(targetZone, targetX, targetY) {
if (this.isTransitioningZone) return;
this.isTransitioningZone = true;
this.keys = {};
this.player.vx = 0;
this.player.vy = 0;
this.sfx.door();
const curtain = document.getElementById('zone-transition-curtain');
if (curtain) {
curtain.style.opacity = '1';
}
setTimeout(() => {
this.zone = targetZone;
this.player.x = targetX;
this.player.y = targetY;
this.camera.x = targetX;
this.camera.y = targetY;
this.footsteps = [];
this.player.trail = [];
this.syncZoneMusic();
this.updateHUD();
setTimeout(() => {
if (curtain) curtain.style.opacity = '0';
this.isTransitioningZone = false;
}, 90);
}, 220);
}
checkMobileDevice() {
const ua = navigator.userAgent || '';
const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua);
const uaDataMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
const ipadOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const coarseNoHover = !!(window.matchMedia && window.matchMedia('(pointer: coarse) and (hover: none)').matches);
return uaMobile || uaDataMobile || ipadOS || coarseNoHover;
}
updateMobileState() {
this.isMobile = this.checkMobileDevice();
document.body.classList.toggle('is-mobile', this.isMobile);
const ctrl = document.getElementById('mobile-controls');
if (ctrl) {
const showCtrl = this.isMobile && !this.mainMenuOpen && !this.activeModal && !this.isLoadingScreen;
ctrl.classList.toggle('hidden', !showCtrl);
}
if (!this.isMobile && this.joy && this.joy.active) {
this.resetJoystick();
}
}
resetJoystick() {
if (!this.joy) return;
this.joy.x = 0;
this.joy.y = 0;
this.joy.active = false;
this.joy.touchId = null;
const knob = document.getElementById('joystick-knob');
if (knob) {
knob.style.transform = 'translate3d(0px, 0px, 0px)';
knob.classList.remove('stick-active');
}
}
bindInputs() {
window.addEventListener('keydown', (e) => {
const k = e.key.toLowerCase();
this.keys[k] = true;
if (this.introPlaying) {
e.preventDefault();
return;
}
if (this.mainMenuOpen && !this.activeModal) {
if (k === 'enter' || k === 'e') {
e.preventDefault();
this.closeMainMenu();
}
return;
}
if ((k === 'e' || k === ' ') && !this.activeModal && !this.mainMenuOpen) {
e.preventDefault();
this.triggerContextInteraction();
} else if (k === 'escape') {
e.preventDefault();
if (this.activeModal) {
this.sfx.uiBack();
this.closeModals();
} else if (!this.mainMenuOpen) {
this.openPauseModal();
}
}
});
window.addEventListener('keyup', (e) => {
this.keys[e.key.toLowerCase()] = false;
});
const zone = document.getElementById('joystick-zone');
const base = document.getElementById('joystick-base');
const knob = document.getElementById('joystick-knob');
if (zone && base && knob) {
const maxRadius = 38;
const updateStickFromPoint = (clientX, clientY) => {
const rect = base.getBoundingClientRect();
const cx = rect.left + rect.width / 2;
const cy = rect.top + rect.height / 2;
let dx = clientX - cx;
let dy = clientY - cy;
const dist = Math.hypot(dx, dy);
if (dist > maxRadius) {
dx = (dx / dist) * maxRadius;
dy = (dy / dist) * maxRadius;
}
knob.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0px)`;
const normX = dx / maxRadius;
const normY = dy / maxRadius;
const mag = Math.hypot(normX, normY);
if (mag < 0.12) {
this.joy.x = 0;
this.joy.y = 0;
} else {
this.joy.x = normX;
this.joy.y = normY;
}
};
zone.addEventListener('touchstart', (e) => {
e.preventDefault();
if (this.joy.active) return;
const t = e.changedTouches[0];
this.joy.active = true;
this.joy.touchId = t.identifier;
knob.classList.add('stick-active');
updateStickFromPoint(t.clientX, t.clientY);
}, { passive: false });
zone.addEventListener('touchmove', (e) => {
if (!this.joy.active) return;
for (let i = 0; i < e.changedTouches.length; i++) {
const t = e.changedTouches[i];
if (t.identifier === this.joy.touchId) {
e.preventDefault();
updateStickFromPoint(t.clientX, t.clientY);
break;
}
}
}, { passive: false });
const endTouch = (e) => {
if (!this.joy.active) return;
for (let i = 0; i < e.changedTouches.length; i++) {
if (e.changedTouches[i].identifier === this.joy.touchId) {
this.resetJoystick();
break;
}
}
};
zone.addEventListener('touchend', endTouch, { passive: false });
zone.addEventListener('touchcancel', endTouch, { passive: false });
let mouseDragging = false;
zone.addEventListener('mousedown', (e) => {
e.preventDefault();
mouseDragging = true;
this.joy.active = true;
knob.classList.add('stick-active');
updateStickFromPoint(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => {
if (!mouseDragging) return;
updateStickFromPoint(e.clientX, e.clientY);
});
window.addEventListener('mouseup', () => {
if (!mouseDragging) return;
mouseDragging = false;
this.resetJoystick();
});
}
}
resize() {
this.updateMobileState();
const rect = this.canvas ? this.canvas.getBoundingClientRect() : null;
const w = Math.max(1, Math.round((rect && rect.width) ? rect.width : window.innerWidth));
const h = Math.max(1, Math.round((rect && rect.height) ? rect.height : window.innerHeight));
this.canvas.width = w;
this.canvas.height = h;
if (this.menuCashCanvas) {
this.menuCashCanvas.width = w;
this.menuCashCanvas.height = h;
}
}
assignNightlyModifier() {
if (this.day === 1) {
this.currentModifier = NIGHTLY_MODIFIERS[0];
} else {
const idx = (this.day - 1) % NIGHTLY_MODIFIERS.length;
this.currentModifier = NIGHTLY_MODIFIERS[idx];
}
}
assignDailyChallenge() {
const tpl = DAILY_CHALLENGES[(this.day - 1) % DAILY_CHALLENGES.length];
this.currentChallenge = {
...tpl,
progress: 0,
completed: false
};
}
initZones() {
this.zones = [
{
getName: () => this.t('zone_0'),
bounds: { x: 120, y: 110, w: 760, h: 410 },
obstacles: [
{ x: 185, y: 140, w: 120, h: 155 },
{ x: 640, y: 135, w: 170, h: 90 },
{ x: 185, y: 375, w: 165, h: 90 }
],
interactables: [
{
box: { x: 185, y: 140, w: 120, h: 155 },
edgeDist: 52,
getPrompt: () => {
if (this.phase === 'PREP') return this.t('prompt_bed_prep');
return this.cash >= this.quota ? this.t('prompt_bed_sleep') : this.t('prompt_bed_locked');
},
action: () => {
if (this.phase === 'PREP') {
this.exitSafehouseToStreet();
} else if (this.cash >= this.quota) {
this.completeDaySummary();
} else {
this.sfx.lose();
this.showToast('Wymagana Kwota nie została jeszcze zebrana w Kasynie!', 'red');
}
}
},
{
box: { x: 640, y: 135, w: 170, h: 90 },
edgeDist: 52,
getPrompt: () => this.t('prompt_terminal'),
action: () => this.openTerminalModal()
},
{
box: { x: 185, y: 375, w: 165, h: 90 },
edgeDist: 52,
getPrompt: () => this.t('prompt_relics', { tokens: this.tokens }),
action: () => this.openRelicModal()
},
{
box: { x: 440, y: 482, w: 120, h: 28 },
edgeDist: 48,
getPrompt: () => this.phase === 'PREP' ? this.t('prompt_door_prep') : this.t('prompt_door_exit'),
action: () => this.exitSafehouseToStreet()
}
]
},
{
getName: () => this.t('zone_1'),
bounds: { x: 60, y: 110, w: 880, h: 410 },
obstacles: [
{ x: 310, y: 145, w: 120, h: 65 },
{ x: 560, y: 405, w: 165, h: 70 }
],
interactables: [
{
box: { x: 48, y: 275, w: 20, h: 90 },
edgeDist: 56,
getPrompt: () => this.t('prompt_enter_home'),
action: () => {
this.transitionToZone(0, 485, 455);
}
},
{
box: { x: 935, y: 260, w: 20, h: 120 },
edgeDist: 56,
getPrompt: () => this.t('prompt_enter_casino'),
action: () => {
if (this.phase === 'PREP') {
this.startNightShift();
}
this.transitionToZone(2, 115, 310);
}
}
]
},
{
getName: () => this.t('zone_2'),
bounds: { x: 60, y: 110, w: 880, h: 410 },
obstacles: [
{ x: 185, y: 135, w: 180, h: 110 },
{ x: 635, y: 135, w: 190, h: 110 },
{ x: 425, y: 265, w: 155, h: 95 },
{ x: 195, y: 385, w: 165, h: 85 },
{ x: 655, y: 385, w: 145, h: 80 }
],
interactables: [
{
box: { x: 63, y: 265, w: 16, h: 90 },
edgeDist: 56,
getPrompt: () => this.t('prompt_door_exit'),
action: () => {
this.transitionToZone(1, 910, 320);
}
},
{
box: { x: 185, y: 135, w: 180, h: 110 },
edgeDist: 54,
getPrompt: () => this.t('prompt_Play_bj'),
action: () => this.openBlackjackModal()
},
{
box: { x: 635, y: 135, w: 190, h: 110 },
edgeDist: 54,
getPrompt: () => this.t('prompt_play_roul'),
action: () => this.openRouletteModal()
},
{
box: { x: 425, y: 265, w: 155, h: 95 },
edgeDist: 54,
getPrompt: () => this.t('prompt_play_dice'),
action: () => this.openDiceModal()
},
{
box: { x: 195, y: 385, w: 165, h: 85 },
edgeDist: 54,
getPrompt: () => this.t('prompt_play_slots'),
action: () => this.openSlotsModal()
},
{
box: { x: 655, y: 385, w: 145, h: 80 },
edgeDist: 54,
getPrompt: () => this.bloodPumpedThisNight ? this.t('prompt_atm_used') : this.t('prompt_atm_ready'),
action: () => this.openAtmModal()
}
]
}
];
}
getDistanceToInteractableEdge(item) {
if (item.box) {
const closestX = Math.max(item.box.x, Math.min(this.player.x, item.box.x + item.box.w));
const closestY = Math.max(item.box.y, Math.min(this.player.y, item.box.y + item.box.h));
return Math.hypot(this.player.x - closestX, this.player.y - closestY);
}
return Infinity;
}
getNearestInteractable() {
const z = this.zones[this.zone];
if (!z || !z.interactables) return null;
let best = null;
let bestDist = Infinity;
for (const item of z.interactables) {
const d = this.getDistanceToInteractableEdge(item);
const maxEdgeDist = item.edgeDist || 52;
if (d <= maxEdgeDist && d < bestDist) {
best = item;
bestDist = d;
}
}
return best;
}
triggerContextInteraction() {
if (this.activeModal || this.mainMenuOpen || this.introPlaying) return;
const target = this.getNearestInteractable();
if (target && target.action) {
target.action();
}
}
exitSafehouseToStreet() {
if (this.phase === 'PREP') {
this.startNightShift();
}
this.transitionToZone(1, 95, 320);
}
startNightShift() {
this.phase = 'SHIFT';
const extraRelic = this.relics.has('adrenaline_shot') ? 45 : 0;
const extraMod = this.currentModifier.extraTime || 0;
this.maxTime = Math.max(120, 360 + extraRelic + extraMod);
this.timeLeft = this.maxTime;
this.sfx.alarm();
this.showToast(`NOCNA ZMIANA ROZPOCZĘTA! Zdobądź $${this.quota.toLocaleString()} przed 00:00!`, 'amber');
this.updateHUD();
}
completeDaySummary() {
this.sfx.jackpot();
const surplus = Math.max(0, this.cash - this.quota);
const bonusTokens = 1 + (surplus >= 500 ? 1 : 0);
this.tokens += bonusTokens;
document.getElementById('summary-title').textContent = `${this.t('hud_cycle')} ${this.day} — ${this.t('completed_word')}`;
document.getElementById('summary-details').innerHTML = `
<div class="flex justify-between"><span>Zebrana Gotówka:</span><strong class="text-emerald-400">$${this.cash.toLocaleString()}</strong></div>
<div class="flex justify-between"><span>Wymagana Kwota:</span><strong class="text-amber-400">$${this.quota.toLocaleString()}</strong></div>
<div class="flex justify-between"><span>Nagroda za przetrwanie:</span><strong class="text-amber-300">+${bonusTokens} 🪙</strong></div>
`;
this.openModal('modal-day-complete');
}
advanceToNextDay(ev) {
if (ev) ev.preventDefault();
this.day += 1;
this.phase = 'PREP';
this.zone = 0;
this.bloodPumpedThisNight = false;
const surplusCarry = Math.min(400, Math.floor(Math.max(0, this.cash - this.quota) * 0.25));
const relicFund = this.relics.has('trust_fund') ? 350 : 0;
this.cash = 500 + (this.day - 1) * 150 + surplusCarry + relicFund;
this.quota = Math.round(1000 * Math.pow(1.45, this.day - 1) / 50) * 50;
this.assignNightlyModifier();
this.assignDailyChallenge();
this.randomizeNightlyCasinoFloor();
const extraRelic = this.relics.has('adrenaline_shot') ? 45 : 0;
const extraMod = this.currentModifier.extraTime || 0;
this.maxTime = Math.max(120, 360 + extraRelic + extraMod);
this.timeLeft = this.maxTime;
this.player.x = 355;
this.player.y = 235;
this.player.vx = 0;
this.player.vy = 0;
this.camera.x = 355;
this.camera.y = 235;
this.closeModals(true);
this.syncZoneMusic();
this.updateHUD();
this.sfx.win();
this.showToast(`☀ ${this.t('day_word')} ${this.day} — Min. zakład: $${this.getMinBet()} | Kwota: $${this.quota.toLocaleString()}`, 'emerald');
}
triggerGameOver(reason) {
this.sfx.lose();
document.getElementById('gameover-reason').textContent = reason;
document.getElementById('gameover-stats').innerHTML = `
<div class="flex justify-between"><span>Przetrwane Dni:</span><strong class="text-white">${this.day - 1}</strong></div>
<div class="flex justify-between"><span>Ostatnia Gotówka:</span><strong class="text-red-400">$${this.cash.toLocaleString()} / $${this.quota.toLocaleString()}</strong></div>
`;
this.openModal('modal-gameover');
}
restartRun() {
this.day = 1;
this.phase = 'PREP';
this.zone = 0;
this.cash = 500;
this.quota = 1000;
this.tokens = 1;
this.relics.clear();
this.bloodPumpedThisNight = false;
this.maxTime = 360;
this.timeLeft = 360;
this.player.x = 355;
this.player.y = 235;
this.player.vx = 0;
this.player.vy = 0;
this.camera.x = 355;
this.camera.y = 235;
this.assignNightlyModifier();
this.assignDailyChallenge();
this.randomizeNightlyCasinoFloor();
this.closeModals(true);
this.syncZoneMusic();
this.updateHUD();
this.sfx.door();
}
checkCollision(nx, ny) {
const z = this.zones[this.zone];
const r = this.player.r;
if (
nx - r < z.bounds.x ||
nx + r > z.bounds.x + z.bounds.w ||
ny - r < z.bounds.y ||
ny + r > z.bounds.y + z.bounds.h
) {
return true;
}
for (const ob of z.obstacles) {
const closestX = Math.max(ob.x, Math.min(nx, ob.x + ob.w));
const closestY = Math.max(ob.y, Math.min(ny, ob.y + ob.h));
const dist = Math.hypot(nx - closestX, ny - closestY);
if (dist < r) return true;
}
return false;
}
unstuckPlayer() {
const z = this.zones[this.zone];
const r = this.player.r;
for (const ob of z.obstacles) {
const closestX = Math.max(ob.x, Math.min(this.player.x, ob.x + ob.w));
const closestY = Math.max(ob.y, Math.min(this.player.y, ob.y + ob.h));
const dist = Math.hypot(this.player.x - closestX, this.player.y - closestY);
if (dist < r) {
this.player.x = ob.x + ob.w + r + 8;
}
}
}
lerpAngle(current, target, t) {
let diff = target - current;
while (diff < -Math.PI) diff += Math.PI * 2;
while (diff > Math.PI) diff -= Math.PI * 2;
return current + diff * Math.min(1, t);
}
update(dt) {
this.animTime += dt;
this.unstuckPlayer();
if (this.mainMenuOpen) return;
if (this.activeModal === 'modal-crash' && this.crash.active) {
this.updateCrashGame(dt);
}
const isTimerPausedModal = (
this.activeModal === 'modal-pause' ||
this.activeModal === 'modal-settings' ||
this.activeModal === 'modal-guide' ||
this.activeModal === 'modal-gameover' ||
this.activeModal === 'modal-day-complete'
);
if (this.phase === 'SHIFT' && !isTimerPausedModal) {
const prevSec = Math.floor(this.timeLeft);
this.timeLeft -= dt * this.clockMultiplier;
const curSec = Math.floor(this.timeLeft);
if (curSec <= 30 && curSec < prevSec && curSec > 0) {
this.sfx.alarm();
}
if (this.timeLeft <= 0) {
this.timeLeft = 0;
this.closeModals(true);
this.triggerGameOver('Czas zmiany (06:00) dobiegł końca zanim wróciłeś do łóżka z Kwotą!');
return;
}
this.updateHUD();
}
if (this.activeModal) {
this.player.vx = 0;
this.player.vy = 0;
this.player.moveAmount = 0;
if (this.joy && this.joy.active) this.resetJoystick();
return;
}
let ix = 0;
let iy = 0;
if (this.keys['w'] || this.keys['arrowup']) iy -= 1;
if (this.keys['s'] || this.keys['arrowdown']) iy += 1;
if (this.keys['a'] || this.keys['arrowleft']) ix -= 1;
if (this.keys['d'] || this.keys['arrowright']) ix += 1;
let inputMag = 1;
if (ix !== 0 || iy !== 0) {
const len = Math.hypot(ix, iy);
ix /= len;
iy /= len;
} else if (this.joy && (this.joy.x !== 0 || this.joy.y !== 0)) {
const jLen = Math.hypot(this.joy.x, this.joy.y);
inputMag = Math.min(1, jLen);
ix = this.joy.x / jLen;
iy = this.joy.y / jLen;
}
const speedMult = this.relics.has('loaded_boots') ? 1.35 : 1.0;
const maxSpeed = this.player.speed * speedMult;
if (ix !== 0 || iy !== 0) {
const targetVx = ix * maxSpeed * inputMag;
const targetVy = iy * maxSpeed * inputMag;
const accelRate = Math.min(1, this.player.accel * dt);
this.player.vx += (targetVx - this.player.vx) * accelRate;
this.player.vy += (targetVy - this.player.vy) * accelRate;
this.player.targetFacing = Math.atan2(iy, ix);
} else {
const damping = Math.exp(-this.player.friction * dt);
this.player.vx *= damping;
this.player.vy *= damping;
if (Math.hypot(this.player.vx, this.player.vy) < 4) {
this.player.vx = 0;
this.player.vy = 0;
}
}
this.player.facing = this.lerpAngle(this.player.facing, this.player.targetFacing, 14 * dt);
const curSpeed = Math.hypot(this.player.vx, this.player.vy);
this.player.moveAmount = Math.min(1, curSpeed / maxSpeed);
if (curSpeed > 0.5) {
const nx = this.player.x + this.player.vx * dt;
const ny = this.player.y + this.player.vy * dt;
if (!this.checkCollision(nx, this.player.y)) {
this.player.x = nx;
} else {
this.player.vx *= -0.2;
}
if (!this.checkCollision(this.player.x, ny)) {
this.player.y = ny;
} else {
this.player.vy *= -0.2;
}
this.player.walkCycle += dt * (8 + this.player.moveAmount * 6);
this.player.stepTimer += dt * (0.8 + this.player.moveAmount * 0.5);
if (this.player.stepTimer > 0.25) {
this.player.stepTimer = 0;
this.sfx.step();
if (!this.settings.lowEndMode) {
const side = (this.footsteps.length % 2 === 0 ? 1 : -1) * 5;
const perpX = -Math.sin(this.player.facing) * side;
const perpY = Math.cos(this.player.facing) * side;
this.footsteps.push({
x: this.player.x + perpX,
y: this.player.y + perpY,
r: 3,
alpha: this.zone === 1 ? 0.55 : 0.3,
color: this.zone === 1 ? '#38bdf8' : (this.zone === 2 ? '#f59e0b' : '#a1a1aa')
});
if (this.footsteps.length > 18) this.footsteps.shift();
}
}
if (!this.settings.lowEndMode && Math.random() < 0.45) {
this.player.trail.push({
x: this.player.x,
y: this.player.y,
alpha: this.relics.has('loaded_boots') ? 0.38 : 0.18
});
if (this.player.trail.length > 8) this.player.trail.shift();
}
} else {
this.player.walkCycle += dt * 2;
}
for (let i = this.footsteps.length - 1; i >= 0; i--) {
this.footsteps[i].alpha -= dt * 0.7;
this.footsteps[i].r += dt * 6;
if (this.footsteps[i].alpha <= 0) this.footsteps.splice(i, 1);
}
for (let i = this.player.trail.length - 1; i >= 0; i--) {
this.player.trail[i].alpha -= dt * 1.4;
if (this.player.trail[i].alpha <= 0) this.player.trail.splice(i, 1);
}
if (!this.settings.lowEndMode) {
for (const d of this.ambientDust) {
d.x += d.vx * dt;
d.y += d.vy * dt;
if (d.x < 80) d.x = 920;
if (d.x > 920) d.x = 80;
if (d.y < 90) d.y = 510;
if (d.y > 510) d.y = 90;
}
}
if (this.zone === 2) {
const w = this.casinoWaiter;
const targetWp = w.waypoints[w.wpIdx];
const dx = targetWp.x - w.x;
const dy = targetWp.y - w.y;
const dist = Math.hypot(dx, dy);
if (dist < 6) {
w.wpIdx = (w.wpIdx + 1) % w.waypoints.length;
} else {
const spd = 62;
w.x += (dx / dist) * spd * dt;
w.y += (dy / dist) * spd * dt;
w.facing = this.lerpAngle(w.facing, Math.atan2(dy, dx), 8 * dt);
}
this.npcBubbleTimer -= dt;
if (this.npcBubbleTimer <= 0) {
this.npcBubbleTimer = 2.0 + Math.random() * 2.2;
const npc = this.casinoNpcs[Math.floor(Math.random() * this.casinoNpcs.length)];
if (npc && npc.barks && npc.barks.length > 0) {
const text = npc.barks[Math.floor(Math.random() * npc.barks.length)];
const isWin = text.includes('+');
const isLoss = text.includes('-') || text.includes('💀') || text.includes('Fura');
this.npcBubbles.push({
x: npc.x + (Math.random() - 0.5) * 14,
y: npc.y - 22,
text,
color: isWin ? '#34d399' : (isLoss ? '#f87171' : '#fde68a'),
alpha: 1.0,
life: 2.2
});
if (this.npcBubbles.length > 5) this.npcBubbles.shift();
}
}
for (let i = this.npcBubbles.length - 1; i >= 0; i--) {
const b = this.npcBubbles[i];
b.y -= dt * 11;
b.life -= dt;
b.alpha = Math.min(1, b.life / 0.6);
if (b.life <= 0) this.npcBubbles.splice(i, 1);
}
}
if (this.zone === 1 && this.settings.weather && !this.settings.lowEndMode) {
for (const drop of this.rain) {
drop.y += drop.speed * dt;
drop.x -= 55 * dt;
if (drop.y > 500) {
if (Math.random() < 0.35 && this.rainSplashes.length < 25) {
this.rainSplashes.push({
x: drop.x,
y: 150 + Math.random() * 320,
r: 1,
alpha: 0.65
});
}
drop.y = 110;
drop.x = 60 + Math.random() * 900;
}
}
for (let i = this.rainSplashes.length - 1; i >= 0; i--) {
this.rainSplashes[i].r += dt * 18;
this.rainSplashes[i].alpha -= dt * 1.8;
if (this.rainSplashes[i].alpha <= 0) this.rainSplashes.splice(i, 1);
}
}
this.hoveredInteractable = this.getNearestInteractable();
const promptEl = document.getElementById('interact-prompt');
const promptLabel = document.getElementById('interact-prompt-label');
const mobileActBtn = document.getElementById('mobile-act-btn');
if (this.hoveredInteractable && !this.activeModal) {
promptEl.classList.remove('hidden');
promptLabel.textContent = this.hoveredInteractable.getPrompt();
if (mobileActBtn) mobileActBtn.classList.add('act-ready');
} else {
promptEl.classList.add('hidden');
if (mobileActBtn) mobileActBtn.classList.remove('act-ready');
}
const lookAheadX = Math.cos(this.player.facing) * 18 * this.player.moveAmount;
const lookAheadY = Math.sin(this.player.facing) * 18 * this.player.moveAmount;
const targetCamX = this.player.x + lookAheadX;
const targetCamY = this.player.y + lookAheadY;
const springStrength = 14.0;
const springDamping = 6.2;
const ax = (targetCamX - this.camera.x) * springStrength - this.camera.vx * springDamping;
const ay = (targetCamY - this.camera.y) * springStrength - this.camera.vy * springDamping;
this.camera.vx += ax * dt;
this.camera.vy += ay * dt;
this.camera.x += this.camera.vx * dt;
this.camera.y += this.camera.vy * dt;
}
loop(timestamp) {
const dt = Math.min(0.1, (timestamp - this.lastFrameTime) / 1000);
this.lastFrameTime = timestamp;
this.fpsFrames++;
if (timestamp - this.fpsLastTime >= 500) {
this.currentFps = Math.round((this.fpsFrames * 1000) / (timestamp - this.fpsLastTime));
this.fpsFrames = 0;
this.fpsLastTime = timestamp;
if (this.settings.showFps) {
const fpsEl = document.getElementById('hud-fps');
if (fpsEl) fpsEl.textContent = `${this.currentFps} FPS`;
}
}
if (this.mainMenuOpen) {
this.animTime += dt;
this.updateAndRenderMenuCash(dt);
requestAnimationFrame((ts) => this.loop(ts));
return;
}
this.update(dt);
if (this.renderGameWorld) {
this.render();
}
requestAnimationFrame((ts) => this.loop(ts));
}
}
window.addEventListener('DOMContentLoaded', () => { if (!window.game) window.game = new VelvetPitGame(); });