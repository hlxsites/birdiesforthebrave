import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  var previous = null;
  var firstUl = false;
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const footerHtml = template.content.firstChild;
  const footer = document.createElement('div');
  footer.classList.add('footer');
  while (footerHtml.firstChild) {
    const n = footerHtml.firstChild;
    footerHtml.removeChild(n);
    if ( n.nodeType === Node.ELEMENT_NODE ) {
      if ( firstUl ) {
        previous.append(n);
        firstUl = false;
      } else {
        if ( n.nodeName === 'UL') {
          firstUl = true;
        }
        const div = document.createElement('div');
        div.append(n);
        footer.append(div);
        previous = div;
      }
    }
  }
  await decorateIcons(footer);
  block.append(footer);
}
