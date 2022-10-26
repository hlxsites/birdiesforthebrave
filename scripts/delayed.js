// eslint-disable-next-line import/no-cycle
import { sampleRUM, fetchPlaceholders } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
const placeholders = await fetchPlaceholders();
const isProd = window.location.hostname.endsWith('birdiesforthebrave.org');

function loadScript(url, callback, type) {
  const head = document.querySelector('head');
  if (!head.querySelector(`script[src="${url}"]`)) {
    const script = document.createElement('script');
    script.src = url;
    if (type) script.setAttribute('type', type);
    head.append(script);
    script.onload = callback;
    return script;
  }
  return head.querySelector(`script[src="${url}"]`);
}

/* setup cookie preferences */
function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const split = decodedCookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < split.length; i++) {
    let c = split[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return null;
}


const pageType = window.location.pathname === '/' ? 'homePage' : 'contentPage';

const pname = window.location.pathname.split('/').pop();

window.pgatour = window.pgatour || {};

window.pgatour.tracking = {
  branch: {
    apiKey: 'key_live_nnTvCBCejtgfn40wtbQ6ckiprsemNktJ',
    isWebView: 'false',
  },
  krux: {
    id: '',
  },
  indexExchange: {
    status: false,
  },
};

window.pgatour.Omniture = {
  properties: {
    pageName: `pgatour:birdiesforthebrave:${pname}`,
    eVar16: `pgatour:birdiesforthebrave:${pname}`,
    prop18: pageType,
    eVar1: 'pgatour',
    prop1: 'pgatour',
    prop2: 'r011',
    eVar2: 'r011',
    eVar6: window.location.href,
  },
  defineOmnitureVars: () => {
    if (window.s) {
      Object.assign(window.s, window.pgatour.Omniture.properties);
    }
  },
};

window.pgatour.docWrite = document.write.bind(document);

async function OptanonWrapper() {
  const geoInfo = window.Optanon.getGeolocationData();
  Object.keys(geoInfo).forEach((key) => {
    const cookieName = `PGAT_${key.charAt(0).toUpperCase() + key.slice(1)}`;
    const cookie = getCookie(cookieName);
    if (!cookie || cookie !== geoInfo[key]) document.cookie = `${cookieName}=${geoInfo[key]}`;
  });

  const prevOptIn = localStorage.getItem('OptIn_PreviousPermissions');
  if (prevOptIn) {
    try {
      const adobeSettings = JSON.parse(prevOptIn);
      if (adobeSettings.tempImplied) {
        localStorage.removeItem('OptIn_PreviousPermissions');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('OptIn_PreviousPermissions parse failed');
    }
  }

  loadScript(`https://assets.adobedtm.com/d17bac9530d5/90b3c70cfef1/launch-1ca88359b76c${isProd ? '.min' : ''}.js`, () => {
    dispatchEvent(new Event('load'));
  });
}

const otId = placeholders.onetrustId;
if (otId) {
  const cookieScript = loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js');
  cookieScript.setAttribute('data-domain-script', `${otId}${isProd ? '' : '-test'}`);

  window.OptanonWrapper = OptanonWrapper;
}
