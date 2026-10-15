/*
  RESIDENT QUOTES
  Each page shows one quote. The page picks its quote by name, for example:
    <section class="resident-voices" data-testimonial="home">
  Keeping every quote here makes it easy to see the whole set at once and avoid repeats.

  How to update it:
  - Edit the text between the quote marks. Keep the commas and braces as they are.
  - "name" is how the resident is credited, for example "Angela, resident".
  - "photo" and "alt" are optional. The photo fills the right side of the section; "alt" describes it
    for screen readers. Leave both out and the quote spans the full width instead.
  - Anything in [square brackets] shows up highlighted on the page as unfinished.
  - All quotes below are placeholders. Replace them with real resident quotes (with permission) before launch.
  - Fair housing: let residents describe what they like about a home or the neighborhood, but do not
    pair a home type with an age group or family role in the credit line or surrounding copy.
*/

window.MIDDLEBROOK_TESTIMONIALS = {
  home: {
    quote: 'It gives a piece of country life, while still being just minutes away from the urban center of Des Moines.',
    name: '[Name], resident',
    photo: 'images/home/Fridays-at-the-Farm/02-middlebrook-fridays-at-the-farm-picnic-gathering.webp',
    alt: 'Friends and family gather around a picnic table at Fridays at the Farm'
  },
  fridays: {
    quote: 'Fridays at the Farm turned into a weekly ritual for us. It is the kind of place where the community really shows up.',
    name: 'Robert, resident',
    photo: 'images/middlebrook-fridays-at-the-farm-farmhouse-porch-band.webp',
    alt: 'A band playing on the Farmhouse porch as guests gather on the lawn at Fridays at the Farm'
  },
  vision: {
    quote: 'The neighborhood feels layered and lived in, not staged. It gives you room to grow and room to gather, all at the same time.',
    name: 'Angela, resident',
    photo: 'images/middlebrook-neighborhood-residents-on-sidewalk.webp',
    alt: 'Neighbors walking along a curving sidewalk past homes in Middlebrook'
  },
  townhomes: { quote: '[Quote about living in The Townhomes]', name: '[Name], resident' },
  cottages: { quote: '[Quote about living in The Cottages]', name: '[Name], resident' },
  villas: { quote: '[Quote about living in The Villas]', name: '[Name], resident' },
  lofts: { quote: '[Quote about living in The Lofts]', name: '[Name], resident' },
  'single-family': { quote: '[Quote about building a single-family home]', name: '[Name], resident' },
  geothermal: { quote: '[Quote about living with geothermal: comfort, quiet, no outdoor unit]', name: '[Name], resident' },
  visit: { quote: '[Quote about walking to the shops, trails, or Town Garden]', name: '[Name], resident' }
};
