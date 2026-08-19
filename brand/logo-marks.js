/* =====================================================================
   Studio table — logo mark builders  (v2)
   • The "table / portal" glyph across a clean → painterly spectrum
   • A library of hand-drawn interior objects (flowers, bowls, lamps,
     trinkets…) that sit ON a long table — the shop's wares.
   Roughness via per-SVG feTurbulence + feDisplacementMap.
   Exports: window.Mark, window.markSVG, window.Table, window.tableSVG,
            window.OBJECT_NAMES, window.MARK_ROUGH
   ===================================================================== */
(function () {
  const ROUGH = {
    clean: null,
    soft:  { scale: 2.4, bf: 0.013, oct: 2 },
    med:   { scale: 5.0, bf: 0.013, oct: 2 },
    rough: { scale: 9.0, bf: 0.012, oct: 3 },
    brush: { scale: 14,  bf: 0.011, oct: 3 },
    sketch:{ scale: 3.5, bf: 0.045, oct: 2 },
  };

  // ---- core table glyph variants (0..200 box) ---------------------------
  const V = {
    signature: (c) =>
      `<path d="M22,50 H178 V70 H160 V160 H140 V70 H60 V160 H40 V70 H22 Z" fill="${c}"/>`,
    flat: (c) =>
      `<path d="M30,52 H170 V160 H150 V72 H50 V160 H30 Z" fill="${c}"/>`,
    fourLeg: (c) =>
      `<rect x="24" y="50" width="152" height="22" fill="${c}"/>` +
      `<rect x="36" y="72" width="16" height="86" fill="${c}"/>` +
      `<rect x="74" y="72" width="16" height="86" fill="${c}"/>` +
      `<rect x="110" y="72" width="16" height="86" fill="${c}"/>` +
      `<rect x="148" y="72" width="16" height="86" fill="${c}"/>`,
    line: (c) =>
      `<path d="M26,66 H174 M44,68 V158 M156,68 V158" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`,
  };

  // ---- drawn objects ----------------------------------------------------
  // Each: (c, sw) => markup. Baseline at y=0 (sits on tabletop), centred on
  // x=0, drawn upward (negative y). Stroke art so they read as "drawn".
  function S(c, sw, extra) {
    return `fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra || ""}`;
  }
  const OBJECTS = {
    vaseFlowers: (c, sw) => `
      <path d="M-11,0 Q-15,-26 0,-30 Q15,-26 11,0 Z" ${S(c, sw)}/>
      <path d="M0,-30 C-3,-44 -12,-50 -14,-62" ${S(c, sw)}/>
      <path d="M0,-30 C0,-48 0,-58 0,-70" ${S(c, sw)}/>
      <path d="M0,-30 C3,-44 12,-50 14,-60" ${S(c, sw)}/>
      <circle cx="-14" cy="-64" r="5" ${S(c, sw)}/>
      <circle cx="0" cy="-72" r="5.5" ${S(c, sw)}/>
      <circle cx="14" cy="-62" r="5" ${S(c, sw)}/>`,
    bowl: (c, sw) => `
      <ellipse cx="0" cy="-14" rx="20" ry="4.5" ${S(c, sw)}/>
      <path d="M-19,-14 Q0,14 19,-14" ${S(c, sw)}/>
      <circle cx="-6" cy="-15" r="3.6" ${S(c, sw)}/>
      <circle cx="6" cy="-16" r="3.6" ${S(c, sw)}/>`,
    books: (c, sw) => `
      <path d="M-22,0 H16 V-9 H-22 Z" ${S(c, sw)}/>
      <path d="M-18,-9 H20 V-18 H-18 Z" ${S(c, sw)}/>
      <path d="M-13,-18 H13 V-28 H-13 Z" ${S(c, sw)}/>
      <path d="M-9,-23 H9" ${S(c, sw)}/>`,
    lamp: (c, sw) => `
      <path d="M-9,0 L-5,-7 H5 L9,0 Z" ${S(c, sw)}/>
      <path d="M0,-7 V-30" ${S(c, sw)}/>
      <path d="M-16,-30 L-9,-52 H9 L16,-30 Z" ${S(c, sw)}/>`,
    plant: (c, sw) => `
      <path d="M-11,0 L-9,-13 H9 L11,0 Z" ${S(c, sw)}/>
      <path d="M0,-13 C-13,-22 -15,-40 -5,-50" ${S(c, sw)}/>
      <path d="M0,-13 C0,-30 0,-44 0,-56" ${S(c, sw)}/>
      <path d="M0,-13 C13,-22 15,-40 5,-50" ${S(c, sw)}/>`,
    candle: (c, sw) => `
      <path d="M-6,0 L-4,-6 H4 L6,0 Z" ${S(c, sw)}/>
      <path d="M-6,-6 Q0,-3 6,-6" ${S(c, sw)}/>
      <path d="M0,-6 V-40" ${S(c, sw)}/>
      <path d="M0,-40 C-4,-46 -1,-53 0,-54 C1,-53 4,-46 0,-40 Z" ${S(c, sw)}/>`,
    clock: (c, sw) => `
      <path d="M-15,0 V-22 Q-15,-32 0,-32 Q15,-32 15,-22 V0 Z" ${S(c, sw)}/>
      <circle cx="0" cy="-17" r="8" ${S(c, sw)}/>
      <path d="M0,-17 V-23 M0,-17 L5,-14" ${S(c, sw)}/>
      <path d="M-11,0 V4 M11,0 V4" ${S(c, sw)}/>`,
    teapot: (c, sw) => `
      <path d="M-15,-6 Q-15,-21 0,-21 Q15,-21 15,-6 Q15,0 0,0 Q-15,0 -15,-6 Z" ${S(c, sw)}/>
      <path d="M-15,-13 C-23,-15 -25,-21 -23,-25" ${S(c, sw)}/>
      <path d="M15,-15 C22,-15 22,-5 15,-5" ${S(c, sw)}/>
      <path d="M-6,-21 Q0,-28 6,-21" ${S(c, sw)}/>
      <circle cx="0" cy="-29" r="2.6" ${S(c, sw)}/>`,
    pitcher: (c, sw) => `
      <path d="M-9,0 L-11,-22 Q-11,-29 -5,-30 L5,-30 Q11,-29 11,-22 L9,0 Z" ${S(c, sw)}/>
      <path d="M5,-30 L11,-34" ${S(c, sw)}/>
      <path d="M-11,-24 C-19,-22 -19,-9 -9,-7" ${S(c, sw)}/>`,
    trinkets: (c, sw) => `
      <circle cx="-14" cy="-6" r="6" ${S(c, sw)}/>
      <path d="M-18,0 H-10" ${S(c, sw)}/>
      <path d="M-1,0 H12 V-12 H-1 Z" ${S(c, sw)}/>
      <path d="M17,0 L22,-15 L27,0 Z" ${S(c, sw)}/>`,
    frame: (c, sw) => `
      <path d="M-15,0 H15 V-26 H-15 Z" ${S(c, sw)}/>
      <path d="M-10,-5 H10 V-21 H-10 Z" ${S(c, sw)}/>
      <path d="M6,0 L12,7" ${S(c, sw)}/>`,
    cup: (c, sw) => `
      <path d="M-14,-1 Q0,5 14,-1" ${S(c, sw)}/>
      <path d="M-9,-14 V-3 Q-9,-1 0,-1 Q9,-1 9,-3 V-14 Z" ${S(c, sw)}/>
      <path d="M9,-12 Q15,-11 13,-6" ${S(c, sw)}/>
      <path d="M-9,-14 H9" ${S(c, sw)}/>`,
  };

  // ---- filter helper ----------------------------------------------------
  function filterDefs(r, seed) {
    if (!r || !r.scale) return ["", ""];
    const id = `f${seed}_${Math.round(r.scale * 10)}_${Math.round(r.bf * 1000)}`;
    const def =
      `<defs><filter id="${id}" x="-25%" y="-25%" width="150%" height="150%">` +
      `<feTurbulence type="turbulence" baseFrequency="${r.bf}" numOctaves="${r.oct || 2}" seed="${seed}" result="n"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="n" scale="${r.scale}" xChannelSelector="R" yChannelSelector="G"/>` +
      `</filter></defs>`;
    return [def, ` filter="url(#${id})"`];
  }

  let _uid = 0;
  function markSVG(opts) {
    const { variant = "signature", rough = "med", color = "#1A16E8", size = 200, seed = (++_uid % 97) + 1 } = opts || {};
    const inner = (V[variant] || V.signature)(color);
    const r = typeof rough === "string" ? ROUGH[rough] : rough;
    const [def, attr] = filterDefs(r, seed);
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${def}<g${attr}>${inner}</g></svg>`;
  }

  // ---- long shelf-table builder ----------------------------------------
  function tableSVG(opts) {
    const {
      w = 200, bar = 18, legW = 18, color = "#1A16E8",
      objects = [], objSw = 4, rough = "soft", seed = (++_uid % 97) + 1,
      width, height,
    } = opts || {};
    const pad = 14, baseY = 186, topEdge = 118;
    const barBot = topEdge + bar;
    let s =
      `<rect x="${pad}" y="${topEdge}" width="${w - 2 * pad}" height="${bar}" fill="${color}"/>` +
      `<rect x="${pad}" y="${barBot}" width="${legW}" height="${baseY - barBot}" fill="${color}"/>` +
      `<rect x="${w - pad - legW}" y="${barBot}" width="${legW}" height="${baseY - barBot}" fill="${color}"/>`;
    const n = objects.length;
    if (n) {
      const uL = pad + legW + 8, uR = w - pad - legW - 8;
      objects.forEach((o, i) => {
        const name = typeof o === "string" ? o : o.name;
        const sc = (o && o.scale) || 1;
        const cx = n === 1 ? w / 2 : uL + ((uR - uL) * (i + 0.5)) / n;
        const inner = (OBJECTS[name] || (() => ""))(color, objSw / sc);
        s += `<g transform="translate(${cx.toFixed(1)},${topEdge}) scale(${sc})">${inner}</g>`;
      });
    }
    const r = typeof rough === "string" ? ROUGH[rough] : rough;
    const [def, attr] = filterDefs(r, seed);
    const vw = width || w, vh = height || Math.round((200 * vw) / w);
    return `<svg viewBox="0 0 ${w} 200" width="${vw}" height="${vh}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${def}<g${attr}>${s}</g></svg>`;
  }

  function spanHTML(html, style) {
    return React.createElement("span", {
      style: { display: "inline-flex", lineHeight: 0, ...style },
      dangerouslySetInnerHTML: { __html: html },
    });
  }
  function Mark(props) { const { style, ...rest } = props || {}; return spanHTML(markSVG(rest), style); }
  function Table(props) { const { style, ...rest } = props || {}; return spanHTML(tableSVG(rest), style); }

  window.Mark = Mark;
  window.Table = Table;
  window.markSVG = markSVG;
  window.tableSVG = tableSVG;
  window.OBJECT_NAMES = Object.keys(OBJECTS);
  window.MARK_ROUGH = Object.keys(ROUGH);
  // additive exports for the motion lab — individual object builders + table variants
  window.OBJECTS = OBJECTS;
  window.TABLE_VARIANTS = V;
  window.ROUGH_PRESETS = ROUGH;
})();
