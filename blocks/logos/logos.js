import { decorateIcons } from '../../scripts/scripts.js';

/**
 * Returns the "mirror" element of a list of sibling elements. The
 * parent of the element is assumed to have an even list of children.
 * This list is split in half, and the element is returned that is
 * at the same position of the current element in the other half of
 * the list.
 * @param {Element} element a DOM element
 * @returns {Element} the mirror element
 */
function mirror(element) {
  const parent = element.parentElement;
  const siblings = parent.children;
  const half = siblings.length / 2;
  const myindex = Array.prototype.indexOf.call(siblings, element);
  const mirrorindex = (myindex % half) + half;
  return siblings[mirrorindex];
}

export default async function decorate(block) {
  // we need to duplicate all children, so that we have
  // an overflow area for the carousel
  [...block.children].forEach((row) => {
    const overflow = row.cloneNode(true);
    overflow.className = 'overflow';
    block.append(overflow);
    row.querySelector('img').removeAttribute('loading');
  });

  const scroll = (direction) => {
    const current = block.querySelector('.selected') || block.firstElementChild;
    if (current === block.firstElementChild && direction === 'prev') {
      // prevent underscrolling by silently jumping to the first
      // overflow element, and then scroll to the left again
      const looparound = block.querySelector('.overflow');
      looparound.classList.add('selected');
      current.classList.remove('selected');
      block.scrollTo({ top: 0, left: looparound.offsetLeft - looparound.parentNode.offsetLeft, behavior: 'instant' });
      scroll('prev');
      return;
    }
    const next = direction === 'next' ? current.nextElementSibling : current.previousElementSibling;
    const currentmirror = mirror(current);
    const nextmirror = mirror(next);
    current.classList.remove('selected');
    next.classList.add('selected');
    currentmirror.classList.remove('mirror');
    nextmirror.classList.add('mirror');

    block.scrollTo({ top: 0, left: next.offsetLeft - next.parentNode.offsetLeft, behavior: 'smooth' });
    if (next.classList.contains('overflow')) {
      const looparound = block.firstElementChild;
      // go back to the first
      looparound.classList.add('selected');
      next.classList.remove('selected');
      setTimeout(() => {
        // this is a bit dirty, but we don't have a callback for the end of the
        // smooth scroll above so we have to wait a bit and them peform the sleight
        // of hand of scrolling back to the first element
        block.scrollTo({ top: 0, left: looparound.offsetLeft - looparound.parentNode.offsetLeft, behavior: 'instant' });
      }, 500);
    }
  };

  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';

  const next = document.createElement('button');
  next.className = 'carousel-next';
  next.innerHTML = '<span class="icon icon-arrow"/>';

  const prev = next.cloneNode(true);
  prev.className = 'carousel-prev';

  buttons.append(prev, next);
  block.parentElement.prepend(buttons);
  decorateIcons(buttons);

  const autoScroll = !block.classList.contains('stopped');
  if (autoScroll) {
    // scroll automatically
    const id = setInterval(() => {
      scroll('next');
    }, 1500);
    next.onclick = () => { clearInterval(id); scroll('next'); };
    prev.onclick = () => { clearInterval(id); scroll('prev'); };
  } else {
    next.onclick = () => { scroll('next'); };
    prev.onclick = () => { scroll('prev'); };
  }
}
