import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const parser = new DOMParser();
    const navdoc = parser.parseFromString(html, 'text/html');
    const navsections = Array.from(navdoc.querySelectorAll('body > div'));

    const nav = document.createElement('nav');
    const logo = document.createElement('div');
    logo.className = 'logo';

    // decorate nav DOM
    navsections.forEach((section) => {
      if (section.querySelector('ul')) {
        nav.innerHTML += section.innerHTML;
      } else {
        const a = section.querySelector('a');
        const icon = section.querySelector('picture');
        a.innerHTML = icon.outerHTML;
        logo.appendChild(a);
      }
    });

    // hamburger for mobile
    const hamburger = document.createElement('a');
    hamburger.href = '#';
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    block.appendChild(logo);
    block.appendChild(hamburger);
    block.appendChild(nav);
  }
}
