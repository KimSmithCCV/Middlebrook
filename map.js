/*
  INTERACTIVE MAP
  This one file draws the map everywhere it appears: on the home page, on the Vision page,
  and in the "Explore the Map" drawer that opens from the tab on the right side of every page.
  Add or change a pin here and it updates everywhere.

  How to add a pin:
  - Copy one of the { ... } blocks below, paste it after the last one, and keep the commas between blocks.
  - "top" and "left" place the pin as a percent of the map image (0% is the top or left edge).
  - A pin with only top, left, and name shows as a plain dot.
  - Add "details" to make the pin open a card with photos, a description, a walk time, and a link.
    Inside details, "tag", "link", and "video" are optional; delete any you do not need.
  - Photos for each place go in images/Interactive-Map/<Place name>/.
  - Use the style guide's shorthand names (The Townhomes, The Merc, The Meadow, and so on).
  - Walk times should be the real walk time for that spot, not a blanket "10 minutes" on every card.
*/

window.MIDDLEBROOK_MAP = {
  image: 'images/home/middlebrook-aerial-map.webp',
  pins: [
    { top: 72, left: 18, name: '[Place name]' },
    { top: 56, left: 30, name: '[Place name]' },
    { top: 52, left: 44, name: '[Place name]' },
    { top: 43, left: 60, name: '[Place name]' },
    {
      top: 65,
      left: 85,
      name: 'The Homestead Townhomes',
      details: {
        tag: 'geothermal',
        photos: [
          { src: 'images/Interactive-Map/Townhomes/01-middlebrook-homestead-townhomes-aerial-at-sunset.webp', alt: 'Aerial view of Middlebrook townhomes and walking paths at sunset' },
          { src: 'images/Interactive-Map/Townhomes/Two-story/02-middlebrook-homestead-townhomes-connected-exterior.webp', alt: 'Street view of connected Middlebrook townhomes with attached garages' },
          { src: 'images/Interactive-Map/Townhomes/One-story/03-middlebrook-homestead-townhome-exterior-white-gables.jpg', alt: 'Front entry and attached garage of a white Middlebrook townhome' },
          { src: 'images/Interactive-Map/Townhomes/One-story/04-middlebrook-homestead-townhome-living-room-entry.jpg', alt: 'Bright Middlebrook townhome living room beside the front entry' },
          { src: 'images/Interactive-Map/Townhomes/Two-story/05-middlebrook-homestead-townhome-kitchen-island-field-views.jpg', alt: 'Kitchen with a white island, pendant lights, and windows overlooking open fields in a Middlebrook townhome' },
          { src: 'images/Interactive-Map/Townhomes/One-story/06-middlebrook-homestead-townhome-kitchen-white-cabinetry.jpg', alt: 'White kitchen with an island in a Middlebrook townhome' },
          { src: 'images/Interactive-Map/Townhomes/Two-story/07-middlebrook-homestead-townhome-double-vanity-bathroom.webp', alt: 'Bathroom with a double vanity in a Middlebrook townhome' },
          { src: 'images/Interactive-Map/Townhomes/Two-story/08-middlebrook-homestead-townhome-open-plan-living-kitchen.webp', alt: 'Open-plan kitchen and living area in a Middlebrook townhome' },
          { src: 'images/Interactive-Map/Townhomes/09-middlebrook-homestead-townhomes-aerial.webp', alt: 'Aerial view of The Townhomes and surrounding neighborhood' }
        ],
        description: 'Attractive architectural curb appeal influenced by the simple, identifiable forms of traditional farmhouse vernacular. One- and two-story units ranging from two to three bedrooms.',
        walkLabel: 'Town Center Walkability',
        walkTime: '5 minutes',
        link: { text: 'Homestead Townhomes', href: 'townhomes.html' },
        video: {
          label: 'Watch the townhome tour',
          src: 'images/Interactive-Map/Townhomes/middlebrook-homestead-townhomes-video-tour.mp4',
          poster: 'images/Interactive-Map/Townhomes/01-middlebrook-homestead-townhomes-aerial-at-sunset.webp'
        }
      }
    },
    {
      top: 64.5,
      left: 78.5,
      name: 'The Villas at Great Western Crossing',
      details: {
        tag: 'zero entry',
        photos: [
          { src: 'images/villas/middlebrook-villas-brierwood-exterior.jpg', alt: 'A white Brierwood villa with a covered front porch and stone accents' },
          { src: 'images/villas/parkland-b/middlebrook-villa-parkland-b-2750-exterior-front.webp', alt: 'A Parkland B villa with green board and batten siding' },
          { src: 'images/villas/parkland-a/middlebrook-villa-parkland-a-2730-exterior.webp', alt: 'A Parkland A villa with a covered porch and a red front door' },
          { src: 'images/villas/brierwood/middlebrook-villa-brierwood-2870-great-room.webp', alt: 'A vaulted great room with a fireplace and tall windows' }
        ],
        description: 'Craftsman bungalow villas with the primary suite on the main level and a lower level you can finish now or later.',
        link: { text: 'The Villas', href: 'villas.html' }
      }
    },
    { top: 36, left: 76, name: '[Place name]' },
    { top: 60, left: 82, name: '[Place name]' }
  ]
};

