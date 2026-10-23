/**
 * Roman Naat Studio - Procedural Acoustic Feedback Engine
 * Strict Zero-Music Jurisprudence (Directive 7 & Learning 29.13 Compliant)
 * Generates tactile UI clicks, soft notification chimes, and haptic feedback
 * completely synthesized via browser Web Audio API. Zero external audio assets.
 */

class AudioSFXEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this._initAudioContext();
    }

    _initAudioContext() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        } catch (e) {
            console.warn("AudioContext not supported or blocked:", e);
            this.ctx = null;
        }
    }

    _ensureActive() {
        if (!this.ctx) {
            this._initAudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.playClick();
        }
        return this.enabled;
    }

    /**
     * Tactile mechanical click on button press
     */
    playClick() {
        if (!this.enabled) return;
        this._ensureActive();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1100, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.036);
        } catch (e) {
            // Non-critical audio error
        }
    }

    /**
     * Gentle soft pop for tab/filter switching
     */
    playTab() {
        if (!this.enabled) return;
        this._ensureActive();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

            gain.gain.setValueAtTime(0.10, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.046);
        } catch (e) {}
    }

    /**
     * Soft acoustic chime on copy / save bookmark (two short sine pings)
     */
    playSuccess() {
        if (!this.enabled) return;
        this._ensureActive();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            
            // Tone 1: E5 (659 Hz)
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659, now);
            gain1.gain.setValueAtTime(0.10, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.085);

            // Tone 2: G#5 (830 Hz) slightly delayed
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(830, now + 0.06);
            gain2.gain.setValueAtTime(0.09, now + 0.06);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now + 0.06);
            osc2.stop(now + 0.165);
        } catch (e) {}
    }
}

window.AudioSFX = new AudioSFXEngine();
