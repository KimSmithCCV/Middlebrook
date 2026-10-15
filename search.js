/*
  SITE SEARCH
  The search button in the menu bar (and the box on the 404 page) searches every page listed below,
  plus the homes in listings.js. It reads the pages themselves, so new sections and copy show up on their own.

  How to update it:
  - When a new page is added to the site, add its file name to PAGES. That is the only upkeep.
  - Search works on the live site and in the local preview (Preview Site.cmd). It cannot read pages
    opened straight from the folder (file://), so test it in the preview.
*/

window.MIDDLEBROOK_SEARCH_PAGES = [
  'index.html',
  'homes-for-sale.html',
  'geothermal.html',
  'vision.html',
  'press.html',
  'single-family.html',
  'lots.html',
  'design-guidelines.html',
  'floor-plans.html',
  'villas.html',
  'cottages.html',
  'townhomes.html',
  'town-garden.html',
  'middlebrook-meadow.html',
  'great-western-trail.html',
  'mayor-tom-becker-park.html',
  'fridays-at-the-farm.html',
  'smoke-and-sip-bbq-festival.html',
  'middlebrook-farmhouse.html',
  'farmhouse-and-farm-grounds.html',
  'private-photography.html',
  'mercantile-private-rental.html',
  'middlebrook-vacation-rental.html',
  'farm-to-table-dinners.html'
];

