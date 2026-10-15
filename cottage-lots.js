/*
  COTTAGE LOTS (Design Options sheet, Cottages/Add ons Fixtures/Design Options.pdf)
  Draws the clickable lot map on the Cottages page and the sold count in its hero.

  How to update it:
  - When a lot sells, change its sold: false to sold: true. The map and the "sold" count update on their own.
  - plan: 'one' or 'two'. pkg: 'A' (Buttercream paint) or 'B' (Fawn stain).
  - siding: 'light' (Worldly Grey) or 'dark' (Iron Ore). accent: 'oak' (Sunbleached Oak) or 'walnut' (Cinnamon Walnut).
  - premium is the lot premium in dollars (0 for none).
  - x and y place the lot's marker on its house in the aerial rendering, as a percent from the left and top edges.
*/

window.MIDDLEBROOK_COTTAGE_LOTS = {
  basePrice: { one: 334900, two: 319900 },
  lots: [
    { lot: 1, address: '3000 Saddle Way', plan: 'one', pkg: 'A', siding: 'light', accent: 'oak', premium: 5000, sold: false, x: 12.3, y: 64.0 },
    { lot: 2, address: '3001 Saddle Way', plan: 'two', pkg: 'A', siding: 'light', accent: 'walnut', premium: 0, sold: false, x: 12.3, y: 58.1 },
    { lot: 3, address: '3002 Saddle Way', plan: 'one', pkg: 'A', siding: 'dark', accent: 'walnut', premium: 5000, sold: false, x: 12.3, y: 52.7 },
    { lot: 4, address: '3003 Saddle Way', plan: 'two', pkg: 'B', siding: 'dark', accent: 'oak', premium: 5000, sold: false, x: 12.3, y: 41.9 },
    { lot: 5, address: '3004 Saddle Way', plan: 'one', pkg: 'B', siding: 'light', accent: 'oak', premium: 0, sold: false, x: 12.3, y: 36.3 },
    { lot: 6, address: '3005 Saddle Way', plan: 'two', pkg: 'A', siding: 'light', accent: 'walnut', premium: 10000, sold: false, x: 12.3, y: 30.5 },
    { lot: 7, address: '3006 Spoke Drive', plan: 'two', pkg: 'A', siding: 'dark', accent: 'oak', premium: 10000, sold: true, x: 28.3, y: 37.8 },
    { lot: 8, address: '3008 Spoke Drive', plan: 'one', pkg: 'B', siding: 'light', accent: 'oak', premium: 10000, sold: true, x: 33.4, y: 37.6 },
    { lot: 9, address: '3010 Spoke Drive', plan: 'two', pkg: 'B', siding: 'light', accent: 'walnut', premium: 10000, sold: false, x: 38.3, y: 36.6 },
    { lot: 10, address: '3012 Spoke Drive', plan: 'one', pkg: 'B', siding: 'dark', accent: 'walnut', premium: 10000, sold: true, x: 43.3, y: 35.8 },
    { lot: 11, address: '3014 Spoke Drive', plan: 'two', pkg: 'B', siding: 'dark', accent: 'oak', premium: 10000, sold: false, x: 48.5, y: 35.2 },
    { lot: 12, address: '3016 Spoke Drive', plan: 'one', pkg: 'A', siding: 'light', accent: 'oak', premium: 10000, sold: false, x: 53.1, y: 34.3 },
    { lot: 13, address: '3018 Spoke Drive', plan: 'two', pkg: 'A', siding: 'light', accent: 'walnut', premium: 10000, sold: false, x: 57.8, y: 33.4 },
    { lot: 14, address: '3020 Spoke Drive', plan: 'one', pkg: 'A', siding: 'dark', accent: 'walnut', premium: 10000, sold: true, x: 63.0, y: 32.6 },
    { lot: 15, address: '3022 Spoke Drive', plan: 'two', pkg: 'A', siding: 'dark', accent: 'oak', premium: 10000, sold: true, x: 68.3, y: 32.0 },
    { lot: 16, address: '3024 Spoke Drive', plan: 'one', pkg: 'B', siding: 'light', accent: 'oak', premium: 10000, sold: true, x: 73.2, y: 31.6 },
    { lot: 17, address: '3026 Spoke Drive', plan: 'two', pkg: 'B', siding: 'light', accent: 'walnut', premium: 10000, sold: true, x: 78.2, y: 32.0 },
    { lot: 18, address: '3028 Spoke Drive', plan: 'one', pkg: 'A', siding: 'dark', accent: 'walnut', premium: 10000, sold: true, x: 83.1, y: 32.0 },
    { lot: 19, address: '3029 Spoke Drive', plan: 'two', pkg: 'B', siding: 'dark', accent: 'oak', premium: 5000, sold: true, x: 82.6, y: 56.4 },
    { lot: 20, address: '3027 Spoke Drive', plan: 'one', pkg: 'B', siding: 'light', accent: 'oak', premium: 0, sold: true, x: 77.6, y: 56.2 },
    { lot: 21, address: '3025 Spoke Drive', plan: 'two', pkg: 'B', siding: 'light', accent: 'walnut', premium: 0, sold: false, x: 72.5, y: 56.4 },
    { lot: 22, address: '3023 Spoke Drive', plan: 'one', pkg: 'B', siding: 'dark', accent: 'walnut', premium: 0, sold: false, x: 67.7, y: 55.8 },
    { lot: 23, address: '3021 Spoke Drive', plan: 'two', pkg: 'A', siding: 'dark', accent: 'oak', premium: 0, sold: false, x: 61.9, y: 56.7 },
    { lot: 24, address: '3019 Spoke Drive', plan: 'one', pkg: 'B', siding: 'light', accent: 'oak', premium: 0, sold: false, x: 57.3, y: 57.0 },
    { lot: 25, address: '3017 Spoke Drive', plan: 'two', pkg: 'B', siding: 'light', accent: 'walnut', premium: 0, sold: false, x: 52.0, y: 57.9 },
    { lot: 26, address: '3015 Spoke Drive', plan: 'one', pkg: 'B', siding: 'dark', accent: 'walnut', premium: 0, sold: false, x: 47.1, y: 58.1 },
    { lot: 27, address: '3013 Spoke Drive', plan: 'two', pkg: 'A', siding: 'dark', accent: 'oak', premium: 0, sold: false, x: 42.1, y: 58.7 },
    { lot: 28, address: '3011 Spoke Drive', plan: 'one', pkg: 'A', siding: 'light', accent: 'oak', premium: 0, sold: false, x: 37.2, y: 59.1 },
    { lot: 29, address: '3009 Spoke Drive', plan: 'two', pkg: 'A', siding: 'light', accent: 'walnut', premium: 0, sold: false, x: 32.3, y: 59.7 },
    { lot: 30, address: '3007 Spoke Drive', plan: 'one', pkg: 'A', siding: 'dark', accent: 'walnut', premium: 5000, sold: true, x: 27.5, y: 59.9 }
  ]
};
