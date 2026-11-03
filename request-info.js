/*
  REQUEST INFO POP-UP
  Every "Request Info" button on the site opens this form in a pop-up instead of jumping to the home page:
  the menu button, the Request Info sections, and any link to "#request-info" or "index.html#request-info".
  Load it on every page, before script.js.

  Where submissions go:
  - Inboxes set by the client, October 28, 2026 (see below).
  - Submit sends the request straight from the page through FormSubmit (formsubmit.co, free, no account).
    The first request to each inbox triggers a one-time "Activate form" email from FormSubmit to that inbox;
    someone has to click it before that inbox starts receiving requests.
  - The visitor never leaves the page or sees their email app. If sending fails, the form says so and
    gives the Middlebrook office number (515.309.0705).
  - To use a different service later, change ENDPOINT and the fetch call below.

  To change the choices, edit INTERESTS (homes), RENTALS (private rentals), and COMMERCIAL. A visitor picks at least one.
  Each request goes to the inbox for what was picked: homes to INBOX (Kalen), private rentals to RENTALS_INBOX
  (the events team), and commercial to COMMERCIAL_INBOX (Tim, like the commercial pages). A request with picks from more than one group goes to each of those inboxes.
*/

window.MIDDLEBROOK_REQUEST_INFO = {
  ENDPOINT: 'https://formsubmit.co/ajax/',
  INBOX: 'Kalen@PeoplesCompany.com',
  RENTALS_INBOX: 'Events@MiddlebrookFarm.com',
  COMMERCIAL_INBOX: 'Tim@DiligentDevelopment.com',
  INTERESTS: ['Townhomes', 'Villas', 'Cottages', 'Homes for sale', 'Lots and custom builds', 'Live-Work Townhomes', 'Rental loft apartments', 'Renting a house', 'Not sure yet'],
  RENTALS: ['Farmhouse & Farm Grounds', 'The Merc private rental', 'Private photography session'],
  COMMERCIAL: ['Town Center storefronts', 'Market Hall', 'Middlebrook West Commercial', 'Land to build on']
};

