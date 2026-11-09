class SoundEngine {
constructor() {
this.ctx = null;
this.muted = false;
this.musicEnabled = CUSTOM_MUSIC_CONFIG.enabled;
this.musicVolume = CUSTOM_MUSIC_CONFIG.defaultVolume;
this.currentTrackKey = null;
this.customBlobUrl = null;
this.audioDecks = {};
this.fadeInterval = null;
this.rainNode = null;
this.rainGain = null;
this.isStreetRainActive = false;
Object.keys(CUSTOM_MUSIC_CONFIG.tracks).forEach(key => {
const audio = new Audio();
audio.loop = true;
audio.preload = 'auto';
audio.volume = this.musicVolume;
audio.src = CUSTOM_MUSIC_CONFIG.tracks[key];
audio.addEventListener('error', () => {
const labelEl = document.getElementById('music-current-track-label');
if (labelEl && !this.customBlobUrl && this.currentTrackKey === key) {
labelEl.textContent = 'Syntezator Cyberpunk Audio (Wbudowany)';
}
});
this.audioDecks[key] = audio;
});
const unlockAudio = () => {
this.init();
this.updateRainSound(this.isStreetRainActive);
if (this.musicEnabled && this.currentTrackKey) {
const activeDeck = this.getDeck(this.currentTrackKey);
if (activeDeck && activeDeck.paused) activeDeck.play().catch(() => {});
}
};
['pointerdown', 'pointermove', 'keydown', 'focus', 'mouseenter'].forEach(evt => {
window.addEventListener(evt, unlockAudio, { passive: true });
});
}
getDeck(trackKey) {
if (this.customBlobUrl) {
if (!this.audioDecks._custom) {
const a = new Audio(this.customBlobUrl);
a.loop = true;
a.volume = this.musicVolume;
this.audioDecks._custom = a;
}
return this.audioDecks._custom;
}
return this.audioDecks[trackKey] || this.audioDecks.menu;
}
playMusicForState(trackKey, forceRestart = false) {
const prevKey = this.currentTrackKey;
this.currentTrackKey = trackKey;
const shouldRestart = forceRestart || trackKey === 'menu';
const labelEl = document.getElementById('music-current-track-label');
if (labelEl && !this.customBlobUrl) {
labelEl.textContent = `🎵 Aktywny motyw: ${trackKey.toUpperCase()}`;
}
if (!this.musicEnabled) {
Object.values(this.audioDecks).forEach(d => { if (d && !d.paused) d.pause(); });
return;
}
const targetDeck = this.getDeck(trackKey);
if (!targetDeck) return;
if (this.customBlobUrl) {
targetDeck.volume = this.musicVolume;
if (targetDeck.paused) targetDeck.play().catch(() => {});
return;
}
if (shouldRestart) {
try { targetDeck.currentTime = 0; } catch (e) {}
}
if (prevKey === trackKey && !targetDeck.paused) {
targetDeck.volume = this.musicVolume;
return;
}
if (this.fadeInterval) {
clearInterval(this.fadeInterval);
this.fadeInterval = null;
}
targetDeck.volume = 0.02;
targetDeck.play().catch(() => {});
const stepMs = 30, totalSteps = 15;
let step = 0;
this.fadeInterval = setInterval(() => {
step++;
const t = Math.min(1, step / totalSteps);
targetDeck.volume = Math.max(0, Math.min(1, this.musicVolume * t));
Object.keys(this.audioDecks).forEach(k => {
if (k !== trackKey) {
const d = this.audioDecks[k];
if (d && !d.paused) {
d.volume = Math.max(0, this.musicVolume * (1 - t));
if (t >= 1) d.pause();
}
}
});
if (t >= 1) {
clearInterval(this.fadeInterval);
this.fadeInterval = null;
}
}, stepMs);
}
initRainLoop() {
if (this.rainNode || !this.ctx) return;
try {
const bufferSize = this.ctx.sampleRate * 2;
const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
const data = buffer.getChannelData(0);
let lastOut = 0.0;
for (let i = 0; i < bufferSize; i++) {
const white = Math.random() * 2 - 1;
data[i] = (lastOut + (0.04 * white)) / 1.04;
lastOut = data[i];
data[i] *= 1.8;
}
const noise = this.ctx.createBufferSource();
noise.buffer = buffer;
noise.loop = true;
const filter = this.ctx.createBiquadFilter();
filter.type = 'bandpass';
filter.frequency.value = 1150;
filter.Q.value = 0.65;
const gain = this.ctx.createGain();
gain.gain.value = 0.0001;
noise.connect(filter);
filter.connect(gain);
gain.connect(this.ctx.destination);
noise.start(0);
this.rainNode = noise;
this.rainGain = gain;
} catch (e) {}
}
updateRainSound(active) {
this.isStreetRainActive = active;
if (this.muted) active = false;
if (active) this.init();
if (!this.ctx) return;
this.initRainLoop();
if (!this.rainGain) return;
try {
const now = this.ctx.currentTime;
const targetGain = active ? 0.045 : 0.0001;
this.rainGain.gain.cancelScheduledValues(now);
this.rainGain.gain.setTargetAtTime(targetGain, now, 0.25);
} catch (e) {}
}
setMusicVolume(val0to1) {
this.musicVolume = Math.max(0, Math.min(1, val0to1));
Object.values(this.audioDecks).forEach(deck => { if (deck) deck.volume = this.musicVolume; });
}
toggleMusic() {
this.musicEnabled = !this.musicEnabled;
if (this.musicEnabled) this.playMusicForState(this.currentTrackKey || 'menu');
else Object.values(this.audioDecks).forEach(deck => { if (deck) deck.pause(); });
}
loadCustomBlob(url, fileName) {
if (this.customBlobUrl) URL.revokeObjectURL(this.customBlobUrl);
Object.values(this.audioDecks).forEach(deck => { if (deck) deck.pause(); });
this.customBlobUrl = url;
const customAudio = new Audio(url);
customAudio.loop = true;
customAudio.volume = this.musicVolume;
this.audioDecks._custom = customAudio;
this.musicEnabled = true;
const labelEl = document.getElementById('music-current-track-label');
if (labelEl) labelEl.textContent = `🎵 ${fileName}`;
this.playMusicForState(this.currentTrackKey || 'menu');
}
init() {
if (!this.ctx) {
const AudioCtx = window.AudioContext || window.webkitAudioContext;
if (AudioCtx) this.ctx = new AudioCtx();
}
if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
}
playTone(freq, type = 'sine', duration = 0.08, vol = 0.08, slideTo = null) {
if (this.muted) return;
this.init();
if (!this.ctx) return;
try {
const now = this.ctx.currentTime;
const osc = this.ctx.createOscillator();
const gain = this.ctx.createGain();
osc.type = type;
osc.frequency.setValueAtTime(freq, now);
if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
gain.gain.setValueAtTime(vol, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
osc.connect(gain);
gain.connect(this.ctx.destination);
osc.start(now);
osc.stop(now + duration);
} catch (e) {}
}
uiHover() { this.playTone(660, 'sine', 0.022, 0.025, 820); }
uiClick() { this.playTone(480, 'triangle', 0.045, 0.065, 920); }
uiBack() { this.playTone(360, 'triangle', 0.05, 0.06, 210); }
introBoom() {
this.playTone(65, 'sawtooth', 1.8, 0.09, 42);
setTimeout(() => this.playTone(130.8, 'triangle', 1.6, 0.07, 196), 150);
}
step() { this.playTone(95 + Math.random() * 25, 'triangle', 0.04, 0.04); }
chip() { this.playTone(920, 'sine', 0.06, 0.07, 1320); }
card() { this.playTone(340, 'triangle', 0.05, 0.07, 180); }
win() {
this.playTone(523.25, 'triangle', 0.12, 0.1);
setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.1), 90);
setTimeout(() => this.playTone(783.99, 'triangle', 0.22, 0.12), 180);
}
lose() {
this.playTone(220, 'sawtooth', 0.18, 0.09, 130);
setTimeout(() => this.playTone(130, 'sawtooth', 0.28, 0.1, 85), 140);
}
jackpot() {
[523, 659, 784, 1046, 1318].forEach((f, idx) => {
setTimeout(() => this.playTone(f, 'square', 0.14, 0.1), idx * 75);
});
}
blood() { this.playTone(150, 'sawtooth', 0.35, 0.12, 55); }
gunshot() {
if (this.muted) return;
this.init();
if (!this.ctx) return;
try {
const now = this.ctx.currentTime;
const bufLen = Math.floor(this.ctx.sampleRate * 0.11);
const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
const data = buf.getChannelData(0);
for (let i = 0; i < bufLen; i++) {
data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.028));
}
const noise = this.ctx.createBufferSource();
noise.buffer = buf;
const filter = this.ctx.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.setValueAtTime(1800, now);
filter.frequency.exponentialRampToValueAtTime(220, now + 0.1);
const gain = this.ctx.createGain();
gain.gain.setValueAtTime(0.22, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
noise.connect(filter);
filter.connect(gain);
gain.connect(this.ctx.destination);
noise.start(now);
} catch (e) {}
this.playTone(135, 'sawtooth', 0.09, 0.14, 38);
}
door() { this.playTone(190, 'sine', 0.14, 0.09, 280); }
tick() { this.playTone(780, 'sine', 0.03, 0.04); }
alarm() { this.playTone(880, 'square', 0.12, 0.08, 440); }
}