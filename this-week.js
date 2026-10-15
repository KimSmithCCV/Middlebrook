/*
  THIS WEEK AT MIDDLEBROOK
  The home page strip under the hero reads from this list.

  How to update it:
  - Edit the text between the quote marks. Keep the commas and braces as they are.
  - "label" is the small heading, "title" is the large line, and "detail" is the sentence underneath.
  - "link" is optional. Delete the whole link line if a card does not need one.
  - "showFrom" and "showUntil" are optional dates (YEAR-MONTH-DAY). A card only appears
    between those dates, so you can load next week's cards early or let old ones expire on their own.
  - Anything in [square brackets] shows up highlighted on the page as unfinished.
    Replace it with the real detail before publishing.
  - The "Week of" date at the top of the strip updates itself.
  - Copy rules: no em dashes, no "&" in titles or details, times as 5:30 PM.
*/

window.MIDDLEBROOK_THIS_WEEK = [
  {
    label: 'Fridays at the Farm',
    title: 'The 2026 season is a wrap',
    detail: 'Thank you for spending your Fridays with us. The 2027 lineup is announced in [month].',
    link: { text: 'Get lineup updates', href: '#newsletter' },
    showUntil: '2027-04-30'
  },
  {
    label: 'Farm Stand',
    title: 'Open daylight hours',
    // {produce} fills in automatically from the first few items in farm-stand.js
    detail: 'Self-service through October. On the shelves: {produce}.',
    link: { text: 'Full Farm Stand list', href: 'town-garden.html#farm-stand' }
  },
  {
    label: 'Open Houses',
    title: '[Day], [start time] to [end time]',
    detail: '[Home or neighborhood], [address].',
    link: { text: 'See homes for sale', href: '#' }
  },
  {
    label: 'Porchfest',
    title: '[Date]',
    detail: '[Start time] to [end time], [where].',
    link: { text: 'Porchfest details', href: '#' }
  }
];
