import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const template = document.createRange().createContextualFragment(html).firstElementChild;
  const footer = document.createDocumentFragment();

  const logo = document.createElement('div');
  logo.append(template.firstElementChild);

  const legal = document.createElement('div');
  legal.append(template.firstElementChild);
  while (template.firstElementChild.childNodes.length > 2) {
    template.firstElementChild.lastChild.remove();
  }
  legal.append(template.firstElementChild);

  const social = document.createElement('div');
  social.append(template.firstElementChild);

  footer.append(logo);
  footer.append(legal);
  footer.append(social);

  block.append(footer);

  decorateIcons(block);
}