(() => {
  const map = window.MIDDLEBROOK_MAP;
  if (!map) {
    return;
  }

  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const icon = {
    prev: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M8.5 1.5L4 6l4.5 4.5"/></svg>',
    next: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 1.5L8 6l-4.5 4.5"/></svg>',
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5L12 8l-7 4.5v-9Z"/></svg>',
    close: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>'
  };
  let renderCount = 0;

  const renderDetails = (pin, uid) => {
    const d = pin.details;
    const photos = d.photos || [];
    const gallery = photos.length ? `
      <div class="pin-gallery" aria-label="${esc(pin.name)} photos">
        ${photos.map((photo, i) => `<img class="pin-thumb" src="${esc(photo.src)}" alt="${esc(photo.alt || '')}" data-gallery-image${i ? ' hidden' : ''}>`).join('')}
        ${photos.length > 1 ? `
          <button class="pin-gallery-control pin-gallery-prev" type="button" aria-label="Previous ${esc(pin.name)} photo">${icon.prev}</button>
          <span class="pin-gallery-count" aria-live="polite">1 / ${photos.length}</span>
          <button class="pin-gallery-control pin-gallery-next" type="button" aria-label="Next ${esc(pin.name)} photo">${icon.next}</button>` : ''}
      </div>` : '';
    const video = d.video ? `
      <button class="pin-video-button" type="button" aria-haspopup="dialog">${icon.play}<span>${esc(d.video.label || 'Watch the video')}</span></button>` : '';
    const videoDialog = d.video ? `
      <dialog class="townhome-video-dialog" aria-labelledby="${uid}-video-title">
        <div class="townhome-video-heading">
          <h2 id="${uid}-video-title">${esc(pin.name)}</h2>
          <button class="townhome-video-close" type="button" aria-label="Close video">${icon.close}</button>
        </div>
        <video controls playsinline preload="none"${d.video.poster ? ` poster="${esc(d.video.poster)}"` : ''}>
          <source src="${esc(d.video.src)}" type="video/mp4">
          Your browser does not support embedded video.
        </video>
      </dialog>` : '';

    return `
      <div class="pin-tooltip" aria-label="${esc(pin.name)} details">
        ${d.tag ? `<span class="pin-tag">${esc(d.tag)}</span>` : ''}
        ${gallery}
        <div class="pin-copy">
          <strong>${esc(pin.name)}</strong>
          ${d.description ? `<p>${esc(d.description)}</p>` : ''}
          ${d.walkTime ? `<span class="pin-distance"><span class="pin-distance-label">${esc(d.walkLabel || 'Walk time')}</span><span class="pin-distance-value">${esc(d.walkTime)}</span></span>` : ''}
          ${d.link ? `<a href="${esc(d.link.href)}" class="underline-link">${esc(d.link.text)}</a>` : ''}
          ${video}
        </div>
        ${videoDialog}
      </div>`;
  };

  const renderPins = () => {
    renderCount += 1;
    return map.pins.map((pin, i) => {
      const position = `top: ${Number(pin.top)}%; left: ${Number(pin.left)}%;`;
      const label = pin.name && !/^\[/.test(pin.name) ? ` aria-label="${esc(pin.name)}"` : '';
      if (!pin.details) {
        return `<div class="pin" style="${position}"${label}><span class="pin-ring"></span><span class="pin-dot"></span></div>`;
      }
      const side = Number(pin.left) > 55 ? ' pin-flip' : '';
      return `<div class="pin pin-featured${side}" style="${position}" tabindex="0"${label}><span class="pin-ring"></span><span class="pin-dot"></span>${renderDetails(pin, `map${renderCount}-pin${i}`)}</div>`;
    }).join('');
  };

  // Maps placed in a page: <div class="map-photo" data-map-pins></div>
  document.querySelectorAll('[data-map-pins]').forEach((target) => {
    target.innerHTML = renderPins();
    target.style.backgroundImage = `url('${map.image}')`;
  });

  // Sitewide drawer: a tab on the right edge of every page that slides the map out.
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'map-tab';
  tab.setAttribute('aria-haspopup', 'dialog');
  tab.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15Z"/><circle cx="8" cy="6.5" r="1.8"/></svg><span>Explore the Map</span>';

  const drawer = document.createElement('dialog');
  drawer.className = 'map-drawer';
  drawer.setAttribute('aria-labelledby', 'map-drawer-title');
  drawer.innerHTML = `
    <div class="map-drawer-header">
      <h2 class="serif" id="map-drawer-title">Explore the Agrihood</h2>
      <button class="map-drawer-close" type="button" aria-label="Close map">${icon.close}</button>
    </div>
    <div class="map-drawer-body">
      <div class="map-drawer-map">
        <div class="map-photo" style="background-image: url('${esc(map.image)}')">${renderPins()}</div>
      </div>
      <p class="map-drawer-hint">Tap a glowing pin to learn more. On a phone, swipe sideways to see the whole map.</p>
    </div>`;

  document.body.append(tab, drawer);

  const openDrawer = () => {
    drawer.showModal();
    document.body.classList.add('map-drawer-open');
  };
  const closeDrawer = () => drawer.close();

  tab.addEventListener('click', openDrawer);
  drawer.querySelector('.map-drawer-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('close', () => {
    document.body.classList.remove('map-drawer-open');
    tab.focus();
  });
  // A click on the backdrop lands on the dialog element itself
  drawer.addEventListener('click', (event) => {
    if (event.target === drawer) {
      closeDrawer();
    }
  });

  // data-open-map="The Homestead Townhomes" opens the drawer on that pin (its card opens and it scrolls into view)
  document.querySelectorAll('[data-open-map]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openDrawer();
      const name = link.dataset.openMap;
      const pin = name && Array.from(drawer.querySelectorAll('.pin')).find((p) => p.getAttribute('aria-label') === name);
      if (pin) {
        requestAnimationFrame(() => {
          // Phones scroll the map sideways, so bring the pin into view there; on larger screens the whole map already shows
          if (window.matchMedia('(max-width: 720px)').matches) pin.scrollIntoView({ block: 'nearest', inline: 'center' });
          if (pin.classList.contains('pin-featured')) pin.focus({ preventScroll: true });
        });
      }
    });
  });

  // Links like href="#map" open the drawer on pages without a map of their own
  if (!document.getElementById('map')) {
    document.querySelectorAll('a[href$="#map"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openDrawer();
      });
    });
  }

  // Hide the tab while a page's own map is on screen
  const inlineMap = document.getElementById('map');
  if (inlineMap && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      tab.classList.toggle('is-hidden', entry.isIntersecting);
    }, { threshold: 0.25 }).observe(inlineMap);
  }
})();
