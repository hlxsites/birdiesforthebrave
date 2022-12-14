import { createOptimizedPicture, decorateIcons } from '../../scripts/scripts.js';

export default function decorate(block) {
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row, i) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    let overlayButton;
    [...li.children].forEach((div) => {
      if (div.querySelector('picture')) div.className = 'cards-card-image';
      else {
        div.className = 'cards-card-body';
        const links = div.getElementsByTagName('a');
        if (links && links.length > 0) {
          overlayButton = document.createElement('a');
          overlayButton.href = links[0].href;
          overlayButton.text = 'Learn more';
          overlayButton.className = 'callout-overlay-button';
        }
      }
    });
    if (block.classList.contains('overlay')) {
      const overlay = document.createElement('div');
      if (overlayButton) {
        overlay.append(overlayButton);
      }
      overlay.className = 'callout-overlay';
      li.insertBefore(overlay, li.children.item(0));
    }
    ul.append(li);

    /* buttons for carousel-style cards */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      ul.scrollTo({ top: 0, left: li.offsetLeft - li.parentNode.offsetLeft, behavior: 'smooth' });
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    });
    buttons.append(button);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  // next and previous buttons for carousel-style cards
  if (block.classList.contains('icons')) {
    const next = document.createElement('button');
    next.innerHTML = '<span class="icon icon-arrow"/>';
    next.className = 'carousel-next';
    next.onclick = () => {
      const selected = buttons.querySelector('.selected');
      let nextnext = selected.nextElementSibling;
      if (!nextnext) {
        nextnext = next.nextElementSibling;
      }
      nextnext.click();
    };
    const prev = next.cloneNode(true);
    prev.className = 'carousel-prev';
    prev.onclick = () => {
      const selected = buttons.querySelector('.selected');
      let prevprev = selected.previousElementSibling;
      if (prevprev === next) {
        prevprev = buttons.querySelector('button:last-child');
      }
      prevprev.click();
    };

    buttons.prepend(prev, next);
    block.parentElement.prepend(buttons);
    decorateIcons(buttons);
  }
}
