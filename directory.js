/*
  HOMES FOR SALE DIRECTORY (homes-for-sale.html)
  Filters and sorts the listing rows that script.js draws from listings.js. Nothing to update here:
  add or remove homes in listings.js and the filters (types, statuses, price range) follow on their own.
  A link like homes-for-sale.html?type=villas opens the page already filtered to that type.
*/

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('[data-directory]');
  const rowsList = page && page.querySelector('[data-listings-rows]');
  if (!page || !rowsList) return;

  const rows = Array.from(rowsList.children);
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = (n) => (n >= 1000000 ? `$${(n / 1000000).toFixed(n % 1000000 ? 2 : 0)}M` : `$${Math.round(n / 1000)}K`);
  const typeNames = { 'single-family': 'Single-family', villas: 'Villas', townhomes: 'Townhomes', cottages: 'Cottages', lots: 'Lots' };
  const state = { q: '', min: 0, max: Infinity, types: new Set(), statuses: new Set(), beds: 0, baths: 0, sort: 'featured' };

  // Build the checkbox lists from the homes actually listed, with a count for each
  const count = (attr) => rows.reduce((map, row) => { const v = row.dataset[attr]; if (v) map.set(v, (map.get(v) || 0) + 1); return map; }, new Map());
  const fillChecks = (holder, counts, names, key) => {
    holder.innerHTML = Array.from(counts.entries()).map(([value, n]) => `
      <li><label class="dir-check"><input type="checkbox" value="${esc(value)}" data-filter="${key}"><span>${esc(names[value] || value)}</span><small>${n}</small></label></li>`).join('');
  };
  fillChecks(page.querySelector('[data-filter-types]'), count('type'), typeNames, 'types');
  // Status filter lists sale statuses only (a feature tag like "Geothermal" is left out)
  const statuses = count('status');
  statuses.delete('Geothermal');
  fillChecks(page.querySelector('[data-filter-statuses]'), statuses, {}, 'statuses');

  // Price range: two sliders sharing one track, stepped to $25K
  const prices = rows.map((r) => Number(r.dataset.price)).filter(Boolean);
  const floor = Math.floor(Math.min(...prices) / 25000) * 25000;
  const ceil = Math.ceil(Math.max(...prices) / 25000) * 25000;
  const minRange = page.querySelector('[data-price-min]');
  const maxRange = page.querySelector('[data-price-max]');
  const priceLabel = page.querySelector('[data-price-label]');
  const fill = page.querySelector('[data-price-fill]');
  [minRange, maxRange].forEach((r) => { r.min = floor; r.max = ceil; r.step = 25000; });
  minRange.value = floor;
  maxRange.value = ceil;

  const showPrice = () => {
    const lo = Number(minRange.value);
    const hi = Number(maxRange.value);
    priceLabel.textContent = `${money(lo)} to ${money(hi)}${hi >= ceil ? '+' : ''}`;
    fill.style.left = `${((lo - floor) / (ceil - floor)) * 100}%`;
    fill.style.right = `${100 - ((hi - floor) / (ceil - floor)) * 100}%`;
  };

  const apply = () => {
    const words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    rows.forEach((row) => {
      const price = Number(row.dataset.price);
      const ok = words.every((w) => row.dataset.search.includes(w))
        && (!price || (price >= state.min && price <= state.max))
        && (!state.types.size || state.types.has(row.dataset.type))
        && (!state.statuses.size || state.statuses.has(row.dataset.status))
        && Number(row.dataset.beds) >= state.beds
        && Number(row.dataset.baths) >= state.baths;
      row.hidden = !ok;
      if (ok) shown += 1;
    });

    // Sort the visible order
    const by = {
      featured: (a, b) => a.dataset.order - b.dataset.order,
      'price-asc': (a, b) => a.dataset.price - b.dataset.price,
      'price-desc': (a, b) => b.dataset.price - a.dataset.price,
      'sqft-desc': (a, b) => b.dataset.sqft - a.dataset.sqft,
      'beds-desc': (a, b) => b.dataset.beds - a.dataset.beds || a.dataset.price - b.dataset.price
    }[state.sort];
    rows.slice().sort(by).forEach((row) => rowsList.appendChild(row));

    page.querySelector('[data-dir-count]').textContent = `Showing ${shown} of ${rows.length} home${rows.length === 1 ? '' : 's'}`;
    page.querySelector('[data-dir-none]').hidden = shown > 0;

    // "Filtering by" chips, each one removes its filter
    const chips = [];
    if (state.q) chips.push(['q', '', `“${state.q}”`]);
    if (state.min > floor || state.max < ceil) chips.push(['price', '', priceLabel.textContent]);
    state.types.forEach((t) => chips.push(['types', t, typeNames[t] || t]));
    state.statuses.forEach((s) => chips.push(['statuses', s, s]));
    if (state.beds) chips.push(['beds', '', `${state.beds}+ beds`]);
    if (state.baths) chips.push(['baths', '', `${state.baths}+ baths`]);
    page.querySelector('[data-dir-chips]').innerHTML = chips.length
      ? chips.map(([key, value, label]) => `<button type="button" class="dir-chip" data-chip="${key}" data-value="${esc(value)}" aria-label="Remove filter: ${esc(label)}">${esc(label)}<span aria-hidden="true">×</span></button>`).join('')
      : '<span class="dir-chips-none">All homes for sale</span>';
  };

  const clear = (key, value) => {
    if (key === 'q') { state.q = ''; page.querySelector('[data-dir-search]').value = ''; }
    if (key === 'price') { minRange.value = floor; maxRange.value = ceil; state.min = 0; state.max = Infinity; showPrice(); }
    if (key === 'types' || key === 'statuses') {
      if (value) state[key].delete(value); else state[key].clear();
      page.querySelectorAll(`[data-filter="${key}"]`).forEach((box) => { if (!value || box.value === value) box.checked = false; });
    }
    if (key === 'beds' || key === 'baths') { state[key] = 0; page.querySelector(`[name="${key}"][value="0"]`).checked = true; }
  };

  // Wire up the controls
  let typing;
  page.querySelector('[data-dir-search]').addEventListener('input', (event) => {
    clearTimeout(typing);
    typing = setTimeout(() => { state.q = event.target.value.trim(); apply(); }, 150);
  });
  [minRange, maxRange].forEach((range) => range.addEventListener('input', () => {
    if (Number(minRange.value) > Number(maxRange.value) - 25000) {
      if (range === minRange) minRange.value = Number(maxRange.value) - 25000; else maxRange.value = Number(minRange.value) + 25000;
    }
    state.min = Number(minRange.value) > floor ? Number(minRange.value) : 0;
    state.max = Number(maxRange.value) < ceil ? Number(maxRange.value) : Infinity;
    showPrice();
    apply();
  }));
  page.addEventListener('change', (event) => {
    const box = event.target;
    if (box.dataset.filter) { if (box.checked) state[box.dataset.filter].add(box.value); else state[box.dataset.filter].delete(box.value); apply(); }
    if (box.name === 'beds' || box.name === 'baths') { state[box.name] = Number(box.value); apply(); }
    if (box.matches('[data-dir-sort]')) { state.sort = box.value; apply(); }
  });
  page.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-chip]');
    const clearButton = event.target.closest('[data-clear]');
    if (chip) { clear(chip.dataset.chip, chip.dataset.value); apply(); }
    if (clearButton) {
      const keys = clearButton.dataset.clear === 'all' ? ['q', 'price', 'types', 'statuses', 'beds', 'baths'] : [clearButton.dataset.clear];
      keys.forEach((k) => clear(k));
      apply();
    }
  });

  // Phones: the filters open as a panel
  const toggle = page.querySelector('[data-dir-toggle]');
  if (toggle) toggle.addEventListener('click', () => {
    const open = page.classList.toggle('is-filters-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Start filtered from the address, e.g. ?type=villas
  const preset = new URLSearchParams(window.location.search).get('type');
  if (preset) {
    preset.split(',').forEach((t) => {
      const box = page.querySelector(`[data-filter="types"][value="${CSS.escape(t)}"]`);
      if (box) { box.checked = true; state.types.add(t); }
    });
  }

  showPrice();
  apply();
});
