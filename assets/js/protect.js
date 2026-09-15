;(function() {
'use strict';

/* ============================================================
 * PUJA PORTFOLIO — HARDENED PROTECTION LAYER v2
 * ============================================================
 * Layers:
 *  1. CSS-level lock (user-select, pointer-events on html/body)
 *  2. Event interception (right-click, select, copy, cut, paste, drag)
 *  3. Keyboard lock (F12, Ctrl+Shift+I/J/C/U/S/P, Ctrl+A)
 *  4. DevTools detection (outerWindowSize, debugger trap, override)
 *  5. DOM tamper watchdog (MutationObserver + periodic check)
 *  6. Window/frame busting (prevent embed/iframe theft)
 *  7. Source viewer blocker (history API, beforeunload)
 * ============================================================ */

/* ---------- 1. CSS lockdown ---------- */
function cssLock() {
  var style = document.createElement('style');
  style.id = 'pj-lock';
  style.textContent = [
    'html,body{user-select:none!important;-webkit-user-select:none!important;',
    '-moz-user-select:none!important;-ms-user-select:none!important;',
    'pointer-events:auto!important;',
    '-webkit-touch-callout:none!important;}',
    'img,svg,canvas,video,audio{pointer-events:none!important;}',
    'a{cursor:default!important;}',
    '.cursor,.cursor-follower{pointer-events:none!important;}',
    '::selection{background:transparent!important;color:inherit!important;}'
  ].join('');
  (document.head || document.documentElement).appendChild(style);
}
cssLock();

/* ---------- 2. Event blockers ---------- */
var BLOCKERS = {
  contextmenu: function(e) {
    if (e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    alert('Right-click is disabled on this site.');
  },
  selectstart: true,
  copy: true,
  cut: true,
  paste: true,
  dragstart: true,
  drag: true,
  drop: true,
  mouseup: function(e) {
    if (e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    return false;
  },
  mousedown: function(e) {
    if (e.button === 2) {
      if (e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
      e.preventDefault();
      return false;
    }
  },
  touchstart: function(e) {
    if (e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    return false;
  },
  touchmove: function(e) {
    if (e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    return false;
  }
};

Object.keys(BLOCKERS).forEach(function(evt) {
  var fn = BLOCKERS[evt];
  if (typeof fn === 'function') {
    document.addEventListener(evt, fn, { passive: false, capture: true });
  } else {
    document.addEventListener(evt, function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false, capture: true });
  }
});

/* alert on right-click (only on non-interactive elements) */
document.addEventListener('contextmenu', function(e) {
  if (e.target.closest('a, button, input, textarea, select, [contenteditable], .hero-buttons')) return;
  e.preventDefault();
  e.stopPropagation();
  return false;
}, true);

/* ---------- 3. Keyboard lock ---------- */
document.addEventListener('keydown', function(e) {
  var k = e.key.toLowerCase();
  var ctrl = e.ctrlKey || e.metaKey;
  var shift = e.shiftKey;

  // F1-F12
  if (k.startsWith('f') && k.length > 1) { e.preventDefault(); return false; }
  // Ctrl+Shift+I/J/C/U/S/P/A
  if (ctrl && shift && /^[ijcusp]$/.test(k)) { e.preventDefault(); return false; }
  // Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+A
  if (ctrl && /^[uspa]$/.test(k)) { e.preventDefault(); return false; }
  // Alt+F4, Alt+Tab, Alt+Esc
  if (e.altKey && !e.ctrlKey) { e.preventDefault(); return false; }
}, true);

/* ---------- 4. DevTools detection ---------- */
var devOpen = false;
var sizeThreshold = 160;

function checkDevTools() {
  var wDiff = window.outerWidth - window.innerWidth > sizeThreshold;
  var hDiff = window.outerHeight - window.innerHeight > sizeThreshold;
  var ratio = window.outerWidth / Math.max(window.innerWidth, 1);
  var wide = ratio > 1.5 || ratio < 0.6;

  if (wDiff || hDiff || wide) {
    if (!devOpen) {
      devOpen = true;
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;' +
        'height:100vh;font-family:sans-serif;text-align:center;padding:2rem;' +
        'background:#0f172a;color:#f8fafc;font-size:1.2rem;">' +
        '<div><h1>🚫 Access Restricted</h1>' +
        '<p>Developer tools detected. This site cannot be viewed while DevTools is open.</p>' +
        '<p>Please close DevTools and refresh.</p></div></div>';
    }
  } else {
    devOpen = false;
  }
}

setInterval(checkDevTools, 1000);

// debugger trap
setInterval(function() {
  if (devOpen) return;
  var start = performance.now();
  debugger;
  var elapsed = performance.now() - start;
  if (elapsed > 100) {
    devOpen = true;
    document.body.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;' +
      'height:100vh;font-family:sans-serif;text-align:center;padding:2rem;' +
      'background:#0f172a;color:#f8fafc;font-size:1.2rem;">' +
      '<div><h1>🚫 Access Restricted</h1>' +
      '<p>Debugger detected. Please close DevTools and refresh.</p></div></div>';
  }
}, 3000);

/* ---------- 5. DOM tamper watchdog ---------- */
var protectionMark = 'data-pj-protected';
var protectionStyleId = 'pj-lock';

function protectAll() {
  cssLock();
  var els = document.querySelectorAll('body,header,nav,section,article,main,div,p,h1,h2,h3,h4,h5,h6,img,svg,canvas,video,audio,a[href],button,input,textarea,select');
  els.forEach(function(el) {
    if (!el.hasAttribute(protectionMark) && !el.classList.contains('cursor') && !el.classList.contains('cursor-follower') && el.id !== 'loading-screen' && !el.closest('.hero-buttons')) {
      el.setAttribute(protectionMark, '1');
      el.style.userSelect = 'none';
      el.style.webkitUserSelect = 'none';
      el.style.msUserSelect = 'none';
      el.style.mozUserSelect = 'none';
      el.style.webkitTouchCallout = 'none';
      el.ondragstart = function() { return false; };
      el.oncontextmenu = function() { return false; };
      el.onselectstart = function() { return false; };
      el.oncopy = function() { return false; };
      el.oncut = function() { return false; };
      el.onpaste = function() { return false; };
    }
  });
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(m) {
    m.removedNodes.forEach(function(node) {
      if (node.nodeType === 1 && (node.id === protectionStyleId || node.hasAttribute(protectionMark) || node === document.body)) {
        // Restore protection
        if (node.id === protectionStyleId) cssLock();
        protectAll();
      }
    });
  });
});
observer.observe(document.documentElement, { childList: true, subtree: true });

setInterval(protectAll, 2000);

/* ---------- 6. Frame busting ---------- */
if (window.top !== window.self) {
  window.top.location = window.self.location;
}

/* ---------- 7. Source viewer blocker ---------- */
window.addEventListener('beforeunload', function() {
  return 'You are leaving a protected site.';
});

/* ---------- init ---------- */
protectAll();
document.addEventListener('DOMContentLoaded', protectAll);

})();