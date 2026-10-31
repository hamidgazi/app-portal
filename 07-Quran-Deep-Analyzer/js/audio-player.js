/**
 * js/audio-player.js
 * Quran Deep Analyzer Version 2.0 — Sacred Audio & Tartil Companion
 * High-fidelity EveryAyah CDN streaming, Multi-Qari selection, Repeat Loops (1x/3x/5x),
 * Playback Speed, and Active Ayah Emerald Wave Illumination.
 */

(function (global) {
  'use strict';

  const RECITERS = {
    alafasy: {
      id: 'alafasy',
      name_en: 'Mishary Rashid Alafasy',
      name_ar: 'مشاري راشد العفاسي',
      quality: '128kbps',
      baseUrl: 'https://everyayah.com/data/Alafasy_128kbps/'
    },
    husary: {
      id: 'husary',
      name_en: 'Mahmoud Khalil Al-Husary (Teacher)',
      name_ar: 'محمود خليل الحصري (معلم تجويد)',
      quality: '128kbps',
      baseUrl: 'https://everyayah.com/data/Husary_128kbps/'
    },
    abdulbasit: {
      id: 'abdulbasit',
      name_en: 'Abdul Basit Abdul Samad',
      name_ar: 'عبد الباسط عبد الصمد (مرتل)',
      quality: '192kbps',
      baseUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/'
    }
  };

  const AudioTartilCompanion = {
    reciters: RECITERS,
    audio: null,
    activeReciter: 'alafasy',
    repeatMode: '1x',       // '1x', '3x', '5x', 'continuous'
    repeatCounter: 0,
    playbackSpeed: 1.0,     // 0.75, 1.0, 1.25
    currentSurahId: 1,
    currentAyahNum: 1,
    isPlaying: false,
    isInitialized: false,

        dismissBar() {
      const bar = document.getElementById('floating-audio-companion');
      if (bar) bar.style.display = 'none';
      if (window.AudioSFX && typeof window.AudioSFX.playClick === 'function') window.AudioSFX.playClick();
    },

    showBar() {
      const bar = document.getElementById('floating-audio-companion');
      if (bar) bar.style.display = 'flex';
    },

    play(surahId, ayahNum) {
      this.showBar();
      return this.playAyah(surahId, ayahNum);
    },

    getAudioUrl(surahId, ayahNum, reciterKey = null) {
      return this.getAyahAudioUrl(surahId, ayahNum, reciterKey);
    },

    init() {
      if (this.isInitialized || typeof window === 'undefined') return;

      // Restore user preferences
      try {
        const savedReciter = localStorage.getItem('quran_audio_reciter');
        if (savedReciter && RECITERS[savedReciter]) this.activeReciter = savedReciter;
        const savedRepeat = localStorage.getItem('quran_audio_repeat');
        if (savedRepeat) this.repeatMode = savedRepeat;
        const savedSpeed = localStorage.getItem('quran_audio_speed');
        if (savedSpeed) this.playbackSpeed = parseFloat(savedSpeed) || 1.0;
      } catch (e) {}

      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audio.playbackRate = this.playbackSpeed;

      // Event Listeners
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.updateUIState();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updateUIState();
      });

      this.audio.addEventListener('ended', () => {
        this.handleAyahEnded();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('[AudioTartilCompanion] Playback error or offline:', e);
        this.isPlaying = false;
        this.updateUIState();
      });

      this.renderPlayerBar();
      this.isInitialized = true;
      console.log('[AudioTartilCompanion] ✓ Version 2.0 Sacred Audio Companion mounted.');
    },

    getAyahAudioUrl(surahId, ayahNum, reciterKey = null) {
      const rec = RECITERS[reciterKey || this.activeReciter] || RECITERS.alafasy;
      const sPad = String(surahId).padStart(3, '0');
      const aPad = String(ayahNum).padStart(3, '0');
      return `${rec.baseUrl}${sPad}${aPad}.mp3`;
    },

    playAyah(surahId, ayahNum) {
      if (!this.audio) this.init();

      this.currentSurahId = parseInt(surahId, 10);
      this.currentAyahNum = parseInt(ayahNum, 10);
      this.repeatCounter = 0;

      const url = this.getAyahAudioUrl(this.currentSurahId, this.currentAyahNum);
      this.audio.src = url;
      this.audio.playbackRate = this.playbackSpeed;

      this.audio.play().then(() => {
        this.isPlaying = true;
        this.highlightActiveAyah(this.currentAyahNum);
        this.updateUIState();
      }).catch(err => {
        console.warn('[AudioTartilCompanion] Play error:', err);
      });
    },

    togglePlay() {
      if (!this.audio) this.init();

      if (this.isPlaying) {
        this.audio.pause();
      } else {
        if (!this.audio.src || this.audio.src.endsWith('/')) {
          this.playAyah(this.currentSurahId, this.currentAyahNum);
        } else {
          this.audio.play().catch(e => console.warn(e));
        }
      }
    },

    nextAyah() {
      const maxAyat = this.getCurrentSurahMaxAyat();
      if (this.currentAyahNum < maxAyat) {
        this.playAyah(this.currentSurahId, this.currentAyahNum + 1);
      } else if (this.currentSurahId < 114) {
        this.playAyah(this.currentSurahId + 1, 1);
        if (window.CorpusEngine) window.CorpusEngine.loadSurah(this.currentSurahId + 1);
      }
    },

    prevAyah() {
      if (this.currentAyahNum > 1) {
        this.playAyah(this.currentSurahId, this.currentAyahNum - 1);
      } else if (this.currentSurahId > 1) {
        const prevSurahId = this.currentSurahId - 1;
        const prevMax = this.getSurahMaxAyat(prevSurahId);
        this.playAyah(prevSurahId, prevMax);
        if (window.CorpusEngine) window.CorpusEngine.loadSurah(prevSurahId);
      }
    },

    handleAyahEnded() {
      // 1. Check repeat loops
      let targetRepeats = 1;
      if (this.repeatMode === '3x') targetRepeats = 3;
      else if (this.repeatMode === '5x') targetRepeats = 5;
      else if (this.repeatMode === 'continuous') targetRepeats = Infinity;

      this.repeatCounter++;
      if (this.repeatCounter < targetRepeats) {
        this.audio.currentTime = 0;
        this.audio.play().catch(e => console.warn(e));
        return;
      }

      // 2. Advance to next Ayah
      this.repeatCounter = 0;
      this.nextAyah();
    },

    setReciter(reciterKey) {
      if (RECITERS[reciterKey]) {
        this.activeReciter = reciterKey;
        try { localStorage.setItem('quran_audio_reciter', reciterKey); } catch(e) {}
        if (this.isPlaying) {
          this.playAyah(this.currentSurahId, this.currentAyahNum);
        }
        this.updateUIState();
      }
    },

    cycleRepeatMode() {
      const modes = ['1x', '3x', '5x', 'continuous'];
      const nextIdx = (modes.indexOf(this.repeatMode) + 1) % modes.length;
      this.repeatMode = modes[nextIdx];
      this.repeatCounter = 0;
      try { localStorage.setItem('quran_audio_repeat', this.repeatMode); } catch(e) {}
      this.updateUIState();
    },

    cycleSpeed() {
      const speeds = [0.75, 1.0, 1.25];
      const nextIdx = (speeds.indexOf(this.playbackSpeed) + 1) % speeds.length;
      this.playbackSpeed = speeds[nextIdx];
      if (this.audio) this.audio.playbackRate = this.playbackSpeed;
      try { localStorage.setItem('quran_audio_speed', String(this.playbackSpeed)); } catch(e) {}
      this.updateUIState();
    },

    getCurrentSurahMaxAyat() {
      return this.getSurahMaxAyat(this.currentSurahId);
    },

    getSurahMaxAyat(sId) {
      if (window.CorpusEngine && window.CorpusEngine.surahsTelemetry) {
        const s = window.CorpusEngine.surahsTelemetry.find(x => x.id === sId);
        if (s && s.total_ayat) return s.total_ayat;
      }
      return 286;
    },

    highlightActiveAyah(ayahNum) {
      if (typeof document === 'undefined') return;

      // Ensure offscreen virtual chunk is mounted if playing sequentially
      if (window.CorpusEngine && typeof window.CorpusEngine.ensureAyahRendered === 'function') {
        window.CorpusEngine.ensureAyahRendered(ayahNum);
      }

      // Remove existing recitation highlights
      document.querySelectorAll('.ayah-card.reciting-active, .reciting-active').forEach(node => {
        node.classList.remove('reciting-active');
      });

      const target = document.getElementById(`ayah-node-${ayahNum}`);
      if (target) {
        target.classList.add('reciting-active');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },

    renderPlayerBar() {
      if (typeof document === 'undefined') return;
      let bar = document.getElementById('floating-audio-companion');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'floating-audio-companion';
        bar.className = 'audio-companion-bar';
        document.body.appendChild(bar);
      }
      bar.style.display = this.isPlaying ? 'flex' : 'none';

      bar.innerHTML = `
        <div class="audio-companion-inner">
          <div class="audio-meta-wrap">
            <span class="audio-wave-anim">
              <span></span><span></span><span></span>
            </span>
            <div class="audio-info-texts">
              <span class="audio-verse-label" id="audio-bar-verse-label">Surah ${this.currentSurahId}:${this.currentAyahNum}</span>
              <select class="audio-reciter-select" id="audio-reciter-select" title="Select Reciter">
                <option value="alafasy" ${this.activeReciter === 'alafasy' ? 'selected' : ''}>Mishary Alafasy</option>
                <option value="husary" ${this.activeReciter === 'husary' ? 'selected' : ''}>Al-Husary (Teacher)</option>
                <option value="abdulbasit" ${this.activeReciter === 'abdulbasit' ? 'selected' : ''}>Abdul Basit</option>
              </select>
            </div>
          </div>

          <div class="audio-controls-wrap">
            <button class="audio-control-btn" id="audio-prev-btn" title="Previous Ayah">⏮</button>
            <button class="audio-control-btn play-btn" id="audio-play-btn" title="Play / Pause">▶</button>
            <button class="audio-control-btn" id="audio-next-btn" title="Next Ayah">⏭</button>
          </div>

          <div class="audio-toggles-wrap">
            <button class="audio-pill-toggle" id="audio-repeat-btn" title="Repeat Mode">
              <span id="audio-repeat-label">${this.repeatMode === 'continuous' ? '🔁' : '🔂 ' + this.repeatMode}</span>
            </button>
            <button class="audio-pill-toggle" id="audio-speed-btn" title="Playback Speed">
              <span id="audio-speed-label">${this.playbackSpeed}x</span>
            </button>
          </div>

          <button class="audio-bar-close-btn" id="audio-bar-close" onclick="window.AudioTartilCompanion.dismissBar()" title="Dismiss audio player" aria-label="Dismiss audio player">✕</button>
        </div>
      `;

      // Bind events
      const playBtn = document.getElementById('audio-play-btn');
      const prevBtn = document.getElementById('audio-prev-btn');
      const nextBtn = document.getElementById('audio-next-btn');
      const reciterSelect = document.getElementById('audio-reciter-select');
      const repeatBtn = document.getElementById('audio-repeat-btn');
      const speedBtn = document.getElementById('audio-speed-btn');

      if (playBtn) playBtn.addEventListener('click', () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.togglePlay();
      });

      if (prevBtn) prevBtn.addEventListener('click', () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.prevAyah();
      });

      if (nextBtn) nextBtn.addEventListener('click', () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.nextAyah();
      });

      if (reciterSelect) reciterSelect.addEventListener('change', (e) => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.setReciter(e.target.value);
      });

      if (repeatBtn) repeatBtn.addEventListener('click', () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.cycleRepeatMode();
      });

      if (speedBtn) speedBtn.addEventListener('click', () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.cycleSpeed();
      });
    },

    updateUIState() {
      if (typeof document === 'undefined') return;

      const playBtn = document.getElementById('audio-play-btn');
      const bar = document.getElementById('floating-audio-companion');
      const label = document.getElementById('audio-bar-verse-label');
      const repeatLabel = document.getElementById('audio-repeat-label');
      const speedLabel = document.getElementById('audio-speed-label');

      if (playBtn) playBtn.innerHTML = this.isPlaying ? '⏸' : '▶';
      if (bar) {
        if (this.isPlaying) bar.classList.add('playing');
        else bar.classList.remove('playing');
      }
      if (label) label.textContent = `Surah ${this.currentSurahId}:${this.currentAyahNum}`;
      if (repeatLabel) repeatLabel.textContent = this.repeatMode === 'continuous' ? '🔁' : '🔂 ' + this.repeatMode;
      if (speedLabel) speedLabel.textContent = `${this.playbackSpeed}x`;
    }
  };

  global.AudioTartilCompanion = AudioTartilCompanion;
  global.RECITERS = RECITERS;

})(typeof window !== 'undefined' ? window : this);
