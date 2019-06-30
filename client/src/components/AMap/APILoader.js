let mainPromise = null;
let amapuiPromise = null;
let amapuiInited = false;

function getScriptSrc(cfg) {
  return `${cfg.protocol}://${cfg.hostAndPath}?v=${cfg.v}&key=${cfg.key}&callback=${cfg.callback}`;
}

function buildScriptTag(src) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = src;
  return script;
}

async function getAmapuiPromise(cfg) {
  const script = buildScriptTag(`${cfg.protocol}://webapi.amap.com/ui/1.0/main.js?v=1.0.11`);
  const p = new Promise((resolve) => {
    script.onload = () => {
      resolve();
    };
  });
  document.body.appendChild(script);
  return p;
}

function getLocaApiPromise(cfg) {
  const script = buildScriptTag(`${cfg.protocol}://webapi.amap.com/loca?v=1.3.0&key=${cfg.key}`);
  const p = new Promise((resolve) => {
    script.onload = () => {
      resolve();
    };
  });
  document.body.appendChild(script);
  return p;
}

function getMainPromise(config) {
  const script = buildScriptTag(getScriptSrc(config));
  const p = new Promise((resolve) => {
    window[config.callback] = () => {
      resolve();
      delete window[config.callback];
    };
  });
  document.body.appendChild(script);
  return p;
}

export {getMainPromise, getAmapuiPromise, getLocaApiPromise};
