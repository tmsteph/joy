console.log("✅ sandbox.js loaded");

var sr = {};
sr.how = {};

// Simple visual block renderer
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

// Listen for messages
window.addEventListener("message", function (e) {
  const msg = e.data;

  // If it's an array of blocks
  if (Array.isArray(msg)) {
    sr.how.view(msg);
    return;
  }

  // Optional: handle 'store' messages here if needed
});
