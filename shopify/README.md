# Studio table — Shopify header section

`sections/studio-table-header.liquid` is a self-contained Shopify section: the
drawn table + wares, the painted wordmark, brand type and colour, and the
lamp-cord scheme flip. No theme assets or app blocks required — CSS and JS are
inlined and scoped to the section id.

## Brand (per https://antonblomster.github.io/studiotable/brand/)

| Token        | Value     | Use                                   |
|--------------|-----------|---------------------------------------|
| Blue         | `#1A16E8` | primary ink                           |
| Deep blue    | `#100C9E` | large fills / shadows                 |
| Paper beige  | `#FAF6EC` | primary background                    |
| Beige        | `#F4EFE3` | ink when background is blue           |
| Sand         | `#E7DEC9` | quiet surfaces / borders              |

- Body / tagline / caps: **Crimson Pro** (loaded from Google Fonts).
- Wordmark: **Times italic**, painted (SVG displacement filter).
- Address line: Crimson Pro 600, +0.22em tracking, uppercase.
- Blue & beige only — never a third colour.

## Install ("mattias edit" theme)

1. Shopify admin → **Online Store → Themes**.
2. On *mattias edit* → **⋯ → Edit code**.
3. **Sections → Add a new section** → name it `studio-table-header` → replace the
   generated file with the contents of `studio-table-header.liquid`. Save.
4. Add it to the page:
   - **As the site header** — open `sections/header-group.json` (or whichever
     group your theme renders at the top) and add
     `"studio-table-header": { "type": "studio-table-header", "settings": {} }`
     plus its id in the `"order"` array. Or:
   - **Via the editor** — Themes → **Customize** → pick a template → **Add
     section** → *Studio table header*.
5. Section settings: wordmark, tagline, the two address lines, background
   (beige / blue), and height.

## Notes

- Visitors flip the scheme by pulling the lamp cord; the section starts on the
  background chosen in settings.
- Wares are draggable along the tabletop. Respects `prefers-reduced-motion`.
- Source of truth for the animation is the repo root: `index.html`, `objects.js`,
  `motion-lab.js`. If those change, re-port the relevant bits here.
