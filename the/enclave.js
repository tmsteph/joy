;(function(sr){
  sr = {ext: ((window.browser||window.chrome)||'').runtime};

  (function start(i){
    i = sr.i = document.createElement('iframe');
    i.className = 'SecureRender';
    i.style = "position: fixed; border: 0; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0;";
    i.sandbox = 'allow-scripts allow-popups allow-downloads allow-pointer-lock allow-same-origin';

    sr.send = function(msg){
      if (i.contentWindow) {
        i.contentWindow.postMessage(msg, '*');
      }
    };

    document.body.appendChild(i);

    if(sr.ext){
      i.src = "./sandbox.html"; // extension mode
      return;
    }

    // Skip localStorage sandbox caching during dev
    i.src = "./sandbox.html";

    // Optionally pre-cache sandbox.html + sandbox.js for faster load/fallback
    // Commented to avoid fetch errors during dev
    /*
    (async function(){
      try {
        const html = await (await fetch('./sandbox.html')).text();
        const js = await (await fetch('./sandbox.js')).text();
        localStorage.sandbox = html.replace('script src="./sandbox.js">', "script>"+js);
      } catch (e) {
        console.warn("Sandbox prefetch failed", e);
      }
    }());
    */
  }());

  // Handle messages
  window.onmessage = function(eve){
    const msg = eve.data;
    if(!msg) return;

    // Relay messages between iframe and app
    if (eve.source !== sr.i.contentWindow) {
      return sr.send(msg);
    }

    const handler = sr.how[msg.how];
    if(handler){
      handler(msg, eve);
    }
  };

  sr.how = {
    store: function(msg){
      if(msg.put !== undefined){
        localStorage.setItem(msg.get, JSON.stringify(msg.put));
      } else if(msg.get){
        const val = JSON.parse(localStorage.getItem(msg.get));
        sr.send({to: msg.via, ack: msg.ack, ask: [val], how: 'store'});
      }
    }
  };

  // Optionally support storage events
  window.addEventListener('storage', function(msg){
    sr.send({to: 1, get: msg.key, put: JSON.parse(msg.newValue), how: 'store'});
  });

  // Optional service worker integration (currently disabled)
  /*
  if(!sr.ext){ try {
    navigator.serviceWorker.addEventListener("message", push);
    (sr.pushed = new BroadcastChannel('service')).onmessage = push;
    function push(msg){
      msg = msg.data;
      if(msg.upgrade){
        console.log("upgrading sandbox!");
        localStorage.sandbox = '';
      }
    }
  } catch(e) { console.log(e); } }
  */

}());
