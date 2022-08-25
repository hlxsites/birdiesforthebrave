import { createOptimizedPicture } from '../../scripts/scripts.js';

export default function decorate(block) {
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row, i) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);

    /* buttons for carousel-style cards */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      block.scrollTo({ top: 0, left: li.offsetLeft - li.parentNode.offsetLeft, behavior: 'smooth' });
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
    next.className = 'carousel-next';
    next.onclick = () => {
      const selected = buttons.querySelector('.selected');
      let nextnext = selected.nextElementSibling;
      if (!nextnext) {
        nextnext = next.nextElementSibling;
      }
      nextnext.click();
    };
    const prev = document.createElement('button');
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
  }
}