(() => {
  const pages = window.MIDDLEBROOK_SEARCH_PAGES || [];
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const clean = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  // Small words that would match almost everything
  const STOP = new Set(['the', 'and', 'for', 'of', 'to', 'in', 'at', 'on', 'is', 'a', 'an', 'or', 'with', 'my', 'me']);
  const queryWords = (query) => normalize(query).split(' ').filter((w) => w.length > 1 && !STOP.has(w));
  const normalize = (text) => clean(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');

  // Build the index once, the first time someone searches
  let indexPromise = null;
  const buildIndex = () => {
    if (indexPromise) return indexPromise;
    indexPromise = Promise.all(pages.map((url) => fetch(url)
      .then((response) => (response.ok ? response.text() : ''))
      .catch(() => '')
      .then((html) => {
        if (!html) return [];
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const main = doc.querySelector('main');
        if (!main) return [];
        // Page name from the <title> ("Fridays at the Farm | Middlebrook..."), so the home page reads "Home"
        const titleTag = clean((doc.querySelector('title') || {}).textContent).split(' | ')[0];
        const pageTitle = url === 'index.html' ? 'Home' : titleTag;
        const lede = clean((main.querySelector('.page-hero-lede, .split-hero-lede, .hero p, p') || {}).textContent);
        const entries = [{ kind: 'page', page: pageTitle, title: pageTitle, snippet: lede, href: url, text: normalize(`${pageTitle} ${lede}`) }];

        // One entry per section heading, linked straight to that heading on the page
        main.querySelectorAll('section').forEach((section) => {
          const heading = section.querySelector('h2:not(.label), h2, h3');
          const title = clean(heading && heading.textContent);
          if (!title || title === pageTitle) return;
          // Leave out text visitors don't normally see (empty-listings fallback, hidden and screen-reader-only text)
          const copy = section.cloneNode(true);
          copy.querySelectorAll('[data-listings-empty], [data-listings-updated], [hidden], .sr-only, script').forEach((el) => el.remove());
          const body = clean(Array.from(copy.querySelectorAll('p, li, dd, h3, h4, figcaption')).map((el) => el.textContent).join(' '));
          const anchor = section.id || (heading && heading.id);
          const href = anchor ? `${url}#${anchor}` : `${url}#:~:text=${encodeURIComponent(title)}`;
          entries.push({ kind: 'section', page: pageTitle, title, snippet: body.slice(0, 2000), href, text: normalize(`${title} ${body}`), titleText: normalize(title) });
        });
        return entries;
      })))
      .then((lists) => {
        const all = lists.flat();
        // Homes for sale, from listings.js
        const listings = (window.MIDDLEBROOK_LISTINGS || {}).homes || [];
        const typePage = { townhomes: 'townhomes.html', villas: 'villas.html', cottages: 'cottages.html', 'single-family': 'single-family.html' };
        const typeName = { townhomes: 'The Townhomes', villas: 'The Villas', cottages: 'The Cottages', 'single-family': 'Single-Family Homes' };
        listings.forEach((home) => {
          const title = home.address || home.plan || 'Home';
          const id = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const details = [home.plan, home.price, home.beds && `${home.beds} bed`, home.baths && `${home.baths} bath`, home.sqft && `${home.sqft} sq ft`].filter(Boolean).join(' · ');
          all.push({ kind: 'home', page: typeName[home.type] || 'Homes for sale', title, snippet: details, href: `${typePage[home.type] || 'index.html'}#${id}`, text: normalize(`${title} ${details} ${home.type} ${home.neighborhood || ''} ${home.builder || ''} ${home.features || ''}`), titleText: normalize(title) });
        });
        return all;
      });
    return indexPromise;
  };

  // Score: results with every word come first; if none have every word, show those with the most.
  // Title matches rank higher.
  const search = (index, query) => {
    const words = queryWords(query);
    if (!words.length) return [];
    const scored = index
      .map((entry) => {
        const hits = words.filter((w) => entry.text.includes(w)).length;
        if (!hits) return null;
        const title = entry.titleText || normalize(entry.title);
        let score = words.reduce((sum, w) => sum + (title.includes(w) ? 10 : entry.text.includes(w) ? 1 : 0), 0);
        if (entry.kind === 'page') score += 3;
        return { entry, score, hits };
      })
      .filter(Boolean);
    const all = scored.filter((r) => r.hits === words.length);
    const best = Math.max(0, ...scored.map((r) => r.hits));
    return (all.length ? all : scored.filter((r) => r.hits === best))
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map((r) => r.entry);
  };

  const highlight = (text, query) => {
    let html = esc(text);
    queryWords(query).forEach((w) => {
      html = html.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    });
    return html;
  };

  const snippetAround = (text, query) => {
    const first = queryWords(query)[0];
    const at = first ? normalize(text).indexOf(first) : -1;
    if (at < 60) return text.slice(0, 150) + (text.length > 150 ? '…' : '');
    return '…' + text.slice(at - 50, at + 110) + '…';
  };

  const groups = [['page', 'Pages'], ['section', 'On the site'], ['home', 'Homes for sale']];

  // A search box: an input, a results list, and an optional status line
  const attach = (input, results, status) => {
    let active = -1;
    const links = () => Array.from(results.querySelectorAll('a'));
    const setActive = (i) => {
      const all = links();
      active = Math.max(-1, Math.min(i, all.length - 1));
      all.forEach((a, n) => a.classList.toggle('is-active', n === active));
      if (all[active]) all[active].scrollIntoView({ block: 'nearest' });
    };
    const run = () => {
      const query = input.value;
      if (normalize(query).length < 2) { results.innerHTML = ''; if (status) status.textContent = ''; return; }
      if (status) status.textContent = 'Searching…';
      buildIndex().then((index) => {
        if (input.value !== query) return;
        if (!index.length) {
          results.innerHTML = '';
          if (status) status.textContent = 'Search works on the live site and in the local preview.';
          return;
        }
        const found = search(index, query);
        if (status) status.textContent = found.length ? `${found.length} result${found.length === 1 ? '' : 's'}` : `No results for “${query}”. Try another word, or browse the menu.`;
        results.innerHTML = groups.map(([kind, label]) => {
          const items = found.filter((e) => e.kind === kind);
          if (!items.length) return '';
          return `<li class="search-group"><p class="search-group-label">${label}</p><ul>${items.map((e) => `
            <li><a href="${esc(e.href)}">
              <span class="search-result-page">${esc(e.kind === 'page' ? 'Page' : e.page)}</span>
              <span class="search-result-title serif">${highlight(e.title, query)}</span>
              ${e.snippet ? `<span class="search-result-snippet">${highlight(snippetAround(e.snippet, query), query)}</span>` : ''}
            </a></li>`).join('')}</ul></li>`;
        }).join('');
        active = -1;
      });
    };
    let timer;
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); setActive(active + 1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); setActive(active - 1); }
      if (event.key === 'Enter') {
        const target = links()[active >= 0 ? active : 0];
        if (target) { event.preventDefault(); window.location.href = target.href; }
      }
    });
    return run;
  };

  // The search panel opened from the menu bar
  const dialog = document.createElement('dialog');
  dialog.className = 'search-dialog';
  dialog.setAttribute('aria-label', 'Search the site');
  dialog.innerHTML = `
    <div class="search-panel">
      <div class="search-bar">
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6"/><path d="M13 13l5 5"/></svg>
        <input type="search" placeholder="Search Middlebrook: homes, events, the Farm…" aria-label="Search the site" autocomplete="off" data-search-input>
        <button type="button" class="search-close" aria-label="Close search"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg></button>
      </div>
      <p class="search-status" aria-live="polite" data-search-status></p>
      <ul class="search-results" data-search-results></ul>
      <p class="search-hint">Try “geothermal,” “Fridays,” “villa,” or an address.</p>
    </div>`;
  document.body.appendChild(dialog);
  const dialogInput = dialog.querySelector('[data-search-input]');
  attach(dialogInput, dialog.querySelector('[data-search-results]'), dialog.querySelector('[data-search-status]'));

  const open = () => {
    dialog.showModal();
    dialogInput.focus();
    dialogInput.select();
    buildIndex();
  };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', open));
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  // Press "/" anywhere (outside a text field) to search
  document.addEventListener('keydown', (event) => {
    const typing = /input|textarea|select/i.test(event.target.tagName) || event.target.isContentEditable;
    if (event.key === '/' && !typing && !dialog.open) { event.preventDefault(); open(); }
  });

  // Search boxes placed in a page, like the one on the 404 page: <form data-search-inline>
  document.querySelectorAll('[data-search-inline]').forEach((form) => {
    const input = form.querySelector('input');
    const run = attach(input, form.querySelector('[data-search-results]'), form.querySelector('[data-search-status]'));
    form.addEventListener('submit', (event) => event.preventDefault());
    if (input.value) run();
  });
})();
