import { toClassName, readBlockConfig } from '../../scripts/scripts.js';

async function insertGallerySlides(block) {
  const damPrefix = 'https://www.pgatour.com';
  const config = readBlockConfig(block);
  const galleryURL = config.source;
  const limit = config.limit || 12;
  block.innerHTML = '';

  const directURL = `${galleryURL}&size=${limit}`;
  const resp = await fetch(`https://little-forest-58aa.david8603.workers.dev/?url=${encodeURIComponent(directURL)}`);
  const json = await resp.json();

  json.items.forEach((photo) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="gallery-image"><picture><img src="${damPrefix}${photo.image}" alt="${photo.description}"/ ></picture></div>
      <div class="gallery-text">
        <p class="gallery-text-title">Photo Gallery${config.title ? `: ${config.title}` : ''}</p>
        ${photo.description ? `<p class="gallery-text-desc">${photo.description}</p>` : ''}
        ${photo.credit ? `<p class="gallery-text-credit">Photo by <strong>${photo.credit}</strong></p>` : ''}
      </div>
    `;
    block.append(div);
  });
}

export default async function decorate(block) {
  const blockClasses = [...block.classList];
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  if (blockClasses.includes('course')) buttons.classList.add('course-buttons');
  /* gallery carousel */
  if (blockClasses.includes('gallery')) {
    buttons.classList.add('gallery-buttons');
    block.closest('.carousel-container').classList.add('gallery-container');
    await insertGallerySlides(block);
  }
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text'];
    classes.forEach((e, j) => {
      if (row.children[j]) row.children[j].classList.add(`carousel-${e}`);
    });
    if (i === 0) {
      const image = row.querySelector('.carousel-image');
      const text = row.querySelector('.carousel-text');

      const heroimage = document.querySelector('div.hero picture');
      const heroh1 = document.querySelector('div.hero h1');

      image.innerHTML = heroimage.outerHTML;
      text.prepend(heroh1.cloneNode(true));
    }
    /* buttons */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    });
    buttons.append(button);
  });
  block.parentElement.prepend(buttons);
}
