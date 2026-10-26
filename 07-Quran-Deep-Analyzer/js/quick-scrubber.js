/**
 * QuickScrubber - High-Velocity Edge Navigation & Direct Jump Engine
 * 120 FPS Dragging, Glass Track, Real-Time Floating Preview & Direct Numeric Jumper
 * Part of Quran Deep Analyzer Suite
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.QuickScrubber = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let activeConfig = null;
  let railEl = null;
  let trackEl = null;
  let thumbEl = null;
  let pillEl = null;
  let pillTitleEl = null;
  let pillSubEl = null;
  let jumpBtnEl = null;
  let modalOverlayEl = null;
  let modalInputEl = null;
  let modalPresetsEl = null;

  let isDragging = false;
  let lastIndex = 1;
  let fadeTimer = null;
  let isModalOpen = false;

  function playTickSFX() {
    try {
      if (window.AudioSFX && typeof window.AudioSFX.playClick === 'function') {
        window.AudioSFX.playClick();
      }
    } catch (e) {}
  }

  function playSuccessSFX() {
    try {
      if (window.AudioSFX && typeof window.AudioSFX.playDing === 'function') {
        window.AudioSFX.playDing();
      }
    } catch (e) {}
  }

  function wakeScrubber() {
    if (!railEl) return;
    railEl.classList.add('active');
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      if (!isDragging && !isModalOpen && railEl) {
        railEl.classList.remove('active');
      }
    }, 2800);
  }

  function buildDOM() {
    if (document.getElementById('quick-scrubber-rail')) {
      railEl = document.getElementById('quick-scrubber-rail');
      trackEl = railEl.querySelector('.quick-scrubber-track');
      thumbEl = railEl.querySelector('.quick-scrubber-thumb');
      pillEl = railEl.querySelector('.quick-scrubber-pill');
      pillTitleEl = pillEl ? pillEl.querySelector('.quick-scrubber-pill-main') : null;
      pillSubEl = pillEl ? pillEl.querySelector('.quick-scrubber-pill-sub') : null;
      jumpBtnEl = railEl.querySelector('.quick-scrubber-trigger-btn');
    } else {
      railEl = document.createElement('div');
      railEl.id = 'quick-scrubber-rail';
      railEl.className = 'quick-scrubber-rail';
      railEl.setAttribute('aria-label', 'Fast Ayah Scrubber');

      railEl.innerHTML = `
        <button class="quick-scrubber-trigger-btn" id="quick-scrubber-jump-btn" title="Jump to Ayah or Item Number">
          <span>#</span>
        </button>
        <div class="quick-scrubber-track" id="quick-scrubber-track">
          <div class="quick-scrubber-bar"></div>
          <div class="quick-scrubber-thumb" id="quick-scrubber-thumb"></div>
        </div>
        <div class="quick-scrubber-pill" id="quick-scrubber-pill">
          <span class="quick-scrubber-pill-main">Ayah 1</span>
          <span class="quick-scrubber-pill-sub"></span>
        </div>
      `;
      document.body.appendChild(railEl);

      trackEl = railEl.querySelector('.quick-scrubber-track');
      thumbEl = railEl.querySelector('.quick-scrubber-thumb');
      pillEl = railEl.querySelector('.quick-scrubber-pill');
      pillTitleEl = pillEl.querySelector('.quick-scrubber-pill-main');
      pillSubEl = pillEl.querySelector('.quick-scrubber-pill-sub');
      jumpBtnEl = railEl.querySelector('.quick-scrubber-trigger-btn');

      bindTrackEvents();
    }

    // Modal DOM
    if (!document.getElementById('quick-jump-modal-overlay')) {
      modalOverlayEl = document.createElement('div');
      modalOverlayEl.id = 'quick-jump-modal-overlay';
      modalOverlayEl.className = 'quick-jump-modal-overlay';
      modalOverlayEl.setAttribute('role', 'dialog');
      modalOverlayEl.setAttribute('aria-modal', 'true');

      modalOverlayEl.innerHTML = `
        <div class="quick-jump-modal-card">
          <div class="quick-jump-header">
            <div class="quick-jump-title">
              <span>⚡</span> <span id="quick-jump-modal-title">Jump to Ayah</span>
            </div>
            <button class="quick-jump-close-btn" id="quick-jump-modal-close" title="Close">✕</button>
          </div>
          <div class="quick-jump-preset-row" id="quick-jump-presets"></div>
          <form id="quick-jump-form" onsubmit="return false;">
            <div class="quick-jump-input-wrap">
              <input type="number" id="quick-jump-input" class="quick-jump-input" min="1" max="286" placeholder="1" autocomplete="off" />
              <button type="button" id="quick-jump-submit" class="quick-jump-submit-btn">Go ⚡</button>
            </div>
          </form>
          <div class="quick-jump-hint" id="quick-jump-hint">Type any verse number or choose a preset</div>
        </div>
      `;
      document.body.appendChild(modalOverlayEl);

      modalInputEl = modalOverlayEl.querySelector('#quick-jump-input');
      modalPresetsEl = modalOverlayEl.querySelector('#quick-jump-presets');

      modalOverlayEl.querySelector('#quick-jump-modal-close').addEventListener('click', closeJumpModal);
      modalOverlayEl.addEventListener('click', (e) => {
        if (e.target === modalOverlayEl) closeJumpModal();
      });

      modalOverlayEl.querySelector('#quick-jump-submit').addEventListener('click', submitJumpModal);
      modalInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitJumpModal();
        } else if (e.key === 'Escape') {
          closeJumpModal();
        }
      });
    } else {
      modalOverlayEl = document.getElementById('quick-jump-modal-overlay');
      modalInputEl = modalOverlayEl.querySelector('#quick-jump-input');
      modalPresetsEl = modalOverlayEl.querySelector('#quick-jump-presets');
    }

    if (jumpBtnEl) {
      jumpBtnEl.onclick = (e) => {
        e.stopPropagation();
        openJumpModal();
      };
    }
  }

  function bindTrackEvents() {
    if (!trackEl) return;

    function handleMove(clientY) {
      if (!activeConfig || !activeConfig.totalItems || activeConfig.totalItems <= 1) return;
      const rect = trackEl.getBoundingClientRect();
      let clampedY = clientY - rect.top;
      if (clampedY < 0) clampedY = 0;
      if (clampedY > rect.height) clampedY = rect.height;

      const ratio = rect.height > 0 ? clampedY / rect.height : 0;
      const targetIndex = Math.min(
        activeConfig.totalItems,
        Math.max(1, Math.round(1 + ratio * (activeConfig.totalItems - 1)))
      );

      // Update thumb position visually
      const pct = (ratio * 100).toFixed(1);
      thumbEl.style.top = pct + '%';

      // Update pill
      if (pillEl) {
        pillEl.style.top = pct + '%';
        pillEl.classList.add('show');
        const info = activeConfig.getItemLabel ? activeConfig.getItemLabel(targetIndex) : { title: `#${targetIndex}` };
        if (pillTitleEl) pillTitleEl.textContent = info.title || `#${targetIndex}`;
        if (pillSubEl) pillSubEl.textContent = info.subtitle || '';
      }

      if (targetIndex !== lastIndex) {
        playTickSFX();
        lastIndex = targetIndex;
      }
    }

    function onPointerDown(e) {
      isDragging = true;
      railEl.classList.add('touching');
      wakeScrubber();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      handleMove(clientY);

      const moveHandler = (moveEvent) => {
        if (!isDragging) return;
        const moveY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
        handleMove(moveY);
      };

      const upHandler = () => {
        if (!isDragging) return;
        isDragging = false;
        railEl.classList.remove('touching');
        if (pillEl) pillEl.classList.remove('show');
        if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
          window.removeEventListener('mousemove', moveHandler);
          window.removeEventListener('mouseup', upHandler);
          window.removeEventListener('touchmove', moveHandler);
          window.removeEventListener('touchend', upHandler);
        }

        if (activeConfig && typeof activeConfig.onJump === 'function') {
          activeConfig.onJump(lastIndex);
        }
        wakeScrubber();
      };

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('mousemove', moveHandler, { passive: true });
        window.addEventListener('mouseup', upHandler, { passive: true });
        window.addEventListener('touchmove', moveHandler, { passive: true });
        window.addEventListener('touchend', upHandler, { passive: true });
      }
    }

    trackEl.addEventListener('mousedown', onPointerDown);
    trackEl.addEventListener('touchstart', onPointerDown, { passive: true });

    // Hover effect on desktop
    trackEl.addEventListener('mousemove', (e) => {
      if (!isDragging) {
        wakeScrubber();
      }
    });

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener(
        'scroll',
        () => {
          wakeScrubber();
          syncThumbWithScroll();
        },
        { passive: true }
      );
    }
  }

  function syncThumbWithScroll() {
    if (isDragging || !activeConfig || !activeConfig.itemSelector) return;
    const container = activeConfig.containerId ? document.getElementById(activeConfig.containerId) : document;
    if (!container) return;

    // Check if parent tab panel is inactive
    const panel = container.closest ? container.closest('.tab-panel') : null;
    if (panel && !panel.classList.contains('active')) return;

    const items = container.querySelectorAll(activeConfig.itemSelector);
    if (!items || items.length === 0) return;

    // Find the topmost visible item in viewport
    const currentScrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
    const viewTop = currentScrollY + 140;
    let foundIndex = 1;
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect ? items[i].getBoundingClientRect() : { top: 0 };
      const top = rect.top + currentScrollY;
      if (top <= viewTop) {
        if (items[i].dataset && items[i].dataset.serial !== undefined) {
          foundIndex = parseInt(items[i].dataset.serial, 10);
        } else if (items[i].dataset && items[i].dataset.idx !== undefined) {
          foundIndex = parseInt(items[i].dataset.idx, 10) + 1;
        } else {
          foundIndex = i + 1;
        }
      } else {
        break;
      }
    }

    if (activeConfig.totalItems > 1) {
      const ratio = Math.min(1, Math.max(0, (foundIndex - 1) / (activeConfig.totalItems - 1)));
      if (thumbEl) thumbEl.style.top = (ratio * 100).toFixed(1) + '%';
    }
  }

  function openJumpModal() {
    if (!activeConfig) return;
    isModalOpen = true;
    buildDOM();
    wakeScrubber();

    const titleEl = document.getElementById('quick-jump-modal-title');
    if (titleEl) {
      titleEl.textContent = activeConfig.modalTitle || 'Jump to Ayah';
    }

    if (modalInputEl) {
      modalInputEl.min = 1;
      modalInputEl.max = activeConfig.totalItems;
      modalInputEl.value = lastIndex || 1;
      modalInputEl.placeholder = `1..${activeConfig.totalItems}`;
    }

    const hintEl = document.getElementById('quick-jump-hint');
    if (hintEl) {
      hintEl.textContent = `Valid range: 1 to ${activeConfig.totalItems} (${activeConfig.unitName || 'verses'})`;
    }

    // Render Presets
    if (modalPresetsEl) {
      const total = activeConfig.totalItems;
      const mid = Math.round(total / 2);
      modalPresetsEl.innerHTML = `
        <button type="button" class="quick-jump-preset-btn" data-target="1">First (1)</button>
        ${total > 2 ? `<button type="button" class="quick-jump-preset-btn" data-target="${mid}">Middle (${mid})</button>` : ''}
        <button type="button" class="quick-jump-preset-btn" data-target="${total}">Last (${total})</button>
      `;

      modalPresetsEl.querySelectorAll('.quick-jump-preset-btn').forEach((btn) => {
        btn.onclick = () => {
          const tgt = parseInt(btn.dataset.target, 10);
          if (modalInputEl) modalInputEl.value = tgt;
          submitJumpModal();
        };
      });
    }

    if (modalOverlayEl) modalOverlayEl.classList.add('open');
    setTimeout(() => {
      if (modalInputEl) {
        modalInputEl.focus();
        modalInputEl.select();
      }
    }, 50);
  }

  function closeJumpModal() {
    isModalOpen = false;
    if (modalOverlayEl) modalOverlayEl.classList.remove('open');
    wakeScrubber();
  }

  function submitJumpModal() {
    if (!activeConfig || !modalInputEl) return;
    let val = parseInt(modalInputEl.value, 10);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > activeConfig.totalItems) val = activeConfig.totalItems;

    closeJumpModal();
    playSuccessSFX();
    lastIndex = val;

    // Update thumb
    if (activeConfig.totalItems > 1 && thumbEl) {
      const ratio = (val - 1) / (activeConfig.totalItems - 1);
      thumbEl.style.top = (ratio * 100).toFixed(1) + '%';
    }

    if (typeof activeConfig.onJump === 'function') {
      activeConfig.onJump(val);
    }
  }

  return {
    init: function (config) {
      activeConfig = config || {};
      activeConfig.totalItems = activeConfig.totalItems || 1;
      activeConfig.context = activeConfig.context || 'default';
      buildDOM();

      if (activeConfig.totalItems <= 1) {
        if (railEl) railEl.style.display = 'none';
        return;
      } else {
        if (railEl) railEl.style.display = 'flex';
      }

      lastIndex = 1;
      if (thumbEl) thumbEl.style.top = '0%';
      wakeScrubber();
      syncThumbWithScroll();
    },

    getContext: function () {
      return activeConfig ? activeConfig.context : null;
    },

    getConfig: function () {
      return activeConfig;
    },

    syncThumb: syncThumbWithScroll,

    updateTotal: function (total) {
      if (!activeConfig) return;
      activeConfig.totalItems = total;
      if (total <= 1) {
        if (railEl) railEl.style.display = 'none';
      } else {
        if (railEl) railEl.style.display = 'flex';
      }
      syncThumbWithScroll();
    },

    setIndex: function (idx) {
      if (!activeConfig || !activeConfig.totalItems) return;
      lastIndex = Math.min(activeConfig.totalItems, Math.max(1, idx));
      if (activeConfig.totalItems > 1 && thumbEl) {
        const ratio = (lastIndex - 1) / (activeConfig.totalItems - 1);
        thumbEl.style.top = (ratio * 100).toFixed(1) + '%';
      }
    },

    hide: function () {
      if (railEl) railEl.style.display = 'none';
    },

    show: function () {
      if (railEl && activeConfig && activeConfig.totalItems > 1) {
        railEl.style.display = 'flex';
        wakeScrubber();
      }
    },

    openModal: openJumpModal,
    closeModal: closeJumpModal
  };
});
