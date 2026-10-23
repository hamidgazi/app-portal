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
        bookmarks: new Set(),
        theme: 'dark',
        activeView: 'search', // 'search' or 'browser'
        reciteFontSize: 20,
        activeKalamId: null
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
                searchInput: document.getElementById('search-input'),
                searchClearBtn: document.getElementById('search-clear-btn'),
                bookPills: document.querySelectorAll('.pill-btn[data-book]'),
                catPills: document.querySelectorAll('.cat-btn[data-cat]'),
                resultsGrid: document.getElementById('results-grid'),
                resultStatusText: document.getElementById('result-status-text'),
                resultsContainer: document.getElementById('results-container'),
                browserContainer: document.getElementById('browser-container'),
                
                // Header Nav Buttons
                themeToggleBtn: document.getElementById('theme-toggle-btn'),
                themeIcon: document.getElementById('theme-icon'),
                audioToggleBtn: document.getElementById('audio-toggle-btn'),
                audioIcon: document.getElementById('audio-icon'),
                browserToggleBtn: document.getElementById('browser-toggle-btn'),
                deckToggleBtn: document.getElementById('deck-toggle-btn'),
                deckBadge: document.getElementById('deck-badge'),
                
                // Full Kalam Modal
                kalamModal: document.getElementById('kalam-modal'),
                modalTitle: document.getElementById('modal-title'),
                modalMeta: document.getElementById('modal-meta'),
                modalBody: document.getElementById('modal-body'),
                modalCloseBtn: document.getElementById('modal-close-btn'),
                modalCopyAllBtn: document.getElementById('modal-copy-all-btn'),
                modalWhatsappAllBtn: document.getElementById('modal-whatsapp-all-btn'),
                
                // Recitation Deck Drawer
                deckDrawer: document.getElementById('deck-drawer'),
                deckBackdrop: document.getElementById('deck-backdrop'),
                deckCloseBtn: document.getElementById('deck-close-btn'),
                deckBody: document.getElementById('deck-body'),
                deckCountText: document.getElementById('deck-count-text'),
                zoomInBtn: document.getElementById('zoom-in-btn'),
                zoomOutBtn: document.getElementById('zoom-out-btn'),
                
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
            } else {
                console.warn("[Bootloader] NAAT_LIBRARY dataset not detected on window.");
            }
        } catch (err) {
            console.error("[Bootloader] SearchEngine indexing failure:", err);
        }

        // 3. Load Saved Bookmarks from LocalStorage
        try {
            const savedBookmarks = localStorage.getItem('roman_naat_bookmarks');
            if (savedBookmarks) {
                const arr = JSON.parse(savedBookmarks);
                state.bookmarks = new Set(arr);
                updateDeckBadge();
            }
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

        // 5. Bind User Interaction Listeners
        try {
            bindEvents();
        } catch (err) {
            console.error("[Bootloader] Event binding failure:", err);
        }

        // 6. Build Book Browser Table of Contents
        try {
            buildBookBrowser();
        } catch (err) {
            console.error("[Bootloader] Book browser build failure:", err);
        }

        // 7. Initial Search Render
        try {
            renderSearchResults();
        } catch (err) {
            console.error("[Bootloader] Initial search render failure:", err);
        }

        console.log("[Bootloader] Roman Naat Studio successfully mounted!");
    }

    /**
     * Bind all DOM UI events
     */
    function bindEvents() {
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

        // Modal Close Button
        if (dom.modalCloseBtn) {
            dom.modalCloseBtn.addEventListener('click', function () {
                if (window.AudioSFX) window.AudioSFX.playClick();
                closeKalamModal();
            });
        }
        if (dom.kalamModal) {
            dom.kalamModal.addEventListener('click', function (e) {
                if (e.target === dom.kalamModal) {
                    closeKalamModal();
                }
            });
        }

        // Full Kalam Copy & WhatsApp Buttons
        if (dom.modalCopyAllBtn) {
            dom.modalCopyAllBtn.addEventListener('click', function () {
                copyFullKalam(state.activeKalamId);
            });
        }
        if (dom.modalWhatsappAllBtn) {
            dom.modalWhatsappAllBtn.addEventListener('click', function () {
                shareFullKalamToWhatsApp(state.activeKalamId);
            });
        }

        // Escape Key Listener to Close Modals
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeKalamModal();
                closeRecitationDeck();
            }
        });
    }

    /**
     * Toggle View between 'search' and 'browser'
     */
    function toggleView(view) {
        state.activeView = view;
        if (view === 'browser') {
            if (dom.resultsContainer) dom.resultsContainer.style.display = 'none';
            if (dom.browserContainer) dom.browserContainer.style.display = 'block';
            if (dom.browserToggleBtn) {
                dom.browserToggleBtn.style.borderColor = 'var(--accent-gold)';
                dom.browserToggleBtn.innerHTML = '🔍 Search View';
            }
        } else {
            if (dom.resultsContainer) dom.resultsContainer.style.display = 'block';
            if (dom.browserContainer) dom.browserContainer.style.display = 'none';
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
     * Renders Search Results Grid
     */
    function renderSearchResults() {
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
                dom.resultStatusText.innerHTML = `Found <span class="status-count">${countText}</span> matching shers for "<strong>${escapeHtml(state.searchQuery)}</strong>"`;
            } else {
                dom.resultStatusText.innerHTML = `Displaying <span class="status-count">${countText}</span> shers across Bareilly Divans`;
            }
        }

        if (results.length === 0) {
            dom.resultsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No matching verses found</h3>
                    <p>Try searching for a different word, couplet line, or adjust your book filters.</p>
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
                                onclick="window.App.openKalamModal('${item.kalamId}')">
                            📖 Full Kalam
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
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Browse the Table of Contents across all 4 foundational books. Tap any poem to read all couplets in sequence.</p>
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
                    <div class="kalam-toc-item" onclick="window.App.openKalamModal('${item.id}')">
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
     * Open Full Kalam Modal
     */
    function openKalamModal(kalamId) {
        if (!dom.kalamModal || !window.NAAT_LIBRARY) return;
        if (window.AudioSFX) window.AudioSFX.playClick();

        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return;

        state.activeKalamId = kalamId;

        if (dom.modalTitle) {
            dom.modalTitle.textContent = kalam.title;
        }
        if (dom.modalMeta) {
            dom.modalMeta.textContent = `${kalam.book_title} | ${kalam.author} | Start Pg. ${kalam.start_page} | ${kalam.shers.length} Couplets`;
        }

        if (dom.modalBody) {
            let bodyHtml = '';
            if (kalam.intro_note) {
                bodyHtml += `
                    <div class="kalam-intro-note">
                        <span class="note-icon">ℹ️</span>
                        <div>${escapeHtml(kalam.intro_note)}</div>
                    </div>
                `;
            }

            for (let i = 0; i < kalam.shers.length; i++) {
                const s = kalam.shers[i];
                bodyHtml += `
                    <div class="full-kalam-sher-row">
                        <div class="sher-num-badge">${s.sher_index}</div>
                        <div class="sher-content-main">
                            <div class="sher-couplet-text" style="margin-bottom: 8px;">${escapeHtml(s.roman)}</div>
                            ${s.english ? `<div class="sher-english" style="margin-bottom: 8px;">🇬🇧 ${escapeHtml(s.english)}</div>` : ''}
                            <div style="display: flex; gap: 8px; margin-top: 6px;">
                                <button class="action-btn-secondary" style="min-height: 32px; padding: 4px 10px; font-size: 0.75rem;"
                                        onclick="window.App.copySher('${kalam.id}', ${s.sher_index})">
                                    📋 Copy
                                </button>
                                <button class="action-btn-primary" style="min-height: 32px; padding: 4px 10px; font-size: 0.75rem;"
                                        onclick="window.App.shareToWhatsApp('${kalam.id}', ${s.sher_index})">
                                    📲 WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            if (kalam.footnote) {
                bodyHtml += `
                    <div class="kalam-footnote">
                        <span class="note-icon">📜</span>
                        <div>${escapeHtml(kalam.footnote)}</div>
                    </div>
                `;
            }
            dom.modalBody.innerHTML = bodyHtml;
        }

        dom.kalamModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close Full Kalam Modal
     */
    function closeKalamModal() {
        if (dom.kalamModal) {
            dom.kalamModal.classList.remove('active');
            document.body.style.overflow = '';
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
     * Render Bookmarked Shers inside Recitation Deck
     */
    function renderRecitationDeck() {
        if (!dom.deckBody || !window.NAAT_LIBRARY) return;

        const bookmarkedKeys = Array.from(state.bookmarks);
        if (dom.deckCountText) {
            dom.deckCountText.textContent = `${bookmarkedKeys.length} Saved`;
        }

        if (bookmarkedKeys.length === 0) {
            dom.deckBody.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⭐</div>
                    <h3>No saved shers yet</h3>
                    <p>Tap the star icon on any couplet during search to save it to your personal recitation deck for gatherings and mehfils.</p>
                </div>
            `;
            return;
        }

        let html = '';
        for (let i = 0; i < bookmarkedKeys.length; i++) {
            const [kId, sIdxStr] = bookmarkedKeys[i].split(':');
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
            showToast('Removed from Recitation Deck');
        } else {
            state.bookmarks.add(key);
            if (btnEl) {
                btnEl.classList.add('starred');
                btnEl.textContent = '⭐';
            }
            if (window.AudioSFX) window.AudioSFX.playSuccess();
            showToast('Saved to Recitation Deck ⭐');
        }
        saveBookmarks();
        updateDeckBadge();
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
        } catch (e) {}
    }

    function updateDeckBadge() {
        if (dom.deckBadge) {
            dom.deckBadge.textContent = state.bookmarks.size;
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
        
        // Attempt native WhatsApp link first, fallback to web
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

    function copyFullKalam(kalamId) {
        if (!window.NAAT_LIBRARY) return;
        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return;

        let msg = `✨ *${kalam.book_title}*\n`;
        msg += `✍️ _${kalam.author}_\n`;
        msg += `📖 Start Page ${kalam.start_page} | *${kalam.title}*\n\n`;

        for (let i = 0; i < kalam.shers.length; i++) {
            const s = kalam.shers[i];
            msg += `[${s.sher_index}]\n${s.roman}\n`;
            if (s.english) {
                msg += `_${s.english}_\n`;
            }
            msg += `\n`;
        }
        msg += `— Shared via Roman Naat Studio`;

        navigator.clipboard.writeText(msg).then(() => {
            if (window.AudioSFX) window.AudioSFX.playSuccess();
            showToast('Entire Kalam copied for WhatsApp! 📋');
        }).catch(() => {
            showToast('Unable to copy to clipboard');
        });
    }

    function shareFullKalamToWhatsApp(kalamId) {
        if (!window.NAAT_LIBRARY) return;
        const kalam = window.NAAT_LIBRARY.kalams.find(k => k.id === kalamId);
        if (!kalam) return;

        let msg = `✨ *${kalam.book_title}*\n`;
        msg += `✍️ _${kalam.author}_\n`;
        msg += `📖 Start Page ${kalam.start_page} | *${kalam.title}*\n\n`;

        for (let i = 0; i < kalam.shers.length; i++) {
            const s = kalam.shers[i];
            msg += `[${s.sher_index}]\n${s.roman}\n`;
            if (s.english) {
                msg += `_${s.english}_\n`;
            }
            msg += `\n`;
        }
        msg += `— Shared via Roman Naat Studio`;

        const encoded = encodeURIComponent(msg);
        window.location.href = `whatsapp://send?text=${encoded}`;
        setTimeout(() => {
            if (document.hasFocus()) {
                window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
            }
        }, 600);
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
        }, 2400);
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
        removeBookmark: removeBookmark,
        openKalamModal: openKalamModal,
        closeKalamModal: closeKalamModal,
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
