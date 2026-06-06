/* =====================================================================
   Studio table — Motion Lab
   Reusable motion/interaction layer built on the drawn-object set.
   The table is drawn as DOM (so it can transition) and the wares are
   absolutely-positioned mini-SVGs that can be animated, dragged within
   the tabletop, lit up, or swapped out.
   Depends on: window.OBJECTS, window.ROUGH_PRESETS  (objects.js)
   ===================================================================== */
(function () {
  const BLUE = "#1A16E8";
  const BEIGE = "#F4EFE3";
  const AMBER = "#FFC24B";

  // shared object viewBox — generous enough for the tallest ware (flowers)
  const VB = { x: -32, y: -84, w: 64, h: 96 };
  const BASE_FRAC = (0 - VB.y) / VB.h;   // 0.875 — where y=0 (the floor of a ware) sits
  const ASPECT = VB.h / VB.w;            // 1.5

  let _fid = 0;
  function filterDefs(r, seed) {
    if (!r || !r.scale) return ["", ""];
    const id = "mlf" + (++_fid);
    const def =
      `<defs><filter id="${id}" x="-35%" y="-35%" width="170%" height="170%">` +
      `<feTurbulence type="turbulence" baseFrequency="${r.bf}" numOctaves="${r.oct || 2}" seed="${seed}" result="n"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="n" scale="${r.scale}" xChannelSelector="R" yChannelSelector="G"/>` +
      `</filter></defs>`;
    return [def, ` filter="url(#${id})"`];
  }

  function objSVG(name, opts) {
    const o = opts || {};
    const color = o.color || BLUE;
    const bg = o.bg || BEIGE;
    const sw = o.sw || 4;
    const rough = (o.rough && typeof o.rough === "object") ? o.rough : window.ROUGH_PRESETS[o.rough || "soft"];
    const draw = window.OBJECTS[name];
    const inner = name === "clock" ? clockInner(color, sw) : (draw ? draw(color, sw) : "");
    // opaque backing: same shapes drawn in the surface colour (fill + stroke) so a
    // ware sitting on top of another isn't see-through. Same filtered group → aligned.
    const back = name === "clock" ? clockInner(bg, sw) : (draw ? draw(bg, sw) : "");
    const backFilled = back.replace(/fill="none"/g, `fill="${bg}"`);
    const [def, attr] = filterDefs(rough, o.seed || ((Math.random() * 90) | 0) + 1);
    return `<svg class="ml-svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" preserveAspectRatio="xMidYMid meet">${def}<g${attr}><g class="ml-obj-fill">${backFilled}</g><g class="ml-obj-ink">${inner}</g></g></svg>`;
  }

  // a clock whose hands actually move (minute fast, hour slow)
  function clockInner(c, sw) {
    const S = `fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
    // raised 4 units so the little legs sit ON the tabletop (y=0) instead of into it
    return `
      <path d="M-15,-4 V-26 Q-15,-36 0,-36 Q15,-36 15,-26 V-4 Z" ${S}/>
      <circle cx="0" cy="-21" r="8" ${S}/>
      <path d="M-11,-4 V0 M11,-4 V0" ${S}/>
      <g><line x1="0" y1="-21" x2="0" y2="-27.5" ${S}/><animateTransform attributeName="transform" type="rotate" values="0 0 -21;360 0 -21" dur="8s" repeatCount="indefinite"/></g>
      <g><line x1="0" y1="-21" x2="4.6" y2="-18.4" ${S}/><animateTransform attributeName="transform" type="rotate" values="0 0 -21;360 0 -21" dur="48s" repeatCount="indefinite"/></g>`;
  }

  // intrinsic (x,y) within a ware → px offset inside its wrapper of width w
  function ix(x, w) { return ((x - VB.x) / VB.w) * w; }
  function iy(y, w) { return ((y - VB.y) / VB.h) * (w * ASPECT); }

  // ---- a single ware element -------------------------------------------
  function makeWare(name, opts) {
    const o = opts || {};
    const w = o.w || 96;
    const h = w * ASPECT;
    const el = document.createElement("div");
    el.className = "ml-ware";
    el.dataset.name = name;
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.transformOrigin = "50% " + (BASE_FRAC * 100) + "%";
    el.innerHTML = objSVG(name, { color: o.color, bg: o.bg, seed: o.seed, rough: o.rough });

    // shape-bounded hit layer — the target area follows the drawn object,
    // not its full bounding box, so neighbours don't block each other
    const hit = document.createElement("div");
    hit.className = "ml-hit";
    hit.innerHTML = objSVG(name, { color: o.color, bg: o.bg, seed: o.seed, rough: o.rough });
    el.appendChild(hit);
    el._hit = hit;

    // accents
    if (name === "lamp") buildLamp(el, w);
    if (name === "candle") buildCandle(el, w);

    return el;
  }

  function buildLamp(el, w) {
    // hand-drawn ink rays around the shade — up AND out to both sides,
    // each starting a few px off the shade so they read as separate strokes
    const cx = 0, cy = -41;            // shade's vertical centre
    const n = 7, a0 = -116, a1 = 116;  // up + both sides (stops short of straight down)
    const r0 = 22;                     // start radius — clears the shade by a few px
    let lines = "";
    for (let i = 0; i < n; i++) {
      const ang = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180;
      const len = (i % 2 === 0) ? 19 : 13;   // varied lengths read as hand-drawn
      const sx = (cx + r0 * Math.sin(ang)).toFixed(1), sy = (cy - r0 * Math.cos(ang)).toFixed(1);
      const ex = (cx + (r0 + len) * Math.sin(ang)).toFixed(1), ey = (cy - (r0 + len) * Math.cos(ang)).toFixed(1);
      lines += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"/>`;
    }
    el.insertAdjacentHTML("afterbegin", `<svg class="ml-rays" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" preserveAspectRatio="xMidYMid meet"><g class="ml-rays-g" filter="url(#ml-sketch)">${lines}</g></svg>`);

    // pull string hanging off the bottom-right rim of the shade — drawn, wobbly, longer,
    // and positioned BELOW the rim so it never crosses the shade
    const string = document.createElement("button");
    string.className = "ml-pull";
    string.type = "button";
    string.setAttribute("aria-label", "Pull the lamp string");
    string.style.left = (ix(12.5, w) - 16) + "px";  // 9px h-padding centres the 15px svg on x≈12.5
    string.style.top = (iy(-33, w)) + "px";          // tuck the top into the shade rim so the tug never disconnects it
    string.innerHTML =
      '<svg class="ml-pull-svg" viewBox="0 0 15 44" preserveAspectRatio="xMidYMid meet" filter="url(#ml-sketch)">' +
      '<path class="ml-pull-line" d="M7.5,1 C5,9 10,16 7.5,24 C6,30 8.4,35 7.5,38"/>' +
      '<circle class="ml-pull-knob" cx="7.5" cy="41" r="3.1"/></svg>';
    el.appendChild(string);

    el.classList.add("lamp-off");
    const toggle = (e) => {
      e.stopPropagation();
      el.classList.toggle("lamp-on");
      el.classList.toggle("lamp-off");
      string.classList.remove("ml-pull-tug");
      void string.offsetWidth;
      string.classList.add("ml-pull-tug");
    };
    string.addEventListener("click", toggle);
  }

  function buildCandle(el, w) {
    // blue spark ticks above the flame (no colour shift)
    const cx = 0, cy = -58;
    const dirs = [[-1, -0.4], [0, -1], [1, -0.4], [-0.7, -0.9], [0.7, -0.9]];
    const lines = dirs.map(([dx, dy]) => `<line x1="${cx}" y1="${cy}" x2="${cx + dx * 9}" y2="${cy + dy * 9}"/>`).join("");
    el.insertAdjacentHTML("beforeend", `<svg class="ml-sparks" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" preserveAspectRatio="xMidYMid meet"><g class="ml-sparks-g">${lines}</g></svg>`);
    el.classList.add("candle-lit");
    el._hit.addEventListener("click", (e) => {
      e.stopPropagation();
      el.classList.toggle("candle-lit");
    });
  }

  // idle character per ware type
  const IDLE = {
    vaseFlowers: "sway", plant: "sway", candle: "bob", lamp: "",
    clock: "", bowl: "bob", books: "", cup: "bob", teapot: "bob",
    pitcher: "bob", trinkets: "jitter", frame: "", cup2: "",
  };
  function applyIdle(el) {
    const k = IDLE[el.dataset.name];
    if (k) el.classList.add("idle-" + k);
    el.style.setProperty("--d", (Math.random() * 2.4).toFixed(2) + "s");
    el.style.setProperty("--dur", (3.6 + Math.random() * 2.4).toFixed(2) + "s");
  }

  /* =====================================================================
     STAGE — a tabletop drawn in DOM + a set of wares placed on its surface
     positions are stored as fractions so the stage re-lays-out on resize
     ===================================================================== */
  function createStage(host, opts) {
    const o = opts || {};
    const st = {
      host,
      surfaceFrac: o.surfaceFrac != null ? o.surfaceFrac : 0.52,
      floorFrac: o.floorFrac != null ? o.floorFrac : 0.9,
      padFrac: o.padFrac != null ? o.padFrac : 0.08,
      barH: o.barH || 15,
      legW: o.legW || 15,
      wareW: o.wareW || 92,
      spanFrac: o.spanFrac != null ? o.spanFrac : 1,   // 0..1 of full width (for grow)
      minBarPx: o.minBarPx != null ? o.minBarPx : null, // never narrower than this (smallest logo)
      fixedBarPx: o.fixedBarPx != null ? o.fixedBarPx : null, // size table to its wares per brand
      wares: [],
    };
    host._ml = st;
    host.classList.add("ml-stage");

    const table = document.createElement("div");
    table.className = "ml-table";
    table.innerHTML =
      '<div class="ml-top"></div><div class="ml-leg ml-leg-l"></div><div class="ml-leg ml-leg-r"></div>';
    host.appendChild(table);
    st.table = table;
    st.top = table.querySelector(".ml-top");
    st.legL = table.querySelector(".ml-leg-l");
    st.legR = table.querySelector(".ml-leg-r");

    layout(st);
    const ro = new ResizeObserver(() => layout(st));
    ro.observe(host);
    return st;
  }

  function geom(st) {
    const W = st.host.clientWidth;
    const H = st.host.clientHeight;
    const surfaceY = H * st.surfaceFrac;
    const floorY = H * st.floorFrac;
    const fullPad = W * st.padFrac;
    const fullSpan = W - 2 * fullPad;
    let barW = st.fixedBarPx != null ? st.fixedBarPx : fullSpan * st.spanFrac;
    if (st.minBarPx != null) barW = Math.max(barW, st.minBarPx);
    barW = Math.min(barW, fullSpan);
    const barLeft = (W - barW) / 2;
    const barRight = barLeft + barW;
    // wares may sit anywhere on the top, kept a half-ware in from each end
    const margin = st.wareW * 0.46;
    return { W, H, surfaceY, floorY, barLeft, barRight, barW,
             usableL: barLeft + margin, usableR: barRight - margin };
  }

  function layout(st) {
    const g = geom(st);
    st.top.style.left = g.barLeft + "px";
    st.top.style.width = g.barW + "px";
    st.top.style.top = g.surfaceY + "px";
    st.top.style.height = st.barH + "px";
    const legTop = g.surfaceY + st.barH - 1;
    const legH = g.floorY - legTop;
    [st.legL, st.legR].forEach((leg) => { leg.style.top = legTop + "px"; leg.style.height = legH + "px"; });
    st.legL.style.left = g.barLeft + "px";
    st.legR.style.left = (g.barRight - st.legW) + "px";
    st.legL.style.width = st.legW + "px";
    st.legR.style.width = st.legW + "px";
    st.wares.forEach((w) => placeAt(st, w, parseFloat(w.dataset.xf), g));
  }

  // xf: 0..1 across the usable span
  function placeAt(st, ware, xf, g) {
    g = g || geom(st);
    xf = Math.max(0, Math.min(1, xf));
    ware.dataset.xf = xf;
    const cx = g.usableL + xf * (g.usableR - g.usableL);
    const w = parseFloat(ware.style.width);
    const h = parseFloat(ware.style.height);
    ware.style.left = (cx - w / 2) + "px";
    ware.style.top = (g.surfaceY - BASE_FRAC * h) + "px";
  }

  function addWare(st, name, xf, opts) {
    const ware = makeWare(name, Object.assign({ w: st.wareW }, opts || {}));
    st.host.appendChild(ware);
    st.wares.push(ware);
    ware.dataset.xf = xf;
    placeAt(st, ware, xf);
    applyIdle(ware);
    return ware;
  }

  // evenly distribute n wares across the span
  function spread(n) {
    if (n === 1) return [0.5];
    return Array.from({ length: n }, (_, i) => 0.08 + (0.84 * i) / (n - 1));
  }

  /* =====================================================================
     INTERACTIONS
     ===================================================================== */
  // a little hop / reaction when a ware is poked
  function pokeable(ware) {
    (ware._hit || ware).addEventListener("click", (e) => {
      if (ware.dataset.dragging) return;
      if (ware.dataset.name === "lamp" || ware.dataset.name === "candle") return;
      ware.classList.remove("ml-poke");
      void ware.offsetWidth;
      ware.classList.add("ml-poke");
    });
  }

  // drag a ware along the tabletop, constrained to the surface
  function draggable(st, ware) {
    ware.classList.add("ml-grab");
    const t = ware._hit || ware;
    let active = false, pid = null;
    const down = (e) => {
      if (e.target.closest(".ml-pull")) return;  // let the lamp string work
      active = true; pid = e.pointerId;
      ware.dataset.dragging = "1";
      ware.classList.add("ml-lift");
      ware.classList.remove("idle-sway", "idle-bob", "idle-tick", "idle-jitter");
      try { t.setPointerCapture(pid); } catch (e) {}
      // bring to front
      st.wares.forEach((w) => (w.style.zIndex = w === ware ? 30 : ""));
      e.preventDefault();
    };
    const move = (e) => {
      if (!active) return;
      const g = geom(st);
      const rect = st.host.getBoundingClientRect();
      let cx = e.clientX - rect.left;
      cx = Math.max(g.usableL, Math.min(g.usableR, cx));
      const xf = (cx - g.usableL) / (g.usableR - g.usableL);
      const w = parseFloat(ware.style.width);
      ware.dataset.xf = xf;
      ware.style.left = (cx - w / 2) + "px";
    };
    const up = () => {
      if (!active) return;
      active = false;
      ware.classList.remove("ml-lift");
      ware.classList.add("ml-drop");
      setTimeout(() => { ware.classList.remove("ml-drop"); applyIdle(ware); delete ware.dataset.dragging; }, 360);
      try { t.releasePointerCapture(pid); } catch (e) {}
    };
    t.addEventListener("pointerdown", down);
    t.addEventListener("pointermove", move);
    t.addEventListener("pointerup", up);
    t.addEventListener("pointercancel", up);
  }

  // knock a ware off the edge — it tips and falls past the floor
  function knockOff(st, ware, dir) {
    const g = geom(st);
    ware.classList.remove("idle-sway", "idle-bob", "idle-tick", "idle-jitter");
    ware.classList.add("ml-fall");
    ware.style.setProperty("--fall-x", (dir > 0 ? 1 : -1) * (g.W * 0.18) + "px");
    ware.style.setProperty("--fall-y", (g.H * 0.7) + "px");
    ware.style.setProperty("--fall-r", (dir > 0 ? 1 : -1) * 96 + "deg");
    setTimeout(() => {
      ware.remove();
      st.wares = st.wares.filter((w) => w !== ware);
    }, 1100);
  }

  // expose
  window.MotionLab = {
    BLUE, BEIGE, AMBER, VB, BASE_FRAC, ASPECT,
    createStage, geom, layout, placeAt, addWare, spread,
    makeWare, applyIdle, pokeable, draggable, knockOff, objSVG,
  };
})();
