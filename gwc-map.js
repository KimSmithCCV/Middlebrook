/*
  GREAT WESTERN CROSSING LOT MAP (lots.html)
  Draws every lot from the Groov lot widget's own lot outlines, colored by status.
  - On middlebrookfarm.com it loads current statuses from Groov on every visit. Update lots in Groov, not here.
  - Anywhere else (the local preview), or if Groov can't be reached, it uses the saved copy in gwc-lots-snapshot.js.
  - Minimum home sizes by plat and lot live in gwc-minimums.js (Groov doesn't store them).
*/

(() => {
  const GROOV = 'https://v3.widget-api.letsgroov.com/widget/c18d2972-fd5a-49d5-9a34-44f826d05172';
  // Minimum home sizes live in gwc-minimums.js (shared with the floor plans page)
  const MINIMUMS = window.MIDDLEBROOK_GWC_MINIMUMS || {};
  const sf = (n) => Number(n).toLocaleString('en-US');
  const minimumFor = (plat, lot) => {
    const n = parseInt(lot, 10);
    const row = (MINIMUMS[plat] || []).find(([a, b]) => n >= a && n <= b);
    return row ? `Ranch ${sf(row[2])} · 1.5-story ${sf(row[3])} · 2-story ${sf(row[4])} SF` : '';
  };
  const STATUS = {
    'For Sale': { key: 'sale', label: 'For sale' },
    Pending: { key: 'pending', label: 'Pending' },
    Reserved: { key: 'reserved', label: 'Reserved' },
    Sold: { key: 'sold', label: 'Sold' }
  };
  const GRADE = { Standard: 'Flat lot', Walkout: 'Walkout lot: the lower level opens onto the backyard', Daylight: 'Daylight lot: larger lower-level windows' };
  const FACING = { N: 'North', S: 'South', E: 'East', W: 'West', NE: 'Northeast', NW: 'Northwest', SE: 'Southeast', SW: 'Southwest' };

  const root = document.querySelector('[data-gwc-map]');
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lotNum = (v) => String(v == null ? '' : v).trim();

  // Both the live Groov bundle and the saved copy become { phases: [{ name, features }], properties }
  const fromGroov = (bundle) => ({
    phases: bundle.phases.map((ph) => ({
      name: ph.name,
      features: ph.geojson.features.map((f) => {
        const g = f.geometry;
        return { type: f.properties.object_type, lot: f.properties.lot_number, status: f.properties.lot_status, c: g.type === 'MultiPolygon' ? g.coordinates[0][0] : g.coordinates[0] };
      })
    })),
    properties: bundle.properties.map((p) => ({
      plat: p.phaseName, lot: p.propertyName, status: p.status, address: p.address, sqft: p.sqft, acreage: p.acreage,
      grade: p.grade, facing: p.facingDirection, setbacks: p.setbacks && p.setbacks.ranch, features: p.features || []
    }))
  });

  const draw = (data, source) => {
    // Simple flat projection: longitude scaled by latitude so the map isn't stretched
    const all = data.phases.flatMap((ph) => ph.features.flatMap((f) => f.c));
    const lats = all.map((p) => p[1]);
    const lons = all.map((p) => p[0]);
    const minLon = Math.min(...lons); const maxLat = Math.max(...lats);
    const k = Math.cos(((Math.min(...lats) + maxLat) / 2) * Math.PI / 180);
    const spanX = (Math.max(...lons) - minLon) * k;
    const spanY = maxLat - Math.min(...lats);
    const W = 1000; const s = W / spanX; const H = Math.round(spanY * s);
    const pt = ([lon, lat]) => [((lon - minLon) * k * s).toFixed(1), ((maxLat - lat) * s).toFixed(1)];
    const path = (c) => `M${c.map(pt).map((p) => p.join(' ')).join('L')}Z`;
    const centroid = (c) => { const ps = c.map(pt).map((p) => p.map(Number)); return [ps.reduce((a, p) => a + p[0], 0) / ps.length, ps.reduce((a, p) => a + p[1], 0) / ps.length]; };

    const props = new Map(data.properties.map((p) => [`${p.plat}|${lotNum(p.lot)}`, p]));
    const lots = [];
    let shapes = '';
    let labels = '';
    data.phases.forEach((ph) => {
      ph.features.filter((f) => f.type !== 'LOT').forEach((f) => { shapes += `<path class="gwc-${f.type === 'ROAD' ? 'road' : 'outlot'}" d="${path(f.c)}"/>`; });
    });
    data.phases.forEach((ph) => {
      const centers = [];
      ph.features.filter((f) => f.type === 'LOT').forEach((f) => {
        const p = props.get(`${ph.name}|${lotNum(f.lot)}`) || { plat: ph.name, lot: f.lot, status: f.status };
        const status = STATUS[p.status] || STATUS.Sold;
        const i = lots.push(p) - 1;
        const [cx, cy] = centroid(f.c);
        centers.push([cx, cy]);
        shapes += `<path class="gwc-lot-shape is-${status.key}" d="${path(f.c)}" data-lot="${i}" tabindex="0" role="button" aria-label="${esc(ph.name)}, lot ${esc(f.lot)}, ${status.label.toLowerCase()}${p.address ? `, ${esc(p.address)}` : ''}"/>`;
        labels += `<text class="gwc-lot-num is-${status.key}" x="${cx.toFixed(1)}" y="${cy.toFixed(1)}">${esc(f.lot)}</text>`;
      });
      if (centers.length) {
        const x = centers.reduce((a, c) => a + c[0], 0) / centers.length;
        const y = Math.min(...centers.map((c) => c[1])) - 14;
        labels += `<text class="gwc-plat-label" x="${x.toFixed(1)}" y="${Math.max(18, y).toFixed(1)}">${esc(ph.name)}</text>`;
      }
    });

    root.querySelector('[data-gwc-svg]').innerHTML = `<svg viewBox="-12 -12 ${W + 24} ${H + 24}" role="group" aria-label="Lot map of Great Western Crossing">${shapes}${labels}</svg>`;

    // Counts and legend
    const counts = lots.reduce((m, p) => { const key = (STATUS[p.status] || STATUS.Sold).key; m[key] = (m[key] || 0) + 1; return m; }, {});
    document.querySelectorAll('[data-gwc-open]').forEach((el) => { el.textContent = counts.sale || 0; });
    document.querySelectorAll('[data-gwc-open-count]').forEach((el) => { el.textContent = `${counts.sale || 0} lots for sale`; });
    root.querySelectorAll('[data-gwc-count]').forEach((el) => { el.textContent = counts[el.dataset.gwcCount] || 0; });
    root.querySelector('[data-gwc-source]').textContent = source;

    // The detail card
    const card = root.querySelector('[data-gwc-card]');
    const svg = root.querySelector('svg');
    const show = (i) => {
      const p = lots[i];
      const status = STATUS[p.status] || STATUS.Sold;
      const open = status.key === 'sale';
      const subject = encodeURIComponent(`Great Western Crossing, ${p.plat} Lot ${lotNum(p.lot)}`);
      const sb = p.setbacks;
      card.innerHTML = `
        <div class="ct-lot-card-head">
          <p class="accent ct-lot-number">${esc(p.plat)} · Lot ${esc(p.lot)}</p>
          <span class="gwc-status is-${status.key}">${status.label}</span>
        </div>
        <h3 class="serif">${esc(p.address || 'Address coming soon')}</h3>
        ${p.sqft ? `<p class="ct-lot-plan">${Number(p.sqft).toLocaleString('en-US')} sq ft${p.acreage ? ` · ${p.acreage} acres` : ''}</p>` : ''}
        ${status.key === 'sold' ? '' : `
        <dl class="ct-lot-finishes gwc-card-rules">
          ${p.grade ? `<div><dt>Lot</dt><dd>${esc(GRADE[p.grade] || p.grade)}</dd></div>` : ''}
          ${p.facing ? `<div><dt>Faces</dt><dd>${esc(FACING[p.facing] || p.facing)}</dd></div>` : ''}
          ${minimumFor(p.plat, p.lot) ? `<div><dt>Build</dt><dd>${esc(minimumFor(p.plat, p.lot))} minimum</dd></div>` : ''}
          ${sb ? `<div><dt>Setbacks</dt><dd>Front ${Number(sb.front)} ft, sides ${Number(sb.side)} ft (${Number(sb.totalSide)} ft total), rear ${Number(sb.rear)} ft</dd></div>` : ''}
          ${(p.features || []).length ? `<div><dt>Notes</dt><dd>${p.features.map(esc).join(' · ')}</dd></div>` : ''}
        </dl>`}
        ${open ? `<p class="ct-lot-contact">For pricing, email <a href="mailto:kalen@peoplescompany.com?subject=${subject}">Kalen</a> or <a href="mailto:keaton@peoplescompany.com?subject=${subject}">Keaton</a></p>`
          : status.key === 'sold' ? '' : `<p class="ct-lot-contact">This lot is ${status.label.toLowerCase()}. To hear if it opens up, email <a href="mailto:kalen@peoplescompany.com?subject=${subject}">Kalen</a> or <a href="mailto:keaton@peoplescompany.com?subject=${subject}">Keaton</a></p>`}`;
      svg.querySelectorAll('.gwc-lot-shape').forEach((el) => el.classList.toggle('is-selected', Number(el.dataset.lot) === i));
    };
    svg.addEventListener('click', (e) => { const el = e.target.closest('.gwc-lot-shape'); if (el) show(Number(el.dataset.lot)); });
    svg.addEventListener('keydown', (e) => { const el = e.target.closest('.gwc-lot-shape'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(Number(el.dataset.lot)); } });
    const first = lots.findIndex((p) => p.status === 'For Sale');
    if (first >= 0) show(first);

    // Legend: show only one status, or all
    root.querySelectorAll('[data-gwc-filter]').forEach((btn) => {
      btn.onclick = () => {
        const on = btn.getAttribute('aria-pressed') !== 'true';
        root.querySelectorAll('[data-gwc-filter]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', String(on));
        svg.dataset.only = on ? btn.dataset.gwcFilter : '';
      };
    });
  };

  if (!root) return;
  const snapshot = window.MIDDLEBROOK_GWC_SNAPSHOT;
  if (snapshot) draw(snapshot, `Saved ${snapshot.saved}`);

  // Live statuses from Groov (Groov only answers pages on middlebrookfarm.com)
  if (/(^|\.)middlebrookfarm\.com$/.test(window.location.hostname)) {
    fetch(GROOV, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => draw(fromGroov(json.data.bundle), 'Live from our lot inventory'))
      .catch(() => {});
  }
})();
