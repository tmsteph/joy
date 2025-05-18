;(function(sr){
  sr = {ext: ((window.browser||window.chrome)||'').runtime};

  (function start(i){
    i = sr.i = document.createElement('iframe');
    i.className = 'SecureRender';
    i.style = "position: fixed; border: 0; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0;";
    i.sandbox = 'allow-scripts allow-same-origin allow-popups allow-downloads allow-pointer-lock';
    i.src = "./sandbox.html";
    document.body.appendChild(i);

    sr.send = function(msg){
      console.log("Sending to iframe:", msg);
      if (i.contentWindow) {
        i.contentWindow.postMessage(msg, '*');
      }
    };
  })();

  window.onmessage = function(eve){
    const msg = eve.data;
    if(!msg) return;
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

  window.addEventListener('storage', function(msg){
    sr.send({to: 1, get: msg.key, put: JSON.parse(msg.newValue), how: 'store'});
  });

}());
