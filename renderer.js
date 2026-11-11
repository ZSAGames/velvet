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
// 1. Głębokie, przygaszone niebo Noir (ciemny indygo/grafit — łagodne dla oczu)
const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
skyGrad.addColorStop(0, '#020306');
skyGrad.addColorStop(0.45, '#050811');
skyGrad.addColorStop(0.78, '#0b101d');
skyGrad.addColorStop(1, '#040509');
ctx.fillStyle = skyGrad;
ctx.fillRect(0, 0, w, h);

// 2. Blady księżyc za ciężkimi chmurami smogu
const moonX = w * 0.78;
const moonY = h * 0.18;
const moonGlow = ctx.createRadialGradient(moonX, moonY, 4, moonX, moonY, Math.min(w, h) * 0.22);
moonGlow.addColorStop(0, 'rgba(203, 213, 225, 0.16)');
moonGlow.addColorStop(0.35, 'rgba(100, 116, 139, 0.06)');
moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = moonGlow;
ctx.fillRect(0, 0, w, h);

// Powolne pasma ciemnych chmur smogu
for (let c = 0; c < 4; c++) {
const cx = ((w * 0.25 * c + this.animTime * (6 + c * 2)) % (w + 320)) - 160;
const cy = h * (0.12 + c * 0.07);
const cwCloud = 260 + c * 55;
const chCloud = 26 + c * 8;
ctx.fillStyle = 'rgba(9, 13, 24, 0.55)';
ctx.beginPath();
ctx.ellipse(cx, cy, cwCloud * 0.5, chCloud * 0.5, 0, 0, Math.PI * 2);
ctx.fill();
}

// 3. Bardzo delikatna, przytłumiona łuna miejskiego smogu nad horyzontem
const leftHaze = ctx.createRadialGradient(w * 0.18, h * 0.68, 20, w * 0.18, h * 0.68, w * 0.36);
leftHaze.addColorStop(0, 'rgba(14, 116, 144, 0.09)');
leftHaze.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = leftHaze;
ctx.fillRect(0, 0, w, h);

const rightHaze = ctx.createRadialGradient(w * 0.82, h * 0.68, 20, w * 0.82, h * 0.68, w * 0.36);
rightHaze.addColorStop(0, 'rgba(153, 27, 27, 0.09)');
rightHaze.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = rightHaze;
ctx.fillRect(0, 0, w, h);

// 4. Dalekie monolityczne megabloki korporacji (sylwetki w głębi)
const farTowers = [
{ xf: 0.02, wf: 0.10, hf: 0.58 },
{ xf: 0.11, wf: 0.09, hf: 0.68 },
{ xf: 0.19, wf: 0.08, hf: 0.52 },
{ xf: 0.28, wf: 0.11, hf: 0.44 },
{ xf: 0.61, wf: 0.11, hf: 0.46 },
{ xf: 0.71, wf: 0.09, hf: 0.64 },
{ xf: 0.79, wf: 0.10, hf: 0.71 },
{ xf: 0.88, wf: 0.11, hf: 0.56 }
];
farTowers.forEach((t, idx) => {
const tx = Math.floor(t.xf * w);
const tw = Math.ceil(t.wf * w);
const th = Math.floor(t.hf * h);
const ty = h - th;
ctx.fillStyle = '#04060c';
ctx.fillRect(tx, ty, tw, th);
ctx.strokeStyle = 'rgba(30, 41, 59, 0.28)';
ctx.lineWidth = 1;
ctx.strokeRect(tx, ty, tw, th);

// Pionowe pasy przygaszonych świateł w dalekich wieżowcach
ctx.fillStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.07)' : 'rgba(217, 119, 6, 0.07)';
ctx.fillRect(tx + tw * 0.3, ty + 18, 2, th - 36);
ctx.fillRect(tx + tw * 0.68, ty + 28, 2, th - 46);

// Antena dachowa z powolnym czerwonym światłem ostrzegawczym
const ax = tx + tw * 0.5;
ctx.strokeStyle = '#0f172a';
ctx.lineWidth = 1.2;
ctx.beginPath();
ctx.moveTo(ax, ty);
ctx.lineTo(ax, ty - 28);
ctx.stroke();
const beaconAlpha = 0.2 + 0.45 * (0.5 + 0.5 * Math.sin(this.animTime * 1.4 + idx * 1.9));
ctx.fillStyle = `rgba(220, 38, 38, ${beaconAlpha.toFixed(2)})`;
ctx.beginPath();
ctx.arc(ax, ty - 28, 2, 0, Math.PI * 2);
ctx.fill();
});

// 5. Estakada / wiadukt kolejki w oddali z powoli jadącymi światłami aut
const bridgeY = Math.floor(h * 0.74);
ctx.fillStyle = '#03050a';
ctx.fillRect(0, bridgeY, w, 7);
for (let px = 40; px < w; px += 110) {
ctx.fillRect(px, bridgeY + 7, 8, h - bridgeY);
}
for (let c = 0; c < 5; c++) {
const dir = c % 2 === 0 ? 1 : -1;
const speed = 28 + c * 9;
const carX = dir > 0
? ((this.animTime * speed + c * 210) % (w + 80)) - 40
: w + 40 - ((this.animTime * speed + c * 210) % (w + 80));
const carY = dir > 0 ? bridgeY - 2 : bridgeY + 1;
ctx.fillStyle = dir > 0 ? 'rgba(220, 38, 38, 0.42)' : 'rgba(251, 191, 36, 0.35)';
ctx.fillRect(carX, carY, 12, 2.5);
}

// 6. Pierwszy plan: ponure kamienice i bloki Neon Noir (stonowane okna i szyldy)
const frontBlocks = [
{ xf: -0.01, wf: 0.085, hf: 0.38, tint: 'rgba(34, 211, 238, 0.25)', sign: 'SYN-CORP' },
{ xf: 0.07,  wf: 0.090, hf: 0.48, tint: 'rgba(244, 63, 94, 0.24)',  sign: 'HOTEL NOIR' },
{ xf: 0.155, wf: 0.080, hf: 0.36, tint: 'rgba(217, 119, 6, 0.24)',  sign: 'PAWN 24H' },
{ xf: 0.23,  wf: 0.075, hf: 0.27, tint: 'rgba(16, 185, 129, 0.20)', sign: '' },
{ xf: 0.695, wf: 0.075, hf: 0.28, tint: 'rgba(56, 189, 248, 0.20)', sign: '' },
{ xf: 0.765, wf: 0.085, hf: 0.39, tint: 'rgba(217, 119, 6, 0.24)',  sign: 'BLACKWATER' },
{ xf: 0.845, wf: 0.090, hf: 0.50, tint: 'rgba(225, 29, 72, 0.25)',  sign: 'VELVET PIT' },
{ xf: 0.93,  wf: 0.085, hf: 0.37, tint: 'rgba(168, 85, 247, 0.22)', sign: 'CLINIC' }
];

frontBlocks.forEach((b, bIdx) => {
const bx = Math.floor(b.xf * w);
const bw = Math.ceil(b.wf * w);
const bh = Math.floor(b.hf * h);
const by = h - bh;

// Ciemna bryła budynku
ctx.fillStyle = '#030509';
ctx.fillRect(bx, by, bw, bh);
ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
ctx.lineWidth = 1;
ctx.strokeRect(bx, by, bw, bh);

// Klimatyzatory i gzymsy na fasadzie
for (let gy = by + 28; gy < h - 30; gy += 42) {
ctx.fillStyle = '#070a12';
ctx.fillRect(bx + 2, gy, bw - 4, 2);
}

// Przygaszony szyld neonowy (bez ostrego mrugania!)
if (b.sign && bw >= 52) {
const slowBreath = 0.32 + 0.12 * Math.sin(this.animTime * 1.2 + bIdx * 1.7);
ctx.save();
ctx.globalAlpha = slowBreath;
const signW = Math.min(bw - 8, 84);
const signH = 14;
const sx = bx + (bw - signW) * 0.5;
const sy = by - signH - 3;
ctx.fillStyle = '#030408';
ctx.fillRect(sx, sy, signW, signH);
ctx.strokeStyle = b.tint;
ctx.lineWidth = 1;
ctx.strokeRect(sx, sy, signW, signH);
ctx.fillStyle = '#cbd5e1';
ctx.font = '700 8px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(b.sign, sx + signW * 0.5, sy + signH * 0.5, signW - 4);
ctx.restore();
}

// Pojedyncze, melancholijne okna (większość budynku pogrążona w mroku)
const cols = Math.max(2, Math.floor((bw - 14) / 13));
const rows = Math.max(3, Math.floor((bh - 28) / 16));
const padX = Math.max(6, Math.floor((bw - cols * 6) / (cols + 1)));
for (let r = 0; r < rows; r++) {
const wy = by + 14 + r * 15;
if (wy > h - 22) break;
for (let c = 0; c < cols; c++) {
const seed = (bIdx * 37 + r * 19 + c * 11) % 23;
if (seed > 5) continue; // Tylko ~25% okien świeci dla ponurego klimatu noir
const wx = bx + padX + c * (6 + padX * 0.5);
if (wx + 5 > bx + bw - 4) continue;
const winAlpha = 0.16 + 0.08 * Math.sin(this.animTime * 0.7 + seed);
if (seed % 3 === 0) {
ctx.fillStyle = `rgba(217, 119, 6, ${winAlpha.toFixed(2)})`;
} else if (seed % 2 === 0) {
ctx.fillStyle = `rgba(56, 189, 248, ${(winAlpha * 0.85).toFixed(2)})`;
} else {
ctx.fillStyle = `rgba(148, 163, 184, ${(winAlpha * 0.75).toFixed(2)})`;
}
ctx.fillRect(wx, wy, 5, 7);
}
}
});

