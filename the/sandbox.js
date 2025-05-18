console.log("✅ sandbox.js loaded");

window.addEventListener("message", (e) => {
  const msg = e.data;
  console.log("Sandbox received message:", msg);

  if (msg.how === 'store') {
    if (msg.put !== undefined) {
      localStorage.setItem(msg.get, JSON.stringify(msg.put));
    } else {
      const value = localStorage.getItem(msg.get);
      e.source.postMessage({
        how: 'store',
        to: msg.via,
        ack: msg.ack,
        ask: [JSON.parse(value)],
      }, '*');
    }
  }
});
