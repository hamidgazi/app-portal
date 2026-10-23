/**
 * Roman Naat Studio - Main Application Controller
 * Built with Defensive Component Bootloader Isolation & Strict DOM Hygiene
 * (Directive 5 & Directive 7 Compliant)
 */

(function () {
    "use strict";

    // Application State
    const state = {
        bookFilter: 'all',
        catFilter: 'all',
        searchQuery: '',
        searchMode: 'shers', // 'shers' or 'kalams'
        bookmarks: new Set(), // Couplet keys: "kalamId:sherIndex"
        kalamBookmarks: new Set(), // Full Kalam IDs: "kalamId"
        theme: 'dark',
        activeView: 'search', // 'search', 'browser', or 'diwan'
        reciteFontSize: 20,
        diwanFontSize: 18,
        showTranslation: true,
        activeKalamId: null,
        activeDeckTab: 'shers', // 'shers' or 'kalams'
        previousScrollY: 0
    };

    // DOM Elements Cache
    let dom = {};

    /**
     * Defensive Bootloader Initializer
     */
    function initBootloader() {
        console.log("[Bootloader] Initializing Roman Naat Studio...");

        // 1. Cache DOM Elements Safely
        try {
            dom = {
                body: document.body,
                searchHero: document.querySelector('.search-hero'),
                searchInput: document.getElementById('search-input'),
                searchClearBtn: document.getElementById('search-clear-btn'),
                bookPills: document.querySelectorAll('.pill-btn[data-book]'),
                catPills: document.querySelectorAll('.cat-btn[data-cat]'),
                resultsGrid: document.getElementById('results-grid'),
                resultStatusText: document.getElementById('result-status-text'),
                resultsContainer: document.getElementById('results-container'),
                browserContainer: document.getElementById('browser-container'),
                
                // Mode Toggle Bar (Shers vs Full Kalams)
                modeShersBtn: document.getElementById('mode-shers-btn'),
                modeKalamsBtn: document.getElementById('mode-kalams-btn'),
                modeSherCount: document.getElementById('mode-sher-count'),
                modeKalamCount: document.getElementById('mode-kalam-count'),

                // Header Nav Buttons
                themeToggleBtn: document.getElementById('theme-toggle-btn'),
                themeIcon: document.getElementById('theme-icon'),
                audioToggleBtn: document.getElementById('audio-toggle-btn'),
                audioIcon: document.getElementById('audio-icon'),
                browserToggleBtn: document.getElementById('browser-toggle-btn'),
                deckToggleBtn: document.getElementById('deck-toggle-btn'),
                deckBadge: document.getElementById('deck-badge'),
                
                // Dedicated Full-Page Diwan Reader Elements
                diwanReaderView: document.getElementById('diwan-reader-view'),
                diwanBackBtn: document.getElementById('diwan-back-btn'),
                diwanTitle: document.getElementById('diwan-title'),
                diwanBookBadge: document.getElementById('diwan-book-badge'),
                diwanAuthorBadge: document.getElementById('diwan-author-badge'),
                diwanPageBadge: document.getElementById('diwan-page-badge'),
                diwanVerseCount: document.getElementById('diwan-verse-count'),
                diwanWhatsappBtn: document.getElementById('diwan-whatsapp-btn'),
                diwanCopyBtn: document.getElementById('diwan-copy-btn'),
                diwanPrevBtn: document.getElementById('diwan-prev-btn'),
                diwanNextBtn: document.getElementById('diwan-next-btn'),
                diwanChapIndicator: document.getElementById('diwan-chap-indicator'),
                diwanTransBtn: document.getElementById('diwan-trans-btn'),
                diwanTransLabel: document.getElementById('diwan-trans-label'),
                diwanZoomOut: document.getElementById('diwan-zoom-out'),
                diwanZoomIn: document.getElementById('diwan-zoom-in'),
                diwanBookmarkBtn: document.getElementById('diwan-bookmark-btn'),
                diwanBookmarkLabel: document.getElementById('diwan-bookmark-label'),
                diwanShareLinkBtn: document.getElementById('diwan-share-link-btn'),
                diwanIntroNote: document.getElementById('diwan-intro-note'),
                diwanVersesContainer: document.getElementById('diwan-verses-container'),
                diwanFootnote: document.getElementById('diwan-footnote'),
                
                // Recitation Deck Drawer
                deckDrawer: document.getElementById('deck-drawer'),
                deckBackdrop: document.getElementById('deck-backdrop'),
                deckCloseBtn: document.getElementById('deck-close-btn'),
                deckBody: document.getElementById('deck-body'),
                deckCountText: document.getElementById('deck-count-text'),
                zoomInBtn: document.getElementById('zoom-in-btn'),
                zoomOutBtn: document.getElementById('zoom-out-btn'),
                deckTabShers: document.getElementById('deck-tab-shers'),
                deckTabKalams: document.getElementById('deck-tab-kalams'),
                deckSherTabCount: document.getElementById('deck-sher-tab-count'),
                deckKalamTabCount: document.getElementById('deck-kalam-tab-count'),
                
                // Toast
                toastNotice: document.getElementById('toast-notice')
            };
        } catch (err) {
            console.error("[Bootloader] DOM element caching failure:", err);
        }

        // 2. Initialize Search Engine Data Indexing
        try {
            if (window.NAAT_LIBRARY && window.NAAT_LIBRARY.kalams && window.SearchEngine) {
                window.SearchEngine.buildIndex(window.NAAT_LIBRARY.kalams);
                if (dom.modeKalamCount) dom.modeKalamCount.textContent = window.NAAT_LIBRARY.kalams.length;
                if (dom.modeSherCount && window.NAAT_LIBRARY.metadata) {
                    dom.modeSherCount.textContent = Number(window.NAAT_LIBRARY.metadata.total_shers).toLocaleString();
                }
            } else {
                console.warn("[Bootloader] NAAT_LIBRARY dataset not detected on window.");
            }
        } catch (err) {
            console.error("[Bootloader] SearchEngine indexing failure:", err);
        }

        // 3. Load Saved Bookmarks & Reader Settings from LocalStorage
        try {
            const savedBookmarks = localStorage.getItem('roman_naat_bookmarks');
            if (savedBookmarks) {
                state.bookmarks = new Set(JSON.parse(savedBookmarks));
            }
            const savedKalamBookmarks = localStorage.getItem('roman_naat_kalam_bookmarks');
            if (savedKalamBookmarks) {
                state.kalamBookmarks = new Set(JSON.parse(savedKalamBookmarks));
            }
            const savedTrans = localStorage.getItem('roman_naat_show_translation');
            if (savedTrans !== null) {
                state.showTranslation = (savedTrans === 'true');
            }
            const savedMode = localStorage.getItem('roman_naat_search_mode');
            if (savedMode && (savedMode === 'shers' || savedMode === 'kalams')) {
                state.searchMode = savedMode;
            }
            updateDeckBadge();
        } catch (err) {
            console.warn("[Bootloader] LocalStorage bookmarks read failure:", err);
        }

        // 4. Load Saved Theme
        try {
            const savedTheme = localStorage.getItem('roman_naat_theme') || 'dark';
            setTheme(savedTheme);
        } catch (err) {
            console.warn("[Bootloader] Theme initialization failure:", err);
        }

        // 5. Sync Mode Switcher Buttons UI
        try {
            updateModeButtonsUI();
        } catch (err) {
            console.error("[Bootloader] Mode button sync failure:", err);
        }

        // 6. Bind User Interaction Listeners
        try {
            bindEvents();
        } catch (err) {
            console.error("[Bootloader] Event binding failure:", err);
        }

        // 7. Build Book Browser Table of Contents
        try {
            buildBookBrowser();
        } catch (err) {
            console.error("[Bootloader] Book browser build failure:", err);
        }

        // 8. Initial Search Render
        try {
            renderSearchResults();
        } catch (err) {
            console.error("[Bootloader] Initial search render failure:", err);
        }

        // 9. Check URL Deep Link (#kalam=...&verse=...)
        try {
            checkUrlDeepLink();
            window.addEventListener('hashchange', checkUrlDeepLink);
            window.addEventListener('popstate', handlePopState);
        } catch (err) {
            console.warn("[Bootloader] Deep link initialization failure:", err);
        }

        console.log("[Bootloader] Roman Naat Studio successfully mounted!");
    }

    /**
     * Bind all DOM UI events
     */
    function bindEvents() {
        // Mode Switcher Buttons (Shers vs Full Kalams)
        if (dom.modeShersBtn) {
            dom.modeShersBtn.addEventListener('click', function () {
                if (state.searchMode !== 'shers') {
                    if (window.AudioSFX) window.AudioSFX.playTab();
                    state.searchMode = 'shers';
                    updateModeButtonsUI();
                    try { localStorage.setItem('roman_naat_search_mode', 'shers'); } catch (e) {}
                    renderSearchResults();
                }
            });
        }
        if (dom.modeKalamsBtn) {
            dom.modeKalamsBtn.addEventListener('click', function () {
                if (state.searchMode !== 'kalams') {
                    if (window.AudioSFX) window.AudioSFX.playTab();
                    state.searchMode = 'kalams';
                    updateModeButtonsUI();
                    try { localStorage.setItem('roman_naat_search_mode', 'kalams'); } catch (e) {}
                    renderSearchResults();
                }
            });
        }

        // Search Input with Debounce
        if (dom.searchInput) {
            let debounceTimer = null;
            dom.searchInput.addEventListener('input', function (e) {
                state.searchQuery = e.target.value;
                if (dom.searchClearBtn) {
                    if (state.searchQuery.length > 0) {
                        dom.searchClearBtn.classList.add('visible');
                    } else {
                        dom.searchClearBtn.classList.remove('visible');
                    }
                }
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    renderSearchResults();
                }, 40);
            });
        }

        // Clear Search Button
        if (dom.searchClearBtn) {
            dom.searchClearBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                if (dom.searchInput) {
                    dom.searchInput.value = '';
                    state.searchQuery = '';
                    dom.searchClearBtn.classList.remove('visible');
                    dom.searchInput.focus();
                    renderSearchResults();
                }
            });
        }

        // Book Filter Pills
        if (dom.bookPills) {
            dom.bookPills.forEach(pill => {
                pill.addEventListener('click', function () {
                    if (window.AudioSFX) window.AudioSFX.playTab();
                    dom.bookPills.forEach(p => p.classList.remove('active'));
                    this.classList.add('active');
                    state.bookFilter = this.getAttribute('data-book');
                    renderSearchResults();
                });
            });
        }

        // Category Filter Pills
        if (dom.catPills) {
            dom.catPills.forEach(pill => {
                pill.addEventListener('click', function () {
                    if (window.AudioSFX) window.AudioSFX.playTab();
                    dom.catPills.forEach(p => p.classList.remove('active'));
                    this.classList.add('active');
                    state.catFilter = this.getAttribute('data-cat');
                    renderSearchResults();
                });
            });
        }

        // Theme Toggle
        if (dom.themeToggleBtn) {
            dom.themeToggleBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
            });
        }

        // Audio SFX Toggle
        if (dom.audioToggleBtn) {
            dom.audioToggleBtn.addEventListener('click', function () {
                if (window.AudioSFX) {
                    const active = window.AudioSFX.toggle();
                    if (dom.audioIcon) {
                        dom.audioIcon.textContent = active ? '🔊' : '🔇';
                    }
                    showToast(active ? 'Acoustic Sound FX On' : 'Sound FX Muted');
                }
            });
        }

        // Book Browser Toggle
        if (dom.browserToggleBtn) {
            dom.browserToggleBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playTab();
                toggleView(state.activeView === 'search' ? 'browser' : 'search');
            });
        }

        // Recitation Deck Drawer Toggle
        if (dom.deckToggleBtn) {
            dom.deckToggleBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playTab();
                openRecitationDeck();
            });
        }
        if (dom.deckCloseBtn) {
            dom.deckCloseBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                closeRecitationDeck();
            });
        }
        if (dom.deckBackdrop) {
            dom.deckBackdrop.addEventListener('click', closeRecitationDeck);
        }

        // Deck Tabs Switcher (Couplets vs Full Naats)
        if (dom.deckTabShers) {
            dom.deckTabShers.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playTab();
                state.activeDeckTab = 'shers';
                dom.deckTabShers.classList.add('active');
                if (dom.deckTabKalams) dom.deckTabKalams.classList.remove('active');
                renderRecitationDeck();
            });
        }
        if (dom.deckTabKalams) {
            dom.deckTabKalams.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playTab();
                state.activeDeckTab = 'kalams';
                dom.deckTabKalams.classList.add('active');
                if (dom.deckTabShers) dom.deckTabShers.classList.remove('active');
                renderRecitationDeck();
            });
        }

        // Font Zoom Controls in Deck
        if (dom.zoomInBtn) {
            dom.zoomInBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                if (state.reciteFontSize < 34) {
                    state.reciteFontSize += 2;
                    document.documentElement.style.setProperty('--recite-size', `${state.reciteFontSize}px`);
                }
            });
        }
        if (dom.zoomOutBtn) {
            dom.zoomOutBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                if (state.reciteFontSize > 16) {
                    state.reciteFontSize -= 2;
                    document.documentElement.style.setProperty('--recite-size', `${state.reciteFontSize}px`);
                }
            });
        }

        // Dedicated Diwan Reader Controls
        if (dom.diwanBackBtn) {
            dom.diwanBackBtn.addEventListener('click', function () {
                closeDiwanReader();
            });
        }

        if (dom.diwanTransBtn) {
            dom.diwanTransBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                state.showTranslation = !state.showTranslation;
                try { localStorage.setItem('roman_naat_show_translation', String(state.showTranslation)); } catch (e) {}
                syncDiwanTranslationUI();
            });
        }

        if (dom.diwanZoomIn) {
            dom.diwanZoomIn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                if (state.diwanFontSize < 30) {
                    state.diwanFontSize += 2;
                    if (dom.diwanVersesContainer) dom.diwanVersesContainer.style.fontSize = `${state.diwanFontSize}px`;
                }
            });
        }
        if (dom.diwanZoomOut) {
            dom.diwanZoomOut.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                if (state.diwanFontSize > 15) {
                    state.diwanFontSize -= 2;
                    if (dom.diwanVersesContainer) dom.diwanVersesContainer.style.fontSize = `${state.diwanFontSize}px`;
                }
            });
        }

        if (dom.diwanBookmarkBtn) {
            dom.diwanBookmarkBtn.addEventListener('click', function () {
                if (state.activeKalamId) {
                    toggleKalamBookmark(state.activeKalamId);
                    syncDiwanBookmarkUI();
                }
            });
        }

        if (dom.diwanShareLinkBtn) {
            dom.diwanShareLinkBtn.addEventListener('click', function () {
                if (!state.activeKalamId) return;
                const url = window.location.origin + window.location.pathname + '#kalam=' + state.activeKalamId;
                navigator.clipboard.writeText(url).then(() => {
                    if (window.AudioSFX) window.AudioSFX.playSuccess();
                    showToast('Direct link to this Naat copied! 🔗');
                }).catch(() => {
                    showToast('Link: ' + url);
                });
            });
        }

        if (dom.diwanPrevBtn) {
            dom.diwanPrevBtn.addEventListener('click', function () {
                navigateSequentialKalam(-1);
            });
        }
        if (dom.diwanNextBtn) {
            dom.diwanNextBtn.addEventListener('click', function () {
                navigateSequentialKalam(1);
            });
        }

        if (dom.diwanWhatsappBtn) {
            dom.diwanWhatsappBtn.addEventListener('click', function () {
                shareFullKalamToWhatsApp(state.activeKalamId);
            });
        }
        if (dom.diwanCopyBtn) {
            dom.diwanCopyBtn.addEventListener('click', function () {
                copyFullKalam(state.activeKalamId);
            });
        }

        // Escape Key Listener to Close Modals / Return from Diwan
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (state.activeView === 'diwan') {
                    closeDiwanReader();
                }
                closeRecitationDeck();
            }
        });
    }

    /**
     * Synchronize Mode Switcher UI
     */
    function updateModeButtonsUI() {
        if (dom.modeShersBtn && dom.modeKalamsBtn) {
            if (state.searchMode === 'shers') {
                dom.modeShersBtn.classList.add('active');
                dom.modeShersBtn.setAttribute('aria-selected', 'true');
                dom.modeKalamsBtn.classList.remove('active');
                dom.modeKalamsBtn.setAttribute('aria-selected', 'false');
            } else {
                dom.modeKalamsBtn.classList.add('active');
                dom.modeKalamsBtn.setAttribute('aria-selected', 'true');
                dom.modeShersBtn.classList.remove('active');
                dom.modeShersBtn.setAttribute('aria-selected', 'false');
            }
        }
    }

    /**
     * Synchronize Diwan Translation Toggle UI
     */
    function syncDiwanTranslationUI() {
        if (!dom.diwanTransBtn || !dom.diwanReaderView) return;
        const bookPage = dom.diwanReaderView.querySelector('.diwan-book-page') || dom.diwanReaderView;

        if (state.showTranslation) {
            dom.diwanTransBtn.classList.add('active');
            if (dom.diwanTransLabel) dom.diwanTransLabel.textContent = 'Translation: ON';
            bookPage.classList.remove('hide-translations');
        } else {
            dom.diwanTransBtn.classList.remove('active');
            if (dom.diwanTransLabel) dom.diwanTransLabel.textContent = 'Translation: OFF';
            bookPage.classList.add('hide-translations');
        }
    }

    function toggleDiwanColumns() {}

    /**
     * Synchronize Diwan Bookmark Button
     */
    function syncDiwanBookmarkUI() {
        if (!dom.diwanBookmarkLabel || !state.activeKalamId) return;
        const isStarred = state.kalamBookmarks.has(state.activeKalamId);
        dom.diwanBookmarkLabel.textContent = isStarred ? 'Saved ⭐' : 'Bookmark';
        if (dom.diwanBookmarkBtn) {
            if (isStarred) dom.diwanBookmarkBtn.classList.add('active');
            else dom.diwanBookmarkBtn.classList.remove('active');
        }
    }

    /**
     * Toggle View between 'search' and 'browser'
     */
    function toggleView(view) {
        state.activeView = view;
        if (view === 'browser') {
            if (dom.searchHero) dom.searchHero.style.display = 'none';
            if (dom.resultsContainer) dom.resultsContainer.style.display = 'none';
            if (dom.browserContainer) dom.browserContainer.style.display = 'block';
            if (dom.diwanReaderView) dom.diwanReaderView.style.display = 'none';
            if (dom.browserToggleBtn) {
                dom.browserToggleBtn.style.borderColor = 'var(--accent-gold)';
                dom.browserToggleBtn.innerHTML = '🔍 Search View';
            }
        } else {
            if (dom.searchHero) dom.searchHero.style.display = 'block';
            if (dom.resultsContainer) dom.resultsContainer.style.display = 'block';
            if (dom.browserContainer) dom.browserContainer.style.display = 'none';
            if (dom.diwanReaderView) dom.diwanReaderView.style.display = 'none';
            if (dom.browserToggleBtn) {
                dom.browserToggleBtn.style.borderColor = 'var(--border-subtle)';
                dom.browserToggleBtn.innerHTML = '📚 Book Index';
            }
            renderSearchResults();
        }
    }

    /**
     * Set Application Theme (Emerald Dark / Daylight Light)
     */
    function setTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('roman_naat_theme', theme);
        } catch (e) {}

        if (dom.themeIcon) {
            dom.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    /**
     * Main Results Orchestrator (Routes to Sher or Kalam views)
     */
    function renderSearchResults() {
        if (state.searchMode === 'kalams') {
            renderKalamSearchResults();
        } else {
            renderSherSearchResults();
        }
    }

    /**
     * Renders Individual Couplets (Shers) Results Grid
     */
    function renderSherSearchResults() {
        if (!dom.resultsGrid || !window.SearchEngine) return;

        const results = window.SearchEngine.search(
            state.searchQuery,
            state.bookFilter,
            state.catFilter,
            120
        );

        // Update status text
        if (dom.resultStatusText) {
            const countText = results.length >= 120 ? '120+' : results.length;
            if (state.searchQuery.trim()) {
                dom.resultStatusText.innerHTML = `Found <span class="status-count">${countText}</span> matching couplets for "<strong>${escapeHtml(state.searchQuery)}</strong>"`;
            } else {
                dom.resultStatusText.innerHTML = `Displaying <span class="status-count">${countText}</span> couplets across Bareilly Divans`;
            }
        }

        if (results.length === 0) {
            dom.resultsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No matching couplets found</h3>
                    <p>Try searching for a different word, couplet line, or switch to <strong>Full Naats</strong> mode above.</p>
                </div>
            `;
            return;
        }

        // Build HTML Cards
        let html = '';
        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const isStarred = state.bookmarks.has(getSherKey(item));
            const highlightedRoman = window.SearchEngine.highlight(escapeHtml(item.roman), state.searchQuery);
            const highlightedEnglish = item.english ? window.SearchEngine.highlight(escapeHtml(item.english), state.searchQuery) : '';

            html += `
                <div class="sher-card" data-book="${item.bookId}">
                    <div class="card-header-meta">
                        <div class="meta-tags">
                            <span class="tag-badge book-badge">📖 ${escapeHtml(item.bookTitle)}</span>
                            <span class="tag-badge cat-badge">${escapeHtml(item.category)}</span>
                            <span class="tag-badge page-badge">Pg. ${item.page}</span>
                        </div>
                        <div class="card-actions-quick">
                            <button class="btn-icon-action ${isStarred ? 'starred' : ''}" 
                                    title="${isStarred ? 'Remove from Recitation Deck' : 'Save to Recitation Deck'}"
                                    onclick="window.App.toggleBookmark('${item.kalamId}', ${item.sherIndex}, this)">
                                ${isStarred ? '⭐' : '☆'}
                            </button>
                        </div>
                    </div>

                    <div class="kalam-title-sub">
                        <span>✨</span>
                        <span>${escapeHtml(item.kalamTitle)}</span>
                    </div>

                    <div class="sher-couplet-text">${highlightedRoman}</div>

                    ${item.english ? `<div class="sher-english">🇬🇧 ${highlightedEnglish}</div>` : ''}

                    <div class="author-attribution">✍️ ${escapeHtml(item.author)}</div>

                    <div class="card-bottom-actions">
                        <div class="share-btns">
                            <button class="action-btn-primary" 
                                    onclick="window.App.shareToWhatsApp('${item.kalamId}', ${item.sherIndex})">
                                📲 WhatsApp
                            </button>
                            <button class="action-btn-secondary" 
                                    onclick="window.App.copySher('${item.kalamId}', ${item.sherIndex})">
                                📋 Copy Sher
                            </button>
                        </div>
                        <button class="btn-open-kalam" 
                                onclick="window.App.openDiwanReader('${item.kalamId}', ${item.sherIndex})">
                            📖 Read Full Kalam →
                        </button>
                    </div>
                </div>
            `;
        }

        dom.resultsGrid.innerHTML = html;
    }

    /**
     * Renders Full Naats (Kalams) Results Grid
     */
    function renderKalamSearchResults() {
        if (!dom.resultsGrid || !window.SearchEngine) return;

        const results = window.SearchEngine.searchKalams(
            state.searchQuery,
            state.bookFilter,
            state.catFilter,
            80
        );

        // Update status text
        if (dom.resultStatusText) {
            const countText = results.length >= 80 ? '80+' : results.length;
            if (state.searchQuery.trim()) {
                dom.resultStatusText.innerHTML = `Found <span class="status-count">${countText}</span> matching Naats for "<strong>${escapeHtml(state.searchQuery)}</strong>"`;
            } else {
                dom.resultStatusText.innerHTML = `Displaying <span class="status-count">${countText}</span> Full Naats across Bareilly Divans`;
            }
        }

        if (results.length === 0) {
            dom.resultsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📖</div>
                    <h3>No matching Naats found</h3>
                    <p>Try searching with another spelling, or switch to <strong>Couplets (Shers)</strong> mode to search individual lines.</p>
                </div>
            `;
            return;
        }

        let html = '';
        for (let i = 0; i < results.length; i++) {
            const res = results[i];
            const k = res.kalam;
            const isKalamStarred = state.kalamBookmarks.has(k.id);
            const highlightedTitle = window.SearchEngine.highlight(escapeHtml(k.title), state.searchQuery);
            const matla = k.shers.length > 0 ? k.shers[0] : null;
            const matlaRoman = matla ? window.SearchEngine.highlight(escapeHtml(matla.roman), state.searchQuery) : '';
            const matlaEng = (matla && matla.english) ? window.SearchEngine.highlight(escapeHtml(matla.english), state.searchQuery) : '';

            // Check if match was in an internal verse (other than matla)
            const isInternalMatch = res.matchedSherIndex > 1 && res.matchedSher;
            const matchedSherRoman = isInternalMatch ? window.SearchEngine.highlight(escapeHtml(res.matchedSher.roman), state.searchQuery) : '';

            html += `
                <div class="kalam-card" data-book="${k.book_id}">
                    <div class="kalam-title-row">
                        <div>
                            <div class="kalam-badge-group">
                                <span class="tag-badge book-badge">📖 ${escapeHtml(k.book_title)}</span>
                                <span class="tag-badge cat-badge">${escapeHtml(k.category)}</span>
                                <span class="tag-badge page-badge">Pg. ${k.start_page}</span>
                                <span class="kalam-verse-count-badge">${k.shers.length} Couplets</span>
                            </div>
                            <div class="kalam-title-text" style="margin-top: 8px;">
                                ✨ ${highlightedTitle}
                            </div>
                        </div>
                        <button class="btn-icon-action ${isKalamStarred ? 'starred' : ''}" 
                                title="${isKalamStarred ? 'Remove from Recitation Deck' : 'Bookmark Full Naat'}"
                                onclick="window.App.toggleKalamBookmark('${k.id}', this)">
                            ${isKalamStarred ? '⭐' : '☆'}
                        </button>
                    </div>

                    ${k.intro_note ? `
                        <div class="kalam-intro-note" style="margin: 0; padding: 8px 12px; font-size: 0.8rem;">
                            <span class="note-icon">ℹ️</span>
                            <div>${escapeHtml(k.intro_note)}</div>
                        </div>
                    ` : ''}

                    <!-- Matla Display Box -->
                    <div class="kalam-matla-box">
                        <div class="kalam-matla-label">Opening Verse (Matla):</div>
                        <div class="kalam-matla-text">${matlaRoman}</div>
                        ${matlaEng ? `<div class="kalam-matla-eng">🇬🇧 ${matlaEng}</div>` : ''}
                    </div>

                    <!-- Internal Verse Match Snippet (If matched deep in poem) -->
                    ${isInternalMatch ? `
                        <div class="kalam-match-snippet">
                            <div class="kalam-match-badge">🎯 Matching Line in Couplet #${res.matchedSherIndex}:</div>
                            <div class="kalam-snippet-text">${matchedSherRoman}</div>
                        </div>
                    ` : ''}

                    <div class="author-attribution" style="margin-top: 2px;">✍️ ${escapeHtml(k.author)}</div>

                    <div class="card-bottom-actions">
                        <div class="share-btns">
                            <button class="action-btn-primary" onclick="window.App.shareFullKalamToWhatsApp('${k.id}')">
                                📲 WhatsApp
                            </button>
                            <button class="action-btn-secondary" onclick="window.App.copyFullKalam('${k.id}')">
                                📋 Copy All
                            </button>
                        </div>
                        <button class="btn-open-kalam" style="background: var(--accent-gold); color: #06110a; font-weight: 700;"
                                onclick="window.App.openDiwanReader('${k.id}', ${res.matchedSherIndex})">
                            📖 Read Full Naat (${k.shers.length}) →
                        </button>
                    </div>
                </div>
            `;
        }

        dom.resultsGrid.innerHTML = html;
    }

    /**
     * Build the Interactive Book Browser (Table of Contents)
     */
    function buildBookBrowser() {
        if (!dom.browserContainer || !window.NAAT_LIBRARY) return;

        const books = window.NAAT_LIBRARY.metadata.books;
        const kalams = window.NAAT_LIBRARY.kalams;

        let html = `
            <div style="margin-bottom: 20px;">
                <h2 style="color: var(--text-gold); font-size: 1.4rem; margin-bottom: 6px;">📚 Complete Canonical Book Index</h2>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Browse the Table of Contents across all 4 foundational books. Tap any poem to open the full reader with translations.</p>
            </div>
        `;

        for (let b = 0; b < books.length; b++) {
            const book = books[b];
            const bookKalams = kalams.filter(k => k.book_id === book.id);

            html += `
                <div class="book-accordion">
                    <div class="book-accordion-header" onclick="window.App.toggleAccordion(this)">
                        <div class="book-acc-title">
                            <span style="font-size: 1.3rem;">📖</span>
                            <span>${escapeHtml(book.title)} (${book.urdu_title})</span>
                        </div>
                        <div class="book-acc-badge">
                            <span>${bookKalams.length} Kalams ▾</span>
                        </div>
                    </div>
                    <div class="book-kalam-list">
            `;

            for (let k = 0; k < bookKalams.length; k++) {
                const item = bookKalams[k];
                html += `
                    <div class="kalam-toc-item" onclick="window.App.openDiwanReader('${item.id}', 1)">
                        <div>
                            <strong>#${item.kalam_number}.</strong> ${escapeHtml(item.title)}
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                                ${item.category} • ${item.shers.length} couplets
                            </div>
                        </div>
                        <div style="font-family: monospace; font-size: 0.8rem; color: var(--accent-gold);">
                            Pg. ${item.start_page} →
                        </div>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        }

        dom.browserContainer.innerHTML = html;
    }

    /**
     * Toggle Accordion in Book Browser
     */
    function toggleAccordion(headerEl) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const list = headerEl.nextElementSibling;
        if (list) {
            list.classList.toggle('open');
            const arrowSpan = headerEl.querySelector('.book-acc-badge span');
            if (arrowSpan) {
                arrowSpan.textContent = list.classList.contains('open') ? 
                    arrowSpan.textContent.replace('▾', '▴') : 
                    arrowSpan.textContent.replace('▴', '▾');
            }
        }
    }

    /**
     * Open Full-Page Dedicated Diwan Reader (No Modals, Minimal Scrolling)
     */
    function openDiwanReader(kalamId, targetSherIndex = 1) {
        if (!dom.diwanReaderView || !window.NAAT_LIBRARY) return;
        if (window.AudioSFX) window.AudioSFX.playClick();

        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return;

        state.activeKalamId = kalamId;
        state.previousScrollY = window.scrollY;
        state.activeView = 'diwan';

        // 1. Hide search hero, results container, and browser container
        if (dom.searchHero) dom.searchHero.style.display = 'none';
        if (dom.resultsContainer) dom.resultsContainer.style.display = 'none';
        if (dom.browserContainer) dom.browserContainer.style.display = 'none';

        // 2. Unhide Diwan Reader View
        dom.diwanReaderView.style.display = 'block';

        // 3. Populate Header Info
        if (dom.diwanTitle) dom.diwanTitle.textContent = kalam.title;
        if (dom.diwanBookBadge) dom.diwanBookBadge.textContent = `📖 ${kalam.book_title}`;
        if (dom.diwanAuthorBadge) dom.diwanAuthorBadge.textContent = `✍️ ${kalam.author}`;
        if (dom.diwanPageBadge) dom.diwanPageBadge.textContent = `Pg. ${kalam.start_page}`;
        if (dom.diwanVerseCount) dom.diwanVerseCount.textContent = `${kalam.shers.length} Couplets`;

        // 4. Sync UI Controls
        syncDiwanBookmarkUI();
        syncDiwanTranslationUI();

        if (dom.diwanVersesContainer) {
            dom.diwanVersesContainer.style.fontSize = `${state.diwanFontSize}px`;
        }

        // 5. Sequential Navigation Flipper
        const bookKalams = window.NAAT_LIBRARY.kalams.filter(k => k.book_id === kalam.book_id);
        const currentIdx = bookKalams.findIndex(k => k.id === kalamId);

        if (dom.diwanChapIndicator) {
            dom.diwanChapIndicator.textContent = `${kalam.book_title} — Kalam ${currentIdx + 1} of ${bookKalams.length}`;
        }
        if (dom.diwanPrevBtn) {
            dom.diwanPrevBtn.disabled = (currentIdx <= 0);
        }
        if (dom.diwanNextBtn) {
            dom.diwanNextBtn.disabled = (currentIdx >= bookKalams.length - 1);
        }

        // 6. Intro Note & Footnote
        if (dom.diwanIntroNote) {
            if (kalam.intro_note) {
                dom.diwanIntroNote.style.display = 'flex';
                dom.diwanIntroNote.innerHTML = `<span class="note-icon">ℹ️</span><div>${escapeHtml(kalam.intro_note)}</div>`;
            } else {
                dom.diwanIntroNote.style.display = 'none';
            }
        }
        if (dom.diwanFootnote) {
            if (kalam.footnote) {
                dom.diwanFootnote.style.display = 'flex';
                dom.diwanFootnote.innerHTML = `<span class="note-icon">📜</span><div>${escapeHtml(kalam.footnote)}</div>`;
            } else {
                dom.diwanFootnote.style.display = 'none';
            }
        }

        // 7. Render Continuous Single-Column Poetry Flow (Left-Aligned, Minimal Spacing)
        if (dom.diwanVersesContainer) {
            let vHtml = '';
            for (let i = 0; i < kalam.shers.length; i++) {
                const s = kalam.shers[i];
                const isTarget = (targetSherIndex && s.sher_index === Number(targetSherIndex));

                vHtml += `
                    <div class="diwan-stanza-row ${isTarget ? 'target-verse-highlight' : ''}" id="diwan-verse-${s.sher_index}">
                        <div class="diwan-stanza-num">${s.sher_index}</div>
                        <div class="diwan-stanza-text">
                            <div class="diwan-misra-line">${escapeHtml(s.roman)}</div>
                            ${s.english ? `<div class="diwan-trans-line">🇬🇧 ${escapeHtml(s.english)}</div>` : ''}
                        </div>
                    </div>
                `;
            }
            dom.diwanVersesContainer.innerHTML = vHtml;
        }

        // 8. Scroll to Target Verse or Top
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (targetSherIndex && targetSherIndex > 1) {
            setTimeout(() => {
                const targetEl = document.getElementById(`diwan-verse-${targetSherIndex}`);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 120);
        }

        // 9. Update URL Deep Link
        try {
            history.replaceState({ view: 'diwan', kalamId: kalamId }, '', `#kalam=${kalamId}&verse=${targetSherIndex || 1}`);
        } catch (e) {}
    }

    /**
     * Close Full-Page Diwan Reader and Return to Search
     */
    function closeDiwanReader() {
        if (!dom.diwanReaderView) return;
        if (window.AudioSFX) window.AudioSFX.playClick();

        state.activeKalamId = null;
        state.activeView = 'search';

        dom.diwanReaderView.style.display = 'none';
        if (dom.searchHero) dom.searchHero.style.display = 'block';
        if (dom.resultsContainer) dom.resultsContainer.style.display = 'block';

        // Clean URL hash without reload
        try {
            if (window.location.hash.startsWith('#kalam=')) {
                history.replaceState({ view: 'search' }, '', window.location.pathname + window.location.search);
            }
        } catch (e) {}

        // Restore scroll position
        window.scrollTo({ top: state.previousScrollY || 0, behavior: 'auto' });
    }

    /**
     * Handle Browser Back/Forward navigation
     */
    function handlePopState(e) {
        if (window.location.hash.startsWith('#kalam=')) {
            checkUrlDeepLink();
        } else if (state.activeView === 'diwan') {
            closeDiwanReader();
        }
    }

    /**
     * Sequential Chapter Navigation (Prev / Next Kalam)
     */
    function navigateSequentialKalam(direction) {
        if (!state.activeKalamId || !window.NAAT_LIBRARY) return;
        const currentKalam = window.NAAT_LIBRARY.kalams.find(k => k.id === state.activeKalamId);
        if (!currentKalam) return;

        const bookKalams = window.NAAT_LIBRARY.kalams.filter(k => k.book_id === currentKalam.book_id);
        const currentIdx = bookKalams.findIndex(k => k.id === state.activeKalamId);
        const targetIdx = currentIdx + direction;

        if (targetIdx >= 0 && targetIdx < bookKalams.length) {
            openDiwanReader(bookKalams[targetIdx].id, 1);
        }
    }

    /**
     * URL Deep Link Handler
     */
    function checkUrlDeepLink() {
        const hash = window.location.hash;
        if (!hash || !hash.startsWith('#kalam=')) return;

        const params = new URLSearchParams(hash.substring(1));
        const kalamId = params.get('kalam');
        const verse = parseInt(params.get('verse') || '1', 10);

        if (kalamId && window.NAAT_LIBRARY) {
            openDiwanReader(kalamId, verse);
        }
    }

    /**
     * Open Recitation Deck Drawer
     */
    function openRecitationDeck() {
        if (!dom.deckDrawer || !dom.deckBackdrop) return;
        renderRecitationDeck();
        dom.deckDrawer.classList.add('active');
        dom.deckBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close Recitation Deck Drawer
     */
    function closeRecitationDeck() {
        if (dom.deckDrawer && dom.deckBackdrop) {
            dom.deckDrawer.classList.remove('active');
            dom.deckBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Render Bookmarked Shers & Kalams inside Recitation Deck
     */
    function renderRecitationDeck() {
        if (!dom.deckBody || !window.NAAT_LIBRARY) return;

        const bookmarkedSherKeys = Array.from(state.bookmarks);
        const bookmarkedKalamKeys = Array.from(state.kalamBookmarks);

        if (dom.deckSherTabCount) dom.deckSherTabCount.textContent = bookmarkedSherKeys.length;
        if (dom.deckKalamTabCount) dom.deckKalamTabCount.textContent = bookmarkedKalamKeys.length;

        if (dom.deckCountText) {
            dom.deckCountText.textContent = `${bookmarkedSherKeys.length + bookmarkedKalamKeys.length} Saved`;
        }

        // Render Saved Couplets Tab
        if (state.activeDeckTab === 'shers') {
            if (bookmarkedSherKeys.length === 0) {
                dom.deckBody.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⭐</div>
                        <h3>No saved couplets yet</h3>
                        <p>Tap the star icon on any couplet during search to save it to your personal recitation deck for gatherings.</p>
                    </div>
                `;
                return;
            }

            let html = '';
            for (let i = 0; i < bookmarkedSherKeys.length; i++) {
                const [kId, sIdxStr] = bookmarkedSherKeys[i].split(':');
                const sIdx = parseInt(sIdxStr, 10);
                const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kId);
                if (!kalam) continue;
                const sher = kalam.shers.find(s => s.sher_index === sIdx);
                if (!sher) continue;

                html += `
                    <div class="recite-card" data-book="${kalam.book_id}">
                        <div class="card-header-meta">
                            <span class="tag-badge book-badge">📖 ${escapeHtml(kalam.book_title)}</span>
                            <span class="tag-badge page-badge">Pg. ${sher.page}</span>
                            <button class="btn-icon-action starred" title="Remove" 
                                    onclick="window.App.removeBookmark('${kId}', ${sIdx})">
                                ❌
                            </button>
                        </div>
                        <div class="kalam-title-sub">✨ ${escapeHtml(kalam.title)}</div>
                        <div class="sher-couplet-text">${escapeHtml(sher.roman)}</div>
                        ${sher.english ? `<div class="sher-english">🇬🇧 ${escapeHtml(sher.english)}</div>` : ''}
                        <div class="card-bottom-actions">
                            <button class="action-btn-primary" onclick="window.App.shareToWhatsApp('${kId}', ${sIdx})">
                                📲 WhatsApp
                            </button>
                            <button class="action-btn-secondary" onclick="window.App.copySher('${kId}', ${sIdx})">
                                📋 Copy
                            </button>
                        </div>
                    </div>
                `;
            }
            dom.deckBody.innerHTML = html;
        } 
        // Render Saved Full Naats Tab
        else {
            if (bookmarkedKalamKeys.length === 0) {
                dom.deckBody.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📖</div>
                        <h3>No saved full Naats yet</h3>
                        <p>Bookmark any complete Kalam while browsing or searching to keep it handy in your Recitation Deck.</p>
                    </div>
                `;
                return;
            }

            let html = '';
            for (let i = 0; i < bookmarkedKalamKeys.length; i++) {
                const kId = bookmarkedKalamKeys[i];
                const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kId);
                if (!kalam) continue;

                html += `
                    <div class="recite-card" data-book="${kalam.book_id}">
                        <div class="card-header-meta">
                            <span class="tag-badge book-badge">📖 ${escapeHtml(kalam.book_title)}</span>
                            <span class="tag-badge page-badge">Pg. ${kalam.start_page}</span>
                            <span class="kalam-verse-count-badge">${kalam.shers.length} Couplets</span>
                            <button class="btn-icon-action starred" title="Remove" 
                                    onclick="window.App.toggleKalamBookmark('${kId}')">
                                ❌
                            </button>
                        </div>
                        <div class="kalam-title-sub" style="font-size: 1.05rem; font-weight: 700;">✨ ${escapeHtml(kalam.title)}</div>
                        <div class="author-attribution">✍️ ${escapeHtml(kalam.author)}</div>
                        <div class="card-bottom-actions">
                            <button class="action-btn-primary" onclick="window.App.shareFullKalamToWhatsApp('${kId}')">
                                📲 WhatsApp
                            </button>
                            <button class="btn-open-kalam" style="background: var(--accent-gold); color: #06110a; font-weight: 700;"
                                    onclick="window.App.openDiwanReader('${kId}', 1)">
                                📖 Read Full Naat →
                            </button>
                        </div>
                    </div>
                `;
            }
            dom.deckBody.innerHTML = html;
        }
    }

    /**
     * Bookmark Helper Functions
     */
    function getSherKey(item) {
        return `${item.kalamId}:${item.sherIndex}`;
    }

    function toggleBookmark(kalamId, sherIndex, btnEl) {
        const key = `${kalamId}:${sherIndex}`;
        if (state.bookmarks.has(key)) {
            state.bookmarks.delete(key);
            if (btnEl) {
                btnEl.classList.remove('starred');
                btnEl.textContent = '☆';
            }
            showToast('Removed couplet from Recitation Deck');
        } else {
            state.bookmarks.add(key);
            if (btnEl) {
                btnEl.classList.add('starred');
                btnEl.textContent = '⭐';
            }
            if (window.AudioSFX) window.AudioSFX.playSuccess();
            showToast('Couplet saved to Recitation Deck ⭐');
        }
        saveBookmarks();
        updateDeckBadge();
    }

    function toggleKalamBookmark(kalamId, btnEl) {
        if (state.kalamBookmarks.has(kalamId)) {
            state.kalamBookmarks.delete(kalamId);
            if (btnEl) {
                btnEl.classList.remove('starred');
                btnEl.textContent = '☆';
            }
            showToast('Removed Naat from Recitation Deck');
        } else {
            state.kalamBookmarks.add(kalamId);
            if (btnEl) {
                btnEl.classList.add('starred');
                btnEl.textContent = '⭐';
            }
            if (window.AudioSFX) window.AudioSFX.playSuccess();
            showToast('Full Naat saved to Recitation Deck ⭐');
        }
        saveBookmarks();
        updateDeckBadge();
        syncDiwanBookmarkUI();
        if (dom.deckDrawer && dom.deckDrawer.classList.contains('active')) {
            renderRecitationDeck();
        }
    }

    function removeBookmark(kalamId, sherIndex) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const key = `${kalamId}:${sherIndex}`;
        state.bookmarks.delete(key);
        saveBookmarks();
        updateDeckBadge();
        renderRecitationDeck();
        renderSearchResults();
    }

    function saveBookmarks() {
        try {
            localStorage.setItem('roman_naat_bookmarks', JSON.stringify(Array.from(state.bookmarks)));
            localStorage.setItem('roman_naat_kalam_bookmarks', JSON.stringify(Array.from(state.kalamBookmarks)));
        } catch (e) {}
    }

    function updateDeckBadge() {
        if (dom.deckBadge) {
            dom.deckBadge.textContent = state.bookmarks.size + state.kalamBookmarks.size;
        }
    }

    /**
     * WhatsApp & Clipboard Sharing Engine
     */
    function formatSherForSharing(kalamId, sherIndex) {
        if (!window.NAAT_LIBRARY) return null;
        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return null;
        const sher = kalam.shers.find(s => s.sher_index === sherIndex);
        if (!sher) return null;

        let msg = `✨ *${kalam.book_title}*\n`;
        msg += `✍️ _${kalam.author}_\n`;
        msg += `📖 Page ${sher.page} | Kalam: *${kalam.title}*\n\n`;
        msg += `"${sher.roman}"\n`;

        if (sher.english) {
            msg += `\n🇬🇧 _${sher.english}_\n`;
        }

        msg += `\n— Shared via Roman Naat Studio`;
        return msg;
    }

    function shareToWhatsApp(kalamId, sherIndex) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const msg = formatSherForSharing(kalamId, sherIndex);
        if (!msg) return;

        const encoded = encodeURIComponent(msg);
        const url = `whatsapp://send?text=${encoded}`;
        
        window.location.href = url;
        setTimeout(() => {
            if (document.hasFocus()) {
                window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
            }
        }, 600);
    }

    function copySher(kalamId, sherIndex) {
        const msg = formatSherForSharing(kalamId, sherIndex);
        if (!msg) return;

        navigator.clipboard.writeText(msg).then(() => {
            if (window.AudioSFX) window.AudioSFX.playSuccess();
            showToast('Couplet copied for WhatsApp! 📋');
        }).catch(err => {
            console.error("Clipboard copy error:", err);
            showToast('Unable to copy to clipboard');
        });
    }

    function formatFullKalamText(kalam) {
        let msg = `✨ *${kalam.book_title}*\n`;
        msg += `✍️ _${kalam.author}_\n`;
        msg += `📖 Start Page ${kalam.start_page} | *${kalam.title}* (${kalam.shers.length} Couplets)\n\n`;

        if (kalam.intro_note) {
            msg += `ℹ️ _${kalam.intro_note}_\n\n`;
        }

        for (let i = 0; i < kalam.shers.length; i++) {
            const s = kalam.shers[i];
            msg += `[${s.sher_index}]\n${s.roman}\n`;
            if (s.english) {
                msg += `_${s.english}_\n`;
            }
            msg += `\n`;
        }

        if (kalam.footnote) {
            msg += `📜 _${kalam.footnote}_\n\n`;
        }

        msg += `— Shared via Roman Naat Studio`;
        return msg;
    }

    function copyFullKalam(kalamId) {
        if (!window.NAAT_LIBRARY) return;
        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return;

        const msg = formatFullKalamText(kalam);

        navigator.clipboard.writeText(msg).then(() => {
            if (window.AudioSFX) window.AudioSFX.playSuccess();
            showToast(`Entire Naat (${kalam.shers.length} couplets) copied! 📋`);
        }).catch(() => {
            showToast('Unable to copy to clipboard');
        });
    }

    function shareFullKalamToWhatsApp(kalamId) {
        if (!window.NAAT_LIBRARY) return;
        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return;

        if (window.AudioSFX) window.AudioSFX.playClick();
        const fullMsg = formatFullKalamText(kalam);

        // Check if message length exceeds WhatsApp URL limit (~3,200 chars)
        if (fullMsg.length > 3200) {
            // Copy full text to clipboard
            navigator.clipboard.writeText(fullMsg).then(() => {
                showToast(`Full Naat copied to clipboard! (Pasting into WhatsApp)`);
            }).catch(() => {});

            // Prepare summary for WhatsApp message
            let summaryMsg = `✨ *${kalam.book_title}*\n`;
            summaryMsg += `✍️ _${kalam.author}_\n`;
            summaryMsg += `📖 *${kalam.title}* (${kalam.shers.length} Couplets)\n\n`;

            const maxCoupletsToInclude = Math.min(8, kalam.shers.length);
            for (let i = 0; i < maxCoupletsToInclude; i++) {
                const s = kalam.shers[i];
                summaryMsg += `[${s.sher_index}]\n${s.roman}\n\n`;
            }

            summaryMsg += `...\n📋 *Note: The complete ${kalam.shers.length} couplets have been copied to your clipboard. Simply Paste (Ctrl+V) in this chat to send all!* \n\n— Shared via Roman Naat Studio`;

            const encoded = encodeURIComponent(summaryMsg);
            window.location.href = `whatsapp://send?text=${encoded}`;
            setTimeout(() => {
                if (document.hasFocus()) {
                    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
                }
            }, 600);
        } else {
            const encoded = encodeURIComponent(fullMsg);
            window.location.href = `whatsapp://send?text=${encoded}`;
            setTimeout(() => {
                if (document.hasFocus()) {
                    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
                }
            }, 600);
        }
    }

    /**
     * Toast Notification
     */
    let toastTimeout = null;
    function showToast(msg) {
        if (!dom.toastNotice) return;
        dom.toastNotice.textContent = msg;
        dom.toastNotice.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            dom.toastNotice.classList.remove('show');
        }, 2500);
    }

    /**
     * HTML Escaping utility
     */
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Public API for Inline Event Handlers
    window.App = {
        toggleBookmark: toggleBookmark,
        toggleKalamBookmark: toggleKalamBookmark,
        removeBookmark: removeBookmark,
        openDiwanReader: openDiwanReader,
        closeDiwanReader: closeDiwanReader,
        openKalamModal: openDiwanReader, // Alias for backward compatibility
        closeKalamModal: closeDiwanReader, // Alias for backward compatibility
        toggleDiwanColumns: toggleDiwanColumns,
        navigateSequentialKalam: navigateSequentialKalam,
        toggleAccordion: toggleAccordion,
        shareToWhatsApp: shareToWhatsApp,
        copySher: copySher,
        copyFullKalam: copyFullKalam,
        shareFullKalamToWhatsApp: shareFullKalamToWhatsApp
    };

    // DOM Ready Listener
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBootloader);
    } else {
        initBootloader();
    }

})();