// 7. Melancholijny deszcz Noir i gęsta mgła przy ziemi + ciemna winieta
ctx.strokeStyle = 'rgba(148, 163, 184, 0.13)';
ctx.lineWidth = 1;
ctx.beginPath();
for (let i = 0; i < 48; i++) {
const rx = ((i * 73 + w - (this.animTime * 45) % w) % w);
const ry = ((i * 59 + this.animTime * (260 + (i % 5) * 25)) % h);
ctx.moveTo(rx, ry);
ctx.lineTo(rx - 3, ry + 13);
}
ctx.stroke();

const mistGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
mistGrad.addColorStop(0, 'rgba(3, 4, 8, 0)');
mistGrad.addColorStop(0.6, 'rgba(6, 9, 17, 0.68)');
mistGrad.addColorStop(1, 'rgba(2, 3, 6, 0.95)');
ctx.fillStyle = mistGrad;
ctx.fillRect(0, h * 0.72, w, h * 0.28);

const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.22, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
vig.addColorStop(1, 'rgba(1, 2, 5, 0.65)');
ctx.fillStyle = vig;
ctx.fillRect(0, 0, w, h);
},
updateAndRenderMenuCash(dt) {
if (!this.mainMenuOpen || !this.menuCashCtx || !this.menuCashCanvas) return;
const ctx = this.menuCashCtx;
const w = this.menuCashCanvas.width;
const h = this.menuCashCanvas.height;
ctx.clearRect(0, 0, w, h);

// TRYB DLA SŁABYCH PC (LOW-END MODE): mniej spadających banknotów 2D w stonowanych barwach
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
ctx.fillStyle = 'rgba(6, 78, 59, 0.75)';
ctx.fillRect(bx - bw * 0.5, by - bh * 0.5, bw, bh);
ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
ctx.lineWidth = 1.2;
ctx.strokeRect(bx - bw * 0.5, by - bh * 0.5, bw, bh);
ctx.fillStyle = 'rgba(217, 119, 6, 0.85)';
ctx.fillText('$', bx, by);
}
return;
}

