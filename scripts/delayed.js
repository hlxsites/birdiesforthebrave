// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

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
  
  
  const pageType = window.location.pathname === '/' ? 'homePage' : 'contentPage';
  
  const pname = window.location.pathname.split('/').pop();

  window.OnetrustActiveGroups = ',C0002,';
  window.OptanonActiveGroups = ',C0002,';
  
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
  

if (!localStorage.getItem('OptIn_PreviousPermissions')) {
    const adobeSettings = {'aa': true, 'aam': true, 'ecid': true};
    adobeSettings.tempImplied = true;
    localStorage.setItem('OptIn_PreviousPermissions', JSON.stringify(adobeSettings));
}

loadScript(`https://assets.adobedtm.com/d17bac9530d5/90b3c70cfef1/launch-1ca88359b76c${isProd ? '.min' : ''}.js`);
