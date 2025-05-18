console.log("✅ sandbox.js loaded");

var sr = sr || {};
sr.how = sr.how || {};

// Handles basic key-value storage sync
sr.how.store = function (msg, eve) {
  if (msg.put !== undefined) {
    localStorage.setItem(msg.get, JSON.stringify(msg.put));
  } else if (msg.get) {
    const value = JSON.parse(localStorage.getItem(msg.get));
    eve.source.postMessage({
      how: 'store',
      to: msg.via,
      ack: msg.ack,
      ask: [value],
    }, '*');
  }
};

// Renders basic visual layout blocks like in the screenshot
sr.how.view = function (list) {
  const container = document.getElementById('SecureRender');
  if (!container) return;

  list.forEach(change => {
    if (!change.name) return;

    let box = document.getElementById(change.name);
    if (!box) {
      box = document.createElement('div');
      box.id = change.name;
      box.textContent = change.fill || change.name;
      box.style.display = 'inline-block';
      box.style.padding = '0.3em 0.5em';
      box.style.margin = '0.3em';
      box.style.border = '1px solid #666';
      box.style.borderRadius = '4px';
      box.style.background = 'rgba(150,200,255,0.2)';
      box.style.fontSize = '0.85em';
      box.style.fontFamily = 'monospace';
      box.style.userSelect = 'none';
      box.title = change.name;
      container.appendChild(box);
    } else {
      box.textContent = change.fill || change.name;
    }
  });
};

// General message handler
window.addEventListener("message", function (e) {
  const msg = e.data;
  if (!msg) return;

  // Message is an array: view update
  if (Array.isArray(msg)) {
    sr.how.view(msg);
    return;
  }

  // Otherwise look for .how and call that
  if (msg.how && typeof sr.how[msg.how] === 'function') {
    sr.how[msg.how](msg, e);
  }
});