// TRYB NORMALNY: Ponura panorama Neon Noir + stonowane banknoty 3D
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
const bx = b.xFrac * w + Math.sin(this.animTime * 1.1 + i) * 10;
const by = b.y;
const hw = 40 * b.z;
const hh = 20 * b.z;
const hd = (b.thickness * 0.45) * b.z;
const localVerts = [
[-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
[-hw, -hh,  hd], [hw, -hh,  hd], [hw, hh,  hd], [-hw, hh,  hd]
];
const pts = localVerts.map(v => rot3D(v[0], v[1], v[2], b.rx, b.ry, b.rz));
const faces = [
{ idx: [0, 1, 2, 3], type: 'front', color: '#065f46', stroke: '#34d399' },
{ idx: [5, 4, 7, 6], type: 'back',  color: '#064e3b', stroke: '#10b981' },
{ idx: [4, 5, 1, 0], type: 'sideLong', color: '#022c22', stroke: '#064e3b' },
{ idx: [3, 2, 6, 7], type: 'sideLong', color: '#022c22', stroke: '#064e3b' },
{ idx: [4, 0, 3, 7], type: 'sideShort', color: '#042f2e', stroke: '#022c22' },
{ idx: [1, 5, 6, 2], type: 'sideShort', color: '#042f2e', stroke: '#022c22' }
];
faces.forEach(f => {
f.avgZ = (pts[f.idx[0]].z + pts[f.idx[1]].z + pts[f.idx[2]].z + pts[f.idx[3]].z) * 0.25;
});
faces.sort((aFace, bFace) => bFace.avgZ - aFace.avgZ);
ctx.save();
ctx.globalAlpha = b.side === 'center' ? 0.35 : 0.62;
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
ctx.lineWidth = 0.9;
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
ctx.fillStyle = f.type === 'sideLong' ? '#92400e' : '#d97706';
ctx.fill();
if (f.type === 'front' || f.type === 'back') {
const cx = (p0.x + p1.x + p2.x + p3.x) * 0.25;
const cy = (p0.y + p1.y + p2.y + p3.y) * 0.25;
ctx.beginPath();
ctx.arc(cx, cy, 3.8 * b.z, 0, Math.PI * 2);
ctx.fillStyle = '#022c22';
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
if (!this.settings.lowEndMode && this.settings.glows) {
this.drawRaytracedSceneLighting(ctx);
}
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
if ((this.zone === 1 || this.zone === 2) && (!this.cutscene || !this.cutscene.active)) {
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
// Ślady na podłodze, rysy i plamy
ctx.fillStyle = 'rgba(127, 29, 29, 0.22)';
ctx.beginPath();
ctx.arc(345, 290, 24, 0, Math.PI * 2);
ctx.arc(362, 302, 14, 0, Math.PI * 2);
ctx.fill();

// Wycieraczka przy drzwiach wyjściowych
ctx.save();
this.drawRoundedRect(ctx, 458, 454, 84, 24, 4);
ctx.fillStyle = '#1c1917';
ctx.fill();
ctx.strokeStyle = '#44403c';
ctx.lineWidth = 1.5;
ctx.stroke();
ctx.fillStyle = '#57534e';
ctx.font = '800 7.5px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.fillText('WELCOME', 500, 469);
ctx.restore();

// Stolik kawowy na dywanie z popielniczką, dymkiem papierosa i kartami
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.45)';
this.drawRoundedRect(ctx, 454, 266, 68, 46, 6);
ctx.fill();
this.drawRoundedRect(ctx, 450, 262, 68, 46, 6);
ctx.fillStyle = '#271c19';
ctx.fill();
ctx.strokeStyle = '#573d32';
ctx.lineWidth = 1.8;
ctx.stroke();
// Pudełko po pizzy i popielniczka
ctx.fillStyle = '#d6d3d1';
ctx.fillRect(458, 270, 22, 20);
ctx.fillStyle = '#dc2626';
ctx.fillRect(463, 275, 12, 10);
ctx.fillStyle = '#334155';
ctx.beginPath(); ctx.arc(500, 286, 6, 0, Math.PI * 2); ctx.fill();
ctx.fillStyle = '#ef4444';
ctx.beginPath(); ctx.arc(502, 286, 1.5, 0, Math.PI * 2); ctx.fill();
if (!this.settings.lowEndMode) {
const wispY = (this.animTime * 12) % 18;
ctx.strokeStyle = `rgba(203, 213, 225, ${(0.35 - wispY / 60).toFixed(2)})`;
ctx.lineWidth = 1.2;
ctx.beginPath();
ctx.moveTo(502, 285 - wispY * 0.4);
ctx.quadraticCurveTo(506 + Math.sin(this.animTime * 4) * 3, 276 - wispY, 500, 268 - wispY);
ctx.stroke();
}
ctx.restore();

// Aneks kuchenny przy prawej ścianie (zlew z kapiącym kranem i mikrofalówka)
ctx.save();
this.drawRoundedRect(ctx, 836, 235, 38, 125, 5);
ctx.fillStyle = '#1e293b';
ctx.fill();
ctx.strokeStyle = '#475569';
ctx.lineWidth = 2;
ctx.stroke();
// Zlew
this.drawRoundedRect(ctx, 842, 248, 26, 38, 4);
ctx.fillStyle = '#0f172a';
ctx.fill();
const dripR = (this.animTime * 6) % 9;
ctx.strokeStyle = `rgba(56, 189, 248, ${(0.6 - dripR / 15).toFixed(2)})`;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(855, 267, dripR, 0, Math.PI * 2);
ctx.stroke();
// Mikrofalówka z zielonym zegarem LED
this.drawRoundedRect(ctx, 841, 305, 28, 42, 3);
ctx.fillStyle = '#09090b';
ctx.fill();
ctx.fillStyle = Math.sin(this.animTime * 3) > 0 ? '#10b981' : '#064e3b';
ctx.fillRect(845, 310, 4, 8);
ctx.restore();

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

// Okno na północnej ścianie z żaluzjami i spływającymi kroplami deszczu
ctx.save();
ctx.fillStyle = '#090d16';
ctx.fillRect(435, 104, 130, 14);
ctx.strokeStyle = '#38bdf8';
ctx.lineWidth = 1.5;
ctx.strokeRect(435, 104, 130, 14);
for (let lx = 442; lx < 560; lx += 14) {
ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
ctx.fillRect(lx, 107, 9, 2);
ctx.fillRect(lx, 112, 9, 2);
}
if (!this.settings.lowEndMode) {
const winGlow = ctx.createLinearGradient(500, 115, 500, 195);
winGlow.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
winGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
ctx.fillStyle = winGlow;
ctx.beginPath();
ctx.moveTo(435, 118); ctx.lineTo(565, 118); ctx.lineTo(590, 195); ctx.lineTo(410, 195);
ctx.closePath(); ctx.fill();
}
// Tablica korkowa ze śledztwem i wezwaniami do zapłaty
ctx.fillStyle = '#451a03';
ctx.fillRect(342, 105, 68, 12);
ctx.strokeStyle = '#78350f';
ctx.strokeRect(342, 105, 68, 12);
ctx.fillStyle = '#fef08a';
ctx.fillRect(348, 107, 10, 8);
ctx.fillStyle = '#fca5a5';
ctx.fillRect(366, 107, 12, 8);
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(386, 107, 10, 8);
ctx.restore();

// ŁÓŻKO
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

// TERMINAL CRT SYNDYKATU
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
ctx.fillStyle = '#061310';
ctx.fill();
ctx.strokeStyle = '#34d399';
ctx.lineWidth = 1.5;
ctx.stroke();
// Animowany wykres długu na ekranie CRT
ctx.strokeStyle = '#10b981';
ctx.lineWidth = 1.4;
ctx.beginPath();
for (let gx = 0; gx <= 66; gx += 6) {
const gy = 162 + Math.sin(this.animTime * 5 + gx * 0.2) * 7;
if (gx === 0) ctx.moveTo(692 + gx, gy);
else ctx.lineTo(692 + gx, gy);
}
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
// Kubek z gorącą kawą i parą
ctx.beginPath();
ctx.arc(662, 198, 8, 0, Math.PI * 2);
ctx.fillStyle = '#f8fafc';
ctx.fill();
ctx.beginPath();
ctx.arc(662, 198, 5, 0, Math.PI * 2);
ctx.fillStyle = '#451a03';
ctx.fill();
if (!this.settings.lowEndMode) {
const stY = (this.animTime * 10) % 12;
ctx.strokeStyle = `rgba(248, 250, 252, ${(0.35 - stY / 40).toFixed(2)})`;
ctx.lineWidth = 1.2;
ctx.beginPath();
ctx.moveTo(662, 195 - stY);
ctx.lineTo(662 + Math.sin(this.animTime * 4) * 2.5, 188 - stY);
ctx.stroke();
}
ctx.restore();
this.drawPropBadge(ctx, 725, 120, this.t('canvas_crt'), '#6ee7b7', '#022c22');

// OŁTARZ RELIKTÓW
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

// DRZWI WYJŚCIOWE NA ULICĘ
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

// Obracający się cień wentylatora sufitowego na środku pokoju
ctx.translate(485, 285);
ctx.rotate(this.animTime * 1.8);
ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
for (let f = 0; f < 4; f++) {
ctx.rotate(Math.PI / 2);
this.drawRoundedRect(ctx, 6, -4, 34, 8, 3);
ctx.fill();
}
ctx.beginPath();
ctx.arc(0, 0, 7, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
}
const bulbFlicker = Math.sin(this.animTime * 11) > -0.92 ? 0.12 : 0.05;
this.drawNeonGlow(ctx, 485, 295, 230, '#fef08a', bulbFlicker);
}
,
drawStreet(ctx) {
const b = this.zones[1].bounds;
this.drawStreetBuildings(ctx, b);

// Asfaltowa czteropasmowa aleja Blackwater (x: -120..1340, y: 75..545)
ctx.fillStyle = '#080a0f';
ctx.fillRect(b.x, b.y, b.w, b.h);

// Szerokie chodniki północny (y: 75..165) i południowy (y: 455..545)
ctx.fillStyle = '#151821';
ctx.fillRect(b.x, b.y, b.w, 90);
ctx.fillRect(b.x, b.y + b.h - 90, b.w, 90);
ctx.strokeStyle = '#262b38';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(b.x, b.y + 90); ctx.lineTo(b.x + b.w, b.y + 90);
ctx.moveTo(b.x, b.y + b.h - 90); ctx.lineTo(b.x + b.w, b.y + b.h - 90);
ctx.stroke();

// Płyty chodnikowe
ctx.strokeStyle = '#1d2230';
ctx.lineWidth = 1;
for (let x = b.x; x <= b.x + b.w; x += 60) {
ctx.beginPath();
ctx.moveTo(x, b.y); ctx.lineTo(x, b.y + 90);
ctx.moveTo(x, b.y + b.h - 90); ctx.lineTo(x, b.y + b.h);
ctx.stroke();
}

// Dwa przejścia dla pieszych (Zebra Zachodnia przy Kryjówce i Wschodnia przy Kasynie)
ctx.save();
ctx.fillStyle = 'rgba(203, 213, 225, 0.20)';
for (let zy = b.y + 104; zy < b.y + b.h - 98; zy += 24) {
ctx.fillRect(-55, zy, 46, 12);
ctx.fillRect(1225, zy, 46, 12);
}
const walkSignal = Math.sin(this.animTime * 1.5) > 0;
[-68, 1212].forEach(sx => {
ctx.fillStyle = '#0f172a';
ctx.fillRect(sx, 140, 12, 20);
ctx.fillStyle = walkSignal ? '#10b981' : '#ef4444';
ctx.beginPath();
ctx.arc(sx + 6, walkSignal ? 154 : 146, 3, 0, Math.PI * 2);
ctx.fill();
});
ctx.restore();

// Centralny pas rozdzielający jezdnię (wysepki bezpieczeństwa z neonowymi słupkami)
ctx.strokeStyle = 'rgba(245, 158, 11, 0.38)';
ctx.lineWidth = 3;
ctx.setLineDash([36, 28]);
ctx.beginPath();
ctx.moveTo(b.x + 95, 240); ctx.lineTo(b.x + b.w - 95, 240);
ctx.moveTo(b.x + 95, 380); ctx.lineTo(b.x + b.w - 95, 380);
ctx.stroke();
ctx.setLineDash([]);

[120, 480, 840].forEach((mx, midx) => {
ctx.save();
this.drawRoundedRect(ctx, mx, 298, 210, 24, 8);
ctx.fillStyle = '#11141d';
ctx.fill();
ctx.strokeStyle = '#334155';
ctx.lineWidth = 2;
ctx.stroke();
const bollardCol = (this.day >= 5) ? '#a855f7' : '#f59e0b';
ctx.fillStyle = bollardCol;
ctx.beginPath();
ctx.arc(mx + 14, 310, 4, 0, Math.PI * 2);
ctx.arc(mx + 196, 310, 4, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
});

// Kratki ściekowe przy krawężnikach
[{ x: 115, y: 168 }, { x: 525, y: 168 }, { x: 965, y: 168 }, { x: 245, y: 442 }, { x: 685, y: 442 }, { x: 1115, y: 442 }].forEach(gr => {
ctx.save();
ctx.fillStyle = '#05070b';
ctx.fillRect(gr.x, gr.y, 24, 10);
ctx.strokeStyle = '#334155';
ctx.lineWidth = 1;
ctx.strokeRect(gr.x, gr.y, 24, 10);
for (let gx = gr.x + 4; gx < gr.x + 22; gx += 4) {
ctx.beginPath(); ctx.moveTo(gx, gr.y); ctx.lineTo(gx, gr.y + 10); ctx.stroke();
}
ctx.restore();
});

// Kałuże odbijające neony na szerokiej ulicy
const puddles = [
{ x: 45,   y: 255, rx: 62, ry: 22, col: 'rgba(236, 72, 153, 0.15)', stroke: 'rgba(244, 114, 182, 0.30)' },
{ x: 385,  y: 355, rx: 82, ry: 26, col: 'rgba(34, 211, 238, 0.14)', stroke: 'rgba(56, 189, 248, 0.30)' },
{ x: 655,  y: 225, rx: 68, ry: 22, col: 'rgba(168, 85, 247, 0.16)', stroke: 'rgba(192, 132, 252, 0.32)' },
{ x: 985,  y: 345, rx: 74, ry: 25, col: 'rgba(16, 185, 129, 0.15)', stroke: 'rgba(52, 211, 153, 0.30)' },
{ x: 1195, y: 275, rx: 68, ry: 28, col: 'rgba(239, 68, 68, 0.18)',  stroke: 'rgba(248, 113, 113, 0.36)' }
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

// Dwie studzienki kanalizacyjne z unoszącą się parą
[345, 925].forEach((mhx, idx) => {
ctx.save();
ctx.beginPath();
ctx.arc(mhx, 240 + idx * 130, 18, 0, Math.PI * 2);
ctx.fillStyle = '#1e293b';
ctx.fill();
ctx.strokeStyle = '#475569';
ctx.lineWidth = 2;
ctx.stroke();
const steamOffset = ((this.animTime * 16 + idx * 12) % 24);
ctx.fillStyle = `rgba(203, 213, 225, ${0.22 - steamOffset / 120})`;
ctx.beginPath();
ctx.arc(mhx + Math.sin(this.animTime * 3 + idx) * 4, 235 + idx * 130 - steamOffset, 8 + steamOffset * 0.3, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
});

// Przeszkoda 1: Kontener przemysłowy przy Klinice (x: 290, y: 92, w: 125, h: 62)
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.65)';
ctx.fillRect(296, 98, 127, 64);
this.drawRoundedRect(ctx, 290, 92, 125, 62, 5);
ctx.fillStyle = '#14332b';
ctx.fill();
ctx.strokeStyle = '#475569';
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.fillStyle = '#0f172a';
for (let rx = 302; rx < 405; rx += 22) {
ctx.fillRect(rx, 96, 12, 54);
}
ctx.restore();

// Przeszkoda 3: Opancerzona furgonetka Syndykatu na północnym chodniku (x: 1030, y: 92, w: 135, h: 60)
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.68)';
this.drawRoundedRect(ctx, 1035, 98, 137, 62, 10);
ctx.fill();
this.drawRoundedRect(ctx, 1030, 92, 135, 60, 10);
ctx.fillStyle = '#18181b';
ctx.fill();
ctx.strokeStyle = '#dc2626';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = '#09090b';
ctx.fillRect(1052, 98, 88, 48);
ctx.fillStyle = '#ef4444';
ctx.font = '800 8px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.fillText('SYNDICATE SEC', 1096, 125);
ctx.restore();

// INTERAKTYWNY PUNKT 1: CZARNY RYNEK SYNDYKATU (x: 575, y: 75, w: 135, h: 36)
const bmColor = this.day >= 5 ? '#f59e0b' : '#a855f7';
this.drawNeonGlow(ctx, 642, 95, 115, bmColor, 0.28);
ctx.save();
this.drawRoundedRect(ctx, 575, 75, 135, 34, 6);
ctx.fillStyle = '#1b0b2e';
ctx.fill();
ctx.strokeStyle = bmColor;
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.fillStyle = '#09090b';
ctx.fillRect(585, 81, 115, 22);
ctx.fillStyle = bmColor;
for (let bx = 592; bx < 692; bx += 16) {
ctx.fillRect(bx, 85, 10, 14);
}
ctx.restore();
this.drawPropBadge(
ctx,
642,
62,
this.day >= 5 ? '🔥 CZARNY RYNEK [OVERDRIVE]' : '🕶️ CZARNY RYNEK SYNDYKATU',
this.day >= 5 ? '#fde047' : '#e9d5ff',
'#2e1065',
this.day >= 5 ? 'HAKI KWOTY • CHIPY • STYMY' : 'STYMULANTY • ŻETONY (OD NOCY 5: OVERDRIVE)'
);

// Automat "STYM-COLA" i płonący koksownik przy Barze Zdechły Pies (południowy chodnik)
ctx.save();
this.drawRoundedRect(ctx, 212, 495, 34, 34, 4);
ctx.fillStyle = '#064e3b';
ctx.fill();
ctx.strokeStyle = '#10b981';
ctx.lineWidth = 1.5;
ctx.stroke();
ctx.fillStyle = '#34d399';
ctx.fillRect(217, 500, 16, 22);

const fireFlicker = 0.28 + 0.1 * Math.sin(this.animTime * 14);
this.drawNeonGlow(ctx, 468, 492, 70, '#f97316', fireFlicker);
ctx.fillStyle = '#292524';
ctx.beginPath();
ctx.arc(468, 492, 11, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = '#78350f';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = '#f97316';
ctx.beginPath();
ctx.arc(468, 492, 6.5 + Math.sin(this.animTime * 16) * 1.5, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#fef08a';
ctx.beginPath();
ctx.arc(468, 492, 3.2, 0, Math.PI * 2);
ctx.fill();
ctx.restore();

// Przeszkoda 2: Radiowóz Syndykatu na światłach awaryjnych (x: 760, y: 448, w: 170, h: 72)
const hazardBlink = Math.sin(this.animTime * 6) > 0;
if (hazardBlink) {
this.drawNeonGlow(ctx, 760, 484, 75, '#f59e0b', 0.26);
this.drawNeonGlow(ctx, 925, 484, 75, '#ef4444', 0.26);
}
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.7)';
this.drawRoundedRect(ctx, 766, 455, 170, 72, 12);
ctx.fill();
this.drawRoundedRect(ctx, 760, 448, 170, 72, 12);
ctx.fillStyle = '#1e1b2e';
ctx.fill();
ctx.strokeStyle = '#64748b';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = '#dc2626';
ctx.fillRect(765, 480, 32, 8);
this.drawRoundedRect(ctx, 798, 455, 90, 56, 6);
ctx.fillStyle = '#0f172a';
ctx.fill();
ctx.fillStyle = hazardBlink ? '#ef4444' : '#1e3a8a';
ctx.fillRect(838, 467, 10, 14);
ctx.fillStyle = hazardBlink ? '#3b82f6' : '#7f1d1d';
ctx.fillRect(838, 485, 10, 14);
ctx.fillStyle = hazardBlink ? '#fbbf24' : '#78350f';
ctx.fillRect(761, 455, 5, 12);
ctx.fillRect(761, 499, 5, 12);
ctx.fillStyle = hazardBlink ? '#ef4444' : '#7f1d1d';
ctx.fillRect(923, 455, 5, 12);
ctx.fillRect(923, 499, 5, 12);
ctx.restore();

// INTERAKTYWNY PUNKT 2: KURIER PODZIEMIA // ZRZUT ZAOPATRZENIA (x: 895, y: 508, w: 130, h: 36)
const smugActive = !this.smugglerUsedThisNight;
const smugCol = !smugActive ? '#52525b' : (this.day >= 5 ? '#fbbf24' : '#10b981');
this.drawNeonGlow(ctx, 960, 524, 95, smugCol, smugActive ? 0.26 : 0.08);
ctx.save();
this.drawRoundedRect(ctx, 895, 508, 130, 34, 6);
ctx.fillStyle = smugActive ? '#062e22' : '#18181b';
ctx.fill();
ctx.strokeStyle = smugCol;
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = smugCol;
ctx.fillRect(910, 516, 22, 18);
ctx.fillRect(942, 516, 22, 18);
ctx.restore();
this.drawPropBadge(
ctx,
960,
558,
!smugActive ? '📦 ZRZUT ODEBRANY (1/1)' : (this.day >= 5 ? '📦 ★ ZŁOTY ZRZUT OVERDRIVE' : '📦 KURIER PODZIEMIA (1/NOC)'),
smugCol,
'#022c22',
!smugActive ? 'WRÓĆ KOLEJNEJ NOCY' : 'DARMOWA GOTÓWKA / ŻETONY / CZAS'
);

// Wejście do Kryjówki na zachodzie (x: -132, y: 265)
this.drawNeonGlow(ctx, -115, 312, 110, '#10b981', 0.3);
ctx.fillStyle = '#10b981';
ctx.fillRect(-132, 265, 14, 95);
this.drawPropBadge(ctx, -45, 250, this.t('canvas_safehouse_left'), '#6ee7b7', '#022c22');

// Wejście do Kasyna na wschodzie (x: 1330, y: 250)
const casinoPulse = 0.32 + 0.1 * Math.sin(this.animTime * 8);
this.drawNeonGlow(ctx, 1320, 312, 165, '#ef4444', casinoPulse);
ctx.fillStyle = '#450a0a';
ctx.fillRect(1260, 282, 75, 64);
ctx.strokeStyle = '#d97706';
ctx.lineWidth = 1.5;
ctx.strokeRect(1260, 282, 75, 64);
ctx.fillStyle = '#7f1d1d';
ctx.fillRect(1280, 274, 65, 80);
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 2;
ctx.strokeRect(1280, 274, 65, 80);
for (let my = 278; my <= 350; my += 11) {
const bulbOn = ((Math.floor(this.animTime * 7) + my) % 2 === 0);
ctx.fillStyle = bulbOn ? '#fef08a' : '#b45309';
ctx.beginPath(); ctx.arc(1282, my, 2.2, 0, Math.PI * 2); ctx.fill();
}
ctx.fillStyle = '#ef4444';
ctx.fillRect(1332, 250, 14, 125);
this.drawPropBadge(ctx, 1235, 238, this.t('canvas_casino_right'), '#fca5a5', '#450a0a');

if (this.streetNpcs) {
this.streetNpcs.forEach((npc, idx) => this.drawTopDownNpc(ctx, npc, idx + 30));
}

// 5 Latarni ulicznych wzdłuż całej alei
const lamps = [{ x: -10, y: 155 }, { x: 280, y: 155 }, { x: 610, y: 155 }, { x: 940, y: 155 }, { x: 1220, y: 155 }];
lamps.forEach(l => {
this.drawNeonGlow(ctx, l.x, l.y, 125, '#f59e0b', 0.18);
ctx.fillStyle = '#fbbf24';
ctx.beginPath();
ctx.arc(l.x, l.y, 5, 0, Math.PI * 2);
ctx.fill();
});

if (!this.settings.lowEndMode) {
ctx.save();
ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
ctx.lineWidth = 1.5;
const sway = Math.sin(this.animTime * 2.2) * 5;
[[-10, 75, 110, 545], [280, 75, 420, 545], [610, 75, 740, 545], [940, 75, 1060, 545]].forEach(wLine => {
ctx.beginPath();
ctx.moveTo(wLine[0], wLine[1]);
ctx.quadraticCurveTo((wLine[0] + wLine[2]) * 0.5 + sway, 310, wLine[2], wLine[3]);
ctx.stroke();
});
ctx.restore();
}

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
// WARSTWA 1 (TŁO): Wysokie megabloki i wieżowce za pierwszą linią budynków (północ i południe)
const farTopTowers = [
{ x: -165, y: -165, w: 240, h: 120, sign: 'SECTOR 04 // SLUMS', neon: '#38bdf8' },
{ x: 95,   y: -180, w: 265, h: 135, sign: 'SYNDICATE CORP TOWER', neon: '#f43f5e' },
{ x: 380,  y: -170, w: 250, h: 125, sign: 'CYBER-BANK // DŁUGI', neon: '#fbbf24' },
{ x: 650,  y: -185, w: 270, h: 140, sign: 'OVERDRIVE LABS', neon: '#a855f7' },
{ x: 940,  y: -170, w: 240, h: 125, sign: 'HOTEL NOIR SKYLINE', neon: '#22d3ee' },
{ x: 1195, y: -180, w: 220, h: 135, sign: 'VELVET CASINO SPIRE', neon: '#f59e0b' }
];
const farBotTowers = [
{ x: -165, y: 665, w: 250, h: 125, sign: 'POWER GRID // SEKTOR B', neon: '#10b981' },
{ x: 105,  y: 665, w: 280, h: 135, sign: 'BIO-PHARMA // STYMY', neon: '#22d3ee' },
{ x: 405,  y: 665, w: 270, h: 130, sign: 'NIGHT CITY ARCHIVES', neon: '#f43f5e' },
{ x: 695,  y: 665, w: 290, h: 140, sign: 'HEAVY INDUSTRY // DOKI', neon: '#f59e0b' },
{ x: 1005, y: 665, w: 390, h: 135, sign: 'SYNDICATE VIP PENTHOUSE', neon: '#c084fc' }
];

const renderFarTower = (tw, isTop) => {
ctx.save();
this.drawRoundedRect(ctx, tw.x, tw.y, tw.w, tw.h, 6);
ctx.fillStyle = '#04060b';
ctx.fill();
ctx.strokeStyle = '#161e2e';
ctx.lineWidth = 2;
ctx.stroke();

// Siatka przygaszonych okien w dalekich wieżowcach
for (let wy = tw.y + 14; wy < tw.y + tw.h - 18; wy += 16) {
for (let wx = tw.x + 14; wx < tw.x + tw.w - 18; wx += 22) {
if (((wx + wy) % 5) === 0) continue;
ctx.fillStyle = ((wx * wy) % 7 === 0) ? tw.neon : 'rgba(148, 163, 184, 0.18)';
ctx.globalAlpha = 0.28;
ctx.fillRect(wx, wy, 8, 9);
}
}
ctx.globalAlpha = 1;

// Neonowy billboard korporacji na dachu dalekiego wieżowca
const sx = tw.x + tw.w * 0.5;
const sy = isTop ? (tw.y + 24) : (tw.y + tw.h - 24);
ctx.font = '800 9px "JetBrains Mono", monospace';
const bw = ctx.measureText(tw.sign).width + 16;
ctx.fillStyle = '#030408';
ctx.fillRect(sx - bw * 0.5, sy - 9, bw, 18);
ctx.strokeStyle = tw.neon;
ctx.globalAlpha = 0.55;
ctx.lineWidth = 1.2;
ctx.strokeRect(sx - bw * 0.5, sy - 9, bw, 18);
ctx.fillStyle = tw.neon;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(tw.sign, sx, sy);
ctx.restore();
};

farTopTowers.forEach(t => renderFarTower(t, true));
farBotTowers.forEach(t => renderFarTower(t, false));

// WARSTWA 2 (PIERWSZY PLAN PRZY CHODNIKU): 13 szczegółowych budynków wzdłuż rozszerzonej ulicy
const topBlocks = [
{ x: -130, y: -42, w: 190, h: 112, bg: '#090c14', border: '#1e293b', sign: 'KAMIENICA // KRYJÓWKA #4', neon: '#10b981', flicker: 2, kind: 'safehouse_ext' },
{ x: 72,   y: -42, w: 205, h: 112, bg: '#0b0d16', border: '#1e293b', sign: 'LOMBARD // LICHWA 24H', neon: '#ec4899', flicker: 1, kind: 'pawn' },
{ x: 289,  y: -45, w: 225, h: 115, bg: '#090d16', border: '#1e293b', sign: 'CYBER-KLINIKA // KREW', neon: '#22d3ee', flicker: 2, kind: 'clinic' },
{ x: 526,  y: -45, w: 235, h: 115, bg: '#140924', border: '#4c1d95', sign: '🕶️ CZARNY RYNEK // OVERDRIVE', neon: '#a855f7', flicker: 0, kind: 'blackmarket' },
{ x: 773,  y: -42, w: 220, h: 112, bg: '#100c1c', border: '#312e81', sign: 'HOTEL NOIR // POKOJE', neon: '#818cf8', flicker: 3, kind: 'hotel' },
{ x: 1005, y: -42, w: 155, h: 112, bg: '#0c0a14', border: '#334155', sign: 'BIURO AUDYTU', neon: '#38bdf8', flicker: 2, kind: 'office' },
{ x: 1172, y: -48, w: 180, h: 118, bg: '#18080c', border: '#7f1d1d', sign: '🎰 VELVET PIT CASINO 777', neon: '#f59e0b', flicker: 0, kind: 'casino' }
];
const botBlocks = [
{ x: -130, y: 550, w: 185, h: 98, bg: '#080b11', border: '#1e293b', sign: 'STACJA TRANSFORMATOROWA', neon: '#38bdf8', flicker: 3, kind: 'power' },
{ x: 67,   y: 550, w: 235, h: 98, bg: '#0c0f17', border: '#1e293b', sign: 'APTEKA NOCNA // STYMY', neon: '#10b981', flicker: 2, kind: 'pharmacy' },
{ x: 314,  y: 550, w: 265, h: 98, bg: '#120d16', border: '#3b0764', sign: 'BAR "ZDECHŁY PIES"', neon: '#f43f5e', flicker: 4, kind: 'bar' },
{ x: 591,  y: 550, w: 235, h: 98, bg: '#0f1118', border: '#334155', sign: 'WARSZTAT // CYBER-AUTO', neon: '#fb923c', flicker: 1, kind: 'garage' },
{ x: 838,  y: 550, w: 235, h: 98, bg: '#061a14', border: '#065f46', sign: '📦 KURIER PODZIEMIA // ZRZUT', neon: '#34d399', flicker: 0, kind: 'smuggler' },
{ x: 1085, y: 550, w: 267, h: 98, bg: '#16090d', border: '#7f1d1d', sign: 'VIP LOUNGE // RULETKA & KOŚCI', neon: '#fbbf24', flicker: 1, kind: 'vip' }
];
const renderBlock = (blk, isTop) => {
ctx.save();
this.drawRoundedRect(ctx, blk.x, blk.y, blk.w, blk.h, 6);
ctx.fillStyle = blk.bg;
ctx.fill();
ctx.strokeStyle = blk.border;
ctx.lineWidth = 2.5;
ctx.stroke();

// Dachowy wentylator wyciągowy
ctx.fillStyle = '#161b26';
ctx.strokeStyle = '#334155';
ctx.lineWidth = 1.2;
ctx.fillRect(blk.x + 14, blk.y + 14, 32, 22);
ctx.strokeRect(blk.x + 14, blk.y + 14, 32, 22);
ctx.save();
ctx.translate(blk.x + 30, blk.y + 25);
ctx.rotate(this.animTime * 3.6);
ctx.strokeStyle = '#64748b';
ctx.beginPath();
ctx.moveTo(-7, 0); ctx.lineTo(7, 0);
ctx.moveTo(0, -7); ctx.lineTo(0, 7);
ctx.stroke();
ctx.restore();

if (blk.kind === 'pawn') {
const swayAng = Math.sin(this.animTime * 2.5) * 0.12;
ctx.save();
ctx.translate(blk.x + blk.w - 30, blk.y + 26);
ctx.rotate(swayAng);
ctx.fillStyle = '#fbbf24';
ctx.beginPath();
ctx.arc(-6, 6, 4, 0, Math.PI * 2);
ctx.arc(6, 6, 4, 0, Math.PI * 2);
ctx.arc(0, -2, 4, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
} else if (blk.kind === 'clinic' || blk.kind === 'pharmacy') {
const medPulse = 0.55 + 0.45 * Math.sin(this.animTime * 4);
ctx.save();
ctx.globalAlpha = medPulse;
ctx.fillStyle = blk.neon;
const mx = blk.x + blk.w - 32, my = blk.y + 26;
ctx.fillRect(mx - 3, my - 8, 6, 16);
ctx.fillRect(mx - 8, my - 3, 16, 6);
ctx.restore();
} else if (blk.kind === 'blackmarket') {
// Pulsujące oko / symbol Syndykatu nad Czarnym Rynkiem
ctx.save();
ctx.strokeStyle = this.day >= 5 ? '#f59e0b' : '#c084fc';
ctx.lineWidth = 1.6;
const bx = blk.x + blk.w - 34, by = blk.y + 25;
ctx.beginPath();
ctx.arc(bx, by, 9, 0, Math.PI * 2);
ctx.stroke();
ctx.fillStyle = '#ef4444';
ctx.beginPath();
ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
} else if (blk.kind === 'casino') {
for (let bx = blk.x + 14; bx < blk.x + blk.w - 12; bx += 18) {
const on = ((Math.floor(this.animTime * 8) + Math.floor(bx / 18)) % 2 === 0);
ctx.fillStyle = on ? '#fde047' : '#78350f';
ctx.beginPath();
ctx.arc(bx, blk.y + blk.h - 4, 2.2, 0, Math.PI * 2);
ctx.fill();
}
} else if (blk.kind === 'vip') {
ctx.save();
ctx.translate(blk.x + blk.w - 36, blk.y + 26);
ctx.rotate(Math.sin(this.animTime * 1.1) * 0.5);
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 1.6;
ctx.beginPath();
ctx.arc(0, 0, 9, -Math.PI * 0.7, Math.PI * 0.7);
ctx.stroke();
ctx.fillStyle = '#ef4444';
ctx.beginPath(); ctx.arc(4, 0, 2, 0, Math.PI * 2); ctx.fill();
ctx.restore();
}

const winY = isTop ? blk.y + blk.h - 22 : blk.y + 8;
for (let wx = blk.x + 14; wx < blk.x + blk.w - 22; wx += 30) {
const isLit = ((wx + blk.x) % 3 === 0);
ctx.fillStyle = isLit ? 'rgba(251, 191, 36, 0.28)' : '#05070b';
ctx.fillRect(wx, winY, 17, 10);
ctx.strokeStyle = isLit ? '#d97706' : '#1e293b';
ctx.lineWidth = 1;
ctx.strokeRect(wx, winY, 17, 10);
}

const flickOn = blk.flicker === 0 || Math.sin(this.animTime * 7 + blk.flicker * 3) > -0.88;
const signX = blk.x + blk.w / 2;
const signY = isTop ? blk.y + blk.h - 38 : blk.y + 42;
if (flickOn) {
this.drawNeonGlow(ctx, signX, isTop ? signY + 42 : signY - 35, 95, blk.neon, 0.18);
}
ctx.font = '800 9.5px "JetBrains Mono", monospace';
const tw = Math.min(blk.w - 8, ctx.measureText(blk.sign).width + 16);
this.drawRoundedRect(ctx, signX - tw / 2, signY - 10, tw, 20, 5);
ctx.fillStyle = '#05060a';
ctx.fill();
ctx.strokeStyle = flickOn ? blk.neon : '#334155';
ctx.lineWidth = 1.8;
ctx.stroke();
ctx.fillStyle = flickOn ? '#ffffff' : '#475569';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(blk.sign, signX, signY, tw - 6);
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

// Krwistoczerwony dywan wejściowy ze złotym obszyciem prowadzący od drzwi ulicy
ctx.save();
ctx.fillStyle = 'rgba(127, 29, 29, 0.55)';
ctx.fillRect(75, 276, 130, 68);
ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
ctx.lineWidth = 2;
ctx.strokeRect(75, 276, 130, 68);

// Złoty obracający się hologram / rozeta Syndykatu w centralnej rotundzie podłogi
ctx.translate(502, 312);
ctx.rotate(this.animTime * 0.35);
ctx.strokeStyle = 'rgba(245, 158, 11, 0.16)';
ctx.lineWidth = 1.5;
for (let r = 0; r < 8; r++) {
ctx.rotate(Math.PI / 4);
ctx.strokeRect(-42, -42, 84, 84);
}
ctx.restore();

// Podświetlany Bar VIP z butelkami pod północną ścianą (między stołami VIP, x: 420..585, y: 112)
ctx.save();
this.drawRoundedRect(ctx, 420, 112, 165, 28, 6);
ctx.fillStyle = '#1c0a13';
ctx.fill();
ctx.strokeStyle = '#f59e0b';
ctx.lineWidth = 2;
ctx.stroke();
const bottleColors = ['#22d3ee', '#10b981', '#f43f5e', '#fbbf24', '#a855f7'];
for (let bx = 432, bi = 0; bx < 572; bx += 14, bi++) {
ctx.fillStyle = bottleColors[bi % bottleColors.length];
ctx.fillRect(bx, 116, 6, 11);
}
this.drawNeonGlow(ctx, 502, 126, 75, '#f59e0b', 0.18);
ctx.restore();

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
} else if (slot.type === 'wheel') {
ctx.save();
ctx.translate(cx, cy);
ctx.rotate(this.animTime * 2.8);
ctx.strokeStyle = '#facc15';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(0, 0, 24, 0, Math.PI * 2);
ctx.stroke();
for (let a = 0; a < 4; a++) {
ctx.rotate(Math.PI / 4);
ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();
}
ctx.restore();
} else if (slot.type === 'poker') {
[-22, 0, 22].forEach((ox, idx) => {
ctx.fillStyle = idx === 1 ? '#fb7185' : '#f8fafc';
ctx.fillRect(cx + ox - 7, cy - 11, 14, 22);
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
if (cs.type === 'VICTORY') {
cs.goons.forEach((g, idx) => {
g.facing = 0;
this.drawTopDownNpc(ctx, g, 70 + idx);
});
// Złota walizka z $1,000,000 przekazywana Mafii
const bx = cs.briefcaseX || (this.player.x - 18);
const by = cs.briefcaseY || this.player.y;
this.drawNeonGlow(ctx, bx, by, 55, '#fbbf24', 0.45);
ctx.save();
this.drawRoundedRect(ctx, bx - 11, by - 8, 22, 16, 3);
ctx.fillStyle = '#f59e0b';
ctx.fill();
ctx.strokeStyle = '#fef08a';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = '#09090b';
ctx.font = '800 8px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('$1M', bx, by);
ctx.restore();
this.renderPropBadgeImmediate(ctx, bx, by - 22, '💼 $1,000,000 DLA SYNDYKATU', '#fde047', '#451a03');
this.renderPropBadgeImmediate(ctx, cs.goons[1].x, cs.goons[1].y - 26, '👑 DON SYNDYKATU', '#6ee7b7', '#064e3b');
return;
}
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
drawEndlessHorizonHighway(ctx, cw, ch, cs) {
const horizonY = Math.floor(ch * 0.52);

// 1. Niebo o wschodzie słońca na horyzoncie (Synthwave / Cyberpunk Dawn)
const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
skyGrad.addColorStop(0, '#040611');
skyGrad.addColorStop(0.45, '#1e1b4b');
skyGrad.addColorStop(0.78, '#701a75');
skyGrad.addColorStop(1, '#f59e0b');
ctx.fillStyle = skyGrad;
ctx.fillRect(0, 0, cw, horizonY);

// Gwiazdy wysoko na niebie
ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
for (let s = 0; s < 36; s++) {
const sx = ((s * 97) % cw);
const sy = ((s * 43) % Math.floor(horizonY * 0.65));
ctx.fillRect(sx, sy, (s % 2) + 1, (s % 2) + 1);
}

// 2. Wielkie Złote Słońce Wolności na horyzoncie (z pasami synthwave)
const sunR = Math.min(cw, ch) * 0.19;
const sunX = cw * 0.5;
const sunY = horizonY - sunR * 0.15;
const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.2);
sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.65)');
sunGlow.addColorStop(0.45, 'rgba(244, 63, 94, 0.30)');
sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = sunGlow;
ctx.fillRect(0, 0, cw, horizonY);

ctx.save();
ctx.beginPath();
ctx.arc(sunX, sunY, sunR, Math.PI, 0, false);
ctx.closePath();
const sunFill = ctx.createLinearGradient(0, sunY - sunR, 0, horizonY);
sunFill.addColorStop(0, '#fef08a');
sunFill.addColorStop(0.55, '#f59e0b');
sunFill.addColorStop(1, '#e11d48');
ctx.fillStyle = sunFill;
ctx.fill();
// Poziome wycięcia w słońcu
ctx.fillStyle = '#3b0764';
for (let sl = 0; sl < 5; sl++) {
const ly = horizonY - 6 - sl * 9;
ctx.fillRect(sunX - sunR, ly, sunR * 2, 2 + sl * 0.6);
}
ctx.restore();

// 3. Sylwetki gór na horyzoncie
ctx.fillStyle = '#090514';
ctx.beginPath();
ctx.moveTo(0, horizonY);
for (let mx = 0; mx <= cw; mx += 45) {
const mh = 14 + Math.sin(mx * 0.025) * 12 + Math.cos(mx * 0.06) * 8;
ctx.lineTo(mx, horizonY - Math.max(2, mh));
}
ctx.lineTo(cw, horizonY);
ctx.closePath();
ctx.fill();

// 4. Ziemia i nieskończona perspektywiczna autostrada prowadząca w horyzont
const groundGrad = ctx.createLinearGradient(0, horizonY, 0, ch);
groundGrad.addColorStop(0, '#090414');
groundGrad.addColorStop(1, '#020308');
ctx.fillStyle = groundGrad;
ctx.fillRect(0, horizonY, cw, ch - horizonY);

// Siatka perspektywiczna pobocza
ctx.strokeStyle = 'rgba(217, 70, 239, 0.22)';
ctx.lineWidth = 1;
for (let gx = -8; gx <= 8; gx++) {
ctx.beginPath();
ctx.moveTo(sunX + gx * 18, horizonY);
ctx.lineTo(sunX + gx * (cw * 0.18), ch);
ctx.stroke();
}

// Asfalt drogi w perspektywie
const roadTopW = 26;
const roadBotW = Math.min(cw * 0.78, 680);
ctx.fillStyle = '#0f131d';
ctx.beginPath();
ctx.moveTo(sunX - roadTopW, horizonY);
ctx.lineTo(sunX + roadTopW, horizonY);
ctx.lineTo(sunX + roadBotW * 0.5, ch);
ctx.lineTo(sunX - roadBotW * 0.5, ch);
ctx.closePath();
ctx.fill();

// Świecące krawędzie drogi
ctx.strokeStyle = '#22d3ee';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(sunX - roadTopW, horizonY);
ctx.lineTo(sunX - roadBotW * 0.5, ch);
ctx.moveTo(sunX + roadTopW, horizonY);
ctx.lineTo(sunX + roadBotW * 0.5, ch);
ctx.stroke();

// Animowane pasy ruchu uciekające w dół (efekt jazdy w stronę horyzontu!)
const speedPhase = (this.animTime * 1.85) % 1;
for (let i = 0; i < 8; i++) {
const p0 = ((i + speedPhase) / 8);
const p1 = Math.min(1, p0 + 0.055);
const ease0 = Math.pow(p0, 2.4);
const ease1 = Math.pow(p1, 2.4);
const y0 = horizonY + ease0 * (ch - horizonY);
const y1 = horizonY + ease1 * (ch - horizonY);
const w0 = Math.max(1.5, ease0 * 10);
const w1 = Math.max(2, ease1 * 12);
ctx.fillStyle = '#fbbf24';
ctx.beginPath();
ctx.moveTo(sunX - w0, y0);
ctx.lineTo(sunX + w0, y0);
ctx.lineTo(sunX + w1, y1);
ctx.lineTo(sunX - w1, y1);
ctx.closePath();
ctx.fill();
}

// Mijane latarnie przydrożne po obu stronach szosy
for (let l = 0; l < 6; l++) {
const lp = ((l + (this.animTime * 0.95) % 1) / 6);
const easeL = Math.pow(lp, 2.3);
const ly = horizonY + easeL * (ch - horizonY);
const spread = (roadTopW + easeL * (roadBotW * 0.5 - roadTopW)) * 1.18;
const poleH = 8 + easeL * 85;
[-1, 1].forEach(dir => {
const lx = sunX + dir * spread;
ctx.strokeStyle = '#334155';
ctx.lineWidth = Math.max(1, easeL * 3.5);
ctx.beginPath();
ctx.moveTo(lx, ly);
ctx.lineTo(lx, ly - poleH);
ctx.lineTo(lx - dir * (4 + easeL * 16), ly - poleH);
ctx.stroke();
ctx.fillStyle = '#38bdf8';
ctx.beginPath();
ctx.arc(lx - dir * (4 + easeL * 16), ly - poleH, Math.max(1.5, easeL * 4.5), 0, Math.PI * 2);
ctx.fill();
});
}

// 5. Samochód gracza jadący w stronę horyzontu (widok od tyłu z neonowymi światłami)
const carX = sunX + Math.sin(this.animTime * 1.6) * 14;
const carY = ch - Math.max(92, ch * 0.19) + Math.sin(this.animTime * 9) * 1.2;
const carW = Math.min(150, cw * 0.28);
const carH = carW * 0.48;

ctx.save();
ctx.translate(carX, carY);
// Cień pod autem
ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
ctx.beginPath();
ctx.ellipse(0, carH * 0.42, carW * 0.58, carH * 0.22, 0, 0, Math.PI * 2);
ctx.fill();

// Opony
ctx.fillStyle = '#09090b';
ctx.fillRect(-carW * 0.48, carH * 0.1, carW * 0.16, carH * 0.32);
ctx.fillRect(carW * 0.32, carH * 0.1, carW * 0.16, carH * 0.32);

// Nadwozie Cyber-Coupe
this.drawRoundedRect(ctx, -carW * 0.46, -carH * 0.15, carW * 0.92, carH * 0.45, 8);
ctx.fillStyle = '#111827';
ctx.fill();
ctx.strokeStyle = '#38bdf8';
ctx.lineWidth = 2;
ctx.stroke();

// Dach i tylna szyba odbijająca zachód słońca
ctx.beginPath();
ctx.moveTo(-carW * 0.30, -carH * 0.48);
ctx.lineTo(carW * 0.30, -carH * 0.48);
ctx.lineTo(carW * 0.40, -carH * 0.12);
ctx.lineTo(-carW * 0.40, -carH * 0.12);
ctx.closePath();
ctx.fillStyle = '#1e1b4b';
ctx.fill();
ctx.strokeStyle = '#f59e0b';
ctx.lineWidth = 1.5;
ctx.stroke();

// Tylny pas świetlny (czerwono-złote neony i tablica "FREE-1M")
ctx.fillStyle = '#ef4444';
ctx.shadowColor = '#ef4444';
ctx.shadowBlur = 16;
ctx.fillRect(-carW * 0.42, -carH * 0.02, carW * 0.24, carH * 0.12);
ctx.fillRect(carW * 0.18, -carH * 0.02, carW * 0.24, carH * 0.12);
ctx.shadowBlur = 0;

ctx.fillStyle = '#09090b';
ctx.fillRect(-carW * 0.14, 0, carW * 0.28, carH * 0.16);
ctx.fillStyle = '#fbbf24';
ctx.font = '800 9px "JetBrains Mono", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('FREE $1M', 0, carH * 0.08);
ctx.restore();
},
drawCutsceneScreenOverlay(ctx, cw, ch) {
const cs = this.cutscene;
if (!cs || !cs.active) return;
if (cs.type === 'VICTORY' && cs.phase === 'HIGHWAY_LOOP') {
ctx.save();
this.drawEndlessHorizonHighway(ctx, cw, ch, cs);
const barH = Math.max(54, Math.round(ch * 0.12));
ctx.fillStyle = 'rgba(3, 4, 7, 0.88)';
ctx.fillRect(0, 0, cw, barH);
ctx.fillRect(0, ch - barH, cw, barH);
ctx.strokeStyle = '#fbbf24';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(0, barH); ctx.lineTo(cw, barH);
ctx.moveTo(0, ch - barH); ctx.lineTo(cw, ch - barH);
ctx.stroke();

ctx.fillStyle = '#fbbf24';
ctx.font = `800 ${cw < 450 ? 11 : 14}px "Syne", sans-serif`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('☀ DŁUG SPŁACONY ($1,000,000) // WOLNOŚĆ OSIĄGNIĘTA', cw / 2, barH * 0.42, cw - 20);
ctx.fillStyle = '#6ee7b7';
ctx.font = `700 ${cw < 450 ? 9.5 : 11}px "JetBrains Mono", monospace`;
ctx.fillText('[ESC / ENTER] WRÓĆ DO MENU GŁÓWNEGO', cw / 2, barH * 0.76, cw - 20);

if (cs.subtitle) {
ctx.fillStyle = '#fef3c7';
ctx.font = `800 ${cw < 480 ? 10.5 : 13}px "JetBrains Mono", monospace`;
ctx.fillText(cs.subtitle, cw / 2, ch - barH / 2, cw - 24);
}
if (cs.blackAlpha > 0) {
ctx.fillStyle = `rgba(0, 0, 0, ${cs.blackAlpha})`;
ctx.fillRect(0, 0, cw, ch);
}
ctx.restore();
return;
}
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
const lensGrad = ctx.createRadialGradient(14, 12, 1, 14, 12, 22);
lensGrad.addColorStop(0, 'rgba(254, 249, 195, 0.85)');
lensGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.32)');
lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = lensGrad;
ctx.beginPath();
ctx.arc(14, 12, 22, 0, Math.PI * 2);
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
raySegmentIntersect(ox, oy, dx, dy, x1, y1, x2, y2) {
const sx = x2 - x1;
const sy = y2 - y1;
const denom = dx * sy - dy * sx;
if (Math.abs(denom) < 1e-7) return null;
const qpx = x1 - ox;
const qpy = y1 - oy;
const t = (qpx * sy - qpy * sx) / denom;
const u = (qpx * dy - qpy * dx) / denom;
if (t >= 0 && u >= 0 && u <= 1) return t;
return null;
},
castRayInZone(ox, oy, angle, maxDist = 250) {
const z = this.zones[this.zone];
const dx = Math.cos(angle);
const dy = Math.sin(angle);
let bestT = maxDist;
let hit = false;
let hitNormalX = -dx;
let hitNormalY = -dy;
if (z) {
const b = z.bounds;
const wallSegs = [
[b.x, b.y, b.x + b.w, b.y, 0, 1],
[b.x + b.w, b.y, b.x + b.w, b.y + b.h, -1, 0],
[b.x, b.y + b.h, b.x + b.w, b.y + b.h, 0, -1],
[b.x, b.y, b.x, b.y + b.h, 1, 0]
];
for (let i = 0; i < wallSegs.length; i++) {
const s = wallSegs[i];
const t = this.raySegmentIntersect(ox, oy, dx, dy, s[0], s[1], s[2], s[3]);
if (t !== null && t < bestT) {
bestT = t;
hit = true;
hitNormalX = s[4];
hitNormalY = s[5];
}
}
if (z.obstacles) {
for (let i = 0; i < z.obstacles.length; i++) {
const ob = z.obstacles[i];
const segs = [
[ob.x, ob.y, ob.x + ob.w, ob.y, 0, -1],
[ob.x + ob.w, ob.y, ob.x + ob.w, ob.y + ob.h, 1, 0],
[ob.x, ob.y + ob.h, ob.x + ob.w, ob.y + ob.h, 0, 1],
[ob.x, ob.y, ob.x, ob.y + ob.h, -1, 0]
];
for (let j = 0; j < segs.length; j++) {
const s = segs[j];
const t = this.raySegmentIntersect(ox, oy, dx, dy, s[0], s[1], s[2], s[3]);
if (t !== null && t < bestT) {
bestT = t;
hit = true;
hitNormalX = s[4];
hitNormalY = s[5];
}
}
}
}
}
return {
x: ox + dx * bestT,
y: oy + dy * bestT,
dist: bestT,
hit,
nx: hitNormalX,
ny: hitNormalY
};
},
getZonePointLights() {
const p = this.player;
const fx = p.x + Math.cos(p.facing) * 12;
const fy = p.y + Math.sin(p.facing) * 12;
const lights = [
{ x: fx, y: fy, r: 280, color: '#38bdf8', intensity: 0.95, isPlayer: true }
];
if (this.zone === 0) {
lights.push(
{ x: 485, y: 285, r: 260, color: '#fef08a', intensity: 0.55 },
{ x: 725, y: 185, r: 190, color: '#10b981', intensity: 0.65 },
{ x: 267, y: 420, r: 195, color: '#f59e0b', intensity: 0.65 },
{ x: 500, y: 485, r: 160, color: '#f59e0b', intensity: 0.50 }
);
} else if (this.zone === 1) {
lights.push(
{ x: -10, y: 155, r: 240, color: '#f59e0b', intensity: 0.55 },
{ x: 280, y: 155, r: 240, color: '#f59e0b', intensity: 0.55 },
{ x: 610, y: 155, r: 240, color: '#a855f7', intensity: 0.65 },
{ x: 940, y: 155, r: 240, color: '#f59e0b', intensity: 0.55 },
{ x: 1220, y: 155, r: 250, color: '#ef4444', intensity: 0.65 },
{ x: 468, y: 492, r: 190, color: '#f97316', intensity: 0.72 }
);
} else if (this.zone === 2) {
lights.push(
{ x: 502, y: 312, r: 310, color: '#f59e0b', intensity: 0.68 },
{ x: 275, y: 190, r: 210, color: '#10b981', intensity: 0.55 },
{ x: 730, y: 190, r: 210, color: '#ef4444', intensity: 0.55 },
{ x: 727, y: 425, r: 190, color: '#dc2626', intensity: 0.60 }
);
}
return lights;
},
drawBoxShadowVolume(ctx, lx, ly, ob, maxLen, alpha) {
const cx = ob.x + ob.w * 0.5;
const cy = ob.y + ob.h * 0.5;
const distToCenter = Math.hypot(cx - lx, cy - ly);
if (distToCenter > maxLen + 140 || distToCenter < 4) return;
const corners = [
{ x: ob.x, y: ob.y },
{ x: ob.x + ob.w, y: ob.y },
{ x: ob.x + ob.w, y: ob.y + ob.h },
{ x: ob.x, y: ob.y + ob.h }
];
let minAng = Infinity;
let maxAng = -Infinity;
let cMin = corners[0];
let cMax = corners[0];
const baseAng = Math.atan2(cy - ly, cx - lx);
for (let i = 0; i < 4; i++) {
const c = corners[i];
let diff = Math.atan2(c.y - ly, c.x - lx) - baseAng;
while (diff < -Math.PI) diff += Math.PI * 2;
while (diff > Math.PI) diff -= Math.PI * 2;
if (diff < minAng) { minAng = diff; cMin = c; }
if (diff > maxAng) { maxAng = diff; cMax = c; }
}
const shadowLen = Math.max(95, maxLen - distToCenter * 0.35);
const angMin = Math.atan2(cMin.y - ly, cMin.x - lx);
const angMax = Math.atan2(cMax.y - ly, cMax.x - lx);
const farMinX = cMin.x + Math.cos(angMin - 0.05) * shadowLen;
const farMinY = cMin.y + Math.sin(angMin - 0.05) * shadowLen;
const farMaxX = cMax.x + Math.cos(angMax + 0.05) * shadowLen;
const farMaxY = cMax.y + Math.sin(angMax + 0.05) * shadowLen;

const grad = ctx.createLinearGradient(cx, cy, (farMinX + farMaxX) * 0.5, (farMinY + farMaxY) * 0.5);
const atten = Math.max(0.15, 1 - distToCenter / (maxLen + 140));
grad.addColorStop(0, `rgba(1, 2, 6, ${(alpha * atten).toFixed(3)})`);
grad.addColorStop(0.55, `rgba(2, 4, 10, ${(alpha * atten * 0.55).toFixed(3)})`);
grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

ctx.save();
ctx.fillStyle = grad;
ctx.beginPath();
ctx.moveTo(cMin.x, cMin.y);
ctx.lineTo(farMinX, farMinY);
ctx.lineTo(farMaxX, farMaxY);
ctx.lineTo(cMax.x, cMax.y);
ctx.closePath();
ctx.fill();
ctx.restore();
},
drawRaytracedSceneLighting(ctx) {
// Działa TYLKO na High Graphics (wyłączone w Low-End Mode!)
if (this.settings.lowEndMode || !this.settings.glows) return;
const z = this.zones[this.zone];
if (!z) return;
const lights = this.getZonePointLights();
const npcs = this.getZoneNpcs ? this.getZoneNpcs(this.zone) : [];

// 1. Raytraced Specular Floor Reflections (odbicia neonów i świateł w podłodze/asfalcie)
ctx.save();
ctx.globalCompositeOperation = 'screen';
for (let i = 0; i < lights.length; i++) {
const l = lights[i];
if (Math.abs(l.x - this.camera.x) > 720) continue;
const specR = l.r * 0.72;
const grad = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, specR);
grad.addColorStop(0, l.color);
grad.addColorStop(0.35, l.color);
grad.addColorStop(1, 'rgba(0,0,0,0)');
ctx.globalAlpha = l.isPlayer ? 0.14 : 0.11 * l.intensity;
ctx.fillStyle = grad;
ctx.beginPath();
ctx.ellipse(l.x, l.y + 8, specR * 0.85, specR * 0.52, 0, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();

// 2. Dynamiczne cienie rzucane przez przeszkody (stoły, łóżko, auta, kontenery) oraz NPC
for (let li = 0; li < lights.length; li++) {
const l = lights[li];
if (!l.isPlayer && Math.hypot(l.x - this.player.x, l.y - this.player.y) > 620) continue;
const shadowAlpha = l.isPlayer ? 0.62 : 0.34 * l.intensity;
if (z.obstacles) {
for (let oi = 0; oi < z.obstacles.length; oi++) {
this.drawBoxShadowVolume(ctx, l.x, l.y, z.obstacles[oi], l.r * 1.15, shadowAlpha);
}
}
for (let ni = 0; ni < npcs.length; ni++) {
const npc = npcs[ni];
const dx = npc.x - l.x;
const dy = npc.y - l.y;
const dist = Math.hypot(dx, dy);
if (dist > l.r || dist < 4) continue;
const ang = Math.atan2(dy, dx);
const len = (1 - dist / l.r) * (l.isPlayer ? 68 : 44) + 18;
const nr = npc.r || 13;
const sx = npc.x + Math.cos(ang) * len;
const sy = npc.y + Math.sin(ang) * len;
const nGrad = ctx.createLinearGradient(npc.x, npc.y, sx, sy);
const nAlpha = (1 - dist / l.r) * (l.isPlayer ? 0.58 : 0.32);
nGrad.addColorStop(0, `rgba(1, 2, 6, ${nAlpha.toFixed(3)})`);
nGrad.addColorStop(1, 'rgba(1, 2, 6, 0)');
ctx.save();
ctx.fillStyle = nGrad;
ctx.beginPath();
ctx.moveTo(npc.x + Math.cos(ang + Math.PI * 0.5) * nr * 0.85, npc.y + Math.sin(ang + Math.PI * 0.5) * nr * 0.85);
ctx.lineTo(sx + Math.cos(ang + Math.PI * 0.5) * nr * 1.65, sy + Math.sin(ang + Math.PI * 0.5) * nr * 1.65);
ctx.lineTo(sx + Math.cos(ang - Math.PI * 0.5) * nr * 1.65, sy + Math.sin(ang - Math.PI * 0.5) * nr * 1.65);
ctx.lineTo(npc.x + Math.cos(ang - Math.PI * 0.5) * nr * 0.85, npc.y + Math.sin(ang - Math.PI * 0.5) * nr * 0.85);
ctx.closePath();
ctx.fill();
ctx.restore();
}
}

// 3. Raytraced Specular Rim Highlights (podświetlenie krawędzi obiektów zwróconych w stronę gracza)
if (z.obstacles) {
ctx.save();
ctx.globalCompositeOperation = 'lighter';
const px = this.player.x;
const py = this.player.y;
for (let i = 0; i < z.obstacles.length; i++) {
const ob = z.obstacles[i];
const cx = ob.x + ob.w * 0.5;
const cy = ob.y + ob.h * 0.5;
const d = Math.hypot(cx - px, cy - py);
if (d > 290) continue;
const rimAlpha = Math.max(0, (1 - d / 290) * 0.42);
ctx.strokeStyle = `rgba(125, 211, 252, ${rimAlpha.toFixed(3)})`;
ctx.lineWidth = 2.2;
ctx.beginPath();
if (py < ob.y) { ctx.moveTo(ob.x + 4, ob.y); ctx.lineTo(ob.x + ob.w - 4, ob.y); }
if (py > ob.y + ob.h) { ctx.moveTo(ob.x + 4, ob.y + ob.h); ctx.lineTo(ob.x + ob.w - 4, ob.y + ob.h); }
if (px < ob.x) { ctx.moveTo(ob.x, ob.y + 4); ctx.lineTo(ob.x, ob.y + ob.h - 4); }
if (px > ob.x + ob.w) { ctx.moveTo(ob.x + ob.w, ob.y + 4); ctx.lineTo(ob.x + ob.w, ob.y + ob.h - 4); }
ctx.stroke();
}
ctx.restore();
}

// 4. Prawdziwy Raytracing Latarki Gracza (64-promieniowy wielokąt widoczności zatrzymujący się na przeszkodach + odbicia fotonów)
const p = this.player;
const originX = p.x + Math.cos(p.facing) * 8;
const originY = p.y + Math.sin(p.facing) * 8;
const rayCount = 64;
const halfSpread = 0.44;
const maxBeamDist = 245;
const hits = [];
for (let i = 0; i <= rayCount; i++) {
const frac = (i / rayCount) * 2 - 1;
const ang = p.facing + frac * halfSpread;
hits.push(this.castRayInZone(originX, originY, ang, maxBeamDist));
}

ctx.save();
ctx.globalCompositeOperation = 'lighter';
const beamGrad = ctx.createRadialGradient(originX, originY, 4, originX, originY, maxBeamDist);
beamGrad.addColorStop(0, 'rgba(254, 249, 195, 0.34)');
beamGrad.addColorStop(0.38, 'rgba(56, 189, 248, 0.16)');
beamGrad.addColorStop(0.78, 'rgba(14, 165, 233, 0.06)');
beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = beamGrad;
ctx.beginPath();
ctx.moveTo(originX, originY);
for (let i = 0; i < hits.length; i++) {
ctx.lineTo(hits[i].x, hits[i].y);
}
ctx.closePath();
ctx.fill();

// Subtelne odbicia światła (Raytraced Bounce Highlights) w miejscach uderzenia promieni o przeszkody
for (let i = 0; i < hits.length; i += 2) {
const h = hits[i];
if (h.hit && h.dist < maxBeamDist - 2) {
const bounceAlpha = (1 - h.dist / maxBeamDist) * 0.28;
ctx.fillStyle = `rgba(186, 230, 253, ${bounceAlpha.toFixed(3)})`;
ctx.beginPath();
ctx.arc(h.x, h.y, 4.5, 0, Math.PI * 2);
ctx.fill();
}
}
ctx.restore();
},
drawNoirLightingOverlay(ctx) {
ctx.save();
const p = this.player;
if (!this.settings.lowEndMode && this.settings.glows) {
// Wieloźródłowe cieniowanie Ambient Occlusion + Global Illumination (Raytraced High Graphics)
const grad = ctx.createRadialGradient(p.x, p.y, 85, p.x, p.y, 350);
grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
grad.addColorStop(0.58, 'rgba(2, 4, 11, 0.32)');
grad.addColorStop(0.86, 'rgba(2, 3, 8, 0.65)');
grad.addColorStop(1, 'rgba(1, 2, 5, 0.80)');
ctx.fillStyle = grad;
ctx.fillRect(p.x - 1000, p.y - 1000, 2000, 2000);

// Dodatkowy blask wolumetryczny wokół głównych źródeł światła w strefie
ctx.globalCompositeOperation = 'lighter';
const lights = this.getZonePointLights();
for (let i = 0; i < lights.length; i++) {
const l = lights[i];
if (l.isPlayer || Math.abs(l.x - this.camera.x) > 720) continue;
const lg = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.r * 0.65);
lg.addColorStop(0, l.color);
lg.addColorStop(1, 'rgba(0,0,0,0)');
ctx.globalAlpha = 0.075 * l.intensity;
ctx.fillStyle = lg;
ctx.beginPath();
ctx.arc(l.x, l.y, l.r * 0.65, 0, Math.PI * 2);
ctx.fill();
}
} else {
const grad = ctx.createRadialGradient(p.x, p.y, 75, p.x, p.y, 310);
grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
grad.addColorStop(0.60, 'rgba(3, 5, 10, 0.34)');
grad.addColorStop(0.88, 'rgba(2, 3, 7, 0.68)');
grad.addColorStop(1, 'rgba(1, 2, 5, 0.82)');
ctx.fillStyle = grad;
ctx.fillRect(p.x - 1000, p.y - 1000, 2000, 2000);
}
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