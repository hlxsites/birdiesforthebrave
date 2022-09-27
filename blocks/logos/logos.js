export default async function decorate(block) {
  // we need to duplicate all children, so that we have
  // an overflow area for the carousel
  [...block.children].forEach((row) => {
    const overflow = row.cloneNode(true);
    overflow.className = 'overflow';
    block.append(overflow);
    row.querySelector("img").removeAttribute("loading");
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
    current.classList.remove('selected');
    next.classList.add('selected');

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


  // scroll automatically
  const id = setInterval(() => {
    scroll('next');
  }, 1500);

  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';

  const next = document.createElement('button');
  next.className = 'carousel-next';
  next.onclick = () => {clearInterval(id); scroll('next');};

  const prev = document.createElement('button');
  prev.className = 'carousel-prev';
  prev.onclick = () => {clearInterval(id); scroll('prev');};

  buttons.append(prev, next);
  block.parentElement.prepend(buttons);
}
