/*
  FLOOR PLANS (floor-plans.html)
  - Each plan in the list carries its style (data-type) and listed square footage (data-sf).
  - "Fits my lot" and the line under each plan compare that square footage to the lot minimums in gwc-minimums.js,
    so updating a minimum there updates this page and the lot map together.
  - Villas are built in their own neighborhood, so the lot filter leaves them out.
*/

(() => {
  const root = document.querySelector('[data-fp-catalog]');
  if (!root) return;
  const MINIMUMS = window.MIDDLEBROOK_GWC_MINIMUMS || {};
  const COLUMN = { ranch: 2, story15: 3, story2: 4 };
  const dash = '–';

  // Every lot range as its own choice: "Plat 4, lots 1–9", or just "Plat 1" when one rule covers the whole plat
  const ranges = Object.entries(MINIMUMS).flatMap(([plat, rows]) => rows.map((row) => ({
    plat, row, label: rows.length > 1 ? `${plat}, lots ${row[0]}${dash}${row[1]}` : plat
  })));
  const plans = Array.from(root.querySelectorAll('.fp-plan'));
  const fits = (plan, range) => COLUMN[plan.dataset.type] && Number(plan.dataset.sf) >= range.row[COLUMN[plan.dataset.type]];
  const list = (labels) => labels.length < 3 ? labels.join(' and ') : `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;

  // The line under each single-family plan
  plans.filter((plan) => COLUMN[plan.dataset.type]).forEach((plan) => {
    const yes = ranges.filter((r) => fits(plan, r)).map((r) => r.label);
    const no = ranges.filter((r) => !fits(plan, r)).map((r) => r.label);
    const line = plan.querySelector('[data-fits]');
    if (!no.length) line.textContent = 'Meets the minimum on every lot';
    else if (!yes.length) line.textContent = 'Needs more square feet than drawn on every lot';
    else if (yes.length >= no.length) line.textContent = `Meets the minimum on every lot except ${list(no)}`;
    else line.textContent = `Meets the minimum on ${list(yes)}`;
    if (no.length) plan.classList.add('fp-fits-some');
  });

  const select = root.querySelector('[data-fp-lot]');
  ranges.forEach((r, i) => select.add(new Option(r.label, String(i))));

  const typeButtons = root.querySelectorAll('[data-fp-type]');
  const count = root.querySelector('[data-fp-count]');
  const empty = root.querySelector('[data-fp-empty]');
  const apply = () => {
    const type = root.querySelector('[data-fp-type][aria-pressed="true"]').dataset.fpType;
    const range = select.value === '' ? null : ranges[Number(select.value)];
    let shown = 0;
    plans.forEach((plan) => {
      const ok = (type === 'all' || plan.dataset.type === type) && (!range || fits(plan, range));
      plan.hidden = !ok;
      if (ok) shown += 1;
    });
    count.textContent = `${shown} ${shown === 1 ? 'plan' : 'plans'}${range ? ` for ${range.label}` : ''}`;
    empty.hidden = shown > 0;
  };
  typeButtons.forEach((btn) => btn.addEventListener('click', () => {
    typeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    apply();
  }));
  select.addEventListener('change', apply);
  root.querySelector('[data-fp-reset]').addEventListener('click', (e) => {
    e.preventDefault();
    select.value = '';
    typeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fpType === 'all')));
    apply();
  });
})();
