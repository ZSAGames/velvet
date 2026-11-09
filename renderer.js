Object.assign(VelvetPitGame.prototype, {
spawnMenuCashBill(index = 0, randomY = false) {
const lane = index % 5;
let side = 'left';
let xFrac = 0.04 + Math.random() * 0.22;
if (lane === 1 || lane === 3) {
side = 'right';
xFrac = 0.74 + Math.random() * 0.22;
} else if (lane === 4) {
side = 'center';
xFrac = 0.22 + Math.random() * 0.56;
}
const depth = side === 'center' ? (0.42 + Math.random() * 0.52) : (0.55 + Math.random() * 0.78);
return {
side,
xFrac,
y: randomY ? Math.random() * window.innerHeight : -90 - Math.random() * 240,
z: depth,
vy: (100 + Math.random() * 125) * depth,
rx: Math.random() * Math.PI * 2,
ry: Math.random() * Math.PI * 2,
rz: Math.random() * Math.PI * 2,
vrx: (1.6 + Math.random() * 2.4) * (Math.random() < 0.5 ? 1 : -1),
vry: (1.8 + Math.random() * 2.8) * (Math.random() < 0.5 ? 1 : -1),
vrz: (0.8 + Math.random() * 1.6) * (Math.random() < 0.5 ? 1 : -1),
thickness: 11 + Math.floor(Math.random() * 10)
};
},
drawMenuNeonNoirSkyline(ctx, w, h) {
// 1. Nocne niebo i neonowa łuna nad horyzontem
const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
skyGrad.addColorStop(0, '#020306');
skyGrad.addColorStop(0.52, '#070913');
skyGrad.addColorStop(0.82, '#13091c');
skyGrad.addColorStop(1, '#05060a');
ctx.fillStyle = skyGrad;
ctx.fillRect(0, 0, w, h);

// 2. Szperacze (searchlights) przecinające nocne niebo
ctx.save();
for (let s = 0; s < 3; s++) {
const sx = w * (0.18 + s * 0.32);
const sy = h * 0.88;
const swing = Math.sin(this.animTime * (0.45 + s * 0.18) + s * 2.1) * 0.42;
const ang = -Math.PI / 2 + swing;
const len = Math.max(w, h) * 0.95;
const beamGrad = ctx.createLinearGradient(sx, sy, sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
const col = s === 0 ? 'rgba(34, 211, 238, 0.08)' : (s === 1 ? 'rgba(236, 72, 153, 0.08)' : 'rgba(245, 158, 11, 0.08)');
beamGrad.addColorStop(0, col);
beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = beamGrad;
ctx.beginPath();
ctx.moveTo(sx - 12, sy);
ctx.lineTo(sx + Math.cos(ang - 0.09) * len, sy + Math.sin(ang - 0.09) * len);
ctx.lineTo(sx + Math.cos(ang + 0.09) * len, sy + Math.sin(ang + 0.09) * len);
ctx.lineTo(sx + 12, sy);
ctx.closePath();
ctx.fill();
}
ctx.restore();

// 3. Poświaty neonowe po bokach i w centrum horyzontu
const leftGlow = ctx.createRadialGradient(w * 0.15, h * 0.62, 20, w * 0.15, h * 0.62, w * 0.34);
leftGlow.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
leftGlow.addColorStop(0.6, 'rgba(6, 182, 212, 0.08)');
leftGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = leftGlow;
ctx.fillRect(0, 0, w, h);

const rightGlow = ctx.createRadialGradient(w * 0.85, h * 0.62, 20, w * 0.85, h * 0.62, w * 0.34);
rightGlow.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
rightGlow.addColorStop(0.6, 'rgba(239, 68, 68, 0.08)');
rightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = rightGlow;
ctx.fillRect(0, 0, w, h);

// 4. Dalszy plan wieżowców (tło)
const backBuildings = [
{ xf: 0.00, wf: 0.09, hf: 0.44, col: '#070a12', neon: '#06b6d4' },
{ xf: 0.08, wf: 0.08, hf: 0.56, col: '#080b14', neon: '#ec4899' },
{ xf: 0.15, wf: 0.09, hf: 0.48, col: '#070a12', neon: '#f59e0b' },
{ xf: 0.23, wf: 0.08, hf: 0.39, col: '#060911', neon: '#a855f7' },
{ xf: 0.69, wf: 0.09, hf: 0.42, col: '#060911', neon: '#22d3ee' },
{ xf: 0.77, wf: 0.08, hf: 0.58, col: '#080b14', neon: '#ef4444' },
{ xf: 0.84, wf: 0.09, hf: 0.50, col: '#070a12', neon: '#f59e0b' },
{ xf: 0.92, wf: 0.09, hf: 0.45, col: '#070a12', neon: '#10b981' }
];
backBuildings.forEach((b, idx) => {
const bx = Math.floor(b.xf * w);
const bw = Math.ceil(b.wf * w);
const bh = Math.floor(b.hf * h);
const by = h - bh;
ctx.fillStyle = b.col;
ctx.fillRect(bx, by, bw, bh);
ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
ctx.lineWidth = 1;
ctx.strokeRect(bx, by, bw, bh);
// Iglica na dachu
const spireX = bx + bw * 0.5;
ctx.strokeStyle = '#1e293b';
ctx.lineWidth = 1.5;
ctx.beginPath();
ctx.moveTo(spireX, by);
ctx.lineTo(spireX, by - 26);
ctx.stroke();
if (Math.sin(this.animTime * 4 + idx * 1.7) > -0.2) {
ctx.fillStyle = '#ef4444';
ctx.beginPath();
ctx.arc(spireX, by - 26, 2.2, 0, Math.PI * 2);
ctx.fill();
}
});

// 5. Pierwszy plan wieżowców Neon Noir ze świecącymi oknami i szyldami
const frontBuildings = [
{ xf: -0.01, wf: 0.075, hf: 0.36, neon: '#22d3ee', sign: 'SYNDICATE' },
{ xf: 0.06,  wf: 0.085, hf: 0.49, neon: '#ec4899', sign: 'VELVET PIT' },
{ xf: 0.14,  wf: 0.075, hf: 0.38, neon: '#f59e0b', sign: 'CASINO 777' },
{ xf: 0.21,  wf: 0.070, hf: 0.30, neon: '#10b981', sign: '' },
{ xf: 0.275, wf: 0.070, hf: 0.24, neon: '#a855f7', sign: '' },
{ xf: 0.655, wf: 0.070, hf: 0.25, neon: '#38bdf8', sign: '' },
{ xf: 0.72,  wf: 0.075, hf: 0.32, neon: '#f43f5e', sign: '' },
{ xf: 0.79,  wf: 0.085, hf: 0.48, neon: '#f59e0b', sign: 'BLACKWATER' },
{ xf: 0.87,  wf: 0.075, hf: 0.40, neon: '#10b981', sign: 'LICHWA 24H' },
{ xf: 0.94,  wf: 0.075, hf: 0.34, neon: '#c084fc', sign: 'VIP CLUB' }
];

frontBuildings.forEach((b, bIdx) => {
const bx = Math.floor(b.xf * w);
const bw = Math.ceil(b.wf * w);
const bh = Math.floor(b.hf * h);
const by = h - bh;

// Bryła budynku
ctx.fillStyle = '#05070d';
ctx.fillRect(bx, by, bw, bh);

// Świecąca neonowa krawędź dachu i obrys
ctx.strokeStyle = b.neon;
ctx.globalAlpha = 0.45 + 0.15 * Math.sin(this.animTime * 2.5 + bIdx);
ctx.lineWidth = 1.6;
ctx.strokeRect(bx, by, bw, bh);
ctx.globalAlpha = 1;

// Neonowy szyld na dachu wybranych wieżowców
if (b.sign && bw >= 48) {
const pulse = Math.sin(this.animTime * 6 + bIdx * 2.3) > -0.85 ? 1 : 0.25;
ctx.save();
ctx.globalAlpha = pulse;
const signW = Math.min(bw - 6, 86);
const signH = 15;
const sx = bx + (bw - signW) * 0.5;
const sy = by - signH - 4;
ctx.fillStyle = '#04050a';
ctx.fillRect(sx, sy, signW, signH);
ctx.strokeStyle = b.neon;
ctx.lineWidth = 1.4;
ctx.strokeRect(sx, sy, signW, signH);
ctx.fillStyle = b.neon;
ctx.font = '800 8.5px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(b.sign, sx + signW * 0.5, sy + signH * 0.5, signW - 4);
ctx.restore();
}

// Siatka świecących okien w stylu Neon Noir
const cols = Math.max(2, Math.floor((bw - 12) / 11));
const rows = Math.max(4, Math.floor((bh - 24) / 14));
const padX = Math.max(5, Math.floor((bw - cols * 7) / (cols + 1)));
for (let r = 0; r < rows; r++) {
const wy = by + 12 + r * 13;
if (wy > h - 18) break;
for (let c = 0; c < cols; c++) {
const seed = (bIdx * 31 + r * 17 + c * 13) % 19;
if (seed < 7) continue; // Część okien wygaszona dla klimatu noir
const wx = bx + padX + c * (7 + padX * 0.5);
if (wx + 6 > bx + bw - 3) continue;
const flick = Math.sin(this.animTime * (1.5 + (seed % 4)) + seed) > -0.75;
if (!flick) continue;
if (seed % 5 === 0) ctx.fillStyle = b.neon;
else if (seed % 3 === 0) ctx.fillStyle = 'rgba(251, 191, 36, 0.78)';
else ctx.fillStyle = 'rgba(56, 189, 248, 0.62)';
ctx.fillRect(wx, wy, 5, 7);
}
}
});

// 6. Dolna mgła uliczna (neon mist)
const mistGrad = ctx.createLinearGradient(0, h * 0.82, 0, h);
mistGrad.addColorStop(0, 'rgba(4, 5, 8, 0)');
mistGrad.addColorStop(0.65, 'rgba(15, 23, 42, 0.55)');
mistGrad.addColorStop(1, 'rgba(3, 4, 8, 0.92)');
ctx.fillStyle = mistGrad;
ctx.fillRect(0, h * 0.82, w, h * 0.18);
},
updateAndRenderMenuCash(dt) {
if (!this.mainMenuOpen || !this.menuCashCtx || !this.menuCashCanvas) return;
const ctx = this.menuCashCtx;
const w = this.menuCashCanvas.width;
const h = this.menuCashCanvas.height;
ctx.clearRect(0, 0, w, h);

// TRYB DLA SŁABYCH PC (LOW-END MODE): tylko mniej spadających banknotów 2D bez skyline i bez 3D
if (this.settings.lowEndMode) {
const lowEndCount = Math.min(18, this.menuCashBills.length);
ctx.font = '800 11px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
for (let i = 0; i < lowEndCount; i++) {
const b = this.menuCashBills[i];
b.y += b.vy * dt;
if (b.y > h + 60) {
this.menuCashBills[i] = this.spawnMenuCashBill(i, false);
continue;
}
const bx = b.xFrac * w;
const by = b.y;
const bw = 40;
const bh = 20;
ctx.fillStyle = '#059669';
ctx.fillRect(bx - bw * 0.5, by - bh * 0.5, bw, bh);
ctx.strokeStyle = '#6ee7b7';
ctx.lineWidth = 1.5;
ctx.strokeRect(bx - bw * 0.5, by - bh * 0.5, bw, bh);
ctx.fillStyle = '#fbbf24';
ctx.fillText('$', bx, by);
}
return;
}

// TRYB NORMALNY / WYSOKA JAKOŚĆ: Neon Noir Skyline + gęsty deszcz banknotów 3D
this.drawMenuNeonNoirSkyline(ctx, w, h);

const fov = 320;
const rot3D = (vx, vy, vz, rx, ry, rz) => {
const cy1 = vy * Math.cos(rx) - vz * Math.sin(rx);
const cz1 = vy * Math.sin(rx) + vz * Math.cos(rx);
const cx2 = vx * Math.cos(ry) + cz1 * Math.sin(ry);
const cz2 = -vx * Math.sin(ry) + cz1 * Math.cos(ry);
const cx3 = cx2 * Math.cos(rz) - cy1 * Math.sin(rz);
const cy3 = cx2 * Math.sin(rz) + cy1 * Math.cos(rz);
const s = fov / Math.max(60, fov + cz2);
return { x: cx3 * s, y: cy3 * s, z: cz2 };
};
for (let i = 0; i < this.menuCashBills.length; i++) {
const b = this.menuCashBills[i];
b.y += b.vy * dt;
b.rx = (b.rx + b.vrx * dt) % (Math.PI * 2);
b.ry = (b.ry + b.vry * dt) % (Math.PI * 2);
b.rz = (b.rz + b.vrz * dt) % (Math.PI * 2);
if (b.y > h + 120) {
this.menuCashBills[i] = this.spawnMenuCashBill(i, false);
continue;
}
const bx = b.xFrac * w + Math.sin(this.animTime * 1.4 + i) * 12;
const by = b.y;
const hw = 42 * b.z;
const hh = 21 * b.z;
const hd = (b.thickness * 0.5) * b.z;
const localVerts = [
[-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
[-hw, -hh,  hd], [hw, -hh,  hd], [hw, hh,  hd], [-hw, hh,  hd]
];
const pts = localVerts.map(v => rot3D(v[0], v[1], v[2], b.rx, b.ry, b.rz));
const faces = [
{ idx: [0, 1, 2, 3], type: 'front', color: '#10b981', stroke: '#a7f3d0' },
{ idx: [5, 4, 7, 6], type: 'back',  color: '#047857', stroke: '#6ee7b7' },
{ idx: [4, 5, 1, 0], type: 'sideLong', color: '#064e3b', stroke: '#022c22' },
{ idx: [3, 2, 6, 7], type: 'sideLong', color: '#064e3b', stroke: '#022c22' },
{ idx: [4, 0, 3, 7], type: 'sideShort', color: '#065f46', stroke: '#022c22' },
{ idx: [1, 5, 6, 2], type: 'sideShort', color: '#065f46', stroke: '#022c22' }
];
faces.forEach(f => {
f.avgZ = (pts[f.idx[0]].z + pts[f.idx[1]].z + pts[f.idx[2]].z + pts[f.idx[3]].z) * 0.25;
});
faces.sort((aFace, bFace) => bFace.avgZ - aFace.avgZ);
ctx.save();
ctx.translate(bx, by);
for (const f of faces) {
const p0 = pts[f.idx[0]];
const p1 = pts[f.idx[1]];
const p2 = pts[f.idx[2]];
const p3 = pts[f.idx[3]];
ctx.beginPath();
ctx.moveTo(p0.x, p0.y);
ctx.lineTo(p1.x, p1.y);
ctx.lineTo(p2.x, p2.y);
ctx.lineTo(p3.x, p3.y);
ctx.closePath();
ctx.fillStyle = f.color;
ctx.fill();
ctx.strokeStyle = f.stroke;
ctx.lineWidth = 1.2;
ctx.stroke();
if (f.type === 'front' || f.type === 'back' || f.type === 'sideLong') {
const lerpPt = (pa, pb, t) => ({
x: pa.x + (pb.x - pa.x) * t,
y: pa.y + (pb.y - pa.y) * t
});
const b0 = lerpPt(p0, p1, 0.4);
const b1 = lerpPt(p0, p1, 0.6);
const b2 = lerpPt(p3, p2, 0.6);
const b3 = lerpPt(p3, p2, 0.4);
ctx.beginPath();
ctx.moveTo(b0.x, b0.y);
ctx.lineTo(b1.x, b1.y);
ctx.lineTo(b2.x, b2.y);
ctx.lineTo(b3.x, b3.y);
ctx.closePath();
ctx.fillStyle = f.type === 'sideLong' ? '#b45309' : '#fbbf24';
ctx.fill();
if (f.type === 'front' || f.type === 'back') {
const cx = (p0.x + p1.x + p2.x + p3.x) * 0.25;
const cy = (p0.y + p1.y + p2.y + p3.y) * 0.25;
ctx.beginPath();
ctx.arc(cx, cy, 4 * b.z, 0, Math.PI * 2);
ctx.fillStyle = '#064e3b';
ctx.fill();
}
}
}
ctx.restore();
}
},
prebakeZoneFloors() {
const c0 = document.createElement('canvas');
c0.width = 1000;
c0.height = 600;
const ctx0 = c0.getContext('2d');
const b0 = this.zones[0].bounds;
ctx0.fillStyle = '#020305';
ctx0.fillRect(b0.x - 18, b0.y - 18, b0.w + 36, b0.h + 36);
ctx0.fillStyle = '#10121a';
ctx0.fillRect(b0.x, b0.y, b0.w, b0.h);
ctx0.strokeStyle = '#181b26';
ctx0.lineWidth = 1.5;
for (let y = b0.y; y <= b0.y + b0.h; y += 28) {
ctx0.beginPath();
ctx0.moveTo(b0.x, y);
ctx0.lineTo(b0.x + b0.w, y);
ctx0.stroke();
for (let x = b0.x + ((y * 3) % 90); x < b0.x + b0.w; x += 95) {
ctx0.beginPath();
ctx0.moveTo(x, y);
ctx0.lineTo(x, Math.min(b0.y + b0.h, y + 28));
ctx0.stroke();
}
}
ctx0.strokeStyle = 'rgba(0,0,0,0.65)';
ctx0.lineWidth = 16;
ctx0.strokeRect(b0.x + 8, b0.y + 8, b0.w - 16, b0.h - 16);
this.drawRoundedRect(ctx0, 370, 210, 230, 170, 8);
ctx0.fillStyle = '#1e131a';
ctx0.fill();
ctx0.strokeStyle = '#3b1d2e';
ctx0.lineWidth = 3;
ctx0.stroke();
ctx0.strokeStyle = '#4c1d3d';
ctx0.lineWidth = 1;
ctx0.strokeRect(380, 220, 210, 150);
this.cachedZoneFloors[0] = c0;
const c2 = document.createElement('canvas');
c2.width = 1000;
c2.height = 600;
const ctx2 = c2.getContext('2d');
const b2 = this.zones[2].bounds;
ctx2.fillStyle = '#14060b';
ctx2.fillRect(b2.x, b2.y, b2.w, b2.h);
ctx2.strokeStyle = '#280b15';
ctx2.lineWidth = 1.5;
for (let x = b2.x; x <= b2.x + b2.w; x += 48) {
ctx2.beginPath(); ctx2.moveTo(x, b2.y); ctx2.lineTo(x, b2.y + b2.h); ctx2.stroke();
}
for (let y = b2.y; y <= b2.y + b2.h; y += 48) {
ctx2.beginPath(); ctx2.moveTo(b2.x, y); ctx2.lineTo(b2.x + b2.w, y); ctx2.stroke();
}
ctx2.strokeStyle = 'rgba(245, 158, 11, 0.2)';
ctx2.lineWidth = 3;
ctx2.beginPath();
ctx2.arc(502, 312, 115, 0, Math.PI * 2);
ctx2.stroke();
ctx2.strokeStyle = '#b45309';
ctx2.lineWidth = 8;
ctx2.strokeRect(b2.x, b2.y, b2.w, b2.h);
ctx2.strokeStyle = '#fbbf24';
ctx2.lineWidth = 2;
ctx2.strokeRect(b2.x + 4, b2.y + 4, b2.w - 8, b2.h - 8);
this.cachedZoneFloors[2] = c2;
}
,
render() {
const ctx = this.ctx;
const cw = this.canvas.width;
const ch = this.canvas.height;
ctx.fillStyle = '#030407';
ctx.fillRect(0, 0, cw, ch);
const isPortrait = cw < ch;
const baseScale = isPortrait ? Math.max(cw / 620, ch / 960) : Math.min(cw / 1000, ch / 600);
const zoomMult = (this.cutscene && this.cutscene.active) ? 1.12 : 1.0;
const camScale = baseScale * this.camera.zoom * zoomMult;
this.pendingBadges = [];
ctx.save();
ctx.translate(cw / 2, ch / 2);
ctx.scale(camScale, camScale);
ctx.translate(-this.camera.x, -this.camera.y);
if (this.zone === 0) this.drawSafehouse(ctx);
else if (this.zone === 1) this.drawStreet(ctx);
else if (this.zone === 2) this.drawCasino(ctx);
if (!this.settings.lowEndMode) {
for (const fp of this.footsteps) {
ctx.save();
ctx.strokeStyle = fp.color;
ctx.globalAlpha = Math.max(0, fp.alpha);
ctx.lineWidth = 1.5;
ctx.beginPath();
ctx.arc(fp.x, fp.y, fp.r, 0, Math.PI * 2);
ctx.stroke();
ctx.restore();
}
}
if (this.cutscene && this.cutscene.active) {
this.drawCutsceneWorldUnderPlayer(ctx);
}
this.drawPlayer(ctx);
if (this.cutscene && this.cutscene.active) {
this.drawCutsceneWorldOverPlayer(ctx);
}
this.flushPropBadges(ctx);
if (this.zone === 2 && (!this.cutscene || !this.cutscene.active)) {
this.drawNpcBubbles(ctx);
}
if (this.hoveredInteractable && this.hoveredInteractable.box && (!this.cutscene || !this.cutscene.active)) {
this.drawInteractableHighlight(ctx, this.hoveredInteractable);
}
if (!this.settings.lowEndMode) {
for (const d of this.ambientDust) {
const dx = d.x - this.player.x;
const dy = d.y - this.player.y;
const dist = Math.hypot(dx, dy);
let inBeam = false;
if (this.settings.glows && dist < 185) {
let angDiff = Math.atan2(dy, dx) - this.player.facing;
while (angDiff < -Math.PI) angDiff += Math.PI * 2;
while (angDiff > Math.PI) angDiff -= Math.PI * 2;
if (Math.abs(angDiff) < 0.36) inBeam = true;
}
ctx.fillStyle = inBeam ? 'rgba(254, 243, 199, 0.78)' : (this.zone === 2 ? 'rgba(251, 191, 36, 0.22)' : 'rgba(148, 163, 184, 0.18)');
ctx.beginPath();
ctx.arc(d.x, d.y, inBeam ? d.r * 1.35 : d.r, 0, Math.PI * 2);
ctx.fill();
}
}
if (this.zone === 1 && this.settings.weather && !this.settings.lowEndMode) {
this.drawRain(ctx);
}
this.drawNoirLightingOverlay(ctx);
ctx.restore();
if (this.cutscene && this.cutscene.active) {
this.drawCutsceneScreenOverlay(ctx, cw, ch);
}
},
drawRoundedRect(ctx, x, y, w, h, r) {
ctx.beginPath();
ctx.moveTo(x + r, y);
ctx.lineTo(x + w - r, y);
ctx.quadraticCurveTo(x + w, y, x + w, y + r);
ctx.lineTo(x + w, y + h - r);
ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
ctx.lineTo(x + r, y + h);
ctx.quadraticCurveTo(x, y + h, x, y + h - r);
ctx.lineTo(x, y + r);
ctx.quadraticCurveTo(x, y, x + r, y);
ctx.closePath();
},
drawNeonGlow(ctx, x, y, radius, colorHex, alpha = 0.25) {
if (!this.settings.glows || this.settings.lowEndMode) return;
ctx.save();
const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
grad.addColorStop(0, '#ffffff');
grad.addColorStop(0.14, colorHex);
grad.addColorStop(0.55, colorHex);
grad.addColorStop(1, 'rgba(0,0,0,0)');
ctx.globalAlpha = alpha;
ctx.fillStyle = grad;
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
},
drawInteractableHighlight(ctx, item) {
const b = item.box;
const pulse = 0.5 + 0.5 * Math.sin(this.animTime * 7);
const pad = 6 + pulse * 3;
const bx = b.x - pad;
const by = b.y - pad;
const bw = b.w + pad * 2;
const bh = b.h + pad * 2;
const len = 14;
ctx.save();
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 3;
if (this.settings.glows && !this.settings.lowEndMode) {
ctx.shadowColor = '#f59e0b';
ctx.shadowBlur = 12;
}
ctx.beginPath();
ctx.moveTo(bx, by + len); ctx.lineTo(bx, by); ctx.lineTo(bx + len, by);
ctx.moveTo(bx + bw - len, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + len);
ctx.moveTo(bx + bw, by + bh - len); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw - len, by + bh);
ctx.moveTo(bx + len, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - len);
ctx.stroke();
const pillX = b.x + b.w / 2;
const pillY = b.y - 18 - pulse * 4;
this.drawRoundedRect(ctx, pillX - 18, pillY - 11, 36, 20, 6);
ctx.fillStyle = '#f59e0b';
ctx.fill();
ctx.fillStyle = '#09090b';
ctx.font = '800 11px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
const actKey = this.getActionKeyLabel ? this.getActionKeyLabel() : 'E';
ctx.fillText(`[${actKey}]`, pillX, pillY);
ctx.restore();
}
,
drawSafehouse(ctx) {
const b = this.zones[0].bounds;
if (this.cachedZoneFloors && this.cachedZoneFloors[0]) {
ctx.drawImage(this.cachedZoneFloors[0], 0, 0);
} else {
ctx.fillStyle = '#020305';
ctx.fillRect(b.x - 18, b.y - 18, b.w + 36, b.h + 36);
ctx.fillStyle = '#10121a';
ctx.fillRect(b.x, b.y, b.w, b.h);
}
ctx.fillStyle = 'rgba(127, 29, 29, 0.22)';
ctx.beginPath();
ctx.arc(345, 290, 24, 0, Math.PI * 2);
ctx.arc(362, 302, 14, 0, Math.PI * 2);
ctx.fill();
const papers = [{ x: 560, y: 270, a: 0.3 }, { x: 578, y: 282, a: -0.4 }, { x: 420, y: 395, a: 0.2 }];
papers.forEach(p => {
ctx.save();
ctx.translate(p.x, p.y);
ctx.rotate(p.a);
ctx.fillStyle = '#cbd5e1';
ctx.fillRect(-8, -10, 16, 20);
ctx.fillStyle = '#ef4444';
ctx.fillRect(-5, -6, 10, 3);
ctx.fillStyle = '#64748b';
ctx.fillRect(-5, 0, 10, 2);
ctx.fillRect(-5, 4, 7, 2);
ctx.restore();
});
ctx.strokeStyle = '#27273a';
ctx.lineWidth = 10;
ctx.strokeRect(b.x, b.y, b.w, b.h);
ctx.strokeStyle = '#38bdf8';
ctx.globalAlpha = 0.25;
ctx.lineWidth = 1.5;
ctx.strokeRect(b.x - 2, b.y - 2, b.w + 4, b.h + 4);
ctx.globalAlpha = 1;
this.drawNeonGlow(ctx, 245, 217, 110, '#dc2626', this.cash >= this.quota ? 0.32 : 0.14);
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.6)';
ctx.fillRect(191, 148, 122, 157);
this.drawRoundedRect(ctx, 185, 140, 120, 155, 8);
ctx.fillStyle = '#27171c';
ctx.fill();
ctx.strokeStyle = this.cash >= this.quota ? '#10b981' : '#ef4444';
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.fillStyle = '#180d10';
ctx.fillRect(188, 143, 114, 16);
this.drawRoundedRect(ctx, 193, 162, 104, 125, 5);
ctx.fillStyle = '#475569';
ctx.fill();
ctx.save();
ctx.translate(245, 180);
ctx.rotate(-0.06);
this.drawRoundedRect(ctx, -34, -12, 68, 24, 6);
ctx.fillStyle = '#cbd5e1';
ctx.fill();
ctx.restore();
this.drawRoundedRect(ctx, 193, 205, 104, 82, 5);
ctx.fillStyle = '#7f1d1d';
ctx.fill();
ctx.fillStyle = '#991b1b';
ctx.fillRect(196, 205, 98, 12);
ctx.restore();
this.drawPropBadge(ctx, 245, 125, this.t('canvas_bed'), '#fca5a5', '#450a0a');
const crtFlicker = 0.25 + 0.08 * Math.sin(this.animTime * 18);
this.drawNeonGlow(ctx, 725, 195, 135, '#10b981', crtFlicker);
ctx.save();
ctx.strokeStyle = '#065f46';
ctx.lineWidth = 2.5;
ctx.beginPath();
ctx.moveTo(640, 175);
ctx.bezierCurveTo(600, 170, 590, 120, 560, 105);
ctx.stroke();
ctx.fillStyle = 'rgba(0,0,0,0.65)';
ctx.fillRect(646, 142, 172, 92);
this.drawRoundedRect(ctx, 640, 135, 170, 90, 6);
ctx.fillStyle = '#0f172a';
ctx.fill();
ctx.strokeStyle = '#10b981';
ctx.lineWidth = 2.5;
ctx.stroke();
this.drawRoundedRect(ctx, 685, 142, 80, 46, 5);
ctx.fillStyle = '#1e293b';
ctx.fill();
ctx.strokeStyle = '#34d399';
ctx.lineWidth = 1.5;
ctx.stroke();
ctx.fillStyle = '#059669';
ctx.fillRect(692, 176, 66, 9);
ctx.fillStyle = '#6ee7b7';
ctx.fillRect(696, 179, 45, 3);
this.drawRoundedRect(ctx, 690, 197, 68, 18, 3);
ctx.fillStyle = '#334155';
ctx.fill();
ctx.fillStyle = '#10b981';
for (let kx = 695; kx < 752; kx += 7) {
ctx.fillRect(kx, 201, 4, 3);
ctx.fillRect(kx, 207, 4, 3);
}
ctx.beginPath();
ctx.arc(662, 198, 8, 0, Math.PI * 2);
ctx.fillStyle = '#f8fafc';
ctx.fill();
ctx.beginPath();
ctx.arc(662, 198, 5, 0, Math.PI * 2);
ctx.fillStyle = '#451a03';
ctx.fill();
ctx.restore();
this.drawPropBadge(ctx, 725, 120, this.t('canvas_crt'), '#6ee7b7', '#022c22');
const candlePulse = 0.25 + 0.08 * Math.sin(this.animTime * 9);
this.drawNeonGlow(ctx, 267, 420, 130, '#f59e0b', candlePulse);
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.65)';
ctx.fillRect(191, 382, 167, 92);
this.drawRoundedRect(ctx, 185, 375, 165, 90, 6);
ctx.fillStyle = '#291509';
ctx.fill();
ctx.strokeStyle = '#f59e0b';
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.fillStyle = '#4c1d95';
ctx.fillRect(215, 378, 105, 84);
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 1.5;
ctx.strokeRect(215, 378, 105, 84);
ctx.beginPath();
ctx.arc(267, 420, 22, 0, Math.PI * 2);
ctx.stroke();
ctx.fillStyle = '#e2e8f0';
ctx.beginPath();
ctx.arc(267, 418, 9, 0, Math.PI * 2);
ctx.fill();
ctx.fillRect(263, 424, 8, 5);
ctx.fillStyle = '#09090b';
ctx.fillRect(263, 416, 3, 3);
ctx.fillRect(269, 416, 3, 3);
const candles = [{ x: 202, y: 392 }, { x: 202, y: 446 }, { x: 332, y: 395 }, { x: 332, y: 445 }];
candles.forEach((c, idx) => {
ctx.fillStyle = '#fef3c7';
ctx.beginPath();
ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
ctx.fill();
const rFlame = 3.5 + Math.sin(this.animTime * 14 + idx * 2) * 1.2;
ctx.fillStyle = '#f59e0b';
ctx.beginPath();
ctx.arc(c.x, c.y, rFlame, 0, Math.PI * 2);
ctx.fill();
});
ctx.restore();
this.drawPropBadge(ctx, 267, 360, this.t('canvas_shrine', { tokens: this.tokens }), '#fde68a', '#451a03');
this.drawNeonGlow(ctx, 500, 492, 85, '#f59e0b', 0.25);
ctx.fillStyle = '#18181b';
ctx.fillRect(440, 482, 120, 20);
ctx.fillStyle = '#f59e0b';
ctx.fillRect(445, 490, 110, 8);
this.drawPropBadge(ctx, 500, 464, this.t('canvas_street_exit'), '#fbbf24', '#27272a');
if (this.settings.glows && !this.settings.lowEndMode) {
ctx.save();
const scanY = 144 + ((this.animTime * 28) % 30);
ctx.fillStyle = 'rgba(110, 231, 183, 0.35)';
ctx.fillRect(690, scanY, 70, 2);
ctx.fillStyle = Math.sin(this.animTime * 10) > 0 ? '#10b981' : '#047857';
ctx.beginPath(); ctx.arc(792, 155, 2.5, 0, Math.PI * 2); ctx.fill();
ctx.fillStyle = '#ef4444';
ctx.beginPath(); ctx.arc(792, 163, 2, 0, Math.PI * 2); ctx.fill();
const doorShaft = ctx.createLinearGradient(500, 495, 500, 390);
doorShaft.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
doorShaft.addColorStop(1, 'rgba(245, 158, 11, 0)');
ctx.fillStyle = doorShaft;
ctx.beginPath();
ctx.moveTo(445, 492); ctx.lineTo(555, 492); ctx.lineTo(590, 390); ctx.lineTo(410, 390);
ctx.closePath(); ctx.fill();
ctx.restore();
}
const bulbFlicker = Math.sin(this.animTime * 23) > -0.85 ? 0.14 : 0.04;
this.drawNeonGlow(ctx, 485, 295, 230, '#fef08a', bulbFlicker);
}
,
drawStreet(ctx) {
const b = this.zones[1].bounds;
this.drawStreetBuildings(ctx, b);
ctx.fillStyle = '#090b10';
ctx.fillRect(b.x, b.y, b.w, b.h);
ctx.fillStyle = '#161922';
ctx.fillRect(b.x, b.y, b.w, 82);
ctx.fillRect(b.x, b.y + b.h - 82, b.w, 82);
ctx.strokeStyle = '#262b38';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(b.x, b.y + 82); ctx.lineTo(b.x + b.w, b.y + 82);
ctx.moveTo(b.x, b.y + b.h - 82); ctx.lineTo(b.x + b.w, b.y + b.h - 82);
ctx.stroke();
ctx.strokeStyle = '#1e2230';
ctx.lineWidth = 1;
for (let x = b.x; x < b.x + b.w; x += 60) {
ctx.beginPath();
ctx.moveTo(x, b.y); ctx.lineTo(x, b.y + 82);
ctx.moveTo(x, b.y + b.h - 82); ctx.lineTo(x, b.y + b.h);
ctx.stroke();
}
const puddles = [
{ x: 185, y: 275, rx: 58, ry: 22, col: 'rgba(236, 72, 153, 0.18)', stroke: 'rgba(244, 114, 182, 0.36)' },
{ x: 475, y: 345, rx: 78, ry: 26, col: 'rgba(34, 211, 238, 0.17)', stroke: 'rgba(56, 189, 248, 0.36)' },
{ x: 690, y: 255, rx: 52, ry: 20, col: 'rgba(168, 85, 247, 0.18)', stroke: 'rgba(192, 132, 252, 0.34)' },
{ x: 825, y: 305, rx: 68, ry: 30, col: 'rgba(239, 68, 68, 0.22)', stroke: 'rgba(248, 113, 113, 0.42)' }
];
puddles.forEach(p => {
ctx.save();
ctx.beginPath();
ctx.ellipse(p.x, p.y, p.rx, p.ry, 0.08, 0, Math.PI * 2);
ctx.fillStyle = p.col;
ctx.fill();
ctx.strokeStyle = p.stroke;
ctx.lineWidth = 1.5;
ctx.stroke();
ctx.restore();
});
ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
ctx.lineWidth = 4;
ctx.setLineDash([32, 26]);
ctx.beginPath();
ctx.moveTo(b.x + 30, 310);
ctx.lineTo(b.x + b.w - 30, 310);
ctx.stroke();
ctx.setLineDash([]);
ctx.save();
ctx.beginPath();
ctx.arc(465, 255, 18, 0, Math.PI * 2);
ctx.fillStyle = '#1e293b';
ctx.fill();
ctx.strokeStyle = '#475569';
ctx.lineWidth = 2;
ctx.stroke();
const steamOffset = (this.animTime * 16) % 24;
ctx.fillStyle = `rgba(203, 213, 225, ${0.22 - steamOffset / 120})`;
ctx.beginPath();
ctx.arc(465 + Math.sin(this.animTime * 3) * 4, 250 - steamOffset, 8 + steamOffset * 0.3, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.65)';
ctx.fillRect(316, 152, 122, 67);
this.drawRoundedRect(ctx, 310, 145, 120, 65, 5);
ctx.fillStyle = '#1e293b';
ctx.fill();
ctx.strokeStyle = '#64748b';
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.fillStyle = '#0f172a';
for (let rx = 322; rx < 420; rx += 22) {
ctx.fillRect(rx, 149, 12, 57);
}
ctx.fillStyle = '#334155';
ctx.beginPath();
ctx.arc(436, 192, 12, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
const hazardBlink = Math.sin(this.animTime * 6) > 0;
if (hazardBlink) {
this.drawNeonGlow(ctx, 560, 440, 75, '#f59e0b', 0.28);
this.drawNeonGlow(ctx, 725, 440, 75, '#ef4444', 0.28);
}
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.7)';
this.drawRoundedRect(ctx, 566, 412, 167, 72, 12);
ctx.fill();
ctx.fillStyle = '#09090b';
ctx.fillRect(578, 400, 26, 8);
ctx.fillRect(682, 400, 26, 8);
ctx.fillRect(578, 472, 26, 8);
ctx.fillRect(682, 472, 26, 8);
this.drawRoundedRect(ctx, 560, 405, 165, 70, 12);
ctx.fillStyle = '#312e43';
ctx.fill();
ctx.strokeStyle = '#94a3b8';
ctx.lineWidth = 2;
ctx.stroke();
this.drawRoundedRect(ctx, 598, 412, 88, 56, 6);
ctx.fillStyle = '#0f172a';
ctx.fill();
ctx.fillStyle = '#1e1b2e';
ctx.fillRect(622, 416, 46, 48);
ctx.strokeStyle = '#38bdf8';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(605, 425); ctx.lineTo(618, 438); ctx.lineTo(608, 452);
ctx.stroke();
ctx.fillStyle = hazardBlink ? '#fbbf24' : '#78350f';
ctx.fillRect(561, 412, 5, 12);
ctx.fillRect(561, 456, 5, 12);
ctx.fillStyle = hazardBlink ? '#ef4444' : '#7f1d1d';
ctx.fillRect(720, 412, 5, 12);
ctx.fillRect(720, 456, 5, 12);
ctx.restore();
this.drawNeonGlow(ctx, 65, 320, 110, '#10b981', 0.3);
ctx.fillStyle = '#10b981';
ctx.fillRect(48, 275, 14, 90);
this.drawPropBadge(ctx, 130, 260, this.t('canvas_safehouse_left'), '#6ee7b7', '#022c22');
const casinoPulse = 0.32 + 0.1 * Math.sin(this.animTime * 8);
this.drawNeonGlow(ctx, 925, 320, 165, '#ef4444', casinoPulse);
ctx.fillStyle = '#7f1d1d';
ctx.fillRect(885, 282, 65, 76);
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 2;
ctx.strokeRect(885, 282, 65, 76);
ctx.fillStyle = '#ef4444';
ctx.fillRect(938, 260, 14, 120);
this.drawPropBadge(ctx, 845, 245, this.t('canvas_casino_right'), '#fca5a5', '#450a0a');
if (this.streetNpcs) {
this.streetNpcs.forEach((npc, idx) => this.drawTopDownNpc(ctx, npc, idx + 30));
}
const lamps = [{ x: 210, y: 205 }, { x: 520, y: 205 }, { x: 820, y: 205 }];
lamps.forEach(l => {
this.drawNeonGlow(ctx, l.x, l.y, 120, '#f59e0b', 0.18);
ctx.fillStyle = '#fbbf24';
ctx.beginPath();
ctx.arc(l.x, l.y, 5, 0, Math.PI * 2);
ctx.fill();
});
if (this.settings.glows && !this.settings.lowEndMode) {
ctx.save();
puddles.forEach((p, idx) => {
ctx.strokeStyle = p.stroke;
ctx.lineWidth = 1;
const shimmerW = p.rx * (0.45 + 0.2 * Math.sin(this.animTime * 4 + idx));
ctx.beginPath();
ctx.moveTo(p.x - shimmerW, p.y - 3); ctx.lineTo(p.x + shimmerW, p.y - 3);
ctx.moveTo(p.x - shimmerW * 0.7, p.y + 4); ctx.lineTo(p.x + shimmerW * 0.7, p.y + 4);
ctx.stroke();
});
if (hazardBlink) {
const hlGrad = ctx.createLinearGradient(560, 440, 465, 440);
hlGrad.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
hlGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
ctx.fillStyle = hlGrad;
ctx.beginPath();
ctx.moveTo(560, 410); ctx.lineTo(465, 385); ctx.lineTo(465, 495); ctx.lineTo(560, 470);
ctx.closePath(); ctx.fill();
}
if (Math.sin(this.animTime * 19) > 0.75) {
ctx.strokeStyle = '#38bdf8';
ctx.lineWidth = 1.5;
ctx.beginPath();
ctx.moveTo(580, 425); ctx.lineTo(573, 419); ctx.lineTo(584, 415);
ctx.stroke();
}
if (this.smokePuffs) {
for (const sp of this.smokePuffs) {
ctx.fillStyle = `${sp.color}${Math.max(0, sp.alpha)})`;
ctx.beginPath();
ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
ctx.fill();
}
}
ctx.restore();
}
ctx.strokeStyle = '#334155';
ctx.lineWidth = 6;
ctx.strokeRect(b.x, b.y, b.w, b.h);
}
,
drawStreetBuildings(ctx, b) {
const topBlocks = [
{ x: 50, y: 18, w: 215, h: 110, bg: '#0b0d16', border: '#1e293b', sign: 'LOMBARD // LICHWA 24H', neon: '#ec4899', flicker: 1 },
{ x: 275, y: 12, w: 235, h: 116, bg: '#090d16', border: '#1e293b', sign: 'CYBER-KLINIKA // KREW', neon: '#22d3ee', flicker: 2 },
{ x: 520, y: 20, w: 210, h: 108, bg: '#100c1c', border: '#312e81', sign: 'HOTEL NOIR // POKOJE', neon: '#a855f7', flicker: 3 },
{ x: 740, y: 10, w: 210, h: 118, bg: '#18080c', border: '#7f1d1d', sign: '🎰 VELVET PIT CASINO 777', neon: '#f59e0b', flicker: 0 }
];
const botBlocks = [
{ x: 50, y: 492, w: 265, h: 92, bg: '#0c0f17', border: '#1e293b', sign: 'APTEKA NOCNA // STYMY', neon: '#10b981', flicker: 2 },
{ x: 325, y: 492, w: 285, h: 92, bg: '#120d16', border: '#3b0764', sign: 'BAR "ZDECHŁY PIES"', neon: '#f43f5e', flicker: 4 },
{ x: 620, y: 492, w: 330, h: 92, bg: '#16090d', border: '#7f1d1d', sign: 'VIP LOUNGE // RULETKA & KOŚCI', neon: '#fbbf24', flicker: 1 }
];
const renderBlock = (blk, isTop) => {
ctx.save();
this.drawRoundedRect(ctx, blk.x, blk.y, blk.w, blk.h, 6);
ctx.fillStyle = blk.bg;
ctx.fill();
ctx.strokeStyle = blk.border;
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.fillStyle = '#161b26';
ctx.strokeStyle = '#334155';
ctx.lineWidth = 1.2;
ctx.fillRect(blk.x + 18, blk.y + 16, 36, 26);
ctx.strokeRect(blk.x + 18, blk.y + 16, 36, 26);
ctx.save();
ctx.translate(blk.x + 36, blk.y + 29);
ctx.rotate(this.animTime * 4);
ctx.strokeStyle = '#64748b';
ctx.beginPath();
ctx.moveTo(-9, 0); ctx.lineTo(9, 0);
ctx.moveTo(0, -9); ctx.lineTo(0, 9);
ctx.stroke();
ctx.restore();
const winY = isTop ? blk.y + blk.h - 22 : blk.y + 8;
for (let wx = blk.x + 16; wx < blk.x + blk.w - 24; wx += 32) {
const isLit = ((wx + blk.x) % 3 === 0);
ctx.fillStyle = isLit ? 'rgba(251, 191, 36, 0.35)' : '#05070b';
ctx.fillRect(wx, winY, 18, 10);
ctx.strokeStyle = isLit ? '#f59e0b' : '#1e293b';
ctx.lineWidth = 1;
ctx.strokeRect(wx, winY, 18, 10);
}
const flickOn = blk.flicker === 0 || Math.sin(this.animTime * 12 + blk.flicker * 3) > -0.82;
const signX = blk.x + blk.w / 2;
const signY = isTop ? blk.y + blk.h - 38 : blk.y + 42;
if (flickOn) {
this.drawNeonGlow(ctx, signX, isTop ? signY + 42 : signY - 35, 115, blk.neon, 0.24);
}
ctx.font = '800 10.5px "JetBrains Mono", monospace';
const tw = ctx.measureText(blk.sign).width + 20;
this.drawRoundedRect(ctx, signX - tw / 2, signY - 11, tw, 22, 5);
ctx.fillStyle = '#05060a';
ctx.fill();
ctx.strokeStyle = flickOn ? blk.neon : '#334155';
ctx.lineWidth = 2;
if (flickOn && this.settings.glows && !this.settings.lowEndMode) {
ctx.shadowColor = blk.neon;
ctx.shadowBlur = 12;
}
ctx.stroke();
ctx.fillStyle = flickOn ? '#ffffff' : '#475569';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(blk.sign, signX, signY);
ctx.restore();
};
topBlocks.forEach(blk => renderBlock(blk, true));
botBlocks.forEach(blk => renderBlock(blk, false));
}
,
drawCasino(ctx) {
const b = this.zones[2].bounds;
if (this.cachedZoneFloors && this.cachedZoneFloors[2]) {
ctx.drawImage(this.cachedZoneFloors[2], 0, 0);
} else {
ctx.fillStyle = '#14060b';
ctx.fillRect(b.x, b.y, b.w, b.h);
ctx.strokeStyle = '#b45309';
ctx.lineWidth = 8;
ctx.strokeRect(b.x, b.y, b.w, b.h);
}
this.drawNeonGlow(ctx, 80, 310, 95, '#f59e0b', 0.25);
ctx.fillStyle = '#f59e0b';
ctx.fillRect(63, 265, 12, 90);
this.drawPropBadge(ctx, 140, 248, this.t('canvas_exit_street'), '#fde68a', '#451a03');
this.activeCasinoSlots.forEach(slot => {
const bx = slot.box.x;
const by = slot.box.y;
const bw = slot.box.w;
const bh = slot.box.h;
const cx = bx + bw / 2;
const cy = by + bh / 2;
this.drawNeonGlow(ctx, cx, cy, 135, slot.color, 0.25);
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.72)';
this.drawRoundedRect(ctx, bx + 5, by + 7, bw, bh, 18);
ctx.fill();
this.drawRoundedRect(ctx, bx, by, bw, bh, 18);
ctx.fillStyle = slot.bg;
ctx.fill();
ctx.strokeStyle = slot.color;
ctx.lineWidth = 3;
ctx.stroke();
this.drawRoundedRect(ctx, bx + 10, by + 10, bw - 20, bh - 20, 12);
ctx.fillStyle = '#090b10';
ctx.fill();
if (slot.type === 'crash') {
ctx.strokeStyle = '#e879f9';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(bx + 22, by + bh - 22);
ctx.quadraticCurveTo(cx, by + bh - 24, bx + bw - 24, by + 22);
ctx.stroke();
ctx.fillStyle = '#f59e0b';
ctx.beginPath();
ctx.arc(bx + bw - 26, by + 24, 6 + Math.sin(this.animTime * 8) * 2, 0, Math.PI * 2);
ctx.fill();
} else if (slot.type === 'mines') {
for (let gx = 0; gx < 4; gx++) {
for (let gy = 0; gy < 3; gy++) {
ctx.fillStyle = ((gx + gy) % 2 === 0) ? '#365314' : '#1a2e05';
ctx.fillRect(cx - 42 + gx * 22, cy - 24 + gy * 17, 18, 13);
}
}
} else if (slot.type === 'roul') {
ctx.save();
ctx.translate(cx - 28, cy);
ctx.rotate(this.animTime * 2.2);
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(0, 0, 22, 0, Math.PI * 2);
ctx.stroke();
ctx.restore();
} else if (slot.type === 'bj') {
ctx.fillStyle = '#065f46';
ctx.fillRect(bx + 14, by + 14, bw - 28, bh - 28);
ctx.fillStyle = '#f8fafc';
ctx.fillRect(cx - 14, cy - 8, 11, 16);
ctx.fillRect(cx + 2, cy - 6, 11, 16);
} else if (slot.type === 'dice') {
ctx.fillStyle = '#cffafe';
ctx.fillRect(cx - 18, cy - 8, 15, 15);
ctx.fillRect(cx + 4, cy - 4, 15, 15);
} else if (slot.type === 'slots') {
[bx + 22, cx - 16, bx + bw - 54].forEach((mx, idx) => {
ctx.fillStyle = '#fde68a';
ctx.fillRect(mx, cy - 14, 32, 24);
});
} else if (slot.type === 'tower') {
for (let fl = 0; fl < 3; fl++) {
ctx.fillStyle = '#0284c7';
ctx.fillRect(cx - 32 + fl * 6, cy + 10 - fl * 13, 64 - fl * 12, 9);
}
} else if (slot.type === 'pulse') {
ctx.fillStyle = '#134e4a';
ctx.fillRect(bx + 22, cy - 6, bw - 44, 12);
ctx.fillStyle = '#10b981';
ctx.fillRect(cx - 16, cy - 6, 32, 12);
const curX = bx + 26 + ((Math.sin(this.animTime * 5) * 0.5 + 0.5) * (bw - 52));
ctx.fillStyle = '#fbbf24';
ctx.fillRect(curX - 2, cy - 10, 4, 20);
} else if (slot.type === 'hilo') {
ctx.fillStyle = '#f472b6';
ctx.fillRect(cx - 20, cy - 12, 16, 24);
ctx.fillStyle = '#ffffff';
ctx.fillRect(cx + 4, cy - 12, 16, 24);
} else if (slot.type === 'cups') {
[-26, 0, 26].forEach(ox => {
ctx.fillStyle = '#c084fc';
ctx.beginPath();
ctx.arc(cx + ox, cy, 9, 0, Math.PI * 2);
ctx.fill();
});
}
if (this.settings.glows && !this.settings.lowEndMode) {
for (let bi = 0; bi < 6; bi++) {
const pulseOn = ((Math.floor(this.animTime * 8) + bi) % 2 === 0);
ctx.fillStyle = pulseOn ? '#ffffff' : slot.color;
ctx.beginPath();
ctx.arc(bx + 20 + bi * ((bw - 40) / 5), by + 5, 1.8, 0, Math.PI * 2);
ctx.arc(bx + 20 + bi * ((bw - 40) / 5), by + bh - 5, 1.8, 0, Math.PI * 2);
ctx.fill();
}
}
ctx.restore();
this.drawPropBadge(ctx, cx, by - 14, slot.title, slot.color, slot.bg, `${slot.variantText} • MIN $${this.getMinBet()}`);
});
const atmActive = !this.bloodPumpedThisNight;
this.drawNeonGlow(ctx, 727, 425, 125, atmActive ? '#dc2626' : '#52525b', atmActive ? 0.3 : 0.1);
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.7)';
ctx.fillRect(661, 392, 147, 82);
this.drawRoundedRect(ctx, 655, 385, 145, 80, 10);
ctx.fillStyle = '#1f0808';
ctx.fill();
ctx.strokeStyle = atmActive ? '#ef4444' : '#52525b';
ctx.lineWidth = 2.5;
ctx.stroke();
this.drawRoundedRect(ctx, 668, 396, 42, 58, 8);
ctx.fillStyle = '#09090b';
ctx.fill();
ctx.fillStyle = atmActive ? '#dc2626' : '#3f3f46';
const fillH = atmActive ? 46 : 12;
ctx.fillRect(672, 450 - fillH, 34, fillH);
ctx.fillStyle = '#09090b';
ctx.fillRect(720, 398, 68, 34);
ctx.strokeStyle = atmActive ? '#ef4444' : '#71717a';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(724, 415);
ctx.lineTo(740, 415);
ctx.lineTo(746, atmActive ? 403 : 415);
ctx.lineTo(753, atmActive ? 426 : 415);
ctx.lineTo(760, 415);
ctx.lineTo(784, 415);
ctx.stroke();
ctx.restore();
const atmTitle = this.bloodPumpedThisNight ? this.t('canvas_atm_used') : this.t('canvas_atm_ready');
this.drawPropBadge(ctx, 727, 368, atmTitle, atmActive ? '#fca5a5' : '#a1a1aa', '#3b0707');
this.casinoNpcs.forEach((npc, idx) => {
this.drawTopDownNpc(ctx, npc, idx);
});
this.drawTopDownNpc(ctx, {
x: this.casinoWaiter.x,
y: this.casinoWaiter.y,
facing: this.casinoWaiter.facing,
coat: '#3b0764',
trim: '#fbbf24',
hair: '#f8fafc',
role: 'waiter'
}, 99);

}
,
drawTopDownNpc(ctx, npc, seed = 0) {
const sway = npc.role === 'mafia' ? 0 : Math.sin(this.animTime * 2.8 + seed * 1.7) * 0.14;
const breathe = Math.sin(this.animTime * 4 + seed) * 0.7;
ctx.save();
ctx.translate(npc.x, npc.y);
ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
ctx.beginPath();
ctx.ellipse(0, 3, 13, 11, 0, 0, Math.PI * 2);
ctx.fill();
ctx.rotate((npc.facing || 0) + sway);
ctx.fillStyle = npc.coat || '#1e293b';
ctx.strokeStyle = npc.trim || '#94a3b8';
ctx.lineWidth = 1.3;
const handReach = npc.role === 'dealer' ? 4 + Math.sin(this.animTime * 5 + seed) * 3 : 2;
this.drawRoundedRect(ctx, handReach, -13, 9, 5, 2.5);
ctx.fill(); ctx.stroke();
this.drawRoundedRect(ctx, handReach, 8, 9, 5, 2.5);
ctx.fill(); ctx.stroke();
if (npc.role === 'waiter') {
ctx.beginPath();
ctx.arc(14, 0, 7, 0, Math.PI * 2);
ctx.fillStyle = '#fbbf24';
ctx.fill();
ctx.fillStyle = '#22d3ee';
ctx.beginPath();
ctx.arc(13, -2, 2.2, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#f43f5e';
ctx.beginPath();
ctx.arc(16, 2, 2.2, 0, Math.PI * 2);
ctx.fill();
}
this.drawRoundedRect(ctx, -8, -12 - breathe, 16, 24 + breathe * 2, 7);
ctx.fillStyle = npc.coat || '#1e293b';
ctx.fill();
ctx.strokeStyle = npc.trim || '#64748b';
ctx.lineWidth = 1.8;
ctx.stroke();
if (!this.settings.lowEndMode) {
if (npc.role === 'dealer') {
ctx.fillStyle = '#f8fafc';
ctx.fillRect(-2, -5, 6, 10);
ctx.fillStyle = npc.trim || '#ef4444';
ctx.beginPath();
ctx.moveTo(3, -3); ctx.lineTo(6, -5); ctx.lineTo(6, 5); ctx.lineTo(3, 3);
ctx.closePath(); ctx.fill();
} else if (npc.role === 'guard') {
ctx.fillStyle = '#27272a';
this.drawRoundedRect(ctx, -6, -14, 10, 5, 2); ctx.fill();
this.drawRoundedRect(ctx, -6, 9, 10, 5, 2); ctx.fill();
if (this.settings.glows) {
ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(52, 0); ctx.stroke();
}
}
}
ctx.beginPath();
ctx.arc(1, 0, 7.5, 0, Math.PI * 2);
ctx.fillStyle = npc.hair || '#cbd5e1';
ctx.fill();
ctx.strokeStyle = '#09090b';
ctx.lineWidth = 1.5;
ctx.stroke();
if (npc.visor) {
ctx.fillStyle = npc.visor;
ctx.fillRect(4, -5, 4, 10);
} else if (npc.smoking) {
ctx.fillStyle = '#f8fafc';
ctx.fillRect(7, 2, 5, 1.8);
ctx.fillStyle = '#ef4444';
ctx.beginPath();
ctx.arc(12.5, 2.8, 1.8 + Math.sin(this.animTime * 8) * 0.5, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();
}
,
drawPropBadge(ctx, x, y, title, textColor, bgColor, subtitle = '') {
if (this.pendingBadges) {
this.pendingBadges.push({ x, y, title, textColor, bgColor, subtitle });
return;
}
this.renderPropBadgeImmediate(ctx, x, y, title, textColor, bgColor, subtitle);
},
renderPropBadgeImmediate(ctx, x, y, title, textColor, bgColor, subtitle = '') {
ctx.save();
ctx.font = '800 10.5px "JetBrains Mono", monospace';
const titleW = ctx.measureText(title).width;
const subW = subtitle ? ctx.measureText(subtitle).width : 0;
const boxW = Math.max(titleW, subW) + 18;
const boxH = subtitle ? 30 : 19;
const bx = x - boxW / 2;
const by = y - boxH / 2;
this.drawRoundedRect(ctx, bx, by, boxW, boxH, 6);
ctx.fillStyle = bgColor || 'rgba(9, 9, 11, 0.9)';
ctx.globalAlpha = 0.94;
ctx.fill();
ctx.globalAlpha = 1;
ctx.strokeStyle = textColor;
ctx.lineWidth = 1.2;
ctx.stroke();
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(title, x, subtitle ? y - 5 : y);
if (subtitle) {
ctx.fillStyle = textColor;
ctx.font = '700 8.5px "JetBrains Mono", monospace';
ctx.fillText(subtitle, x, y + 7);
}
ctx.restore();
},
flushPropBadges(ctx) {
if (!this.pendingBadges || !this.pendingBadges.length) return;
for (const b of this.pendingBadges) {
this.renderPropBadgeImmediate(ctx, b.x, b.y, b.title, b.textColor, b.bgColor, b.subtitle);
}
this.pendingBadges = [];
},
drawNpcBubbles(ctx) {
for (const b of this.npcBubbles) {
ctx.save();
ctx.globalAlpha = Math.max(0, b.alpha);
ctx.font = '800 9.5px "JetBrains Mono", monospace';
const tw = ctx.measureText(b.text).width + 12;
this.drawRoundedRect(ctx, b.x - tw / 2, b.y - 9, tw, 18, 5);
ctx.fillStyle = 'rgba(9, 9, 11, 0.92)';
ctx.fill();
ctx.strokeStyle = b.color;
ctx.lineWidth = 1.2;
ctx.stroke();
ctx.fillStyle = b.color;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(b.text, b.x, b.y);
ctx.restore();
}
},
drawCutsceneWorldUnderPlayer(ctx) {
const cs = this.cutscene;
if (!cs || !cs.active) return;
if (cs.switchedToStreet) {
ctx.save();
const lx = 235, ly = 278, lw = 155, lh = 72;
const beamGrad = ctx.createLinearGradient(lx + lw, ly + lh / 2, 575, ly + lh / 2);
beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.36)');
beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
ctx.fillStyle = beamGrad;
ctx.beginPath();
ctx.moveTo(lx + lw, ly + 10);
ctx.lineTo(585, 245);
ctx.lineTo(585, 385);
ctx.lineTo(lx + lw, ly + lh - 10);
ctx.closePath();
ctx.fill();
ctx.fillStyle = 'rgba(0,0,0,0.75)';
this.drawRoundedRect(ctx, lx + 5, ly + 7, lw, lh, 12);
ctx.fill();
this.drawRoundedRect(ctx, lx, ly, lw, lh, 12);
ctx.fillStyle = '#09090b';
ctx.fill();
ctx.strokeStyle = '#dc2626';
ctx.lineWidth = 2.5;
ctx.stroke();
this.drawRoundedRect(ctx, lx + 28, ly + 8, lw - 58, lh - 16, 6);
ctx.fillStyle = '#18181b';
ctx.fill();
ctx.fillStyle = '#fef08a';
ctx.fillRect(lx + lw - 5, ly + 8, 5, 14);
ctx.fillRect(lx + lw - 5, ly + lh - 22, 5, 14);
ctx.restore();
}
if (cs.bloodPoolR > 0) {
ctx.save();
ctx.fillStyle = 'rgba(153, 27, 27, 0.85)';
ctx.beginPath();
ctx.ellipse(this.player.x, this.player.y + 2, cs.bloodPoolR, cs.bloodPoolR * 0.68, 0.1, 0, Math.PI * 2);
ctx.fill();
for (const bd of cs.bloodDrops) {
ctx.fillStyle = '#dc2626';
ctx.beginPath();
ctx.arc(bd.x, bd.y, bd.r, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();
}
},
drawCutsceneWorldOverPlayer(ctx) {
const cs = this.cutscene;
if (!cs || !cs.active) return;
cs.goons.forEach((g, idx) => {
const aimAngle = Math.atan2(this.player.y - g.y, this.player.x - g.x);
g.facing = aimAngle;
this.drawTopDownNpc(ctx, g, 70 + idx);
const muzzleX = g.x + Math.cos(aimAngle) * 22;
const muzzleY = g.y + Math.sin(aimAngle) * 22;
// Wiązka lasera celująca bezpośrednio w środek gracza
ctx.save();
ctx.strokeStyle = cs.phase === 'SHOOTING' ? 'rgba(239, 68, 68, 0.85)' : 'rgba(239, 68, 68, 0.62)';
ctx.lineWidth = 1.4;
ctx.beginPath();
ctx.moveTo(muzzleX, muzzleY);
ctx.lineTo(this.player.x, this.player.y);
ctx.stroke();
ctx.fillStyle = '#ef4444';
ctx.beginPath();
ctx.arc(this.player.x, this.player.y, 2.8, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
// Broń wycelowana idealnie wzdłuż linii strzału
ctx.save();
ctx.translate(g.x, g.y);
ctx.rotate(aimAngle);
ctx.fillStyle = '#18181b';
ctx.strokeStyle = '#71717a';
ctx.lineWidth = 1.2;
ctx.fillRect(8, -2, 15, 4);
ctx.strokeRect(8, -2, 15, 4);
if (g.muzzleTimer > 0) {
ctx.fillStyle = '#fef08a';
ctx.beginPath();
ctx.arc(24, 0, 6 + Math.random() * 4, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();
});
for (const tr of cs.tracers) {
ctx.save();
ctx.strokeStyle = `rgba(253, 224, 71, ${Math.max(0, tr.alpha)})`;
ctx.lineWidth = 2.4;
ctx.beginPath();
ctx.moveTo(tr.x1, tr.y1);
ctx.lineTo(tr.x2, tr.y2);
ctx.stroke();
ctx.restore();
}
if (cs.phase === 'KIDNAP') {
this.renderPropBadgeImmediate(ctx, this.player.x, this.player.y - 26, this.lang === 'uk' ? '⛓ ВИКРАДЕНО МАФІЄЮ!' : '⛓ PORWANY PRZEZ MAFIĘ!', '#fca5a5', '#450a0a');
} else if (cs.phase === 'ARRIVAL') {
this.renderPropBadgeImmediate(ctx, cs.goons[0].x, cs.goons[0].y - 24, '💀 MAFIA SYNDYKATU', '#fca5a5', '#450a0a');
} else if (cs.phase === 'STREET_AIM') {
this.renderPropBadgeImmediate(ctx, cs.goons[1].x, cs.goons[1].y - 26, '🎯 EGZEKUTORZY SYNDYKATU', '#fca5a5', '#450a0a');
}
},
drawCutsceneScreenOverlay(ctx, cw, ch) {
const cs = this.cutscene;
if (!cs || !cs.active) return;
ctx.save();
if (cs.flashAlpha > 0) {
ctx.fillStyle = `rgba(239, 68, 68, ${cs.flashAlpha})`;
ctx.fillRect(0, 0, cw, ch);
}
const barH = Math.max(52, Math.round(ch * 0.12));
ctx.fillStyle = 'rgba(3, 4, 7, 0.94)';
ctx.fillRect(0, 0, cw, barH);
ctx.fillRect(0, ch - barH, cw, barH);
ctx.strokeStyle = '#dc2626';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(0, barH); ctx.lineTo(cw, barH);
ctx.moveTo(0, ch - barH); ctx.lineTo(cw, ch - barH);
ctx.stroke();
ctx.fillStyle = '#ef4444';
const topFontPx = cw < 420 ? 9.5 : 11;
ctx.font = `800 ${topFontPx}px "JetBrains Mono", monospace`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('🎬 SYNDICATE_EXECUTION_PROTOCOL // CUTSCENE', cw / 2, barH / 2, cw - 16);
if (cs.subtitle) {
ctx.fillStyle = '#fef3c7';
const subFontPx = cw < 480 ? 10.5 : 13.5;
ctx.font = `800 ${subFontPx}px "JetBrains Mono", monospace`;
const maxSubW = cw - 24;
const words = cs.subtitle.split(' ');
const lines = [];
let curLine = '';
for (const w of words) {
const test = curLine ? `${curLine} ${w}` : w;
if (ctx.measureText(test).width > maxSubW && curLine) {
lines.push(curLine);
curLine = w;
} else {
curLine = test;
}
}
if (curLine) lines.push(curLine);
const lineH = subFontPx + 4;
const startY = (ch - barH / 2) - ((lines.length - 1) * lineH) / 2;
lines.forEach((ln, i) => {
ctx.fillText(ln, cw / 2, startY + i * lineH, maxSubW);
});
}
if (cs.blackAlpha > 0) {
ctx.fillStyle = `rgba(0, 0, 0, ${cs.blackAlpha})`;
ctx.fillRect(0, 0, cw, ch);
if (cs.blackAlpha > 0.4) {
const textAlpha = Math.min(1, (cs.blackAlpha - 0.4) / 0.45);
ctx.globalAlpha = textAlpha;
const badgeText = this.lang === 'uk' ? 'КОНТРАКТ РОЗІРВАНО' : 'KONTRAKT ZERWANY';
const titleText = this.lang === 'uk' ? 'БОРГ СТЯГНУТО' : 'DŁUG WYEGZEKWOWANY';
const maxAllowedW = Math.max(200, cw * 0.88);
// Dopasowanie rozmiaru napisu głównego jak w intro ZSAGames (responsywne na telefonach i PC)
let titlePx = Math.max(18, Math.min(48, Math.floor(cw * 0.068)));
ctx.font = `800 ${titlePx}px "Syne", sans-serif`;
const measuredW = ctx.measureText(titleText).width;
if (measuredW > maxAllowedW) {
titlePx = Math.max(15, Math.floor(titlePx * (maxAllowedW / measuredW)));
ctx.font = `800 ${titlePx}px "Syne", sans-serif`;
}
// Mały nagłówek nad tytułem
const badgePx = Math.max(10, Math.min(13, Math.floor(cw * 0.028)));
ctx.font = `800 ${badgePx}px "JetBrains Mono", monospace`;
ctx.fillStyle = '#f87171';
ctx.fillText(badgeText, cw / 2, ch / 2 - titlePx * 0.95);
// Główny tytuł w stylu ZSAGames Intro
ctx.save();
ctx.font = `800 ${titlePx}px "Syne", sans-serif`;
ctx.fillStyle = '#dc2626';
ctx.shadowColor = 'rgba(220, 38, 38, 0.75)';
ctx.shadowBlur = 28;
ctx.fillText(titleText, cw / 2, ch / 2 - 4);
ctx.restore();
// Świecąca linia pod tytułem jak w intro ZSAGames
const lineW = Math.min(160, cw * 0.42);
const lineGrad = ctx.createLinearGradient(cw / 2 - lineW / 2, 0, cw / 2 + lineW / 2, 0);
lineGrad.addColorStop(0, 'rgba(220, 38, 38, 0)');
lineGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.9)');
lineGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
ctx.fillStyle = lineGrad;
ctx.fillRect(cw / 2 - lineW / 2, ch / 2 + titlePx * 0.45, lineW, 2);
// Zawijanie tekstu przyczyny zgonu na ekranach mobilnych
const reasonPx = cw < 480 ? 11 : 13;
ctx.font = `700 ${reasonPx}px "JetBrains Mono", monospace`;
ctx.fillStyle = '#fca5a5';
const rWords = (cs.reason || '').split(' ');
const rLines = [];
let rCur = '';
for (const w of rWords) {
const test = rCur ? `${rCur} ${w}` : w;
if (ctx.measureText(test).width > maxAllowedW && rCur) {
rLines.push(rCur);
rCur = w;
} else {
rCur = test;
}
}
if (rCur) rLines.push(rCur);
const rLineH = reasonPx + 5;
const rStartY = ch / 2 + titlePx * 0.45 + 22;
rLines.forEach((ln, idx) => {
ctx.fillText(ln, cw / 2, rStartY + idx * rLineH, maxAllowedW);
});
}
}
ctx.restore();
}
,
drawPlayer(ctx) {
const p = this.player;
for (const tr of p.trail) {
ctx.save();
ctx.globalAlpha = Math.max(0, tr.alpha);
ctx.fillStyle = this.relics.has('loaded_boots') ? '#38bdf8' : '#f59e0b';
ctx.beginPath();
ctx.arc(tr.x, tr.y, p.r * 0.75, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
}
ctx.save();
ctx.translate(p.x, p.y);
if (this.cutscene && this.cutscene.active && this.cutscene.playerDown) {
ctx.rotate(0.85);
ctx.scale(1.12, 0.68);
}
if (this.settings.glows && !this.settings.lowEndMode) {
const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 56);
auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
auraGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.14)');
auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = auraGrad;
ctx.beginPath();
ctx.arc(0, 0, 56, 0, Math.PI * 2);
ctx.fill();
}
ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
ctx.beginPath();
ctx.ellipse(0, 4, p.r + 3, p.r + 1, 0, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = this.relics.has('loaded_boots') ? 'rgba(56, 189, 248, 0.7)' : 'rgba(251, 191, 36, 0.65)';
ctx.lineWidth = 1.8;
ctx.beginPath();
ctx.arc(0, 0, p.r + 4 + Math.sin(this.animTime * 5) * 1.2, 0, Math.PI * 2);
ctx.stroke();
ctx.rotate(p.facing);
if (this.settings.glows && !this.settings.lowEndMode) {
const coneGrad = ctx.createLinearGradient(8, 0, 175, 0);
coneGrad.addColorStop(0, 'rgba(254, 243, 199, 0.26)');
coneGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.09)');
coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = coneGrad;
ctx.beginPath();
ctx.moveTo(6, -4);
ctx.lineTo(175, -62);
ctx.arc(0, 0, 185, -0.34, 0.34);
ctx.lineTo(6, 4);
ctx.closePath();
ctx.fill();
}
const stride = Math.sin(p.walkCycle) * 7 * p.moveAmount;
const armSwing = Math.cos(p.walkCycle) * 5 * p.moveAmount;
const breathe = Math.sin(this.animTime * 3.5) * 0.8;
ctx.fillStyle = this.relics.has('loaded_boots') ? '#0284c7' : '#27272a';
ctx.strokeStyle = '#e2e8f0';
ctx.lineWidth = 1.2;
this.drawRoundedRect(ctx, stride - 5, -13, 11, 6, 3);
ctx.fill(); ctx.stroke();
this.drawRoundedRect(ctx, -stride - 5, 7, 11, 6, 3);
ctx.fill(); ctx.stroke();
ctx.fillStyle = '#1e293b';
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 1.5;
this.drawRoundedRect(ctx, -armSwing - 3, -16 - breathe, 12, 6, 3);
ctx.fill(); ctx.stroke();
this.drawRoundedRect(ctx, armSwing + 1, 10 + breathe, 13, 6, 3);
ctx.fill(); ctx.stroke();
this.drawRoundedRect(ctx, -10, -14 - breathe, 19, 28 + breathe * 2, 8);
ctx.fillStyle = '#0f172a';
ctx.fill();
ctx.strokeStyle = '#f59e0b';
ctx.lineWidth = 2.2;
ctx.stroke();
ctx.strokeStyle = '#38bdf8';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(-1, 0, 11, -Math.PI * 0.65, Math.PI * 0.65);
ctx.stroke();
ctx.beginPath();
ctx.arc(1, 0, 9.5, 0, Math.PI * 2);
ctx.fillStyle = '#1e293b';
ctx.fill();
ctx.lineWidth = 2;
ctx.strokeStyle = '#fef3c7';
ctx.stroke();
if (!this.settings.lowEndMode) {
ctx.fillStyle = '#334155';
ctx.fillRect(-8, -12, 5, 24);
for (let si = -6; si <= 6; si += 6) {
ctx.fillStyle = '#22d3ee';
ctx.fillRect(-7, si - 1, 2.5, 2);
}
ctx.fillStyle = '#64748b';
ctx.fillRect(armSwing + 10, 11.5 + breathe, 6, 3.5);
ctx.fillStyle = '#fef08a';
ctx.beginPath(); ctx.arc(armSwing + 16.5, 13.2 + breathe, 2.2, 0, Math.PI * 2); ctx.fill();
}
this.drawRoundedRect(ctx, 4, -6.5, 6.5, 13, 2.5);
ctx.fillStyle = '#38bdf8';
ctx.fill();
ctx.fillStyle = '#e0f2fe';
ctx.fillRect(6, -4, 3, 8);
ctx.restore();
}
,
drawNoirLightingOverlay(ctx) {
ctx.save();
const p = this.player;
const grad = ctx.createRadialGradient(p.x, p.y, 75, p.x, p.y, 310);
grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
grad.addColorStop(0.55, 'rgba(3, 5, 10, 0.48)');
grad.addColorStop(0.85, 'rgba(2, 3, 7, 0.88)');
grad.addColorStop(1, 'rgba(1, 2, 5, 0.97)');
ctx.fillStyle = grad;
ctx.fillRect(p.x - 1000, p.y - 1000, 2000, 2000);
ctx.restore();
},
drawRain(ctx) {
ctx.save();
for (const sp of this.rainSplashes) {
ctx.strokeStyle = `rgba(125, 211, 252, ${Math.max(0, sp.alpha)})`;
ctx.lineWidth = 1.2;
ctx.beginPath();
ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.45, 0, 0, Math.PI * 2);
ctx.stroke();
}
ctx.strokeStyle = 'rgba(125, 211, 252, 0.42)';
ctx.lineWidth = 1.5;
ctx.beginPath();
for (const d of this.rain) {
ctx.moveTo(d.x, d.y);
ctx.lineTo(d.x - 4, d.y + d.len);
}
ctx.stroke();
ctx.restore();
}
});
if (!window.game) window.game = new VelvetPitGame();