document.addEventListener('DOMContentLoaded', () => {
  const settings = window.MIDDLEBROOK_REQUEST_INFO;
  const dialog = document.createElement('dialog');
  dialog.className = 'ri-dialog';
  dialog.setAttribute('aria-labelledby', 'ri-title');
  dialog.innerHTML = `
    <button class="profile-dialog-close ri-close" type="button" aria-label="Close">
      <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13"/></svg>
    </button>
    <div class="ri-grid">
      <figure class="ri-photo">
        <img src="images/middlebrook-front-porch-neighbors.webp" width="1000" height="1500" alt="Two neighbors talking on the front porch of a white farmhouse at Middlebrook" decoding="async">
        <figcaption class="ri-photo-caption"><span class="season-stamp">Cumming, Iowa</span></figcaption>
      </figure>
      <div class="ri-body">
        <div class="ri-head">
          <img src="images/brand/sprigs/sprig-12.svg" alt="" class="ri-sprig" aria-hidden="true">
          <h2 class="serif ri-title" id="ri-title">Find your place at Middlebrook</h2>
          <p class="ri-lede">Tell us a little about what you are looking for, from a new home to a private event or a place for your business, and we will follow up.</p>
        </div>
        <form class="ri-form" novalidate>
          <div class="ri-row">
            <label class="ri-field"><span class="label">First name</span><input name="first_name" type="text" autocomplete="given-name" required></label>
            <label class="ri-field"><span class="label">Last name</span><input name="last_name" type="text" autocomplete="family-name" required></label>
            <label class="ri-field"><span class="label">Email</span><input name="email" type="email" autocomplete="email" required></label>
            <label class="ri-field"><span class="label">Phone <em>Optional</em></span><input name="phone" type="tel" autocomplete="tel"></label>
            <label class="ri-field"><span class="label">Zip code</span><input name="zip" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5" required></label>
          </div>
          <fieldset class="ri-interests">
            <legend class="label">Homes <em>Choose any</em></legend>
            ${settings.INTERESTS.map((item) => `<label><input type="checkbox" name="interest" value="${item}"><span>${item}</span></label>`).join('')}
          </fieldset>
          <fieldset class="ri-interests ri-interests--rentals">
            <legend class="label">Private rentals <em>Choose any</em></legend>
            ${settings.RENTALS.map((item) => `<label><input type="checkbox" name="rental" value="${item}"><span>${item}</span></label>`).join('')}
          </fieldset>
          <fieldset class="ri-interests ri-interests--rentals">
            <legend class="label">Commercial <em>Choose any</em></legend>
            ${settings.COMMERCIAL.map((item) => `<label><input type="checkbox" name="commercial" value="${item}"><span>${item}</span></label>`).join('')}
          </fieldset>
          <label class="ri-field ri-field--wide"><span class="label">Comments <em>Optional</em></span><textarea name="comments" rows="3" placeholder="Timing, questions, or anything else we should know"></textarea></label>
          <p class="ri-error" role="alert" hidden></p>
          <div class="ri-send">
            <button type="submit" class="btn-dark">Send my request</button>
            <p class="ri-note">Someone from Middlebrook will be in touch.</p>
          </div>
        </form>
        <div class="ri-thanks" hidden>
          <img src="images/brand/sprigs/sprig-12.svg" alt="" class="ri-sprig" aria-hidden="true">
          <p class="serif ri-title">Thank you</p>
          <p class="ri-lede" data-ri-thanks-text></p>
          <button type="button" class="btn-dark" data-ri-done>Close</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const form = dialog.querySelector('.ri-form');
  const error = dialog.querySelector('.ri-error');
  const thanks = dialog.querySelector('.ri-thanks');
  const head = dialog.querySelector('.ri-head');
  // The thank-you screen swaps the porch photo for string lights at dusk (client, October 28, 2026)
  const photo = dialog.querySelector('.ri-photo img');
  const photos = {
    form: { src: photo.getAttribute('src'), alt: photo.alt },
    thanks: { src: 'images/middlebrook-string-lights-vertical.webp', alt: 'String lights glowing at dusk on the Farm' }
  };
  const showPhoto = (which) => { photo.src = photos[which].src; photo.alt = photos[which].alt; };
  const reset = () => {
    form.hidden = false;
    head.hidden = false;
    showPhoto('form');
    thanks.hidden = true;
    error.hidden = true;
  };
  dialog.querySelector('.ri-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-ri-done]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (!thanks.hidden) {
      form.reset();
      reset();
    }
  });

  // Open from any Request Info button or link
  const opener = 'a[href="#request-info"], a[href="index.html#request-info"], .request-info-cta, .nav-cta';
  document.querySelectorAll(opener).forEach((link) => link.setAttribute('data-request-info', ''));
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-request-info]');
    if (!link || dialog.open) {
      return;
    }
    event.preventDefault();
    reset();
    dialog.showModal();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const interests = data.getAll('interest');
    const rentals = data.getAll('rental');
    const commercial = data.getAll('commercial');
    const firstBad = form.querySelector('input:invalid, textarea:invalid');
    if (firstBad || !(interests.length + rentals.length + commercial.length)) {
      error.textContent = firstBad
        ? 'Please add your first and last name, email, and a 5-digit zip code.'
        : 'Please choose at least one home, private rental, or commercial option.';
      error.hidden = false;
      (firstBad || form.querySelector('[name="interest"]')).focus();
      return;
    }
    error.hidden = true;

    const name = `${data.get('first_name')} ${data.get('last_name')}`.trim();
    const done = (text) => {
      dialog.querySelector('[data-ri-thanks-text]').textContent = text;
      form.hidden = true;
      head.hidden = true;
      showPhoto('thanks');
      thanks.hidden = false;
    };

    // Each group's inbox gets the request; a mixed request goes to all of them (client, October 28, 2026)
    const groups = [
      interests.length && settings.INBOX,
      rentals.length && settings.RENTALS_INBOX,
      commercial.length && settings.COMMERCIAL_INBOX
    ].filter(Boolean);
    const subject = `Request More Information: ${name}`;
    const failed = () => {
      error.textContent = 'Sorry, your request did not go through. Please try again in a moment, or call us at 515.309.0705.';
      error.hidden = false;
    };

    // Sent straight from the page by FormSubmit to the first inbox, with the others copied
    const [to, ...cc] = groups;
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    fetch(`${settings.ENDPOINT}${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: subject,
        _cc: cc.join(','),
        _template: 'table',
        Name: name,
        email: data.get('email'),
        Phone: data.get('phone') || 'not given',
        'Zip code': data.get('zip'),
        Homes: interests.join(', ') || 'none',
        'Private rentals': rentals.join(', ') || 'none',
        Commercial: commercial.join(', ') || 'none',
        Comments: data.get('comments') || 'none',
        'Sent from': document.title
      })
    })
      .then((response) => response.json())
      .then((result) => {
        if (String(result.success) !== 'true') throw new Error(result.message);
        done('We received your request, and someone from Middlebrook will be in touch soon.');
      })
      .catch(failed)
      .finally(() => { button.disabled = false; });
  });
});
