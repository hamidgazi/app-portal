/**
 * Quran Deep Analyzer - Master Bootloader & State Orchestrator
 * Defensive Component Bootloader Isolation (Workspace Directive 5)
 */

function switchAppTab(tabName) {
  if (window.AudioSFX) window.AudioSFX.playTab();

  const navBtns = document.querySelectorAll(".nav-tab-btn");
  navBtns.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const tabPanels = document.querySelectorAll(".tab-panel");
  tabPanels.forEach(panel => {
    if (panel.id === `tab-${tabName}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  window.location.hash = tabName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchAppTab = switchAppTab;

function initTabs() {
  const navBtns = document.querySelectorAll(".nav-tab-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      switchAppTab(tabName);
    });
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`tab-${hash}`)) {
    switchAppTab(hash);
  }
}

function initModalHandlers() {
  const modal = document.getElementById("occurrence-modal");
  const closeBtn = document.getElementById("occ-modal-close");
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (window.AudioSFX) window.AudioSFX.playClick();
      modal.classList.remove("open");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });
}

function bootApp() {
  console.log("[BOOT] Starting Quran Deep Analyzer bootloader...");

  const modules = [
    { name: "AudioSFX", init: () => window.AudioSFX && window.AudioSFX.init() },
    { name: "Tabs", init: () => initTabs() },
    { name: "ModalHandlers", init: () => initModalHandlers() },
    { name: "TelemetryEngine", init: () => window.TelemetryEngine && window.TelemetryEngine.init() },
    { name: "CorpusEngine", init: () => window.CorpusEngine && window.CorpusEngine.init() },
    { name: "AnalyticsStudio", init: () => window.AnalyticsStudio && window.AnalyticsStudio.init() }
  ];

  modules.forEach(mod => {
    try {
      mod.init();
      console.log(`[BOOT] ✓ ${mod.name} initialized successfully.`);
    } catch (err) {
      console.error(`[CRITICAL] Failure in module ${mod.name}:`, err);
    }
  });

  console.log("[BOOT] Application successfully mounted.");
}

document.addEventListener("DOMContentLoaded", bootApp);
