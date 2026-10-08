/* ============================================================
   LeafCraftPRO 2.0  -  front-end behaviour
   Vanilla JS, no dependencies, loaded with `defer`.
   Every feature degrades gracefully: with JS disabled the site
   still renders, navigates and reads perfectly.
   ============================================================ */
(function () {
    'use strict';

    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Sticky header shadow ---------- */
    var header = $('.site-header');
    if (header) {
        var onHeaderScroll = function () {
            header.classList.toggle('is-stuck', window.scrollY > 8);
        };
        window.addEventListener('scroll', onHeaderScroll, { passive: true });
        onHeaderScroll();
    }

    /* ---------- Mobile navigation ---------- */
    var navToggle = $('.nav-toggle');
    var mobileNav = $('.mobile-nav');
    var navBackdrop = $('.nav-backdrop');
    var navClose = $('.mobile-nav .nav-close');

    function setNav(open) {
        if (!mobileNav) return;
        mobileNav.classList.toggle('is-open', open);
        if (navBackdrop) navBackdrop.classList.toggle('is-open', open);
        if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
    }
    if (navToggle) navToggle.addEventListener('click', function () { setNav(true); });
    if (navClose) navClose.addEventListener('click', function () { setNav(false); });
    if (navBackdrop) navBackdrop.addEventListener('click', function () { setNav(false); });

    /* ---------- Search overlay ---------- */
    var searchOverlay = $('.search-overlay');

    function setSearch(open) {
        if (!searchOverlay) return;
        searchOverlay.classList.toggle('is-open', open);
        searchOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (open) {
            var input = $('input[name="q"]', searchOverlay);
            if (input) setTimeout(function () { input.focus(); }, 80);
        }
    }
    $$('.js-search-open').forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.preventDefault(); setSearch(true); });
    });
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function (e) {
            if (e.target === searchOverlay) setSearch(false);
        });
        var searchClose = $('.search-close', searchOverlay);
        if (searchClose) searchClose.addEventListener('click', function () { setSearch(false); });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        setNav(false);
        setSearch(false);
    });
    // Cmd/Ctrl + K opens search.
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            setSearch(true);
        }
    });

    /* ---------- Toast ---------- */
    function showToast(message, type) {
        var wrap = $('.flash-wrap');
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.className = 'flash-wrap';
            document.body.appendChild(wrap);
        }
        var el = document.createElement('div');
        el.className = 'alert alert-' + (type === 'error' ? 'error' : 'success');
        el.setAttribute('role', 'status');
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg><span></span>';
        $('span', el).textContent = message;
        wrap.appendChild(el);
        setTimeout(function () {
            el.style.transition = 'opacity .4s';
            el.style.opacity = '0';
            setTimeout(function () { el.remove(); }, 400);
        }, 4200);
    }

    /* ---------- Reading progress bar ---------- */
    var progress = $('.reading-progress');
    var articleBody = $('.article-body');
    if (progress && articleBody) {
        var updateProgress = function () {
            var rect = articleBody.getBoundingClientRect();
            var start = rect.top + window.scrollY;
            var total = rect.height - window.innerHeight * 0.6;
            var scrolled = window.scrollY - start + window.innerHeight * 0.25;
            var pct = total > 0 ? (scrolled / total) * 100 : 0;
            progress.style.width = Math.max(0, Math.min(100, pct)) + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    /* ---------- Table of contents active state ---------- */
    var tocLinks = $$('.toc a[href^="#"]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
        var headings = tocLinks
            .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
            .filter(Boolean);

        var tocObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                tocLinks.forEach(function (a) {
                    var isActive = a.getAttribute('href') === '#' + entry.target.id;
                    a.classList.toggle('is-active', isActive);
                    if (isActive) a.style.color = 'var(--green-700)';
                    else a.style.color = '';
                });
            });
        }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });

        headings.forEach(function (h) { tocObserver.observe(h); });
    }

    /* ---------- Quantity steppers ---------- */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.qty-input button');
        if (!btn) return;
        e.preventDefault();
        var wrap = btn.closest('.qty-input');
        var input = $('input', wrap);
        if (!input) return;
        var step = parseInt(input.getAttribute('step') || '1', 10);
        var min = parseInt(input.getAttribute('min') || '1', 10);
        var max = parseInt(input.getAttribute('max') || '99', 10);
        var val = parseInt(input.value || '1', 10);
        val += btn.dataset.action === 'plus' ? step : -step;
        input.value = Math.max(min, Math.min(max, val));
    });

    /* ---------- Product gallery ---------- */
    var pgMain = $('.pg-main img');
    if (pgMain) {
        $$('.pg-thumb').forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var inner = $('img', thumb);
                var src = thumb.dataset.full || (inner && inner.getAttribute('src'));
                var srcset = thumb.dataset.srcset || (inner && inner.getAttribute('srcset'));
                if (src) pgMain.setAttribute('src', src);
                if (srcset) pgMain.setAttribute('srcset', srcset);
                else pgMain.removeAttribute('srcset');
                $$('.pg-thumb').forEach(function (t) {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-pressed', 'false');
                });
                thumb.classList.add('is-active');
                thumb.setAttribute('aria-pressed', 'true');
            });
        });
    }

    /* ---------- Tabs ---------- */
    $$('.tab-nav').forEach(function (nav) {
        var scope = nav.parentElement;
        var buttons = $$('.tab-btn', nav);

        function activate(target, focus) {
            buttons.forEach(function (b) {
                var on = b.dataset.tab === target;
                b.classList.toggle('is-active', on);
                b.setAttribute('aria-selected', on ? 'true' : 'false');
                b.setAttribute('tabindex', on ? '0' : '-1');
                if (on && focus) b.focus();
            });
            $$('.tab-panel', scope).forEach(function (p) {
                var on = p.dataset.panel === target;
                p.classList.toggle('is-active', on);
                p.hidden = !on;
            });
        }

        buttons.forEach(function (btn, i) {
            btn.setAttribute('role', 'tab');
            btn.addEventListener('click', function () {
                activate(btn.dataset.tab, false);
                if (history.replaceState) history.replaceState(null, '', '#' + btn.dataset.tab);
            });
            btn.addEventListener('keydown', function (e) {
                var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                if (!dir) return;
                e.preventDefault();
                var next = buttons[(i + dir + buttons.length) % buttons.length];
                activate(next.dataset.tab, true);
            });
        });

        // Initial state: honour the URL hash, else the first tab.
        var wanted = location.hash ? location.hash.substring(1) : null;
        var hasWanted = wanted && buttons.some(function (b) { return b.dataset.tab === wanted; });
        var first = hasWanted ? wanted : (buttons.find(function (b) { return b.classList.contains('is-active'); }) || buttons[0]);
        if (first) activate(first.dataset.tab, false);
    });

    /* ---------- Rating input ---------- */
    var ratingInput = $('.rating-input');
    if (ratingInput) {
        var stars = $$('.ri-star', ratingInput);
        var paint = function (idx) {
            stars.forEach(function (s, i) {
                s.style.color = i <= idx ? 'var(--gold)' : 'var(--line)';
            });
        };
        $$('label', ratingInput).forEach(function (label, index) {
            label.addEventListener('mouseenter', function () { paint(index); });
        });
        ratingInput.addEventListener('mouseleave', function () {
            var checked = $('input:checked', ratingInput);
            paint(checked ? parseInt(checked.value, 10) - 1 : -1);
        });
    }

    /* ---------- Copy to clipboard ---------- */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-copy]');
        if (!btn) return;
        e.preventDefault();
        var text = btn.dataset.copy || window.location.href;
        var done = function () { showToast('Link copied to clipboard', 'success'); };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); done(); } catch (err) { /* ignore */ }
            ta.remove();
        }
    });

    /* ---------- Newsletter form (static-site friendly) ---------- */
    $$('form[data-newsletter]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = $('input[type="email"]', form);
            if (!input || !input.value) return;
            // A static build has no server to post to, so we hand the
            // subscription to the visitor's mail client instead of
            // silently dropping it.
            var subject = encodeURIComponent('Newsletter signup');
            var body = encodeURIComponent('Please add this address to the LeafCraftPRO newsletter: ' + input.value);
            window.location.href = 'mailto:' + (form.dataset.mailto || 'leafcraftpro@gmail.com') +
                '?subject=' + subject + '&body=' + body;
            showToast('Opening your email app to confirm', 'success');
            form.reset();
        });
    });

    /* ---------- Back to top ---------- */
    var toTop = $('.to-top');
    if (toTop) {
        var onTopScroll = function () {
            toTop.classList.toggle('is-visible', window.scrollY > 700);
        };
        window.addEventListener('scroll', onTopScroll, { passive: true });
        onTopScroll();
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Smooth in-view reveal ---------- */
    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

        $$('.reveal').forEach(function (el) { revealObserver.observe(el); });
    } else {
        $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Hero product carousel ---------- */
    /* One slide is visible at a time; the rest are hidden by CSS. With JS off
       the first slide keeps its `is-active` class from the server render, so
       the panel still shows a real, clickable product. */
    $$('[data-carousel]').forEach(function (root) {
        var slides = $$('[data-carousel-slide]', root);
        var dots = $$('[data-carousel-dot]', root);
        var prev = $('[data-carousel-prev]', root);
        var next = $('[data-carousel-next]', root);
        if (slides.length < 2) return;

        var index = 0;
        var timer = null;
        var DELAY = 5200;

        function show(i) {
            index = (i + slides.length) % slides.length;
            slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
            dots.forEach(function (d, n) {
                d.classList.toggle('is-active', n === index);
                if (n === index) { d.setAttribute('aria-current', 'true'); }
                else { d.removeAttribute('aria-current'); }
            });
        }

        function start() {
            // Autoplay is motion, so it is off for anyone who asked for less.
            if (reduceMotion || timer) return;
            timer = setInterval(function () { show(index + 1); }, DELAY);
        }
        function stop() {
            if (timer) { clearInterval(timer); timer = null; }
        }
        function go(i) { show(i); stop(); start(); }

        if (prev) prev.addEventListener('click', function () { go(index - 1); });
        if (next) next.addEventListener('click', function () { go(index + 1); });
        dots.forEach(function (d, n) {
            d.addEventListener('click', function () { go(n); });
        });

        // Pause while the visitor is reading or tabbing through it.
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', start);

        // Left/right arrows when the carousel has focus.
        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
        });

        // Touch: a short horizontal swipe moves one slide.
        var startX = null;
        root.addEventListener('touchstart', function (e) {
            startX = e.changedTouches[0].clientX;
            stop();
        }, { passive: true });
        root.addEventListener('touchend', function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) { show(index + (dx < 0 ? 1 : -1)); }
            startX = null;
            start();
        }, { passive: true });

        // Do not run a timer for a carousel nobody can see.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) start(); else stop();
                });
            }, { threshold: 0.2 }).observe(root);
        } else {
            start();
        }
    });

    /* ---------- External links get rel=noopener ---------- */
    $$('a[target="_blank"]').forEach(function (a) {
        var rel = a.getAttribute('rel') || '';
        if (rel.indexOf('noopener') === -1) a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
    });

    /* ---------- Expose a tiny public API ---------- */
    window.LeafCraft = { toast: showToast };
})();
