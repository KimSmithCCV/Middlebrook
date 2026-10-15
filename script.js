document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  // [Bracketed] text is unfinished copy; flag it visibly so it can't ship unnoticed.
  const formatCopy = (value) => escapeHtml(value).replace(/\[([^\]]+)\]/g, '<span class="is-tbd">$1</span>');

  // Drive times (drive-times.js): a row on the home page, and rows in the press page facts
  const driveTimes = window.MIDDLEBROOK_DRIVE_TIMES || [];
  document.querySelectorAll('[data-drive-times]').forEach((list) => {
    list.innerHTML = driveTimes.map((item) => `
      <li><span class="accent drive-times-min">${formatCopy(item.minutes)}<small>min</small></span><span class="drive-times-place">${formatCopy(item.place)}</span></li>`).join('');
  });
  document.querySelectorAll('[data-drive-line]').forEach((line) => {
    line.innerHTML = driveTimes.map((item) => `${formatCopy(item.minutes)} min to ${formatCopy(item.place)}`).join(' · ');
  });
  document.querySelectorAll('[data-drive-time-facts]').forEach((slot) => {
    slot.outerHTML = driveTimes.map((item) => `
      <div class="press-fact"><dt>Drive to ${formatCopy(item.place)}</dt><dd>${formatCopy(item.minutes)} minutes</dd></div>`).join('');
  });

  const testimonialSection = document.querySelector('[data-testimonial]');

  if (testimonialSection) {
    const testimonial = (window.MIDDLEBROOK_TESTIMONIALS || {})[testimonialSection.dataset.testimonial];
    if (testimonial) {
      testimonialSection.querySelector('[data-testimonial-quote]').innerHTML = formatCopy(testimonial.quote);
      testimonialSection.querySelector('[data-testimonial-name]').innerHTML = formatCopy(testimonial.name);
      const photo = testimonialSection.querySelector('[data-testimonial-photo]');
      if (photo && testimonial.photo) {
        photo.src = testimonial.photo;
        photo.alt = testimonial.alt || '';
        photo.closest('.resident-photo').hidden = false;
        testimonialSection.classList.add('has-photo');
      }
    } else {
      testimonialSection.hidden = true;
    }
  }

  // Farm Stand availability (farm-stand.js): full list on the Town Garden page,
  // and a short "{produce}" summary that this-week.js can drop into its text.
  const farmStand = window.MIDDLEBROOK_FARM_STAND;
  const farmStandList = document.querySelector('[data-farm-stand-list]');

  if (farmStand && farmStandList && farmStand.items && farmStand.items.length) {
    farmStandList.querySelector('[data-farm-stand-updated]').textContent = `Updated ${farmStand.updated}. While supplies last.`;
    farmStandList.querySelector('[data-farm-stand-items]').innerHTML = farmStand.items.map((item) => `
      <li>
        <span class="farm-stand-item-name">${formatCopy(item.name)}</span>
        ${item.price ? `<span class="farm-stand-item-price">${formatCopy(item.price)}</span>` : ''}
        ${item.note ? `<span class="farm-stand-item-note">${formatCopy(item.note)}</span>` : ''}
      </li>`).join('');
    farmStandList.hidden = false;
  }

  // Homes for sale (listings.js): each home type page shows the homes whose "type" matches data-listings.
  // With none listed, the page keeps its built-in "nothing listed right now" message.
  const listings = window.MIDDLEBROOK_LISTINGS || { homes: [] };
  const listingId = (home) => String(home.address || home.plan || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  document.querySelectorAll('[data-listings]').forEach((section) => {
    const homes = (listings.homes || []).filter((home) => section.dataset.listings === 'all' || home.type === section.dataset.listings);
    const rows = section.querySelector('[data-listings-rows]');
    const updated = section.querySelector('[data-listings-updated]');
    if (updated && listings.updated) updated.textContent = `Updated ${listings.updated}. Pricing and availability subject to change.`;
    if (!homes.length || !rows) return;

    rows.innerHTML = homes.map((home, index) => {
      // Model homes can leave out the address; the plan name becomes the title
      const title = home.address || home.plan || 'Home';
      const photos = home.photos || (home.photo ? [{ src: home.photo, alt: title }] : []);
      // Each spec is a large figure over a small label, e.g. "3" over "beds"
      const specs = [
        home.beds ? [home.beds, Number(home.beds) === 1 ? 'bed' : 'beds'] : null,
        home.baths ? [home.baths, Number(home.baths) === 1 ? 'bath' : 'baths'] : null,
        home.sqft ? [home.sqft, 'sq ft'] : null,
        home.lowerLevel ? [`+${home.lowerLevel}`, 'sq ft finished lower level'] : null,
        home.garage ? [home.garage, 'car garage'] : null,
        home.acres ? [home.acres, 'acres'] : null
      ].filter(Boolean).map(([figure, label]) => `<div><dt class="accent">${formatCopy(figure)}</dt><dd>${formatCopy(label)}</dd></div>`).join('');
      // Type label for rows without a plan name (single-family homes), and the directory's filters
      const typeLabel = { townhomes: 'Townhome', villas: 'Villa', cottages: 'Cottage', 'single-family': 'Single-family home', lots: 'Lot' }[home.type] || '';
      const kicker = [home.address ? (home.plan || typeLabel) : '', home.neighborhood].filter(Boolean).map(formatCopy).join(' · ');
      const priceValue = Number(String(home.price || '').replace(/[^0-9.]/g, '')) || 0;
      const team = [home.builder, home.agent].filter(Boolean).map(formatCopy).join(' · ');
      // Agent emails open with the address already in the subject line
      const contacts = (home.contacts || []).filter((person) => person.email);
      const contactLinks = contacts.map((person) => {
        const subject = encodeURIComponent(`Tour request: ${title}, Middlebrook`);
        return `<a href="mailto:${escapeHtml(person.email)}?subject=${subject}">${formatCopy(person.name)}</a>`;
      });
      const contactLine = contactLinks.length
        ? `<p class="listing-contact">Schedule a tour: contact ${contactLinks.length > 1 ? `${contactLinks.slice(0, -1).join(', ')} or ${contactLinks[contactLinks.length - 1]}` : contactLinks[0]}</p>`
        : '';
      const link = home.link
        ? `<a href="${escapeHtml(home.link)}" class="underline-link" target="_blank" rel="noopener">View listing<span class="sr-only"> for ${escapeHtml(title)} (opens in a new tab)</span></a>`
        : (contactLine ? '' : `<a href="#request-info" class="underline-link">Ask about this home</a>`);
      return `
        <li class="listing" id="${listingId(home)}" data-type="${escapeHtml(home.type || '')}" data-price="${priceValue}" data-beds="${Number(home.beds) || 0}" data-baths="${Number(home.baths) || 0}" data-sqft="${Number(String(home.sqft || '').replace(/[^0-9]/g, '')) || 0}" data-status="${escapeHtml(home.status || '')}" data-order="${index}" data-search="${escapeHtml([title, home.plan, typeLabel, home.neighborhood, home.builder, home.status].filter(Boolean).join(' ').toLowerCase())}">
          <div class="listing-media pin-gallery" aria-label="${escapeHtml(title)} photos">
            <div class="listing-photo" data-lightbox-group>
              ${photos.map((photo, i) => `<button type="button" class="listing-photo-open" data-gallery-image data-lightbox="${i}"${i ? ' hidden' : ''} aria-label="View larger photo ${i + 1} of ${photos.length}" style="--bg: url('${escapeHtml(photo.src)}')"><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt || title)}" loading="lazy" decoding="async"></button>`).join('')}
              ${home.status ? `<span class="pin-tag">${formatCopy(home.status)}</span>` : ''}
            </div>
            ${photos.length > 1 ? `
              <div class="listing-photo-controls">
                <button class="th-gallery-arrow pin-gallery-prev" type="button" aria-label="Previous ${escapeHtml(title)} photo"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg></button>
                <span class="listing-photo-count"><span class="pin-gallery-count" aria-live="polite">1 / ${photos.length}</span> photos</span>
                <button class="th-gallery-arrow pin-gallery-next" type="button" aria-label="Next ${escapeHtml(title)} photo"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></button>
              </div>` : ''}
          </div>
          <div class="listing-main">
            ${kicker ? `<p class="listing-plan">${kicker}</p>` : ''}
            <h3 class="serif listing-address">${formatCopy(title)}</h3>
            ${specs ? `<dl class="listing-specs">${specs}</dl>` : ''}
            ${home.perk ? `<p class="listing-perk">${formatCopy(home.perk)}</p>` : ''}
            ${home.features ? `<p class="listing-features">${formatCopy(home.features)}</p>` : ''}
            ${team ? `<p class="listing-team">${team}</p>` : ''}
          </div>
          <div class="listing-side">
            <p class="accent listing-price">${formatCopy(home.price || '')}</p>
            ${link}
            ${contactLine}
            <button type="button" class="listing-share" data-share-listing="${listingId(home)}" data-share-title="${escapeHtml(title)}, Middlebrook">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 10V2M5 5l3-3 3 3M3 9v4.5h10V9"/></svg><span data-share-label>Share this home</span>
            </button>
          </div>
        </li>`;
    }).join('');
    rows.hidden = false;

    // Share a listing: the phone's share menu where available, otherwise copy the link
    rows.querySelectorAll('[data-share-listing]').forEach((button) => {
      button.addEventListener('click', async () => {
        const url = `${window.location.origin}${window.location.pathname}#${button.dataset.shareListing}`;
        const label = button.querySelector('[data-share-label]');
        if (navigator.share) {
          try { await navigator.share({ title: button.dataset.shareTitle, url }); } catch (error) { /* closed the share menu */ }
          return;
        }
        try {
          await navigator.clipboard.writeText(url);
          label.textContent = 'Link copied';
        } catch (error) {
          window.prompt('Copy this link to share the home:', url);
        }
        setTimeout(() => { label.textContent = 'Share this home'; }, 2200);
      });
    });

    // Opening a shared link jumps to that home (the rows are drawn after the page loads)
    const shared = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (shared) {
      requestAnimationFrame(() => shared.scrollIntoView({ block: 'start' }));
      shared.classList.add('is-shared');
    }
    const empty = section.querySelector('[data-listings-empty]');
    if (empty) empty.hidden = true;
  });

  const produceSummary = (() => {
    const names = ((farmStand && farmStand.items) || [])
      .filter((item) => item.price)
      .slice(0, 4)
      .map((item) => item.short || item.name.toLowerCase());
    return names.length ? `${names.join(', ')}, and more` : '';
  })();

  (window.MIDDLEBROOK_THIS_WEEK || []).forEach((item) => {
    if (item.detail && item.detail.includes('{produce}')) {
      item.detail = produceSummary ? item.detail.replace('{produce}', produceSummary) : item.detail.replace(/\s*On the shelves[^.]*\{produce\}\.?/, '');
    }
  });

  // Single cards elsewhere on the site that mirror one "This week" item, e.g. data-week-card="Farm Stand".
  // If the item is missing or out of its date range, the card keeps its built-in fallback text.
  document.querySelectorAll('[data-week-card]').forEach((card) => {
    const todayIso = new Date().toLocaleDateString('en-CA');
    const item = (window.MIDDLEBROOK_THIS_WEEK || []).find((entry) => entry.label === card.dataset.weekCard
      && (!entry.showFrom || entry.showFrom <= todayIso) && (!entry.showUntil || entry.showUntil >= todayIso));
    if (item) {
      card.innerHTML = `
        <p class="serif farm-stand-now-title">${formatCopy(item.title)}</p>
        ${item.detail ? `<p class="farm-stand-now-detail">${formatCopy(item.detail)}</p>` : ''}
        ${item.link ? `<a href="${escapeHtml(item.link.href)}" class="underline-link">${formatCopy(item.link.text)}</a>` : ''}`;
    }
  });

  const weekSection = document.querySelector('[data-this-week-section]');

  if (weekSection) {
    const weekList = weekSection.querySelector('[data-this-week]');
    const weekOf = weekSection.querySelector('[data-week-of]');
    const today = new Date();
    const toIsoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const todayIso = toIsoDate(today);

    const items = (Array.isArray(window.MIDDLEBROOK_THIS_WEEK) ? window.MIDDLEBROOK_THIS_WEEK : [])
      .filter((item) => (!item.showFrom || item.showFrom <= todayIso) && (!item.showUntil || item.showUntil >= todayIso));

    if (items.length) {
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      weekOf.textContent = `Week of ${monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

      weekList.innerHTML = items.map((item) => `
        <li class="this-week-item">
          <p class="label">${formatCopy(item.label)}</p>
          <p class="serif this-week-item-title">${formatCopy(item.title)}</p>
          ${item.detail ? `<p class="this-week-item-detail">${formatCopy(item.detail)}</p>` : ''}
          ${item.link ? `<a href="${escapeHtml(item.link.href)}" class="underline-link">${formatCopy(item.link.text)}</a>` : ''}
        </li>`).join('');
    } else {
      weekSection.hidden = true;
    }
  }

  const nav = document.querySelector('[data-nav]');

  if (nav) {
    const navItems = Array.from(nav.querySelectorAll('.nav-item'));
    const navToggle = nav.querySelector('.nav-toggle');
    const desktopHover = window.matchMedia('(min-width: 1081px) and (hover: hover)');
    const isMobileMenu = () => window.matchMedia('(max-width: 1080px)').matches;
    const navScrim = document.createElement('div');
    let closeTimer;

    navScrim.className = 'nav-scrim';
    document.body.appendChild(navScrim);

    const setItemOpen = (item, open) => {
      item.classList.toggle('is-open', open);
      item.querySelector('.nav-trigger').setAttribute('aria-expanded', String(open));
    };

    const syncNavState = () => {
      const anyOpen = navItems.some((item) => item.classList.contains('is-open'));
      const menuOpen = nav.classList.contains('is-menu-open');
      nav.classList.toggle('is-solid', anyOpen || menuOpen);
      navScrim.classList.toggle('is-visible', anyOpen && !isMobileMenu());
    };

    const openItem = (item) => {
      clearTimeout(closeTimer);
      navItems.forEach((other) => setItemOpen(other, other === item));
      syncNavState();
    };

    const closeAllItems = () => {
      clearTimeout(closeTimer);
      navItems.forEach((item) => setItemOpen(item, false));
      syncNavState();
    };

    const setMenuOpen = (open) => {
      nav.classList.toggle('is-menu-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-locked', open);
      if (!open) {
        closeAllItems();
      }
      syncNavState();
    };

    navItems.forEach((item) => {
      const trigger = item.querySelector('.nav-trigger');

      trigger.addEventListener('click', () => {
        if (item.classList.contains('is-open')) {
          setItemOpen(item, false);
          syncNavState();
        } else if (isMobileMenu()) {
          setItemOpen(item, true);
          syncNavState();
        } else {
          openItem(item);
        }
      });

      item.addEventListener('mouseenter', () => {
        if (desktopHover.matches) {
          openItem(item);
        }
      });

      item.addEventListener('mouseleave', () => {
        if (desktopHover.matches) {
          closeTimer = setTimeout(closeAllItems, 180);
        }
      });
    });

    navToggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('is-menu-open'));
    });

    const syncScrolled = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    syncScrolled();
    window.addEventListener('scroll', syncScrolled, { passive: true });

    navScrim.addEventListener('click', closeAllItems);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }
      const openTrigger = nav.querySelector('.nav-item.is-open .nav-trigger');
      if (openTrigger && !isMobileMenu()) {
        closeAllItems();
        openTrigger.focus();
      } else if (nav.classList.contains('is-menu-open')) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !isMobileMenu()) {
        closeAllItems();
      }
    });

    nav.addEventListener('focusout', (event) => {
      // relatedTarget is null for mouse clicks on non-focusable areas; the document click handler covers those.
      if (!isMobileMenu() && event.relatedTarget && !nav.contains(event.relatedTarget)) {
        closeAllItems();
      }
    });

    nav.querySelectorAll('.nav-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-menu-open')) {
          setMenuOpen(false);
        } else {
          closeAllItems();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!isMobileMenu() && nav.classList.contains('is-menu-open')) {
        setMenuOpen(false);
      }
      syncNavState();
    });
  }

  const featuredPins = document.querySelectorAll('.pin-featured');

  // Cards open to the right of their pin; pins on the right half of the map (class "pin-flip", set in map.js)
  // open to the left instead, so the card stays on screen. Clear any old inline position so the CSS decides.
  const constrainTooltip = (pin) => {
    const tooltip = pin.querySelector('.pin-tooltip');
    if (tooltip) {
      tooltip.style.left = '';
      tooltip.style.right = '';
    }
  };

  const initializeGallery = (gallery) => {
    if (!gallery) {
      return;
    }

    const galleryImages = Array.from(gallery.querySelectorAll('[data-gallery-image]'));
    const galleryCount = gallery.querySelector('.pin-gallery-count');
    const galleryDots = Array.from(gallery.querySelectorAll('[data-gallery-dot]'));
    let activeGalleryImage = 0;

    const showGalleryImage = (nextIndex) => {
      activeGalleryImage = (nextIndex + galleryImages.length) % galleryImages.length;
      galleryImages.forEach((image, index) => {
        image.hidden = index !== activeGalleryImage;
      });
      if (galleryCount) {
        galleryCount.textContent = `${activeGalleryImage + 1} / ${galleryImages.length}`;
      }
      galleryDots.forEach((dot, index) => {
        dot.setAttribute('aria-current', String(index === activeGalleryImage));
      });
    };

    const prevButton = gallery.querySelector('.pin-gallery-prev');
    const nextButton = gallery.querySelector('.pin-gallery-next');
    if (prevButton) prevButton.addEventListener('click', (event) => {
      event.stopPropagation();
      showGalleryImage(activeGalleryImage - 1);
    });

    if (nextButton) nextButton.addEventListener('click', (event) => {
      event.stopPropagation();
      showGalleryImage(activeGalleryImage + 1);
    });

    galleryDots.forEach((dot, index) => {
      dot.addEventListener('click', (event) => {
        event.stopPropagation();
        showGalleryImage(index);
      });
    });

    showGalleryImage(0);
  };

  // Listing slideshows use the same gallery as the map cards
  document.querySelectorAll('.listing .pin-gallery, .vl-plan .pin-gallery, .ct-plan .pin-gallery').forEach(initializeGallery);

  // Cottage lot map (cottage-lots.js): a marker per lot; selecting one fills the detail card
  const cottageLots = window.MIDDLEBROOK_COTTAGE_LOTS;
  if (cottageLots) {
    const lots = cottageLots.lots || [];
    const soldCount = lots.filter((lot) => lot.sold).length;
    document.querySelectorAll('[data-lots-hero]').forEach((el) => { el.textContent = `${soldCount} of ${lots.length} sold`; });
    document.querySelectorAll('[data-lots-sold]').forEach((el) => { el.textContent = soldCount; });
    document.querySelectorAll('[data-lots-available]').forEach((el) => { el.textContent = lots.length - soldCount; });

    const money = (n) => `$${Number(n).toLocaleString('en-US')}`;
    const names = {
      plan: { one: 'One-story cottage', two: 'Two-story cottage' },
      pkg: { A: 'Package A · Buttercream paint', B: 'Package B · Fawn stain' },
      siding: { light: 'Worldly Grey', dark: 'Iron Ore' },
      accent: { oak: 'Sunbleached Oak', walnut: 'Cinnamon Walnut' }
    };

    document.querySelectorAll('[data-lot-map]').forEach((section) => {
      const markers = section.querySelector('[data-lot-markers]');
      const card = section.querySelector('[data-lot-card]');
      markers.innerHTML = lots.map((lot) => `
        <button type="button" class="ct-lot${lot.sold ? ' is-sold' : ''}" style="left: ${lot.x}%; top: ${lot.y}%;" data-lot="${lot.lot}"
          aria-label="Lot ${lot.lot}, ${escapeHtml(lot.address)}, ${names.plan[lot.plan]}${lot.sold ? ', sold' : ''}" aria-pressed="false">${lot.sold ? '<span class="ct-lot-sold accent" aria-hidden="true">S</span>' : `<span class="ct-dot ct-dot--${lot.pkg === 'A' ? 'paint' : 'stain'}"></span><span class="ct-dot ct-dot--${lot.siding}"></span><span class="ct-dot ct-dot--${lot.accent}"></span>`}</button>`).join('');

      const show = (lot) => {
        const base = cottageLots.basePrice[lot.plan];
        const price = lot.premium ? `${money(base + lot.premium)}<small>${money(base)} + ${money(lot.premium)} lot premium</small>` : money(base);
        const subject = encodeURIComponent(`Cottage lot ${lot.lot}, ${lot.address}`);
        card.innerHTML = `
          <div class="ct-lot-card-head">
            <p class="accent ct-lot-number">Lot ${lot.lot}</p>
            ${lot.sold ? '<span class="pin-tag ct-lot-status">Sold</span>' : '<span class="pin-tag ct-lot-status is-open">Available</span>'}
          </div>
          <h3 class="serif">${escapeHtml(lot.address)}</h3>
          <p class="ct-lot-plan">${names.plan[lot.plan]}</p>
          ${lot.sold ? '' : `<p class="accent ct-lot-price">${price}</p>`}
          <dl class="ct-lot-finishes">
            <div><dt>Interior</dt><dd><span class="ct-dot ct-dot--${lot.pkg === 'A' ? 'paint' : 'stain'}"></span>${names.pkg[lot.pkg]}</dd></div>
            <div><dt>Siding</dt><dd><span class="ct-dot ct-dot--${lot.siding}"></span>${names.siding[lot.siding]}</dd></div>
            <div><dt>Accent</dt><dd><span class="ct-dot ct-dot--${lot.accent}"></span>${names.accent[lot.accent]}</dd></div>
          </dl>
          ${lot.sold ? '' : `<p class="ct-lot-contact">Ask about this lot: email <a href="mailto:kalen@peoplescompany.com?subject=${subject}">Kalen</a> or <a href="mailto:keaton@peoplescompany.com?subject=${subject}">Keaton</a></p>`}`;
        markers.querySelectorAll('.ct-lot').forEach((m) => m.setAttribute('aria-pressed', String(Number(m.dataset.lot) === lot.lot)));
      };

      markers.addEventListener('click', (event) => {
        const marker = event.target.closest('.ct-lot');
        if (marker) show(lots.find((lot) => lot.lot === Number(marker.dataset.lot)));
      });
      const firstOpen = lots.find((lot) => !lot.sold);
      if (firstOpen) show(firstOpen);
    });
  }

  // Tabs ([data-tabs]): click or arrow keys switch panels
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });

  // Geothermal diagram: Winter / Summer buttons switch the flow direction and the explanation
  document.querySelectorAll('[data-geo-season]').forEach((section) => {
    const buttons = section.querySelectorAll('[data-season]');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const season = button.dataset.season;
      section.dataset.geoSeason = season;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      section.querySelectorAll('[data-season-text]').forEach((text) => { text.hidden = text.dataset.seasonText !== season; });
    }));
  });

  // Exterior color switch (Cottages): Light / Dark buttons swap which elevation shows
  document.querySelectorAll('[data-exterior]').forEach((block) => {
    const buttons = block.querySelectorAll('[data-exterior-option]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const option = button.dataset.exteriorOption;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        block.querySelectorAll('[data-exterior-img]').forEach((img) => { img.hidden = img.dataset.exteriorImg !== option; });
      });
    });
  });

  // Photos close to the frame's shape fill it edge to edge (a slight crop), so no thin blurred strip shows.
  // Clearly different shapes (tall photos, floor plans) keep the full image on a blurred backdrop.
  document.querySelectorAll('.listing-photo-open img').forEach((img) => {
    const fit = () => {
      const frame = img.closest('.listing-photo');
      if (!img.naturalWidth || !frame || !frame.clientHeight) return;
      const difference = (img.naturalWidth / img.naturalHeight) / (frame.clientWidth / frame.clientHeight);
      img.closest('.listing-photo-open').classList.toggle('is-fill', difference > 0.82 && difference < 1.22);
    };
    if (img.complete) fit(); else img.addEventListener('load', fit, { once: true });
  });

  // Lightbox: click any photo inside a [data-lightbox-group] to see it full screen, then step through the group
  const lightboxGroups = document.querySelectorAll('[data-lightbox-group]');
  if (lightboxGroups.length) {
    const lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-label', 'Photo viewer');
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close photo viewer"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg></button>
      <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg></button>
      <figure class="lightbox-figure"><img alt=""><figcaption class="lightbox-caption"><span data-lightbox-alt></span><span class="lightbox-count" data-lightbox-count></span></figcaption></figure>
      <button class="lightbox-arrow lightbox-next" type="button" aria-label="Next photo"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></button>`;
    document.body.appendChild(lightbox);
    const lightboxImage = lightbox.querySelector('img');
    let lightboxPhotos = [];
    let lightboxIndex = 0;

    const showLightbox = (index) => {
      lightboxIndex = (index + lightboxPhotos.length) % lightboxPhotos.length;
      const photo = lightboxPhotos[lightboxIndex];
      lightboxImage.src = photo.currentSrc || photo.src;
      lightboxImage.alt = photo.alt;
      lightbox.querySelector('[data-lightbox-alt]').textContent = photo.alt;
      lightbox.querySelector('[data-lightbox-count]').textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;
      lightbox.classList.toggle('is-single', lightboxPhotos.length < 2);
    };

    lightboxGroups.forEach((group) => {
      group.addEventListener('click', (event) => {
        const image = event.target.closest('img');
        if (!image || !group.contains(image)) return;
        lightboxPhotos = Array.from(group.querySelectorAll('img'));
        showLightbox(lightboxPhotos.indexOf(image));
        lightbox.showModal();
      });
    });

    // A button with data-open-photo="N" opens photo N of the photo group in its row (used for floor plans)
    document.querySelectorAll('[data-open-photo]').forEach((button) => {
      const group = button.closest('li, section').querySelector('[data-lightbox-group]');
      if (!group) return;
      button.addEventListener('click', () => {
        lightboxPhotos = Array.from(group.querySelectorAll('img'));
        showLightbox(Number(button.dataset.openPhoto) || 0);
        lightbox.showModal();
      });
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showLightbox(lightboxIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showLightbox(lightboxIndex + 1));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
      if (event.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
    });
  }

  featuredPins.forEach((pin) => {
    constrainTooltip(pin);
    initializeGallery(pin.querySelector('.pin-gallery'));

    // Only some featured pins have a video; skip the video wiring for the rest
    const videoDialog = pin.querySelector('.townhome-video-dialog');
    const videoButton = pin.querySelector('.pin-video-button');
    if (videoDialog && videoButton) {
      const townhomeVideo = videoDialog.querySelector('video');

      videoButton.addEventListener('click', () => {
        pin.classList.add('is-active');
        videoDialog.showModal();
        townhomeVideo.play().catch(() => {});
      });

      videoDialog.querySelector('.townhome-video-close').addEventListener('click', () => {
        videoDialog.close();
      });

      videoDialog.addEventListener('close', () => {
        townhomeVideo.pause();
        townhomeVideo.currentTime = 0;
      });
    }

    pin.addEventListener('click', (event) => {
      if (event.target.closest('a, button, dialog')) {
        return;
      }

      const isOpen = pin.classList.contains('is-active');
      pin.classList.toggle('is-active', !isOpen);
    });

    pin.addEventListener('mouseleave', () => {
      if (!pin.matches(':focus-within')) {
        pin.classList.remove('is-active');
      }
    });

    pin.addEventListener('focusin', () => {
      pin.classList.add('is-active');
    });

    pin.addEventListener('focusout', (event) => {
      if (!pin.contains(event.relatedTarget)) {
        pin.classList.remove('is-active');
      }
    });

    ['mouseenter', 'focusin', 'pointerdown'].forEach((type) => pin.addEventListener(type, () => constrainTooltip(pin)));
  });

  initializeGallery(document.querySelector('.event-gallery'));

  const residentVideoButton = document.querySelector('.resident-video-button');
  const residentVideoDialog = document.querySelector('.resident-video-dialog');

  if (residentVideoButton && residentVideoDialog) {
    const residentVideoFrame = residentVideoDialog.querySelector('iframe');

    residentVideoButton.addEventListener('click', () => {
      residentVideoDialog.showModal();
      residentVideoFrame.src = residentVideoFrame.dataset.embedSrc;
    });

    residentVideoDialog.querySelector('.townhome-video-close').addEventListener('click', () => {
      residentVideoDialog.close();
    });

    residentVideoDialog.addEventListener('close', () => {
      residentVideoFrame.removeAttribute('src');
    });
  }

  // Generic pop-ups: a button with data-dialog-open="ID" opens <dialog id="ID">; data-dialog-close closes it
  document.querySelectorAll('[data-dialog-open]').forEach((button) => {
    const dialog = document.getElementById(button.dataset.dialogOpen);
    if (!dialog) {
      return;
    }
    button.addEventListener('click', () => dialog.showModal());
    dialog.querySelectorAll('[data-dialog-close]').forEach((close) => {
      close.addEventListener('click', () => dialog.close());
    });
  });

  // Photo strips (data-gallery): the arrows scroll most of a screen at a time and dim at either end
  document.querySelectorAll('[data-gallery]').forEach((scroller) => {
    const section = scroller.parentElement;
    const prev = section.querySelector('[data-gallery-prev]');
    const next = section.querySelector('[data-gallery-next]');
    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (prev) prev.disabled = scroller.scrollLeft <= 4;
      if (next) next.disabled = scroller.scrollLeft >= max - 4;
    };
    const go = (direction) => scroller.scrollBy({ left: direction * scroller.clientWidth * 0.85 });
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
    scroller.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    });
    scroller.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Any button with data-video-src="file.mp4" plays that video in a shared pop-up (site-hosted video)
  const fileVideoButtons = document.querySelectorAll('[data-video-src]');

  if (fileVideoButtons.length) {
    const fileDialog = document.createElement('dialog');
    fileDialog.className = 'townhome-video-dialog';
    fileDialog.setAttribute('aria-labelledby', 'file-video-title');
    fileDialog.innerHTML = `
      <div class="townhome-video-heading">
        <h2 id="file-video-title"></h2>
        <button class="townhome-video-close" type="button" aria-label="Close video">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>
        </button>
      </div>
      <video controls playsinline preload="none"></video>`;
    document.body.appendChild(fileDialog);
    const fileVideo = fileDialog.querySelector('video');

    fileVideoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        fileDialog.querySelector('h2').textContent = button.dataset.title || 'Video';
        fileVideo.src = button.dataset.videoSrc;
        if (button.dataset.videoPoster) {
          fileVideo.poster = button.dataset.videoPoster;
        }
        fileDialog.showModal();
        fileVideo.play().catch(() => {});
      });
    });

    fileDialog.querySelector('.townhome-video-close').addEventListener('click', () => fileDialog.close());
    fileDialog.addEventListener('close', () => {
      fileVideo.pause();
      fileVideo.removeAttribute('src');
      fileVideo.load();
    });
  }

  // Any button with data-youtube="VIDEO_ID" plays that video in a shared pop-up
  const youtubeButtons = document.querySelectorAll('[data-youtube]');

  if (youtubeButtons.length) {
    const youtubeDialog = document.createElement('dialog');
    youtubeDialog.className = 'townhome-video-dialog youtube-dialog';
    youtubeDialog.setAttribute('aria-labelledby', 'youtube-dialog-title');
    youtubeDialog.innerHTML = `
      <div class="townhome-video-heading">
        <h2 id="youtube-dialog-title"></h2>
        <button class="townhome-video-close" type="button" aria-label="Close video">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>
        </button>
      </div>
      <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    document.body.appendChild(youtubeDialog);

    const youtubeFrame = youtubeDialog.querySelector('iframe');

    youtubeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.youtube;
        const start = parseInt(button.dataset.start, 10) || 0;
        youtubeDialog.querySelector('h2').textContent = button.dataset.title || 'Video';
        youtubeFrame.title = button.dataset.title || 'Video';
        youtubeFrame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&start=${start}`;
        youtubeDialog.showModal();
      });
    });

    youtubeDialog.querySelector('.townhome-video-close').addEventListener('click', () => youtubeDialog.close());
    youtubeDialog.addEventListener('close', () => youtubeFrame.removeAttribute('src'));
  }

  const fridaysVideoButton = document.querySelector('.event-video-button');
  const fridaysVideoDialog = document.querySelector('.fridays-video-dialog');

  if (fridaysVideoButton && fridaysVideoDialog) {
    const fridaysVideo = fridaysVideoDialog.querySelector('video');

    fridaysVideoButton.addEventListener('click', () => {
      fridaysVideoDialog.showModal();
      fridaysVideo.play().catch(() => {});
    });

    fridaysVideoDialog.querySelector('.townhome-video-close').addEventListener('click', () => {
      fridaysVideoDialog.close();
    });

    fridaysVideoDialog.addEventListener('close', () => {
      fridaysVideo.pause();
      fridaysVideo.currentTime = 0;
    });
  }

  window.addEventListener('resize', () => {
    featuredPins.forEach((pin) => constrainTooltip(pin));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.pin-video-button, .resident-video-button, .event-video-button, [data-youtube], [data-dialog-open], [data-video-src]')) {
      // The map drawer handles its own backdrop clicks (see map.js)
      document.querySelectorAll('dialog[open]:not(.map-drawer)').forEach((dialog) => {
        const bounds = dialog.getBoundingClientRect();
        const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (clickedOutside) {
          dialog.close();
        }
      });
    }

    featuredPins.forEach((pin) => {
      if (!pin.contains(event.target)) {
        pin.classList.remove('is-active');
      }
    });
  });
});
