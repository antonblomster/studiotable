/* =====================================================================
   Studio table — drawn object library
   The shop's wares: hand-drawn interior objects that sit ON the long
   table. Each builder: (color, strokeWidth) => SVG markup, with its
   baseline at y=0 (sits on the tabletop), centred on x=0, drawn upward
   (negative y). Stroke art so they read as "drawn".
   Roughness presets feed the per-ware feTurbulence + feDisplacementMap.
   Exports: window.OBJECTS, window.ROUGH_PRESETS
   (Extracted from the design handoff's logo-marks module — the vanilla
    parts the motion layer needs, with the React helpers dropped.)
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

  // Each: (c, sw) => markup. Baseline at y=0 (sits on tabletop), centred on
  // x=0, drawn upward (negative y).
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

  window.OBJECTS = OBJECTS;
  window.ROUGH_PRESETS = ROUGH;
})();
