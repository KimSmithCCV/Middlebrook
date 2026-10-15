/*
  FARM STAND: CURRENT AVAILABILITY
  The Town Garden page shows this whole list in its "At the Farm Stand" card.
  The home page "This week" Farm Stand card shows the first few items from it automatically.

  How to update it:
  - Change "updated" to today's date, written out (for example 'Friday, September 18, 2026').
  - Edit, add, or delete lines in "items". Keep the commas and braces as they are.
  - "price" and "note" are optional; delete either one if an item does not need it.
  - "short" is optional: how the item reads mid-sentence on the home page when it includes a proper
    name (for example 'Red Norland potatoes' or 'Walla Walla onions'). Without it, the name is lowercased.
  - Put the items you most want people to see first. The home page shows the first four.
  - Copy rules: no em dashes, no "&".
*/

window.MIDDLEBROOK_FARM_STAND = {
  updated: 'Friday, September 18, 2026',
  items: [
    { name: 'Sweet Peppers', price: '$5' },
    { name: 'Yellow Watermelon', price: '$5' },
    { name: 'Red Norland Potatoes', price: '$5', short: 'Red Norland potatoes' },
    { name: 'Local Honey', price: '$7' },
    { name: 'Green Cabbage', price: '$5' },
    { name: 'Red Cabbage', price: '$5' },
    { name: 'Jalapenos', price: '$5' },
    { name: 'Sweet Banana Peppers', price: '$5' },
    { name: 'Snacking Cucumbers', price: '$5' },
    { name: 'Arava Green Melon', price: '$5', short: 'Arava green melon' },
    { name: 'Zucchini', price: '$2' },
    { name: 'Red Onions', price: '$6' },
    { name: 'Walla Walla Onions', price: '$5', short: 'Walla Walla onions' },
    { name: 'Red Chesnok Seed Garlic', price: '$15/lb', short: 'Red Chesnok seed garlic' },
    { name: 'Dried Birdhouse Gourd', price: '$5' },
    { name: 'Pumpkins', price: '$6 each or 3/$15', note: 'Under the shelter south of the Farm Stand' },
    { name: 'You-Pick Flowers', note: 'Instructions, shears, vases, and water are inside the Farm Stand' }
  ]
};
