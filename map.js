/*
  INTERACTIVE MAP
  This one file draws the map everywhere it appears: on the home page, on the Vision page,
  and in the "Explore the Map" drawer that opens from the tab on the right side of every page.
  Add or change a pin here and it updates everywhere.

  How to add a pin:
  - Copy one of the { ... } blocks below, paste it after the last one, and keep the commas between blocks.
  - "top" and "left" place the pin as a percent of the map image (0% is the top or left edge).
  - A pin with only top, left, and name shows as a plain dot. Add "label: true" to show the name as text instead, with no dot.
  - Add "details" to make the pin open a card with photos, a description, a walk time, and a link.
    Inside details, "tag", "link", and "video" are optional; delete any you do not need.
  - Photos for each place go in images/Interactive-Map/<Place name>/.
  - Use the style guide's shorthand names (The Townhomes, The Merc, The Meadow, and so on).
  - Walk times should be the real walk time for that spot, not a blanket "10 minutes" on every card.
*/

window.MIDDLEBROOK_MAP = {
  image: 'images/home/middlebrook-aerial-map.webp',
  // The Great Western Bike Trail, drawn over the map and lit up when its pin (trail: true) is hovered or tapped.
  // Points are "left,top" in percent, like the pins, traced from the client's markup along the tree line (October 28, 2026; upper stretch moved onto the tree belt, the run up to Main Street straightened along the edge of the old town to match the client's sharpie line, the stretch from the barn to the lower left traced onto the path drawn in the image, November 2, 2026).
  trail: '99.6,44.6 86,44.9 81,45.3 75,46.1 71.9,47.2 69.2,48.9 67.2,49.9 64.3,52.1 61.6,54.9 59.45,57.7 57.3,60.3 55.1,63 54.4,65.2 53.7,67.9 53.4,69.8 53,73 52.65,75.4 52.2,77.2 51,80.2 49.7,81.9 47.6,84 45.9,85.5 44.3,86.4 41.6,87.7 39.3,88.5 37.7,89.1 32.9,90.3 30,91 24,92.1 21.2,93.1 18.1,94 15.4,95.2 12.7,97 8.6,100',
  pins: [
    // Historic Cumming: text on the map, no dot or card (client, November 2, 2026)
    { top: 61, left: 59.3, name: 'Historic Cumming', label: true },
    // Future neighborhoods: text on the map, no dot or card (client, October 28, 2026)
    { top: 73.1, left: 38.5, name: 'Future neighborhood', label: true },
    { top: 79.7, left: 14.6, name: 'Future neighborhood', label: true },
    { top: 78.1, left: 75.8, name: 'Future neighborhood', label: true },
    // Positions placed by the client on October 28, 2026 (marked-up screenshot). Walk times are left off until measured.
    {
      top: 85.6, left: 27,
      name: 'Middlebrook Meadow',
      details: {
        tag: '50+ acres',
        photos: [
          { src: 'images/middlebrook-meadow-trailhead-map.webp', alt: 'Two children reading the Middlebrook Meadow trailhead map' },
          { src: 'images/middlebrook-meadow-trail-children.webp', alt: 'A family walking a mowed trail through the Meadow' },
          { src: 'images/middlebrook-meadow-native-grasses.webp', alt: 'Native grasses in Middlebrook Meadow' }
        ],
        description: 'Fifty-plus acres of native grasses, wildflowers, and quiet trails, with three trailheads.',
        walkLabel: 'Town Center Walkability',
        walkTime: '5 minutes',
        link: { text: 'Middlebrook Meadow', href: 'middlebrook-meadow.html' }
      }
    },
    {
      top: 72, left: 18,
      name: 'Wilson’s Orchard & Farm',
      details: {
        photos: [
          { src: 'images/middlebrook-wilsons-ciderhouse-exterior.webp', alt: 'The Ciderhouse at Wilson’s Orchard & Farm' },
          { src: 'images/middlebrook-wilsons-orchard-pond-barn.webp', alt: 'The pond and barn at Wilson’s Orchard' },
          { src: 'images/middlebrook-wilsons-orchard-tulip-rows.webp', alt: 'Rows of tulips at Wilson’s Orchard' }
        ],
        description: 'Pick-your-own fruit, a farm market and bakery, and wood-fired pizza and hard cider at the Ciderhouse.',
        walkLabel: 'Town Center Walkability',
        walkTime: '10 minutes',
        link: { text: 'Wilson’s Orchard & Farm', href: 'wilsons-orchard-and-farm.html' }
      }
    },
    {
      top: 62, left: 29.5,
      name: 'Middlebrook West Commercial',
      details: {
        tag: 'for sale',
        photos: [
          { src: 'images/middlebrook-west-commercial/middlebrook-west-commercial-aerial-caseys-fast-and-fresh.webp', alt: 'Aerial of Highway G14 and 15th Avenue with Casey’s on the corner and Hy-Vee Fast & Fresh across the road' },
          { src: 'images/middlebrook-west-commercial/middlebrook-west-commercial-lot-2-aerial-corner.webp', alt: 'Aerial view of Lot 2 at Highway G14 and 15th Avenue' },
          { src: 'images/middlebrook-west-commercial/middlebrook-west-commercial-aerial-caseys-hy-vee.webp', alt: 'Aerial view of the commercial site beside Casey’s, across from the Hy-Vee Distribution Center' }
        ],
        description: 'Casey’s, Starbucks, and Hy-Vee Fast & Fresh are already open at Highway G14 and 15th Avenue, just east of Interstate 35. One lot on this busy corner is still available: bring your own plan and build on your own timeline.',
        link: { text: 'Middlebrook West Commercial', href: 'middlebrook-west-commercial.html' }
      }
    },
    {
      top: 66.5, left: 51.4,
      name: 'The Cottages',
      details: {
        tag: 'geothermal',
        photos: [
          { src: 'images/cottages/middlebrook-cottages-street-rendering.jpg', alt: 'Rendering of the Cottages along a tree-lined street' },
          { src: 'images/cottages/middlebrook-cottage-two-story-exterior-rendering.jpg', alt: 'Rendering of a two-story cottage' },
          { src: 'images/cottages/middlebrook-cottage-one-story-kitchen-rendering.jpg', alt: 'Rendering of a one-story cottage kitchen' }
        ],
        description: 'Modern one- and two-story cottages with a private fenced patio yard, geothermal heating and cooling, and lawn care and snow removal covered by the HOA.',
        walkLabel: 'Town Center Walkability',
        walkTime: '2 minutes',
        link: { text: 'The Cottages', href: 'cottages.html' }
      }
    },
    {
      top: 79.5, left: 51.3, trail: true,
      name: 'Great Western Bike Trail',
      details: {
        photos: [
          { src: 'images/historic-cumming/middlebrook-great-western-bike-trail-summer.webp', alt: 'The Great Western Trail in summer, lined with trees' },
          { src: 'images/historic-cumming/middlebrook-great-western-bike-trail-path.webp', alt: 'The paved Great Western Trail curving through Middlebrook' }
        ],
        description: 'A paved trail on the old Chicago Great Western rail line, running right through the center of Middlebrook and on to Des Moines.',
        link: { text: 'Great Western Bike Trail', href: 'great-western-trail.html' }
      }
    },
    {
      top: 66, left: 56.7,
      name: 'The Town Center',
      details: {
        tag: 'solar powered',
        photos: [
          { src: 'images/town-center/middlebrook-town-center-lofts-peoples-company-farm-aerial.webp', alt: 'Aerial view of the Lofts and the Peoples Company building, with the Farm beyond' },
          { src: 'images/town-center/middlebrook-town-center-main-street-storefronts-sidewalk.webp', alt: 'The sidewalk along the Main Street storefronts' },
          { src: 'images/town-center/middlebrook-main-street-west-building-storefronts.webp', alt: 'The brick storefronts of the Lofts building on Main Street' }
        ],
        description: 'Where Middlebrook comes together: brick storefronts with the Lofts apartments upstairs, all heated and cooled by geothermal and powered by solar on their own roofs. Walk in to get a haircut, pick up a gift, or grab a cone after dinner.',
        link: { text: 'The Town Center', href: 'middlebrook-town-center.html' }
      }
    },
    {
      top: 66.2, left: 61.6,
      name: 'The Farmhouse',
      details: {
        tag: 'events',
        photos: [
          { src: 'images/farmhouse/middlebrook-farmhouse-front-porch-summer.jpg', alt: 'The Farmhouse front porch with white hydrangeas' },
          { src: 'images/farm-grounds/middlebrook-farmhouse-lawn-private-event-spring.jpg', alt: 'Guests at picnic tables on the Farmhouse lawn under a blooming tree' },
          { src: 'images/farmhouse/middlebrook-farmhouse-dining-table-flowers-fireplace.jpg', alt: 'The Farmhouse dining table set with flowers beside the fireplace' }
        ],
        description: 'A turn-of-the-century farmhouse on Middlebrook Farm. Host a shower, reunion, or dinner on the Farm Grounds, or book a weeknight stay.',
        link: { text: 'Farmhouse and Farm Grounds', href: 'farmhouse-and-farm-grounds.html' }
      }
    },
    {
      top: 66.2, left: 64,
      name: 'Fridays at the Farm',
      details: {
        tag: 'May to September',
        photos: [
          { src: 'images/home/Fridays-at-the-Farm/01-middlebrook-fridays-at-the-farm-band-on-porch.webp', alt: 'A band plays on the Farmhouse porch under string lights' },
          { src: 'images/home/Fridays-at-the-Farm/07-middlebrook-fridays-at-the-farm-children-at-fence.webp', alt: 'Children watch the festivities from a wooden fence' },
          { src: 'images/home/Fridays-at-the-Farm/11-middlebrook-fridays-at-the-farm-flower-garden-visitors.webp', alt: 'Visitors walk through the flower garden' }
        ],
        description: 'Live music, food trucks, and farmers’ market vendors on the Farm Grounds, every Friday from mid-May through September.',
        link: { text: 'Fridays at the Farm', href: 'fridays-at-the-farm.html' }
      }
    },
    {
      top: 68.4, left: 62.8,
      name: 'The Farm',
      details: {
        tag: 'town garden',
        photos: [
          { src: 'images/middlebrook-town-garden-aerial-windmill-high-tunnel.webp', alt: 'Aerial view of the Town Garden, windmill, and high tunnel' },
          { src: 'images/middlebrook-farm-stand-open-doors.webp', alt: 'The Farm Stand with its doors open and produce inside' },
          { src: 'images/middlebrook-you-pick-flower-field-black-eyed-susans.webp', alt: 'Black-eyed Susans in the you-pick flower field' }
        ],
        description: 'Two acres growing in the heart of the Town Center. Pick up fresh produce and eggs at the Farm Stand, say hello to the chickens, cut a bouquet in the you-pick flower field, or rent a garden plot of your own, even one in the high tunnel that grows all winter.',
        link: { text: 'The Town Garden', href: 'town-garden.html' }
      }
    },
    {
      top: 64.6, left: 68.3,
      name: 'The Merc',
      details: {
        photos: [
          { src: 'images/middlebrook-mercantile-schoolhouse-string-lights.webp', alt: 'Middlebrook Mercantile, a restored brick schoolhouse, under string lights' },
          { src: 'images/mercantile/middlebrook-mercantile-interior-brick-bar.webp', alt: 'The brick bar room inside the Mercantile' }
        ],
        description: 'Cocktails, wine, and local beer in Cumming’s 1900 one-room schoolhouse, with live music on weekends.',
        walkLabel: 'Town Center Walkability',
        walkTime: '1 minute',
        link: { text: 'The Merc', href: 'the-merc.html' }
      }
    },
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
        description: 'Zero-entry craftsman villas with the primary suite on the main level. Stay in a single-family home of your own, and leave the lawn care and snow removal to the HOA.',
        walkLabel: 'Town Center Walkability',
        walkTime: '5 minutes',
        link: { text: 'The Villas', href: 'villas.html' }
      }
    },
    {
      top: 62.4, left: 84.8,
      name: 'Mayor Tom Becker Park',
      details: {
        photos: [
          { src: 'images/mayor-tom-becker-park/middlebrook-mayor-tom-becker-park-barn-and-windmill-tower.webp', alt: 'The play barn and windmill climbing tower at Mayor Tom Becker Park' },
          { src: 'images/mayor-tom-becker-park/middlebrook-mayor-tom-becker-park-children-climbing-barn.webp', alt: 'Children climbing the play barn' },
          { src: 'images/mayor-tom-becker-park/middlebrook-mayor-tom-becker-park-tractor-play-sculpture.jpg', alt: 'The tractor play sculpture' }
        ],
        description: 'An agriculture-inspired playground, built like a little farm: climb the windmill tower and the hay bales, explore the play barn, and take the wheel of a tractor, all in the heart of Great Western Crossing.',
        walkLabel: 'Town Center Walkability',
        walkTime: '8 minutes',
        link: { text: 'Mayor Tom Becker Park', href: 'mayor-tom-becker-park.html' }
      }
    },
    {
      top: 58.6, left: 79.5,
      name: 'Great Western Crossing',
      details: {
        tag: 'homes and lots',
        photos: [
          { src: 'images/single-family/middlebrook-home-410-n-36th-st.webp', alt: 'A white farmhouse in Great Western Crossing with twin dormers and a covered front porch' },
          { src: 'images/great-western-crossing-exteriors/middlebrook-great-western-crossing-green-craftsman-front-porch.jpg', alt: 'A green craftsman home with a front porch' },
          { src: 'images/great-western-crossing-exteriors/middlebrook-great-western-crossing-park-pergola.webp', alt: 'The pergola in a Great Western Crossing park' }
        ],
        description: 'Middlebrook’s first neighborhood, where front porches line the streets and no two homes are the same, with Mayor Tom Becker Park at its heart. Find a new build or resale, or buy a lot and build with the builder you trust.',
        walkLabel: 'Town Center Walkability',
        walkTime: '10 minutes',
        link: { text: 'Single-family homes', href: 'single-family.html' }
      }
    }
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

  // Turns the trail's "left,top" points into one smooth curve (Catmull-Rom spline drawn as Bezier segments)
  const smoothPath = (points) => {
    const p = points.trim().split(/\s+/).map((pair) => pair.split(',').map(Number));
    if (p.length < 2) return '';
    let d = `M${p[0][0]},${p[0][1]}`;
    for (let i = 0; i < p.length - 1; i += 1) {
      const [p0, p1, p2, p3] = [p[i - 1] || p[i], p[i], p[i + 1], p[i + 2] || p[i + 1]];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  const renderPins = () => {
    renderCount += 1;
    const trail = map.trail ? `<svg class="map-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${smoothPath(map.trail)}"/></svg>` : '';
    return trail + map.pins.map((pin, i) => {
      const position = `top: ${Number(pin.top)}%; left: ${Number(pin.left)}%;`;
      const label = pin.name && !/^\[/.test(pin.name) ? ` aria-label="${esc(pin.name)}"` : '';
      if (pin.label) {
        return `<span class="map-label" style="${position}">${esc(pin.name)}</span>`;
      }
      if (!pin.details) {
        return `<div class="pin" style="${position}"${label}><span class="pin-ring"></span><span class="pin-dot"></span></div>`;
      }
      const side = (Number(pin.left) > 55 ? ' pin-flip' : '') + (pin.trail ? ' pin-trail' : '');
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
