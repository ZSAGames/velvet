const VelvetMinigames = {
  ensureExtraMinigamesInitialized() {
    if (this._extraMinigamesReady) return;
    this._extraMinigamesReady = true;

    this.tower = {
      bet: 0,
      active: false,
      floor: 0,
      maxFloors: 5,
      doors: 3,
      safeDoors: 2,
      stepMult: 1.45,
      mult: 1.00
    };
    this.pulse = {
      bet: 0,
      active: false,
      cursor: 0.5,
      dir: 1,
      speed: 1.35,
      targetStart: 0.38,
      targetWidth: 0.24,
      hits: 0,
      maxHits: 4,
      stepBonus: 0.65,
      mult: 1.00
    };
    this.hilo = {
      bet: 0,
      active: false,
      currentCard: null,
      streak: 0,
      mult: 1.00,
      deck: []
    };
    this.cups = {
      bet: 0,
      active: false,
      shuffling: false,
      cupCount: 3,
      safeCount: 2,
      stepMult: 1.45,
      mult: 1.00,
      round: 0,
      items: []
    };

    if (typeof this.bloodAvailableToday === 'undefined') {
      this.bloodAvailableToday = true;
      this.tokenPawnAvailableToday = true;
      this.daysWithoutBlood = 0;
      this.daysWithoutPawn = 0;
    }
    this.lastDayGameTypes = this.lastDayGameTypes || [];
    this.featuredMinigameBag = this.featuredMinigameBag || [];
    this.dailyFeaturedGame = this.dailyFeaturedGame || null;

    this.injectExtraMinigameModals();
    this.hookRendererAndModals();
  },

  injectExtraMinigameModals() {
    const backdrop = document.getElementById('modal-backdrop');
    if (!backdrop || document.getElementById('modal-tower')) return;

    const betBarHTML = (key, colorName) => `
      <div class="flex flex-wrap items-center justify-between gap-1.5 bg-zinc-900 px-3.5 py-2.5 rounded-xl border border-zinc-800">
        <span id="${key}-min-badge" class="text-[10px] font-extrabold px-2 py-1 rounded bg-red-950 text-red-300 border border-red-700/60">MIN: $50</span>
        <div class="flex items-center bg-zinc-950 border border-${colorName}-500/50 rounded-lg px-2 py-1">
          <span class="text-${colorName}-400 font-extrabold text-xs mr-1">$</span>
          <input id="${key}-bet-input" type="number" min="0" step="10" value="0" oninput="window.game.onCustomBetInput('${key}', this.value)" class="w-20 bg-transparent text-${colorName}-300 font-extrabold text-sm focus:outline-none">
        </div>
        <button onclick="window.game.modifyGameBet('${key}', 'clear')" class="btn-gritty bg-zinc-800 hover:bg-zinc-700 border-zinc-950 text-zinc-300 text-xs font-bold px-2 py-1.5 rounded">$0</button>
        <button onclick="window.game.modifyGameBet('${key}', 'min')" class="btn-gritty bg-zinc-800 hover:bg-zinc-700 border-zinc-950 text-cyan-300 text-xs font-bold px-2 py-1.5 rounded">MIN</button>
        <button onclick="window.game.modifyGameBet('${key}', 50)" class="btn-gritty bg-emerald-900/80 hover:bg-emerald-800 border-emerald-950 text-emerald-200 text-xs font-extrabold px-2.5 py-1.5 rounded">+$50</button>
        <button onclick="window.game.modifyGameBet('${key}', 150)" class="btn-gritty bg-amber-900/80 hover:bg-amber-800 border-amber-950 text-amber-200 text-xs font-extrabold px-2.5 py-1.5 rounded">+$150</button>
        <button onclick="window.game.modifyGameBet('${key}', 'max')" class="btn-gritty bg-red-900/80 hover:bg-red-800 border-red-950 text-red-200 text-xs font-bold px-2 py-1.5 rounded">MAX</button>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <!-- 1. WIEŻA RYZYKA (TOWER) -->
      <div id="modal-tower" class="hidden w-full max-w-xl bg-zinc-950 border-2 border-sky-500 rounded-2xl shadow-[0_0_65px_rgba(14,165,233,0.3)] max-h-[92dvh] overflow-y-auto my-auto">
        <div class="bg-sky-950 border-b border-sky-700 px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">🏢</span>
            <div>
              <h2 class="text-sky-200 font-bold tracking-wider text-sm sm:text-base uppercase">WIEŻA RYZYKA // SKARBIEC</h2>
              <p id="tower-variant-sub" class="text-[11px] text-sky-300/80">Wybieraj bezpieczne przejścia na kolejnych piętrach i wypłać łup!</p>
            </div>
          </div>
          <button onclick="window.game.closeModals()" class="text-sky-200 hover:text-white font-bold text-xs px-3 py-1.5 rounded bg-sky-900/80 border border-sky-600">ODEJDŹ [ESC]</button>
        </div>
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div><div class="text-[10px] text-zinc-400 uppercase font-bold">PIĘTRO / MNOŻNIK</div><div id="tower-mult-label" class="text-2xl font-extrabold text-sky-400">1.00x (0/5)</div></div>
            <div class="text-right"><div class="text-[10px] text-zinc-400 uppercase font-bold">DO WYPŁATY</div><div id="tower-payout-label" class="text-2xl font-extrabold text-amber-400">$0</div></div>
          </div>
          <div id="tower-doors-grid" class="grid grid-cols-3 gap-3 py-2"></div>
          <div id="tower-status" class="text-center font-extrabold text-xs sm:text-sm text-amber-300">USTAW STAWKĘ I WEJDŹ DO WIEŻY</div>
          ${betBarHTML('tower', 'sky')}
          <div class="grid grid-cols-2 gap-3">
            <button id="tower-start-btn" onclick="window.game.startTowerGame()" class="btn-gritty bg-sky-500 hover:bg-sky-400 border-sky-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider">🏢 WEJDŹ DO WIEŻY</button>
            <button id="tower-cashout-btn" onclick="window.game.cashoutTowerGame()" disabled class="btn-gritty bg-amber-500 hover:bg-amber-400 border-amber-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider">💰 WYPŁAĆ ŁUP</button>
          </div>
        </div>
      </div>

      <!-- 2. KALIBRACJA IMPULSU (PULSE) -->
      <div id="modal-pulse" class="hidden w-full max-w-xl bg-zinc-950 border-2 border-teal-500 rounded-2xl shadow-[0_0_65px_rgba(20,184,166,0.3)] max-h-[92dvh] overflow-y-auto my-auto">
        <div class="bg-teal-950 border-b border-teal-700 px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">⚡</span>
            <div>
              <h2 class="text-teal-200 font-bold tracking-wider text-sm sm:text-base uppercase">KALIBRACJA IMPULSU // RDZEŃ</h2>
              <p id="pulse-variant-sub" class="text-[11px] text-teal-300/80">Zatrzymaj kursor w zielonej strefie, aby podbić mnożnik!</p>
            </div>
          </div>
          <button onclick="window.game.closeModals()" class="text-teal-200 hover:text-white font-bold text-xs px-3 py-1.5 rounded bg-teal-900/80 border border-teal-600">ODEJDŹ [ESC]</button>
        </div>
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div><div class="text-[10px] text-zinc-400 uppercase font-bold">MNOŻNIK RDZENIA</div><div id="pulse-mult-label" class="text-2xl font-extrabold text-teal-400">1.00x</div></div>
            <div class="text-right"><div class="text-[10px] text-zinc-400 uppercase font-bold">DO WYPŁATY</div><div id="pulse-payout-label" class="text-2xl font-extrabold text-amber-400">$0</div></div>
          </div>
          <div class="relative w-full h-14 bg-zinc-900 border-2 border-zinc-700 rounded-xl overflow-hidden">
            <div id="pulse-target-zone" class="absolute top-0 bottom-0 bg-emerald-500/35 border-x-2 border-emerald-400" style="left: 35%; width: 24%;"></div>
            <div id="pulse-cursor-bar" class="absolute top-0 bottom-0 w-2.5 bg-amber-400 shadow-[0_0_15px_#fbbf24]" style="left: 50%;"></div>
          </div>
          <div id="pulse-status" class="text-center font-extrabold text-xs sm:text-sm text-amber-300">USTAW STAWKĘ I URUCHOM IMPULS</div>
          ${betBarHTML('pulse', 'teal')}
          <div class="grid grid-cols-3 gap-2.5">
            <button id="pulse-start-btn" onclick="window.game.startPulseGame()" class="btn-gritty bg-teal-500 hover:bg-teal-400 border-teal-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs uppercase">⚡ START</button>
            <button id="pulse-hit-btn" onclick="window.game.hitPulseBar()" disabled class="btn-gritty bg-emerald-500 hover:bg-emerald-400 border-emerald-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs uppercase">🎯 ZATRZYMAJ!</button>
            <button id="pulse-cashout-btn" onclick="window.game.cashoutPulseGame()" disabled class="btn-gritty bg-amber-500 hover:bg-amber-400 border-amber-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs uppercase">💰 WYPŁAĆ</button>
          </div>
        </div>
      </div>

      <!-- 3. SZULER // HI-LO -->
      <div id="modal-hilo" class="hidden w-full max-w-xl bg-zinc-950 border-2 border-pink-500 rounded-2xl shadow-[0_0_65px_rgba(236,72,153,0.3)] max-h-[92dvh] overflow-y-auto my-auto">
        <div class="bg-pink-950 border-b border-pink-700 px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">🃏</span>
            <div>
              <h2 class="text-pink-200 font-bold tracking-wider text-sm sm:text-base uppercase">SZULER // KARTY HI-LO</h2>
              <p id="hilo-variant-sub" class="text-[11px] text-pink-300/80">Zgadnij, czy następna karta będzie wyższa czy niższa (2 najniższa, As najwyższy)!</p>
            </div>
          </div>
          <button onclick="window.game.closeModals()" class="text-pink-200 hover:text-white font-bold text-xs px-3 py-1.5 rounded bg-pink-900/80 border border-pink-600">ODEJDŹ [ESC]</button>
        </div>
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div><div class="text-[10px] text-zinc-400 uppercase font-bold">SERIA / MNOŻNIK</div><div id="hilo-mult-label" class="text-2xl font-extrabold text-pink-400">1.00x</div></div>
            <div class="text-right"><div class="text-[10px] text-zinc-400 uppercase font-bold">DO WYPŁATY</div><div id="hilo-payout-label" class="text-2xl font-extrabold text-amber-400">$0</div></div>
          </div>
          <div class="flex flex-col items-center justify-center py-3 bg-zinc-900/70 border border-zinc-800 rounded-xl">
            <div id="hilo-card-box" class="w-24 h-32 rounded-xl bg-white border-2 border-amber-400 flex flex-col items-center justify-center text-3xl font-extrabold text-zinc-900 shadow-xl">?</div>
            <div id="hilo-status" class="mt-3 text-center font-extrabold text-xs sm:text-sm text-amber-300">WPISZ STAWKĘ I ROZDAJ KARTĘ STARTOWĄ</div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button id="hilo-btn-higher" onclick="window.game.guessHilo('HIGHER')" disabled class="btn-gritty bg-emerald-600 hover:bg-emerald-500 border-emerald-900 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase">▲ WYŻSZA LUB RÓWNA</button>
            <button id="hilo-btn-lower" onclick="window.game.guessHilo('LOWER')" disabled class="btn-gritty bg-purple-600 hover:bg-purple-500 border-purple-900 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase">▼ NIŻSZA LUB RÓWNA</button>
          </div>
          ${betBarHTML('hilo', 'pink')}
          <div class="grid grid-cols-2 gap-3">
            <button id="hilo-start-btn" onclick="window.game.startHiloGame()" class="btn-gritty bg-pink-500 hover:bg-pink-400 border-pink-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm uppercase">🃏 ROZDAJ KARTĘ</button>
            <button id="hilo-cashout-btn" onclick="window.game.cashoutHiloGame()" disabled class="btn-gritty bg-amber-500 hover:bg-amber-400 border-amber-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm uppercase">💰 WYPŁAĆ ŁUP</button>
          </div>
        </div>
      </div>

      <!-- 4. TRZY CZASZKI (CUPS) -->
      <div id="modal-cups" class="hidden w-full max-w-xl bg-zinc-950 border-2 border-purple-500 rounded-2xl shadow-[0_0_65px_rgba(168,85,247,0.3)] max-h-[92dvh] overflow-y-auto my-auto">
        <div class="bg-purple-950 border-b border-purple-700 px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">💀</span>
            <div>
              <h2 class="text-purple-200 font-bold tracking-wider text-sm sm:text-base uppercase">TRZY CZASZKI // KAPSUŁY</h2>
              <p id="cups-variant-sub" class="text-[11px] text-purple-300/80">Wybierz kapsułę z Krwawym Diamentem 💎 i unikaj Czaszki 💀!</p>
            </div>
          </div>
          <button onclick="window.game.closeModals()" class="text-purple-200 hover:text-white font-bold text-xs px-3 py-1.5 rounded bg-purple-900/80 border border-purple-600">ODEJDŹ [ESC]</button>
        </div>
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div><div class="text-[10px] text-zinc-400 uppercase font-bold">AKTUALNY MNOŻNIK</div><div id="cups-mult-label" class="text-2xl font-extrabold text-purple-400">1.00x</div></div>
            <div class="text-right"><div class="text-[10px] text-zinc-400 uppercase font-bold">DO WYPŁATY</div><div id="cups-payout-label" class="text-2xl font-extrabold text-amber-400">$0</div></div>
          </div>
          <div id="cups-grid" class="grid grid-cols-3 gap-3 py-2"></div>
          <div id="cups-status" class="text-center font-extrabold text-xs sm:text-sm text-amber-300">WPISZ STAWKĘ I ZATASUJ KAPSUŁY</div>
          ${betBarHTML('cups', 'purple')}
          <div class="grid grid-cols-2 gap-3">
            <button id="cups-start-btn" onclick="window.game.startCupsGame()" class="btn-gritty bg-purple-500 hover:bg-purple-400 border-purple-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm uppercase">💀 ZATASUJ KAPSUŁY</button>
            <button id="cups-cashout-btn" onclick="window.game.cashoutCupsGame()" disabled class="btn-gritty bg-amber-500 hover:bg-amber-400 border-amber-800 text-zinc-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm uppercase">💰 WYPŁAĆ ŁUP</button>
          </div>
        </div>
      </div>
    `;
    while (wrapper.firstElementChild) {
      backdrop.appendChild(wrapper.firstElementChild);
    }
  },

  hookRendererAndModals() {
    const origCloseModals = this.closeModals;
    this.closeModals = function(force = false) {
      if (!force) {
        if (this.activeModal === 'modal-tower' && this.tower && this.tower.active && this.tower.floor > 0) {
          this.showToast('Wypłać łup z Wieży Ryzyka przed odejściem!', 'amber');
          return;
        }
        if (this.activeModal === 'modal-pulse' && this.pulse && this.pulse.active && this.pulse.hits > 0) {
          this.showToast('Wypłać łup z Kalibracji Impulsu przed odejściem!', 'amber');
          return;
        }
        if (this.activeModal === 'modal-hilo' && this.hilo && this.hilo.active && this.hilo.streak > 0) {
          this.showToast('Wypłać serię z Hi-Lo przed odejściem!', 'amber');
          return;
        }
        if (this.activeModal === 'modal-cups' && this.cups && this.cups.active && this.cups.round > 0) {
          this.showToast('Wypłać łup z Kapsuł przed odejściem!', 'amber');
          return;
        }
      }
      return origCloseModals.call(this, force);
    };
  },

  rollDailyAtmAvailability() {
    if (this.relics && this.relics.has('velvet_crown')) {
      this.bloodAvailableToday = true;
      this.tokenPawnAvailableToday = true;
      this.daysWithoutBlood = 0;
      this.daysWithoutPawn = 0;
      return;
    }
    if (this.day === 1) {
      this.bloodAvailableToday = Math.random() < 0.65;
      this.tokenPawnAvailableToday = !this.bloodAvailableToday || (Math.random() < 0.5);
    } else {
      const bloodChance = this.bloodAvailableToday ? 0.35 : (this.daysWithoutBlood >= 2 ? 0.85 : 0.60);
      const pawnChance = this.tokenPawnAvailableToday ? 0.35 : (this.daysWithoutPawn >= 2 ? 0.85 : 0.60);
      this.bloodAvailableToday = Math.random() < bloodChance;
      this.tokenPawnAvailableToday = Math.random() < pawnChance;
    }
    this.daysWithoutBlood = this.bloodAvailableToday ? 0 : ((this.daysWithoutBlood || 0) + 1);
    this.daysWithoutPawn = this.tokenPawnAvailableToday ? 0 : ((this.daysWithoutPawn || 0) + 1);
  },

  randomizeNightlyCasinoFloor() {
    this.ensureExtraMinigamesInitialized();
    if (this.day === 1 && typeof this._rolledDay1Atm === 'undefined') {
      this._rolledDay1Atm = true;
      this.rollDailyAtmAvailability();
    }

    const allGames = [
      {
        type: 'crash',
        icon: '🚀',
        title: '🚀 RAKIETA // CRASH',
        color: '#e879f9',
        bg: '#4a044e',
        variants: [
          'WARIANT: ORBITA (POWOLNY START • DŁUGI LOT)',
          'WARIANT: GŁĘBOKI KOSMOS (BARDZO DŁUGI LOT • +10%)',
          'WARIANT: KRWAWE PALIWO (+20% DO WYPŁATY)',
          'WARIANT: CIĘŻKI BOOSTER (STABILNY ROZRUCH)',
          'WARIANT: HIPER-NAPĘD (SZYBSZE WZNOSZENIE PO 4s)'
        ],
        open: () => this.openCrashModal()
      },
      {
        type: 'mines',
        icon: '💣',
        title: '💣 SAPER SYNDYKATU',
        color: '#a3e635',
        bg: '#1a2e05',
        variants: [
          'WARIANT: 2 MINY (PATROL • NISKIE RYZYKO)',
          'WARIANT: 3 MINY (KLASYCZNY SEKTOR)',
          'WARIANT: 4 MINY (WYSOKIE WYPŁATY)',
          'WARIANT: 5 MIN (SKARBIEC • DUŻY MNOŻNIK)',
          'WARIANT: 6 MIN (POLE ŚMIERCI • EKSTREMALNY MNOŻNIK)'
        ],
        open: () => this.openMinesModal()
      },
      {
        type: 'tower',
        icon: '🏢',
        title: '🏢 WIEŻA RYZYKA',
        color: '#38bdf8',
        bg: '#082f49',
        variants: [
          'WARIANT: 3 DRZWI (2 BEZPIECZNE • 1.45x / PIĘTRO)',
          'WARIANT: 2 DRZWI (1 BEZPIECZNE • 1.95x / PIĘTRO)',
          'WARIANT: BUNKIER KORPORACJI (4 DRZWI / 3 BEZPIECZNE)',
          'WARIANT: ŚMIERTELNA WINDA (3 DRZWI / 1 BEZPIECZNE • 2.85x)'
        ],
        open: () => this.openTowerModal()
      },
      {
        type: 'pulse',
        icon: '⚡',
        title: '⚡ KALIBRACJA IMPULSU',
        color: '#2dd4bf',
        bg: '#042f2e',
        variants: [
          'WARIANT: STABILNA FALA (SZEROKA STREFA • +0.65x)',
          'WARIANT: WĄSKI IMPULS (WYSOKIE RYZYKO • +1.10x)',
          'WARIANT: PRZYSPIESZAJĄCY RDZEŃ (+0.85x / TRAFIENIE)',
          'WARIANT: ZŁOTA CZĘSTOTLIWOŚĆ (5 RUND • +0.95x)'
        ],
        open: () => this.openPulseModal()
      },
      {
        type: 'hilo',
        icon: '🃏',
        title: '🃏 SZULER // HI-LO',
        color: '#f472b6',
        bg: '#500724',
        variants: [
          'WARIANT: KLASYCZNE HI-LO (SZANSA NA DŁUGĄ SERIĘ)',
          'WARIANT: SERIA SZULERA (+20% DO KAŻDEGO KROKU)',
          'WARIANT: KRWAWA TALIA (+30% DO MNOŻNIKA)',
          'WARIANT: ZŁOTE ASY (WYSOKIE PODBICIE)'
        ],
        open: () => this.openHiloModal()
      },
      {
        type: 'cups',
        icon: '💀',
        title: '💀 TRZY CZASZKI',
        color: '#c084fc',
        bg: '#2e1065',
        variants: [
          'WARIANT: 3 KAPSUŁY (2 DIAMENTY / 1 CZASZKA • 1.45x)',
          'WARIANT: 3 KAPSUŁY (1 DIAMENT / 2 CZASZKI • 2.80x)',
          'WARIANT: 4 KAPSUŁY (2 DIAMENTY / 2 CZASZKI • 1.95x)',
          'WARIANT: SKARBIEC DUSZ (4 KAPSUŁY / 1 DIAMENT • 3.75x)'
        ],
        open: () => this.openCupsModal()
      },
      {
        type: 'bj',
        icon: '♠',
        title: '♠ VIP BLACKJACK',
        color: '#6ee7b7',
        bg: '#022c22',
        variants: [
          'WARIANT: KLASYCZNY VIP (PAS KRUPIERA NA 17)',
          'WARIANT: STOŁY REKRUTA (KRUPIER PASUJE NA 16+)',
          'WARIANT: ZŁOTY BLACKJACK (NATURALNE 21 PŁACI 3.0x)',
          'WARIANT: NOCNE PODBICIE (WYGRANE +15%)'
        ],
        open: () => this.openBlackjackModal()
      },
      {
        type: 'roul',
        icon: '🎡',
        title: '🎡 DIABELSKA RULETKA',
        color: '#fca5a5',
        bg: '#450a0a',
        variants: [
          'WARIANT: EUROPEJSKI (0-36 • NUMER 36x)',
          'WARIANT: GORĄCE NUMERY (POJEDYNCZY NUMER PŁACI 42x)',
          'WARIANT: KRWAWE KOLORY (KOLORY PŁACĄ 2.15x)',
          'WARIANT: TUZINY SYNDYKATU (TUZINY PŁACĄ 3.3x)'
        ],
        open: () => this.openRouletteModal()
      },
      {
        type: 'dice',
        icon: '🎲',
        title: '🎲 CYBER KOŚCI',
        color: '#67e8f9',
        bg: '#083344',
        variants: [
          'WARIANT: PONIŻEJ / POWYŻEJ 7 (2.2x)',
          'WARIANT: ZŁOTA SIÓDEMKA (DOKŁADNIE 7 PŁACI 5.5x)',
          'WARIANT: OSTRE KRAWĘDZIE (PONIŻEJ/POWYŻEJ 2.4x)',
          'WARIANT: DUBLET SYNDYKATU (DUBLET DAJE +40% WYGRANEJ)'
        ],
        open: () => this.openDiceModal()
      },
      {
        type: 'slots',
        icon: '🎰',
        title: '🎰 AUTOMATY "TĘTNICA"',
        color: '#fde68a',
        bg: '#451a03',
        variants: [
          'WARIANT: TĘTNICA TURBO (777 PŁACI 15x)',
          'WARIANT: DIAMENTOWA GORĄCZKA (💎💎💎 PŁACI 12x)',
          'WARIANT: JACKPOT 777 (7️⃣7️⃣7️⃣ PŁACI 22x)',
          'WARIANT: KRWAWE PARY (KAŻDA PARA PŁACI 2.2x)'
        ],
        open: () => this.openSlotsModal()
      }
    ];

    if (!this.featuredMinigameBag || this.featuredMinigameBag.length === 0) {
      this.featuredMinigameBag = allGames.map(g => g.type);
      for (let i = this.featuredMinigameBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.featuredMinigameBag[i], this.featuredMinigameBag[j]] = [this.featuredMinigameBag[j], this.featuredMinigameBag[i]];
      }
      if (this.dailyFeaturedGame && this.featuredMinigameBag[0] === this.dailyFeaturedGame) {
        const last = this.featuredMinigameBag.length - 1;
        [this.featuredMinigameBag[0], this.featuredMinigameBag[last]] = [this.featuredMinigameBag[last], this.featuredMinigameBag[0]];
      }
    }
    const featuredType = this.featuredMinigameBag.shift();
    this.dailyFeaturedGame = featuredType;

    let selected = [];
    if (this.day === 1) {
      const day1Types = ['crash', 'tower', 'pulse', 'cups'];
      selected = day1Types.map(t => allGames.find(g => g.type === t));
      this.dailyFeaturedGame = 'tower';
    } else {
      const featuredObj = allGames.find(g => g.type === featuredType) || allGames[0];
      selected.push(featuredObj);
      const freshGames = allGames.filter(g => g.type !== featuredObj.type && !(this.lastDayGameTypes || []).includes(g.type));
      const oldGames = allGames.filter(g => g.type !== featuredObj.type && (this.lastDayGameTypes || []).includes(g.type));
      const shuffleArr = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      };
      const pool = [...shuffleArr(freshGames), ...shuffleArr(oldGames)];
      for (const g of pool) {
        if (selected.length < 4) selected.push(g);
      }
    }
    this.lastDayGameTypes = selected.map(g => g.type);

    const tableBoxes = [
      { x: 185, y: 135, w: 180, h: 110 },
      { x: 635, y: 135, w: 190, h: 110 },
      { x: 425, y: 265, w: 155, h: 95 },
      { x: 195, y: 385, w: 165, h: 85 }
    ];
    this.activeCasinoSlots = selected.map((game, idx) => {
      const variantIdx = (this.day * 3 + idx + Math.floor(Math.random() * game.variants.length)) % game.variants.length;
      const isFeatured = game.type === this.dailyFeaturedGame;
      return {
        ...game,
        variantIdx,
        variantText: (isFeatured ? '★ MINIGRA DNIA • ' : '') + game.variants[variantIdx],
        box: tableBoxes[idx]
      };
    });

    const minesSlot = this.activeCasinoSlots.find(s => s.type === 'mines');
    this.mines.mineCount = minesSlot ? (2 + (minesSlot.variantIdx % 5)) : 3;
    const crashSlot = this.activeCasinoSlots.find(s => s.type === 'crash');
    if (crashSlot) {
      const speedMap = [1.0, 0.82, 1.0, 0.76, 1.28];
      this.crash.speed = speedMap[crashSlot.variantIdx] || 1.0;
    } else {
      this.crash.speed = 1.0;
    }

    if (this.zones && this.zones[2]) {
      const streetDoor = this.zones[2].interactables[0];
      const bloodAtm = {
        box: { x: 655, y: 385, w: 145, h: 80 },
        edgeDist: 54,
        getPrompt: () => {
          const bloodStr = !this.bloodAvailableToday ? 'KREW: NIECZYNNA' : (this.bloodPumpedThisNight ? 'KREW: ZUŻYTA' : 'KREW: AKTYWNA');
          const pawnStr = this.tokenPawnAvailableToday ? 'ŻETONY: AKTYWNE' : 'ŻETONY: NIECZYNNE';
          return `🩸 BANKOMAT LICHWIARZA (${bloodStr} | ${pawnStr})`;
        },
        action: () => this.openAtmModal()
      };
      this.zones[2].interactables = [
        streetDoor,
        ...this.activeCasinoSlots.map(slot => ({
          box: slot.box,
          edgeDist: 64,
          getPrompt: () => `${slot.title} — ${slot.variantText} (MIN: $${this.getMinBet()})`,
          action: () => slot.open()
        })),
        bloodAtm
      ];
    }
  },

  advanceToNextDay(ev) {
    if (ev) ev.preventDefault();
    this.day += 1;
    this.phase = 'PREP';
    this.zone = 0;
    this.bloodPumpedThisNight = false;
    this.rollDailyAtmAvailability();
    const surplusCarry = Math.min(400, Math.floor(Math.max(0, this.cash - this.quota) * 0.25));
    const relicFund = (this.relics.has('trust_fund') ? 350 : 0) + (this.relics.has('velvet_crown') ? 1000 : 0);
    this.cash = 500 + (this.day - 1) * 150 + surplusCarry + relicFund;
    const rawQuota = 1000 * Math.pow(1.45, this.day - 1) * (this.relics.has('syndicate_seal') ? 0.85 : 1.0);
    this.quota = Math.round(rawQuota / 50) * 50;
    this.assignNightlyModifier();
    this.assignDailyChallenge();
    this.randomizeNightlyCasinoFloor();
    const extraRelic = (this.relics.has('adrenaline_shot') ? 45 : 0) + (this.relics.has('chrono_anchor') ? 90 : 0);
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
    this.showToast(`☀ ${this.t('day_word')} ${this.day} — Nowe minigry w Kasynie! | Kwota: $${this.quota.toLocaleString()}`, 'emerald');
  },

  restartRun() {
    this.day = 1;
    this.phase = 'PREP';
    this.zone = 0;
    this.cash = 500;
    this.quota = 1000;
    this.tokens = 1;
    this.relics.clear();
    this.bloodPumpedThisNight = false;
    this.rollDailyAtmAvailability();
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
  },

  checkBankruptcy() {
    if (this.cutscene && this.cutscene.active) return;
    if (this.mainMenuOpen || this.introPlaying || this.isLoadingScreen) return;
    if (this.cash >= this.quota) return;
    const minBet = this.getMinBet();
    let roulTotal = 0;
    if (this.roul && this.roul.bets) {
      for (const k in this.roul.bets) roulTotal += this.roul.bets[k];
    }
    const anyRoundActive =
      this.bj.inProgress ||
      this.roul.spinning ||
      this.slots.spinning ||
      this.dice.rolling ||
      this.crash.active ||
      this.mines.active ||
      (this.tower && this.tower.active) ||
      (this.pulse && this.pulse.active) ||
      (this.hilo && this.hilo.active) ||
      (this.cups && this.cups.active) ||
      roulTotal > 0;
    if (anyRoundActive) return;

    const timeCost = Math.max(15, ((this.currentModifier && this.currentModifier.bloodCost) || 60) - (this.relics && this.relics.has('crimson_chalice') ? 20 : 0));
    const bloodAvail = typeof this.bloodAvailableToday === 'boolean' ? this.bloodAvailableToday : true;
    const pawnAvail = typeof this.tokenPawnAvailableToday === 'boolean' ? this.tokenPawnAvailableToday : true;
    const canPumpBlood = bloodAvail && !this.bloodPumpedThisNight && !(this.phase === 'SHIFT' && this.timeLeft <= timeCost + 5);
    const canPawnTokens = pawnAvail && this.tokens > 0;

    if (this.cash < minBet && !canPawnTokens && !canPumpBlood) {
      if (this._bankruptTimeout) {
        clearTimeout(this._bankruptTimeout);
        this._bankruptTimeout = null;
      }
      this.closeModals(true);
      this.triggerGameOver(this.lang === 'uk'
        ? 'Ви програли всю готівку, не маєте жетонів і вже віддали кров — Мафія Синдикату прийшла за боргом!'
        : 'Straciłeś całą gotówkę, nie masz żetonów i oddałeś już krew — Mafia Syndykatu przyszła po dług!');
    }
  },

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
    if (gameKey === 'tower') return this.tower && this.tower.active;
    if (gameKey === 'pulse') return this.pulse && this.pulse.active;
    if (gameKey === 'hilo') return this.hilo && this.hilo.active;
    if (gameKey === 'cups') return this.cups && this.cups.active;
    return false;
  },
  syncBetInputUI(gameKey) {
    const minBet = this.getMinBet();
    const inputEl = document.getElementById(`${gameKey}-bet-input`);
    const badgeEl = document.getElementById(`${gameKey}-min-badge`);
    if (inputEl && this[gameKey]) inputEl.value = this[gameKey].bet;
    if (badgeEl) badgeEl.textContent = `MIN NOC ${this.day}: $${minBet}`;
  },
  validateGameWager(gameKey) {
    const minBet = this.getMinBet();
    const bet = (this[gameKey] && this[gameKey].bet) || 0;
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

  // ==========================================
  // RULETKA
  // ==========================================
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

  // ==========================================
  // BLACKJACK
  // ==========================================
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
    const bjSlot = this.activeCasinoSlots.find(s => s.type === 'bj');
    const standThreshold = (bjSlot && bjSlot.variantIdx === 1) ? 16 : (this.currentModifier.dealerStand || 17);
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
    const bjSlot = this.activeCasinoSlots.find(s => s.type === 'bj');
    if (outcome === 'BLACKJACK' || outcome === 'WIN') {
      let baseMult = outcome === 'BLACKJACK' ? ((bjSlot && bjSlot.variantIdx === 2) ? 3.0 : 2.5) : 2.0;
      if (bjSlot && bjSlot.variantIdx === 3) baseMult *= 1.15;
      const payout = this.recordWinPayout(this.bj.bet, baseMult);
      const netProfit = payout - this.bj.bet;
      this.sfx.win();
      banner.textContent = `${outcome === 'BLACKJACK' ? '★ BLACKJACK!' : 'WYGRANA!'} +$${payout.toLocaleString()} (${pVal} vs ${dVal})`;
      banner.className = 'text-center py-2 px-4 rounded-xl bg-emerald-950/90 border border-emerald-500 font-extrabold text-sm sm:text-base text-emerald-300';
      this.advanceChallenge('bj_wins_2', 1);
      if (pVal <= 17) this.advanceChallenge('bj_low_win', 1);
      if (netProfit >= 400) this.advanceChallenge('big_payout', 1);
    } else if (outcome === 'PUSH') {
      if (this.relics.has('dealer_bribe')) {
        const payout = this.recordWinPayout(this.bj.bet, 2.0);
        this.sfx.win();
        banner.textContent = `🕶️ PRZEKUPSTWO KRUPIERA! REMIS LICZONY JAKO WYGRANA +$${payout.toLocaleString()} (${pVal} vs ${dVal})`;
        banner.className = 'text-center py-2 px-4 rounded-xl bg-emerald-950/90 border border-emerald-500 font-extrabold text-sm sm:text-base text-emerald-300';
      } else {
        this.cash += this.bj.bet;
        this.sfx.chip();
        banner.textContent = `REMIS (ZWROT STAWKI $${this.bj.bet}) (${pVal} vs ${dVal})`;
        banner.className = 'text-center py-2 px-4 rounded-xl bg-zinc-900 border border-zinc-600 font-extrabold text-sm sm:text-base text-zinc-200';
      }
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
    const singleMult = (roulSlot && roulSlot.variantIdx === 1) ? 42 : 36;
    const colorMult = (roulSlot && roulSlot.variantIdx === 2) ? 2.15 : 2;
    const dozMult = (roulSlot && roulSlot.variantIdx === 3) ? 3.3 : 3;
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
          if (k === 'RED' && isRed) rawWin += amt * colorMult;
          else if (k === 'BLACK' && isBlack) rawWin += amt * colorMult;
          else if (k === 'ODD' && winningNum !== 0 && winningNum % 2 === 1) rawWin += amt * 2;
          else if (k === 'EVEN' && winningNum !== 0 && winningNum % 2 === 0) rawWin += amt * 2;
          else if (k === 'DOZ1' && winningNum >= 1 && winningNum <= 12) rawWin += amt * dozMult;
          else if (k === 'DOZ2' && winningNum >= 13 && winningNum <= 24) rawWin += amt * dozMult;
          else if (k === 'DOZ3' && winningNum >= 25 && winningNum <= 36) rawWin += amt * dozMult;
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

  // ==========================================
  // AUTOMATY (SLOTS)
  // ==========================================
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
        if (a === '7️⃣') mult = (slotCfg && slotCfg.variantIdx === 2) ? 22 : 15;
        else if (a === '💎') mult = (slotCfg && slotCfg.variantIdx === 1) ? 12 : 8;
        else if (a === '🔔') mult = 5;
        else if (a === '🍒') mult = 3.5;
      } else if ((a === b && a !== '💀') || (b === c && b !== '💀') || (a === c && a !== '💀')) {
        mult = (slotCfg && slotCfg.variantIdx === 3) ? 2.2 : 1.8;
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

  // ==========================================
  // CYBER KOŚCI (DICE)
  // ==========================================
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
    const sevenMult = (diceSlot && diceSlot.variantIdx === 1) ? 5.5 : 4.5;
    const sideMult = (diceSlot && diceSlot.variantIdx === 2) ? 2.4 : 2.2;
    setTimeout(() => {
      b1.classList.remove('dice-rolling');
      b2.classList.remove('dice-rolling');
      b1.textContent = faces[d1 - 1];
      b2.textContent = faces[d2 - 1];
      document.getElementById('dice-sum-badge').textContent = `SUMA KOŚCI: ${sum}`;
      this.dice.rolling = false;
      let mult = 0;
      if (choice === 'UNDER' && sum < 7) mult = sideMult;
      else if (choice === 'SEVEN' && sum === 7) mult = sevenMult;
      else if (choice === 'OVER' && sum > 7) mult = sideMult;
      if (mult > 0 && d1 === d2 && diceSlot && diceSlot.variantIdx === 3) {
        mult = +(mult * 1.4).toFixed(2);
      }
      const st = document.getElementById('dice-status');
      if (mult > 0) {
        if (this.relics.has('quantum_dice')) mult *= 1.25;
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

  // ==========================================
  // RAKIETA // CRASH (POWOLNY START, DŁUGI LOT, BRAK NATYCHMIASTOWYCH WYBUCHÓW)
  // ==========================================
  openCrashModal() {
    this.sfx.chip();
    this.crash.bet = 0;
    this.crash.active = false;
    this.crash.crashed = false;
    this.crash.cashedOut = false;
    this.crash.mult = 1.00;
    this.crash.elapsed = 0;
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
    this.crash.elapsed = 0;

    const crashSlot = this.activeCasinoSlots.find(s => s.type === 'crash');
    const isDeepSpace = crashSlot && crashSlot.variantIdx === 1;
    // Gwarantowany bezpieczny czas lotu (rakieta NIGDY nie kończy się od razu!)
    const boosterSec = this.relics.has('titanium_booster') ? 4.0 : 0;
    const minFlightSec = (isDeepSpace ? 6.5 : 4.8) + boosterSec;
    const maxFlightSec = (isDeepSpace ? 28.0 : 23.0) + boosterSec;
    const flightRoll = Math.pow(Math.random(), 0.78);
    this.crash.crashDuration = minFlightSec + flightRoll * (maxFlightSec - minFlightSec);
    this.crash.crashPoint = 999; // Kontrolowane przez długi czas lotu crashDuration

    this.sfx.playTone(180, 'sawtooth', 0.25, 0.08, 420);
    this.updateHUD();
    this.updateCrashUI();
  },
  cashoutCrashRocket() {
    if (!this.crash.active || this.crash.crashed || this.crash.cashedOut) return;
    this.crash.cashedOut = true;
    this.crash.active = false;
    const crashSlot = this.activeCasinoSlots.find(s => s.type === 'crash');
    const varBoost = ((crashSlot && crashSlot.variantIdx === 2) ? 1.20 : ((crashSlot && crashSlot.variantIdx === 1) ? 1.10 : 1.0)) * (this.relics.has('titanium_booster') ? 1.20 : 1.0);
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
    this.crash.elapsed = (this.crash.elapsed || 0) + dt;
    const t = this.crash.elapsed;
    const speedMod = this.crash.speed || 1.0;

    // Powolny start przez pierwsze ~3.5 sekundy, a potem płynne rozpędzanie i długi lot:
    let growthRate;
    if (t < 3.5) {
      growthRate = (0.024 + (t / 3.5) * 0.055) * speedMod;
    } else if (t < 9.0) {
      const midT = (t - 3.5) / 5.5;
      growthRate = (0.079 + Math.pow(midT, 1.45) * 0.17) * speedMod;
    } else {
      const lateT = t - 9.0;
      growthRate = (0.249 + Math.pow(lateT, 1.25) * 0.055) * speedMod;
    }

    this.crash.mult = Math.min(60.0, this.crash.mult + growthRate * dt);

    if (this.crash.elapsed >= (this.crash.crashDuration || 8.0)) {
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
        const starSpeed = 0.4 + Math.min(2.2, (this.crash.elapsed || 0) * 0.12);
        st.x -= 45 * 0.016 * starSpeed;
        st.y += 22 * 0.016 * starSpeed;
        if (st.x < 0) st.x = w;
        if (st.y > h) st.y = 0;
      }
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }
    const timeProg = Math.min(1, (this.crash.elapsed || 0) / 18);
    const multProg = Math.min(1, Math.log10(Math.max(1, this.crash.mult)) / 1.25);
    const progress = Math.max(timeProg * 0.72, multProg);
    const startX = 42, startY = h - 28;
    const rx = startX + progress * (w - 110);
    const ry = startY - Math.pow(progress, 1.45) * (h - 68);
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
      ctx.rotate(-0.35 - progress * 0.45);
      if (this.crash.active) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-14, -4);
        ctx.lineTo(-24 - Math.random() * 10, 0);
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

  // ==========================================
  // SAPER SYNDYKATU (MINES)
  // ==========================================
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
    this.mines.defusedThisRound = false;
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
    if (cell.isMine && this.relics.has('titanium_booster') && !this.mines.defusedThisRound) {
      this.mines.defusedThisRound = true;
      cell.isMine = false;
      this.showToast('🚀 Tytanowy Booster rozbroił minę i zamienił ją w Diament!', 'emerald');
    }
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
      const stepFactor = 1.16 + (this.mines.mineCount * 0.055);
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

  // ==========================================
  // NOWA MINIGRA 1: WIEŻA RYZYKA (TOWER)
  // ==========================================
  openTowerModal() {
    this.ensureExtraMinigamesInitialized();
    this.sfx.chip();
    this.tower.bet = 0;
    this.tower.active = false;
    this.tower.floor = 0;
    this.tower.mult = 1.00;
    const slot = this.activeCasinoSlots.find(s => s.type === 'tower');
    const vIdx = slot ? slot.variantIdx : 0;
    const configs = [
      { doors: 3, safe: 2, step: 1.45, floors: 5 },
      { doors: 2, safe: 1, step: 1.95, floors: 5 },
      { doors: 4, safe: 3, step: 1.32, floors: 6 },
      { doors: 3, safe: 1, step: 2.85, floors: 4 }
    ];
    const cfg = configs[vIdx % configs.length];
    this.tower.doors = cfg.doors;
    this.tower.safeDoors = cfg.safe;
    this.tower.stepMult = cfg.step;
    this.tower.maxFloors = cfg.floors;
    const subEl = document.getElementById('tower-variant-sub');
    if (subEl && slot) subEl.textContent = `${slot.variantText} • Min. zakład: $${this.getMinBet()}`;
    this.syncBetInputUI('tower');
    this.renderTowerUI();
    this.openModal('modal-tower');
  },
  startTowerGame() {
    if (this.tower.active || !this.validateGameWager('tower')) return;
    this.cash -= this.tower.bet;
    this.tower.active = true;
    this.tower.floor = 0;
    this.tower.mult = 1.00;
    this.sfx.chip();
    document.getElementById('tower-status').textContent = `PIĘTRO 1/${this.tower.maxFloors}: WYBIERZ DRZWI WINDY!`;
    this.updateHUD();
    this.renderTowerUI();
  },
  pickTowerDoor(doorIdx) {
    if (!this.tower.active) return;
    const winChance = this.tower.safeDoors / this.tower.doors;
    if (Math.random() < winChance) {
      this.tower.floor++;
      this.tower.mult = +(Math.pow(this.tower.stepMult, this.tower.floor)).toFixed(2);
      this.sfx.win();
      if (this.tower.floor >= this.tower.maxFloors) {
        this.cashoutTowerGame();
        return;
      }
      document.getElementById('tower-status').textContent = `✓ BEZPIECZNE PRZEJŚCIE! PIĘTRO ${this.tower.floor}/${this.tower.maxFloors} (${this.tower.mult.toFixed(2)}x)`;
      this.renderTowerUI();
    } else {
      this.tower.active = false;
      this.sfx.lose();
      this.sfx.blood();
      document.getElementById('tower-status').textContent = `💥 PUŁAPKA LASEROWA NA PIĘTRZE ${this.tower.floor + 1}! PRZEGRANA -$${this.tower.bet}`;
      this.renderTowerUI();
      if (this.checkBankruptcy) this.checkBankruptcy();
    }
  },
  cashoutTowerGame() {
    if (!this.tower.active || this.tower.floor <= 0) return;
    this.tower.active = false;
    const qMult = this.relics.has('quantum_dice') ? 1.25 : 1.0;
    const payout = this.recordWinPayout(this.tower.bet, this.tower.mult * qMult);
    this.sfx.jackpot();
    document.getElementById('tower-status').textContent = `💰 ZDOBYTO SKARBIEC: +$${payout.toLocaleString()} (${this.tower.mult.toFixed(2)}x)!`;
    this.showToast(`🏢 Wieża Ryzyka: +$${payout.toLocaleString()}!`, 'emerald');
    if (payout - this.tower.bet >= 400) this.advanceChallenge('big_payout', 1);
    this.updateHUD();
    this.renderTowerUI();
  },
  renderTowerUI() {
    this.syncBetInputUI('tower');
    document.getElementById('tower-mult-label').textContent = `${this.tower.mult.toFixed(2)}x (${this.tower.floor}/${this.tower.maxFloors})`;
    const livePay = this.tower.active ? Math.round(this.tower.bet * this.tower.mult) : 0;
    document.getElementById('tower-payout-label').textContent = `$${livePay.toLocaleString()}`;
    document.getElementById('tower-start-btn').disabled = this.tower.active;
    document.getElementById('tower-cashout-btn').disabled = !(this.tower.active && this.tower.floor > 0);
    const grid = document.getElementById('tower-doors-grid');
    if (!grid) return;
    grid.className = `grid grid-cols-${this.tower.doors} gap-3 py-2`;
    grid.innerHTML = '';
    for (let i = 0; i < this.tower.doors; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-gritty h-20 bg-zinc-900 hover:bg-sky-950 border-2 border-sky-500/60 rounded-xl flex flex-col items-center justify-center gap-1 text-sky-300 font-extrabold';
      btn.innerHTML = `<span class="text-2xl">🚪</span><span class="text-[11px]">DRZWI #${i + 1}</span>`;
      btn.disabled = !this.tower.active;
      btn.onclick = () => this.pickTowerDoor(i);
      grid.appendChild(btn);
    }
  },

  // ==========================================
  // NOWA MINIGRA 2: KALIBRACJA IMPULSU (PULSE)
  // ==========================================
  openPulseModal() {
    this.ensureExtraMinigamesInitialized();
    this.sfx.chip();
    this.pulse.bet = 0;
    this.pulse.active = false;
    this.pulse.hits = 0;
    this.pulse.mult = 1.00;
    this.pulse.cursor = 0.5;
    const slot = this.activeCasinoSlots.find(s => s.type === 'pulse');
    const vIdx = slot ? slot.variantIdx : 0;
    const configs = [
      { width: 0.25, speed: 1.25, bonus: 0.65, maxHits: 4 },
      { width: 0.15, speed: 1.55, bonus: 1.10, maxHits: 4 },
      { width: 0.21, speed: 1.35, bonus: 0.85, maxHits: 4 },
      { width: 0.19, speed: 1.45, bonus: 0.95, maxHits: 5 }
    ];
    const cfg = configs[vIdx % configs.length];
    this.pulse.targetWidth = cfg.width;
    this.pulse.speed = cfg.speed;
    this.pulse.stepBonus = cfg.bonus;
    this.pulse.maxHits = cfg.maxHits;
    this.pulse.targetStart = 0.2 + Math.random() * (0.6 - cfg.width);
    const subEl = document.getElementById('pulse-variant-sub');
    if (subEl && slot) subEl.textContent = `${slot.variantText} • Min. zakład: $${this.getMinBet()}`;
    this.syncBetInputUI('pulse');
    this.renderPulseUI();
    this.openModal('modal-pulse');
  },
  startPulseGame() {
    if (this.pulse.active || !this.validateGameWager('pulse')) return;
    this.cash -= this.pulse.bet;
    this.pulse.active = true;
    this.pulse.hits = 0;
    this.pulse.mult = 1.00;
    this.pulse.cursor = 0.1;
    this.pulse.dir = 1;
    this.pulse.targetStart = 0.18 + Math.random() * (0.64 - this.pulse.targetWidth);
    this.sfx.chip();
    document.getElementById('pulse-status').textContent = 'KLIKNIJ [ZATRZYMAJ!], GDY PASEK JEST W ZIELONEJ STREFIE!';
    this.updateHUD();
    this.renderPulseUI();
    this._startPulseAnimLoop();
  },
  _startPulseAnimLoop() {
    if (this._pulseRaf) cancelAnimationFrame(this._pulseRaf);
    let last = performance.now();
    const step = (now) => {
      if (!this.pulse.active || this.activeModal !== 'modal-pulse') return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.pulse.cursor += this.pulse.dir * this.pulse.speed * dt;
      if (this.pulse.cursor >= 1) { this.pulse.cursor = 1; this.pulse.dir = -1; }
      else if (this.pulse.cursor <= 0) { this.pulse.cursor = 0; this.pulse.dir = 1; }
      const bar = document.getElementById('pulse-cursor-bar');
      if (bar) bar.style.left = `${(this.pulse.cursor * 100).toFixed(1)}%`;
      this._pulseRaf = requestAnimationFrame(step);
    };
    this._pulseRaf = requestAnimationFrame(step);
  },
  hitPulseBar() {
    if (!this.pulse.active) return;
    const c = this.pulse.cursor;
    const s = this.pulse.targetStart;
    const e = s + this.pulse.targetWidth;
    if (c >= s && c <= e) {
      this.pulse.hits++;
      this.pulse.mult = +(this.pulse.mult + this.pulse.stepBonus).toFixed(2);
      this.pulse.speed *= 1.18;
      this.pulse.targetStart = 0.15 + Math.random() * (0.70 - this.pulse.targetWidth);
      this.sfx.win();
      if (this.pulse.hits >= this.pulse.maxHits) {
        this.cashoutPulseGame();
        return;
      }
      document.getElementById('pulse-status').textContent = `⚡ TRAFIONO (${this.pulse.hits}/${this.pulse.maxHits})! MNOŻNIK: ${this.pulse.mult.toFixed(2)}x`;
      this.renderPulseUI();
    } else {
      this.pulse.active = false;
      this.sfx.lose();
      this.sfx.blood();
      document.getElementById('pulse-status').textContent = `💥 PRZECIĄŻENIE RDZENIA (PUDŁO)! PRZEGRANA -$${this.pulse.bet}`;
      this.renderPulseUI();
      if (this.checkBankruptcy) this.checkBankruptcy();
    }
  },
  cashoutPulseGame() {
    if (!this.pulse.active || this.pulse.hits <= 0) return;
    this.pulse.active = false;
    const qMult = this.relics.has('quantum_dice') ? 1.25 : 1.0;
    const payout = this.recordWinPayout(this.pulse.bet, this.pulse.mult * qMult);
    this.sfx.jackpot();
    document.getElementById('pulse-status').textContent = `💰 ZSYNCHRONIZOWANO: +$${payout.toLocaleString()} (${this.pulse.mult.toFixed(2)}x)!`;
    this.showToast(`⚡ Kalibracja Impulsu: +$${payout.toLocaleString()}!`, 'emerald');
    if (payout - this.pulse.bet >= 400) this.advanceChallenge('big_payout', 1);
    this.updateHUD();
    this.renderPulseUI();
  },
  renderPulseUI() {
    this.syncBetInputUI('pulse');
    document.getElementById('pulse-mult-label').textContent = `${this.pulse.mult.toFixed(2)}x (${this.pulse.hits}/${this.pulse.maxHits})`;
    const livePay = this.pulse.active ? Math.round(this.pulse.bet * this.pulse.mult) : 0;
    document.getElementById('pulse-payout-label').textContent = `$${livePay.toLocaleString()}`;
    const zoneEl = document.getElementById('pulse-target-zone');
    if (zoneEl) {
      zoneEl.style.left = `${(this.pulse.targetStart * 100).toFixed(1)}%`;
      zoneEl.style.width = `${(this.pulse.targetWidth * 100).toFixed(1)}%`;
    }
    document.getElementById('pulse-start-btn').disabled = this.pulse.active;
    document.getElementById('pulse-hit-btn').disabled = !this.pulse.active;
    document.getElementById('pulse-cashout-btn').disabled = !(this.pulse.active && this.pulse.hits > 0);
  },

  // ==========================================
  // NOWA MINIGRA 3: SZULER // HI-LO (KARTY)
  // ==========================================
  openHiloModal() {
    this.ensureExtraMinigamesInitialized();
    this.sfx.card();
    this.hilo.bet = 0;
    this.hilo.active = false;
    this.hilo.streak = 0;
    this.hilo.mult = 1.00;
    this.hilo.currentCard = null;
    const slot = this.activeCasinoSlots.find(s => s.type === 'hilo');
    const subEl = document.getElementById('hilo-variant-sub');
    if (subEl && slot) subEl.textContent = `${slot.variantText} • Min. zakład: $${this.getMinBet()}`;
    this.syncBetInputUI('hilo');
    this.renderHiloUI();
    this.openModal('modal-hilo');
  },
  drawHiloCard() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = [
      { r: '2', v: 2 }, { r: '3', v: 3 }, { r: '4', v: 4 }, { r: '5', v: 5 },
      { r: '6', v: 6 }, { r: '7', v: 7 }, { r: '8', v: 8 }, { r: '9', v: 9 },
      { r: '10', v: 10 }, { r: 'J', v: 11 }, { r: 'Q', v: 12 }, { r: 'K', v: 13 }, { r: 'A', v: 14 }
    ];
    const rk = ranks[Math.floor(Math.random() * ranks.length)];
    const st = suits[Math.floor(Math.random() * suits.length)];
    return { rank: rk.r, val: rk.v, suit: st };
  },
  startHiloGame() {
    if (this.hilo.active || !this.validateGameWager('hilo')) return;
    this.cash -= this.hilo.bet;
    this.hilo.active = true;
    this.hilo.streak = 0;
    this.hilo.mult = 1.00;
    this.hilo.currentCard = this.drawHiloCard();
    this.sfx.card();
    document.getElementById('hilo-status').textContent = 'WYBIERZ: CZY NASTĘPNA KARTA BĘDZIE WYŻSZA CZY NIŻSZA?';
    this.updateHUD();
    this.renderHiloUI();
  },
  guessHilo(dir) {
    if (!this.hilo.active || !this.hilo.currentCard) return;
    const prev = this.hilo.currentCard;
    const next = this.drawHiloCard();
    this.hilo.currentCard = next;
    this.sfx.card();
    const won = (dir === 'HIGHER' && next.val >= prev.val) || (dir === 'LOWER' && next.val <= prev.val);
    const slot = this.activeCasinoSlots.find(s => s.type === 'hilo');
    const bribeBoost = this.relics.has('dealer_bribe') ? 1.25 : 1.0;
    const stepBoost = ((slot && slot.variantIdx === 2) ? 1.52 : ((slot && slot.variantIdx === 1) ? 1.42 : 1.34)) * bribeBoost;
    if (won) {
      this.hilo.streak++;
      this.hilo.mult = +(this.hilo.mult * stepBoost).toFixed(2);
      this.sfx.win();
      document.getElementById('hilo-status').textContent = `✓ TRAFIONO (${next.rank}${next.suit})! MNOŻNIK: ${this.hilo.mult.toFixed(2)}x — GRAJ DALEJ LUB WYPŁAĆ!`;
      this.renderHiloUI();
    } else {
      this.hilo.active = false;
      this.sfx.lose();
      document.getElementById('hilo-status').textContent = `✗ PUDŁO (${next.rank}${next.suit} vs ${prev.rank}${prev.suit}) — PRZEGRANA -$${this.hilo.bet}`;
      this.renderHiloUI();
      if (this.checkBankruptcy) this.checkBankruptcy();
    }
  },
  cashoutHiloGame() {
    if (!this.hilo.active || this.hilo.streak <= 0) return;
    this.hilo.active = false;
    const payout = this.recordWinPayout(this.hilo.bet, this.hilo.mult);
    this.sfx.jackpot();
    document.getElementById('hilo-status').textContent = `💰 WYPŁACONO SERIĘ: +$${payout.toLocaleString()} (${this.hilo.mult.toFixed(2)}x)!`;
    this.showToast(`🃏 Szuler Hi-Lo: +$${payout.toLocaleString()}!`, 'emerald');
    if (payout - this.hilo.bet >= 400) this.advanceChallenge('big_payout', 1);
    this.updateHUD();
    this.renderHiloUI();
  },
  renderHiloUI() {
    this.syncBetInputUI('hilo');
    document.getElementById('hilo-mult-label').textContent = `${this.hilo.mult.toFixed(2)}x (Seria: ${this.hilo.streak})`;
    const livePay = this.hilo.active ? Math.round(this.hilo.bet * this.hilo.mult) : 0;
    document.getElementById('hilo-payout-label').textContent = `$${livePay.toLocaleString()}`;
    const cardBox = document.getElementById('hilo-card-box');
    if (cardBox) {
      if (!this.hilo.currentCard) {
        cardBox.textContent = '?';
        cardBox.className = 'w-24 h-32 rounded-xl bg-zinc-950 border-2 border-pink-500/60 flex items-center justify-center text-3xl font-extrabold text-pink-300 shadow-xl';
      } else {
        const isRed = this.hilo.currentCard.suit === '♥' || this.hilo.currentCard.suit === '♦';
        cardBox.className = `w-24 h-32 rounded-xl bg-white border-2 border-amber-400 flex flex-col items-center justify-center text-3xl font-extrabold ${isRed ? 'text-red-600' : 'text-zinc-900'} shadow-xl`;
        cardBox.innerHTML = `<span>${this.hilo.currentCard.rank}</span><span class="text-4xl">${this.hilo.currentCard.suit}</span>`;
      }
    }
    document.getElementById('hilo-start-btn').disabled = this.hilo.active;
    document.getElementById('hilo-btn-higher').disabled = !this.hilo.active;
    document.getElementById('hilo-btn-lower').disabled = !this.hilo.active;
    document.getElementById('hilo-cashout-btn').disabled = !(this.hilo.active && this.hilo.streak > 0);
  },

  // ==========================================
  // NOWA MINIGRA 4: TRZY CZASZKI (CUPS)
  // ==========================================
  openCupsModal() {
    this.ensureExtraMinigamesInitialized();
    this.sfx.chip();
    this.cups.bet = 0;
    this.cups.active = false;
    this.cups.round = 0;
    this.cups.mult = 1.00;
    const slot = this.activeCasinoSlots.find(s => s.type === 'cups');
    const vIdx = slot ? slot.variantIdx : 0;
    const configs = [
      { cups: 3, safe: 2, step: 1.45 },
      { cups: 3, safe: 1, step: 2.80 },
      { cups: 4, safe: 2, step: 1.95 },
      { cups: 4, safe: 1, step: 3.75 }
    ];
    const cfg = configs[vIdx % configs.length];
    this.cups.cupCount = cfg.cups;
    this.cups.safeCount = cfg.safe;
    this.cups.stepMult = cfg.step;
    this.cups.items = Array(cfg.cups).fill(null);
    const subEl = document.getElementById('cups-variant-sub');
    if (subEl && slot) subEl.textContent = `${slot.variantText} • Min. zakład: $${this.getMinBet()}`;
    this.syncBetInputUI('cups');
    this.renderCupsUI();
    this.openModal('modal-cups');
  },
  startCupsGame() {
    if (this.cups.active || !this.validateGameWager('cups')) return;
    this.cash -= this.cups.bet;
    this.cups.active = true;
    this.cups.round = 0;
    this.cups.mult = 1.00;
    this.cups.items = Array(this.cups.cupCount).fill(null);
    this.sfx.chip();
    document.getElementById('cups-status').textContent = 'WYBIERZ KAPSUŁĘ, ABY ODSŁONIĆ ZAWARTOŚĆ!';
    this.updateHUD();
    this.renderCupsUI();
  },
  pickCup(idx) {
    if (!this.cups.active) return;
    const isSafe = Math.random() < (this.cups.safeCount / this.cups.cupCount);
    this.cups.items = Array(this.cups.cupCount).fill('💀');
    if (isSafe) {
      this.cups.items[idx] = '💎';
      this.cups.round++;
      this.cups.mult = +(Math.pow(this.cups.stepMult, this.cups.round)).toFixed(2);
      this.sfx.win();
      document.getElementById('cups-status').textContent = `💎 DIAMENT! MNOŻNIK: ${this.cups.mult.toFixed(2)}x — WYPŁAĆ LUB WYBIERAJ W KOLEJNEJ RUNDZIE!`;
      this.renderCupsUI();
      setTimeout(() => {
        if (this.cups.active) {
          this.cups.items = Array(this.cups.cupCount).fill(null);
          this.renderCupsUI();
        }
      }, 650);
    } else {
      this.cups.items[idx] = '💀';
      this.cups.active = false;
      this.sfx.lose();
      this.sfx.blood();
      document.getElementById('cups-status').textContent = `💀 TRAFIONO NA CZASZKĘ! PRZEGRANA -$${this.cups.bet}`;
      this.renderCupsUI();
      if (this.checkBankruptcy) this.checkBankruptcy();
    }
  },
  cashoutCupsGame() {
    if (!this.cups.active || this.cups.round <= 0) return;
    this.cups.active = false;
    const qMult = this.relics.has('quantum_dice') ? 1.25 : 1.0;
    const payout = this.recordWinPayout(this.cups.bet, this.cups.mult * qMult);
    this.sfx.jackpot();
    document.getElementById('cups-status').textContent = `💰 WYPŁACONO DIAMENTY: +$${payout.toLocaleString()} (${this.cups.mult.toFixed(2)}x)!`;
    this.showToast(`💀 Trzy Czaszki: +$${payout.toLocaleString()}!`, 'emerald');
    if (payout - this.cups.bet >= 400) this.advanceChallenge('big_payout', 1);
    this.updateHUD();
    this.renderCupsUI();
  },
  renderCupsUI() {
    this.syncBetInputUI('cups');
    document.getElementById('cups-mult-label').textContent = `${this.cups.mult.toFixed(2)}x`;
    const livePay = this.cups.active ? Math.round(this.cups.bet * this.cups.mult) : 0;
    document.getElementById('cups-payout-label').textContent = `$${livePay.toLocaleString()}`;
    document.getElementById('cups-start-btn').disabled = this.cups.active;
    document.getElementById('cups-cashout-btn').disabled = !(this.cups.active && this.cups.round > 0);
    const grid = document.getElementById('cups-grid');
    if (!grid) return;
    grid.className = `grid grid-cols-${this.cups.cupCount} gap-3 py-2`;
    grid.innerHTML = '';
    for (let i = 0; i < this.cups.cupCount; i++) {
      const btn = document.createElement('button');
      const val = this.cups.items[i];
      btn.className = 'btn-gritty h-24 bg-zinc-900 hover:bg-purple-950 border-2 border-purple-500/60 rounded-xl flex flex-col items-center justify-center gap-1 text-purple-200 font-extrabold';
      btn.innerHTML = `<span class="text-3xl">${val ? val : '🏺'}</span><span class="text-[10px]">KAPSUŁA #${i + 1}</span>`;
      btn.disabled = !this.cups.active || val !== null;
      btn.onclick = () => this.pickCup(i);
      grid.appendChild(btn);
    }
  },

  // ==========================================
  // BANKOMAT KRWI I ŻETONÓW (NIE ZAWSZE DOSTĘPNE)
  // ==========================================
  openAtmModal() {
    this.ensureExtraMinigamesInitialized();
    this.sfx.tick();
    this.refreshAtmModalUI();
    this.openModal('modal-atm');
    if (this.checkBankruptcy) this.checkBankruptcy();
  },
  refreshAtmModalUI() {
    const chaliceMult = this.relics.has('crimson_chalice') ? 1.45 : 1.0;
    const baseLoan = Math.round((300 + (this.day - 1) * 75) * (this.currentModifier.bloodBonus || 1.0) * chaliceMult);
    const timeCost = Math.max(15, (this.currentModifier.bloodCost || 60) - (this.relics.has('crimson_chalice') ? 20 : 0));
    const badge = document.getElementById('atm-usage-badge');
    const costLbl = document.getElementById('atm-cost-label');
    const loanBtn = document.getElementById('btn-blood-loan');
    const pawnBtn = document.getElementById('btn-pawn-token');

    if (!this.bloodAvailableToday) {
      if (badge) badge.textContent = 'NIECZYNNE DZIŚ';
      if (costLbl) costLbl.textContent = 'Syndykat wyłączył Pompę Krwi w tym cyklu nocnym.';
      if (loanBtn) {
        loanBtn.disabled = true;
        loanBtn.textContent = 'POMPA KRWI NIEDOSTĘPNA DZIŚ';
      }
    } else if (this.bloodPumpedThisNight) {
      if (costLbl) costLbl.textContent = this.t('atm_cost_dyn', { cost: timeCost });
      if (badge) badge.textContent = this.t('atm_badge_used');
      if (loanBtn) {
        loanBtn.disabled = true;
        loanBtn.textContent = this.t('atm_btn_depleted');
      }
    } else {
      if (costLbl) costLbl.textContent = this.t('atm_cost_dyn', { cost: timeCost });
      if (badge) badge.textContent = this.t('atm_badge_avail');
      if (loanBtn) {
        loanBtn.disabled = false;
        loanBtn.textContent = this.t('atm_btn_pump', { amt: baseLoan });
      }
    }

    if (pawnBtn) {
      if (!this.tokenPawnAvailableToday) {
        pawnBtn.disabled = true;
        pawnBtn.textContent = 'SKUP ŻETONÓW NIECZYNNY DZIŚ';
      } else {
        const tokenVal = this.relics.has('syndicate_seal') ? 550 : 350;
        pawnBtn.disabled = this.tokens <= 0;
        pawnBtn.innerHTML = `<span data-i18n="atm_pawn_btn">SPRZEDAJ 1 🪙</span> (+$<span id="atm-token-amount">${tokenVal}</span>)`;
      }
    }
  },
  takeBloodLoan() {
    if (!this.bloodAvailableToday) {
      this.sfx.lose();
      this.showToast('Pompa Krwi jest tej nocy nieczynna!', 'red');
      return;
    }
    if (this.bloodPumpedThisNight) return;
    const timeCost = Math.max(15, (this.currentModifier.bloodCost || 60) - (this.relics.has('crimson_chalice') ? 20 : 0));
    if (this.timeLeft <= timeCost + 5) {
      this.sfx.lose();
      this.showToast('Za mało czasu na zegarze na ekstrakcję krwi!', 'red');
      return;
    }
    const chaliceMult = this.relics.has('crimson_chalice') ? 1.45 : 1.0;
    const baseLoan = Math.round((300 + (this.day - 1) * 75) * (this.currentModifier.bloodBonus || 1.0) * chaliceMult);
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
    if (!this.tokenPawnAvailableToday) {
      this.sfx.lose();
      this.showToast('Skup Żetonów za gotówkę jest tej nocy zamknięty!', 'red');
      return;
    }
    if (this.tokens <= 0) return;
    const tokenVal = this.relics.has('syndicate_seal') ? 550 : 350;
    this.tokens -= 1;
    this.cash += tokenVal;
    this.sfx.chip();
    this.showToast(`🪙 Sprzedano 1 Żeton za +$${tokenVal}!`, 'amber');
    this.refreshAtmModalUI();
    this.updateHUD();
  },
  recordWinPayout(baseBetOrWin, multiplier = 1.0) {
    let relicBonus = 1.0;
    if (this.relics.has('golden_cufflinks')) relicBonus *= 1.20;
    if (this.relics.has('diamond_magnet')) relicBonus *= 1.35;
    if (this.relics.has('velvet_crown')) relicBonus *= 1.50;
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