const VelvetUI = {
playIntroSequence() {
this.introPlaying = true;
this.mainMenuOpen = true;
this.keys = {};
this.sfx.updateRainSound(false);
this.sfx.playMusicForState('menu', true);
this.sfx.introBoom();
const introOverlay = document.getElementById('intro-overlay');
const logoBox = document.getElementById('intro-logo-box');
const menuOverlay = document.getElementById('main-menu-overlay');
if (this.introTimers) this.introTimers.forEach(id => clearTimeout(id));
this.introTimers = [];
if (introOverlay && logoBox && menuOverlay) {
introOverlay.classList.remove('hidden');
introOverlay.style.display = 'flex';
logoBox.classList.remove('intro-visible');
menuOverlay.classList.remove('hidden', 'menu-visible');
menuOverlay.style.display = 'flex';
this.introTimers.push(setTimeout(() => logoBox.classList.add('intro-visible'), 50));
this.introTimers.push(setTimeout(() => logoBox.classList.remove('intro-visible'), 4050));
this.introTimers.push(setTimeout(() => {
introOverlay.style.display = 'none';
introOverlay.classList.add('hidden');
menuOverlay.classList.add('menu-visible');
}, 7150));
this.introTimers.push(setTimeout(() => { this.introPlaying = false; }, 8150));
} else {
this.introPlaying = false;
}
},
bindGlobalUISounds() {
document.addEventListener('mouseover', (e) => {
if (this.introPlaying) return;
const btn = e.target.closest('button, label');
if (btn && !btn.disabled && this._lastHoveredBtn !== btn) {
this._lastHoveredBtn = btn;
this.sfx.uiHover();
}
});
document.addEventListener('pointerdown', (e) => {
if (this.introPlaying) return;
const btn = e.target.closest('button, label');
if (btn && !btn.disabled) this.sfx.uiClick();
});
},
openMainMenu(withIntro = false) {
this.mainMenuOpen = true;
this.renderGameWorld = false;
this.keys = {};
if (this.updateMobileState) this.updateMobileState();
this.sfx.updateRainSound(false);
const hudHeader = document.getElementById('main-hud-header');
if (hudHeader) hudHeader.classList.add('hidden');
if (this.ctx && this.canvas) {
this.ctx.fillStyle = '#030407';
this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
if (withIntro) {
this.playIntroSequence();
return;
}
const overlay = document.getElementById('main-menu-overlay');
if (overlay) {
overlay.classList.remove('hidden');
overlay.classList.add('menu-visible');
overlay.style.display = 'flex';
}
this.sfx.playMusicForState('menu', true);
},
closeMainMenu() {
if (this.introPlaying || this.isLoadingScreen) return;
this.isLoadingScreen = true;
this.keys = {};
this.sfx.uiClick();
const menuOverlay = document.getElementById('main-menu-overlay');
const loadOverlay = document.getElementById('loading-screen-overlay');
const stepText = document.getElementById('loading-step-text');
const subStatus = document.getElementById('loading-sub-status');
const pctText = document.getElementById('loading-pct-text');
const barFill = document.getElementById('loading-bar-fill');
if (menuOverlay) {
menuOverlay.classList.remove('menu-visible');
menuOverlay.classList.add('hidden');
menuOverlay.style.display = 'none';
}
if (loadOverlay) {
loadOverlay.classList.remove('hidden');
loadOverlay.style.display = 'flex';
void loadOverlay.offsetWidth;
loadOverlay.style.opacity = '1';
}
const tipsPl = [
'Rano w Kryjówce zegar stoi w miejscu. Sprawdź dzisiejszy kontrakt w Terminalu i kup Relikty przed wyjściem na ulicę.',
'W Kasynie codziennie rotują stoły i warianty gier. Szukaj stołu oznaczonego jako ★ MINIGRA DNIA!',
'Gdy brakuje Ci gotówki, sprawdź Bankomat Lichwiarza w Kasynie — ale pamiętaj, że nie każdej nocy jest otwarty.',
'Po zebraniu wymaganej Kwoty musisz wrócić do Kryjówki i położyć się do Łóżka przed upływem czasu (00:00).'
];
const tipsUk = [
'Вранці у Схованці таймер зупинено. Перевірте контракт у Терміналі та купіть Реліквії перед виходом.',
'У Казино щодня змінюються столи та варіанти ігор. Шукайте стіл із позначкою ★ МІНІГРА ДНЯ!',
'Якщо бракує грошей, перевірте Банкомат Лихваря в Казино — але він відкритий не кожної ночі.',
'Зібравши Квоту, обов’язково поверніться у Схованку та ляжте в Ліжко до закінчення таймера (00:00).'
];
const tipEl = document.getElementById('loading-tip-text');
if (tipEl) {
const pool = this.lang === 'uk' ? tipsUk : tipsPl;
tipEl.textContent = pool[(this.day - 1 + Math.floor(Math.random() * pool.length)) % pool.length];
}
const setProgress = (pct, mainMsg, subMsg) => {
if (pctText) pctText.textContent = `${pct}%`;
if (barFill) barFill.style.width = `${pct}%`;
if (stepText && mainMsg) stepText.textContent = mainMsg;
if (subStatus && subMsg) subStatus.textContent = subMsg;
};
setProgress(25, this.lang === 'uk' ? 'Підготовка звуку та музики...' : 'Przygotowywanie dźwięku i muzyki...', this.lang === 'uk' ? 'ЗАВАНТАЖЕННЯ' : 'WCZYTYWANIE GRY');
this.sfx.init();
this.sfx.initRainLoop();
Object.values(this.sfx.audioDecks).forEach(deck => {
if (deck && deck.preload !== 'auto') deck.preload = 'auto';
});
setTimeout(() => {
setProgress(60, this.lang === 'uk' ? 'Завантаження локацій: Схованка, Вулиця, Казино...' : 'Wczytywanie lokacji: Kryjówka, Ulica, Kasyno...', this.lang === 'uk' ? 'ЛОКАЦІЇ' : 'ŚWIAT GRY');
this.prebakeZoneFloors();
}, 180);
setTimeout(() => {
setProgress(90, this.lang === 'uk' ? 'Роздача карт і запуск столів Казино...' : 'Rozkładanie stołów i żetonów w Kasynie...', this.lang === 'uk' ? 'КАЗИНО' : 'KASYNO');
const savedZone = this.zone;
const warmCanvas = document.createElement('canvas');
warmCanvas.width = 400;
warmCanvas.height = 240;
const warmCtx = warmCanvas.getContext('2d');
[0, 1, 2].forEach(zIdx => {
this.zone = zIdx;
if (zIdx === 0) this.drawSafehouse(warmCtx);
else if (zIdx === 1) this.drawStreet(warmCtx);
else if (zIdx === 2) this.drawCasino(warmCtx);
});
this.zone = savedZone;
this.camera.x = this.player.x;
this.camera.y = this.player.y;
this.camera.vx = 0;
this.camera.vy = 0;
}, 480);
setTimeout(() => {
setProgress(100, 'Wszystkie zasoby gotowe. Uruchamianie sesji...', 'GOTOWE // 100%');
this.mainMenuOpen = false;
this.renderGameWorld = true;
const hudHeader = document.getElementById('main-hud-header');
if (hudHeader) hudHeader.classList.remove('hidden');
this.updateHUD();
}, 750);
setTimeout(() => {
this.sfx.door();
this.syncZoneMusic();
if (loadOverlay) {
loadOverlay.style.opacity = '0';
setTimeout(() => {
loadOverlay.style.display = 'none';
loadOverlay.classList.add('hidden');
this.isLoadingScreen = false;
if (this.updateMobileState) this.updateMobileState();
this.enforceGameFocus();
}, 950);
} else {
this.isLoadingScreen = false;
if (this.updateMobileState) this.updateMobileState();
this.enforceGameFocus();
}
}, 1850);
},
returnToMainMenuFromPause() {
this.closeModals(true);
this.openMainMenu(true);
},
openPauseModal() {
if (this.mainMenuOpen || this.introPlaying || (this.cutscene && this.cutscene.active)) return;
this.sfx.tick();
const pDay = document.getElementById('pause-stat-day');
const statusEl = document.getElementById('pause-status-line');
const pTok = document.getElementById('pause-stat-tokens');
if (pDay) pDay.textContent = `${this.t('day_word')} ${this.day}`;
if (statusEl) statusEl.textContent = `$${this.cash.toLocaleString()} / $${this.quota.toLocaleString()}`;
if (pTok) pTok.textContent = `${this.tokens} 🪙`;
this.openModal('modal-pause');
},
stepMusicVolume(delta) {
const cur = Math.round((this.sfx.musicVolume || 0) * 100);
const next = Math.max(0, Math.min(100, cur + delta));
this.setMusicVolume(next);
const slider = document.getElementById('set-music-volume');
if (slider) slider.value = next;
this.sfx.tick();
},
syncZoneMusic() {
if (this.mainMenuOpen) {
this.sfx.updateRainSound(false);
this.sfx.playMusicForState('menu', true);
} else if (this.zone === 0) {
this.sfx.updateRainSound(false);
this.sfx.playMusicForState('safehouse');
} else if (this.zone === 1) {
this.sfx.updateRainSound(this.settings.weather && !this.settings.lowEndMode);
this.sfx.playMusicForState('street');
} else if (this.zone === 2) {
this.sfx.updateRainSound(false);
this.sfx.playMusicForState('casino');
}
},
toggleMusic() {
this.sfx.toggleMusic();
this.syncSettingsUI();
},
setMusicVolume(val0to100) {
const num = parseInt(val0to100, 10) || 0;
this.sfx.setMusicVolume(num / 100);
const lbl = document.getElementById('set-music-vol-label');
if (lbl) lbl.textContent = `${num}%`;
},
loadCustomMp3FromFile(event) {
const file = event.target.files && event.target.files[0];
if (!file) return;
const blobUrl = URL.createObjectURL(file);
this.sfx.loadCustomBlob(blobUrl, file.name);
this.syncSettingsUI();
this.showToast(`🎵 Załadowano muzykę: ${file.name}`, 'emerald');
},
quickToggleLowEnd() {
this.toggleSetting('lowEndMode');
},
openSettingsModal() {
this.sfx.tick();
this.syncSettingsUI();
this.openModal('modal-settings');
},
toggleSetting(key) {
this.sfx.tick();
if (key === 'lowEndMode') {
this.settings.lowEndMode = !this.settings.lowEndMode;
const state = !this.settings.lowEndMode;
this.settings.glows = state;
this.settings.weather = state;
this.settings.crt = state;
} else {
this.settings[key] = !this.settings[key];
}
this.sfx.updateRainSound(!this.mainMenuOpen && this.zone === 1 && this.settings.weather && !this.settings.lowEndMode);
this.syncSettingsUI();
},
toggleMute() {
this.sfx.muted = !this.sfx.muted;
this.sfx.updateRainSound(!this.mainMenuOpen && this.zone === 1 && this.settings.weather && !this.settings.lowEndMode);
this.syncSettingsUI();
},
syncSettingsUI() {
const crtEl = document.getElementById('crt-overlay-layer');
if (crtEl) crtEl.style.display = this.settings.crt ? 'block' : 'none';
const fpsEl = document.getElementById('hud-fps');
if (fpsEl) fpsEl.classList.toggle('hidden', !this.settings.showFps);
const coachEl = document.getElementById('bj-coach-box');
if (coachEl) coachEl.style.display = this.settings.coach ? 'flex' : 'none';
const menuLowStatus = document.getElementById('menu-lowend-status');
if (menuLowStatus) {
menuLowStatus.textContent = this.settings.lowEndMode ? this.t('lowend_on') : this.t('lowend_off');
menuLowStatus.className = this.settings.lowEndMode ? 'text-emerald-400 font-extrabold' : 'text-zinc-400 font-extrabold';
}
const styleToggle = (id, state) => {
const btn = document.getElementById(id);
if (!btn) return;
btn.textContent = state ? 'ON' : 'OFF';
btn.className = state
? 'px-3 py-1 rounded-lg font-extrabold text-xs bg-emerald-500 text-zinc-950'
: 'px-3 py-1 rounded-lg font-extrabold text-xs bg-zinc-800 text-zinc-400';
};
styleToggle('set-btn-lowend', this.settings.lowEndMode);
styleToggle('set-btn-glows', this.settings.glows);
styleToggle('set-btn-weather', this.settings.weather);
styleToggle('set-btn-crt', this.settings.crt);
styleToggle('set-btn-coach', this.settings.coach);
styleToggle('set-btn-fps', this.settings.showFps);
styleToggle('set-btn-audio', !this.sfx.muted);
styleToggle('set-btn-music', this.sfx.musicEnabled);
const volSlider = document.getElementById('set-music-volume');
const volLabel = document.getElementById('set-music-vol-label');
if (volSlider && volLabel) {
const pct = Math.round(this.sfx.musicVolume * 100);
volSlider.value = pct;
volLabel.textContent = `${pct}%`;
}
this.syncMenuStatsUI();
},
syncMenuStatsUI() {
const mDay = document.getElementById('menu-stat-day');
const mCash = document.getElementById('menu-stat-cash');
const mTok = document.getElementById('menu-stat-tokens');
if (mDay) mDay.textContent = `${this.t('day_word')} ${this.day}`;
if (mCash) mCash.textContent = `$${this.cash.toLocaleString()} / $${this.quota.toLocaleString()}`;
if (mTok) mTok.textContent = `${this.tokens} 🪙`;
const inpBadge = document.getElementById('menu-input-badge');
const inpText = document.getElementById('menu-input-text');
if (inpBadge && inpText) {
if (this.gamepad && this.gamepad.connected) {
inpBadge.innerHTML = `<span>🎮</span> <span id="menu-input-text">${this.gamepad.type === 'PS' ? 'PAD PLAYSTATION' : 'PAD XBOX / PC'}</span>`;
} else if (this.isMobile) {
inpBadge.innerHTML = `<span>📱</span> <span id="menu-input-text">${this.lang === 'uk' ? 'СЕНСОРНИЙ ЕКРАН' : 'EKRAN DOTYKOWY'}</span>`;
} else {
inpBadge.innerHTML = `<span>⌨️</span> <span id="menu-input-text">${this.lang === 'uk' ? 'КЛАВІАТУРА / МИША' : 'KLAWIATURA / MYSZ'}</span>`;
}
}
},
t(key, params = {}) {
const dict = I18N[this.lang] || I18N.pl;
let text = dict[key] || I18N.pl[key] || key;
for (const k in params) {
text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
}
return text;
},
getLocalized(obj) {
if (!obj) return '';
return obj[this.lang] || obj.pl || '';
},
setLanguage(langCode) {
if (!I18N[langCode]) return;
this.lang = langCode;
this.sfx.tick();
this.applyTranslations();
this.syncSettingsUI();
this.updateHUD();
},
cycleLanguage() {
const langs = ['pl', 'uk'];
this.setLanguage(langs[(langs.indexOf(this.lang) + 1) % langs.length]);
},
applyTranslations() {
document.querySelectorAll('[data-i18n]').forEach(el => {
const key = el.getAttribute('data-i18n');
const translated = this.t(key);
if (translated) el.textContent = translated;
});
['pl', 'uk'].forEach(code => {
const btnMenu = document.getElementById(`lang-btn-menu-${code}`);
if (btnMenu) {
btnMenu.className = `px-2.5 py-1 rounded-lg text-xs font-extrabold transition ${this.lang === code ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`;
}
const btnSet = document.getElementById(`lang-btn-set-${code}`);
if (btnSet) {
btnSet.className = `px-2.5 py-1 rounded-lg text-xs font-extrabold ${this.lang === code ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`;
}
});
const langBtnHud = document.getElementById('btn-hud-lang');
if (langBtnHud) {
const map = { pl: '🇵🇱 PL', uk: '🇺🇦 UA' };
langBtnHud.textContent = map[this.lang] || '🇵🇱 PL';
}
},
toggleClockSpeed() {
this.clockMultiplier = this.clockMultiplier === 1 ? 5 : 1;
const btn = document.getElementById('btn-clock-speed');
const mBtn = document.getElementById('mobile-speed-btn');
const label = this.clockMultiplier === 5 ? '5x ⚡' : '1x ⏱️';
if (mBtn) {
mBtn.textContent = label;
mBtn.className = this.clockMultiplier === 5
? 'btn-gritty bg-amber-500 text-zinc-950 border border-amber-300 px-3 py-2 rounded-xl text-xs font-extrabold shadow-lg'
: 'btn-gritty bg-zinc-900/90 hover:bg-zinc-800 text-amber-300 border border-zinc-700 px-3 py-2 rounded-xl text-xs font-extrabold shadow-lg';
}
if (btn) {
btn.textContent = label;
btn.className = this.clockMultiplier === 5
? 'btn-gritty bg-amber-500 text-zinc-950 border-amber-700 text-[10px] font-extrabold px-2 py-1 rounded shrink-0'
: 'btn-gritty bg-zinc-800 hover:bg-zinc-700 border-zinc-950 text-zinc-200 text-[10px] font-extrabold px-2 py-1 rounded shrink-0';
}
this.sfx.tick();
this.showToast(this.clockMultiplier === 5 ? '⚡ PRĘDKOŚĆ GRY I CZASU: 5x!' : '⏱️ PRĘDKOŚĆ GRY I CZASU: 1x', this.clockMultiplier === 5 ? 'amber' : 'emerald');
},
showToast(msg, tone = 'amber') {
const container = document.getElementById('toast-container');
if (!container) return;
const el = document.createElement('div');
const colors = {
amber: 'bg-amber-950/95 border-amber-500 text-amber-200',
emerald: 'bg-emerald-950/95 border-emerald-500 text-emerald-200',
red: 'bg-red-950/95 border-red-500 text-red-200'
};
el.className = `${colors[tone] || colors.amber} border-2 px-4 py-2 rounded-xl shadow-2xl text-xs sm:text-sm font-extrabold tracking-wide text-center transition-all duration-300`;
el.textContent = msg;
container.appendChild(el);
setTimeout(() => {
el.style.opacity = '0';
el.style.transform = 'translateY(-8px)';
setTimeout(() => el.remove(), 300);
}, 2600);
},
openModal(id) {
const backdrop = document.getElementById('modal-backdrop');
if (!backdrop) return;
backdrop.classList.remove('hidden');
backdrop.style.display = 'flex';
backdrop.querySelectorAll(':scope > div').forEach(m => m.classList.add('hidden'));
const target = document.getElementById(id);
if (target) {
target.classList.remove('hidden');
this.activeModal = id;
}
this.keys = {};
if (this.updateMobileState) this.updateMobileState();
if (this.resetGamepadFocus) this.resetGamepadFocus();
if (this.gamepad && this.gamepad.connected && this.moveGamepadFocus) {
setTimeout(() => this.moveGamepadFocus(1), 30);
}
},
closeModals(force = false) {
if (!force && (this.activeModal === 'modal-gameover' || this.activeModal === 'modal-day-complete')) return;
if (!force && this.activeModal === 'modal-blackjack' && this.bj.inProgress) {
this.showToast('Dokończ obecne rozdanie przed odejściem od stołu!', 'red');
return;
}
if (!force && this.activeModal === 'modal-roulette' && this.roul.spinning) return;
if (!force && this.activeModal === 'modal-crash' && this.crash.active) {
this.showToast('Rakieta jest w locie! Katapultuj się przed odejściem!', 'red');
return;
}
if (!force && this.activeModal === 'modal-mines' && this.mines.active && this.mines.revealedCount > 0) {
this.showToast('Wypłać łup z pola minowego przed odejściem!', 'amber');
return;
}
const backdrop = document.getElementById('modal-backdrop');
if (backdrop) {
backdrop.classList.add('hidden');
backdrop.style.display = 'none';
backdrop.querySelectorAll(':scope > div').forEach(m => m.classList.add('hidden'));
}
this.activeModal = null;
this.keys = {};
if (this.updateMobileState) this.updateMobileState();
if (this.resetGamepadFocus) this.resetGamepadFocus();
if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
this.updateHUD();
this.enforceGameFocus();
},
openGuideModal() {
this.sfx.tick();
this.openModal('modal-guide');
},
openTerminalModal() {
this.sfx.tick();
document.getElementById('term-day').textContent = `${this.t('day_word')} ${this.day}`;
document.getElementById('term-phase').textContent = this.phase === 'PREP' ? this.t('hud_prep') : this.t('hud_shift');
document.getElementById('term-quota').textContent = `$${this.quota.toLocaleString()}`;
document.getElementById('term-cash').textContent = `$${this.cash.toLocaleString()}`;
const diff = Math.max(0, this.quota - this.cash);
const defEl = document.getElementById('term-deficit');
if (diff === 0) {
defEl.textContent = this.t('term_quota_met');
defEl.className = 'text-xs text-emerald-400 mt-0.5 font-bold';
} else {
defEl.textContent = this.t('term_needed', { diff: diff.toLocaleString() });
defEl.className = 'text-xs text-red-400 mt-0.5';
}
document.getElementById('term-modifier-title').textContent = this.getLocalized(this.currentModifier.name).toUpperCase();
document.getElementById('term-modifier-desc').textContent = this.getLocalized(this.currentModifier.desc);
if (this.currentChallenge) {
document.getElementById('term-challenge-desc').textContent = this.getLocalized(this.currentChallenge.desc);
document.getElementById('term-challenge-progress').textContent = this.currentChallenge.completed
? this.t('completed_word')
: `${this.currentChallenge.progress} / ${this.currentChallenge.target}`;
}
this.openModal('modal-terminal');
},
openRelicModal() {
this.sfx.tick();
this.renderRelicShop();
this.openModal('modal-relics');
},
renderRelicShop() {
document.getElementById('shop-tokens').textContent = this.tokens;
const grid = document.getElementById('relic-grid');
if (!grid) return;
grid.innerHTML = '';
RELIC_CATALOG.forEach(r => {
const owned = this.relics.has(r.id);
const canAfford = this.tokens >= r.cost;
const card = document.createElement('div');
card.className = `p-4 rounded-xl border ${owned ? 'bg-emerald-950/30 border-emerald-500/60' : 'bg-zinc-900/90 border-zinc-800'} flex flex-col justify-between gap-3`;
card.innerHTML = `
<div class="flex items-start gap-3">
<div class="text-2xl bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">${r.icon}</div>
<div>
<div class="flex items-center gap-2">
<h3 class="font-extrabold text-sm text-white">${this.getLocalized(r.name)}</h3>
${owned ? `<span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">${this.t('relic_equipped')}</span>` : ''}
</div>
<p class="text-xs text-zinc-400 mt-1 leading-relaxed">${this.getLocalized(r.desc)}</p>
</div>
</div>
<div class="flex items-center justify-between pt-2 border-t border-zinc-800/80">
<span class="text-xs font-extrabold text-amber-400">🪙 ${r.cost}</span>
<button ${owned || !canAfford ? 'disabled' : ''} class="btn-gritty px-4 py-1.5 rounded-lg text-xs font-extrabold ${owned ? 'bg-emerald-800 text-emerald-200 border-emerald-950' : (canAfford ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 border-amber-700' : 'bg-zinc-800 text-zinc-500 border-zinc-950')}">
${owned ? this.t('relic_owned') : `${this.t('relic_unlock')} (${r.cost} 🪙)`}
</button>
</div>`;
if (!owned && canAfford) card.querySelector('button').onclick = () => this.buyRelic(r);
grid.appendChild(card);
});
},
buyRelic(relic) {
if (this.relics.has(relic.id) || this.tokens < relic.cost) return;
this.tokens -= relic.cost;
this.relics.add(relic.id);
if (relic.id === 'adrenaline_shot' && this.phase === 'SHIFT') {
this.timeLeft += 45;
this.maxTime += 45;
}
if (relic.id === 'chrono_anchor' && this.phase === 'SHIFT') {
this.timeLeft += 90;
this.maxTime += 90;
}
if (relic.id === 'syndicate_seal') {
this.quota = Math.max(500, Math.round((this.quota * 0.85) / 50) * 50);
}
if (relic.id === 'velvet_crown') {
this.cash += 1000;
this.bloodAvailableToday = true;
this.tokenPawnAvailableToday = true;
}
this.sfx.win();
this.showToast(`Odblokowano Relikt: ${this.getLocalized(relic.name)}!`, 'emerald');
this.renderRelicShop();
this.updateHUD();
if (this.checkBankruptcy) this.checkBankruptcy();
},
updateHUD() {
if (this.syncMenuStatsUI) this.syncMenuStatsUI();
document.getElementById('hud-day').textContent = `${this.t('day_word')} ${this.day}`;
document.getElementById('hud-zone').textContent = this.zones[this.zone].getName();
const cashEl = document.getElementById('hud-cash');
cashEl.textContent = `$${this.cash.toLocaleString()}`;
if (this.lastHudCash !== this.cash) {
cashEl.classList.remove('hud-pop');
void cashEl.offsetWidth;
cashEl.classList.add('hud-pop');
this.lastHudCash = this.cash;
}
document.getElementById('hud-quota').textContent = `$${this.quota.toLocaleString()}`;
document.getElementById('hud-tokens').textContent = this.tokens;
document.getElementById('hud-modifier-name').textContent = this.getLocalized(this.currentModifier.name).toUpperCase();
const pct = Math.min(100, Math.round((this.cash / this.quota) * 100));
document.getElementById('hud-quota-bar').style.width = `${pct}%`;
const mins = Math.floor(this.timeLeft / 60);
const secs = Math.floor(this.timeLeft % 60);
const timerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
const timerEl = document.getElementById('hud-timer');
const timerLabel = document.getElementById('hud-timer-label');
const timerBox = document.getElementById('hud-timer-box');
timerEl.textContent = timerText;
if (this.phase === 'PREP') {
timerLabel.textContent = this.t('hud_prep');
timerEl.className = 'text-xs sm:text-sm font-extrabold tracking-wider text-emerald-400 leading-none';
timerBox.classList.remove('danger-pulse');
} else if (this.timeLeft <= 60) {
timerLabel.textContent = this.t('hud_hurry');
timerEl.className = 'text-xs sm:text-sm font-extrabold tracking-wider text-red-400 leading-none';
timerBox.classList.add('danger-pulse');
} else {
timerLabel.textContent = this.t('hud_shift');
timerEl.className = 'text-xs sm:text-sm font-extrabold tracking-wider text-amber-400 leading-none';
timerBox.classList.remove('danger-pulse');
}
if (this.currentChallenge) {
document.getElementById('hud-challenge-text').textContent = this.getLocalized(this.currentChallenge.desc);
const st = document.getElementById('hud-challenge-status');
if (this.currentChallenge.completed) {
st.textContent = this.t('completed_word');
st.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600 shrink-0';
} else {
st.textContent = `${this.currentChallenge.progress}/${this.currentChallenge.target} (+${this.currentChallenge.reward}🪙)`;
st.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/50 shrink-0';
}
}
const relicTray = document.getElementById('hud-relics');
if (relicTray) {
if (this.relics.size === 0) {
relicTray.innerHTML = `<span class="text-[10px] text-zinc-500 px-1">${this.t('hud_no_relics')}</span>`;
} else {
relicTray.innerHTML = Array.from(this.relics).map(id => {
const r = RELIC_CATALOG.find(item => item.id === id);
return r ? `<span title="${this.getLocalized(r.name)}" class="text-sm px-1">${r.icon}</span>` : '';
}).join('');
}
}
}
};
Object.assign(VelvetPitGame.prototype, VelvetUI);