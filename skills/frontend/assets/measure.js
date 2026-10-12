/* measure.js: extract a page's design system from its computed styles.
 *
 * One expression that returns a JSON-able object. Three ways to run it:
 *   - measure-reference.mjs runs it for you at each width (preferred)
 *   - paste it into the browser devtools console on any page
 *   - pass it to a browser tool's "execute JavaScript" action
 *
 * It reads what the browser actually rendered, not what the CSS intended:
 * the real type ramp, the colors in use and how often, radii, borders,
 * shadows, spacing, section rhythm, the nav, the buttons and the motion
 * curves. Measured values beat guessed ones; that is the whole method
 * (references/calibration.md).
 */
(() => {
  const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
  const px = (v) => round(parseFloat(v) || 0);
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0.01;
  };
  const tally = (map, key, sample) => {
    if (!key) return;
    const hit = map.get(key) || { n: 0, sample };
    hit.n += 1;
    map.set(key, hit);
  };
  const top = (map, n = 12) =>
    [...map.entries()]
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, n)
      .map(([k, v]) => (v.sample ? { value: k, count: v.n, example: v.sample } : { value: k, count: v.n }));
  const ratio = (v, size) => (v === "normal" ? "normal" : round(parseFloat(v) / size, 3));
  const tracking = (v, size) => (v === "normal" ? "0em" : round(parseFloat(v) / size, 3) + "em");
  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join("")
      .replace(/\s+/g, " ")
      .trim();

  const all = [...document.querySelectorAll("body *")].filter(visible);

  // ── Type ramp: every distinct text style actually rendered, with counts.
  const typeMap = new Map();
  for (const el of all) {
    const text = ownText(el);
    if (text.length < 2) continue;
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    const key = [
      s.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      round(size, 1) + "px",
      s.fontWeight,
      "lh " + ratio(s.lineHeight, size),
      "tr " + tracking(s.letterSpacing, size),
      s.textTransform !== "none" ? s.textTransform : "",
      s.fontStyle !== "normal" ? s.fontStyle : "",
    ]
      .filter(Boolean)
      .join(" | ");
    tally(typeMap, key, `<${el.tagName.toLowerCase()}> ${text.slice(0, 48)}`);
  }
  const typeRamp = top(typeMap, 30).sort((a, b) => parseFloat(b.value.split(" | ")[1]) - parseFloat(a.value.split(" | ")[1]));

  // ── Headings in document order, with wrap behaviour and measure.
  const headings = [...document.querySelectorAll("h1,h2,h3")]
    .filter(visible)
    .slice(0, 16)
    .map((el) => {
      const s = getComputedStyle(el);
      const size = parseFloat(s.fontSize);
      return {
        tag: el.tagName.toLowerCase(),
        text: el.innerText.replace(/\s+/g, " ").trim().slice(0, 70),
        size: round(size, 1),
        weight: s.fontWeight,
        lh: ratio(s.lineHeight, size),
        tracking: tracking(s.letterSpacing, size),
        wrap: s.textWrap || s.textWrapStyle || "",
        align: s.textAlign,
        width: Math.round(el.getBoundingClientRect().width),
        color: s.color,
      };
    });

  // ── Color, surfaces, lines, corners, elevation, spacing.
  const textColors = new Map();
  const bgColors = new Map();
  const borders = new Map();
  const radii = new Map();
  const shadows = new Map();
  const gaps = new Map();
  const maxWidths = new Map();
  const transitions = new Map();
  const animations = new Map();
  const filters = new Map();
  for (const el of all) {
    const s = getComputedStyle(el);
    if (ownText(el).length > 1) tally(textColors, s.color);
    if (s.backgroundColor !== "rgba(0, 0, 0, 0)") tally(bgColors, s.backgroundColor, el.tagName.toLowerCase());
    if (s.backgroundImage !== "none") tally(bgColors, s.backgroundImage.slice(0, 120), "image/gradient");
    for (const side of ["Top", "Right", "Bottom", "Left"]) {
      const w = parseFloat(s[`border${side}Width`]);
      if (w > 0 && s[`border${side}Style`] !== "none" && s[`border${side}Color`] !== "rgba(0, 0, 0, 0)")
        tally(borders, `${w}px ${s[`border${side}Style`]} ${s[`border${side}Color`]}`);
    }
    if (s.borderTopLeftRadius !== "0px") {
      const r = parseFloat(s.borderTopLeftRadius) > 9000 ? "pill" : s.borderTopLeftRadius;
      tally(radii, r, el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""));
    }
    if (s.boxShadow !== "none") tally(shadows, s.boxShadow.slice(0, 160));
    if (s.display.includes("flex") || s.display.includes("grid")) {
      if (s.rowGap !== "normal" && s.rowGap !== "0px") tally(gaps, s.rowGap);
      if (s.columnGap !== "normal" && s.columnGap !== "0px" && s.columnGap !== s.rowGap) tally(gaps, s.columnGap);
    }
    if (s.maxWidth !== "none") tally(maxWidths, s.maxWidth);
    if (s.transitionDuration !== "0s")
      tally(transitions, `${s.transitionProperty.slice(0, 60)} | ${s.transitionDuration.split(",")[0]} | ${s.transitionTimingFunction.split(", c")[0]}`);
    if (s.animationName !== "none") tally(animations, `${s.animationName} | ${s.animationDuration} | ${s.animationTimingFunction} | ${s.animationIterationCount}`);
    if (s.backdropFilter && s.backdropFilter !== "none") tally(filters, "backdrop " + s.backdropFilter);
    if (s.filter && s.filter !== "none") tally(filters, "filter " + s.filter.slice(0, 60));
  }

  // ── Section rhythm: the top-level blocks of the page, in order.
  const main = document.querySelector("main") || document.body;
  const sections = [...main.querySelectorAll(":scope > *, :scope > * > section, section")]
    .filter(visible)
    .filter((el, i, arr) => arr.indexOf(el) === i)
    .slice(0, 20)
    .map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const h = el.querySelector("h1,h2,h3");
      return {
        tag: el.tagName.toLowerCase(),
        heading: h ? h.innerText.replace(/\s+/g, " ").trim().slice(0, 50) : "",
        top: Math.round(r.top + scrollY),
        height: Math.round(r.height),
        width: Math.round(r.width),
        padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
        margin: `${s.marginTop} / ${s.marginBottom}`,
        bg: s.backgroundColor,
        radius: s.borderTopLeftRadius,
      };
    });

  // ── Content edges: where text actually starts. Shared anchors = alignment.
  const lefts = new Map();
  for (const el of document.querySelectorAll("h1,h2,h3,p")) {
    if (!visible(el)) continue;
    const left = Math.round(el.getBoundingClientRect().left);
    if (left < 0 || left > innerWidth) continue; // marquee and carousel copies offscreen
    tally(lefts, left + "px");
  }

  // ── Navigation.
  const navEl = document.querySelector("header") || document.querySelector("nav");
  let nav = null;
  if (navEl) {
    const s = getComputedStyle(navEl);
    const r = navEl.getBoundingClientRect();
    const inner = [...navEl.querySelectorAll("nav")].find(visible) || navEl;
    const si = getComputedStyle(inner);
    const ri = inner.getBoundingClientRect();
    nav = {
      position: s.position,
      top: Math.round(r.top),
      height: Math.round(r.height),
      width: Math.round(r.width),
      bg: s.backgroundColor,
      backdrop: s.backdropFilter,
      borderBottom: s.borderBottom,
      inner: { width: Math.round(ri.width), height: Math.round(ri.height), radius: si.borderRadius, bg: si.backgroundColor, backdrop: si.backdropFilter, padding: si.padding },
      links: [...navEl.querySelectorAll("a")].filter(visible).slice(0, 10).map((a) => a.innerText.trim().slice(0, 24)),
    };
  }

  // ── Buttons and pills: deduplicated by look.
  const btnMap = new Map();
  for (const el of document.querySelectorAll("a, button")) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    const filled = s.backgroundColor !== "rgba(0, 0, 0, 0)";
    const bordered = parseFloat(s.borderTopWidth) > 0 && s.borderTopColor !== "rgba(0, 0, 0, 0)";
    if (!filled && !bordered) continue;
    const r = el.getBoundingClientRect();
    if (r.height > 72) continue;
    const key = [
      Math.round(r.height) + "h",
      "pad " + s.paddingLeft,
      parseFloat(s.borderTopLeftRadius) > 9000 ? "pill" : s.borderTopLeftRadius,
      s.fontSize + " " + s.fontWeight,
      "bg " + s.backgroundColor,
      "fg " + s.color,
      bordered ? "border " + s.borderTopColor : "",
    ]
      .filter(Boolean)
      .join(" | ");
    tally(btnMap, key, el.innerText.replace(/\s+/g, " ").trim().slice(0, 30));
  }

  // ── Custom properties on :root (same-origin stylesheets only).
  const rootVars = {};
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (!rule.selectorText || !/(^|,)\s*(:root|html)\b/.test(rule.selectorText)) continue;
      for (const prop of rule.style) if (prop.startsWith("--") && Object.keys(rootVars).length < 160) rootVars[prop] = rule.style.getPropertyValue(prop).trim();
    }
  }

  const body = getComputedStyle(document.body);
  return {
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight },
    pageHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    body: { bg: body.backgroundColor, color: body.color, font: body.fontFamily, size: body.fontSize, weight: body.fontWeight, lineHeight: body.lineHeight },
    fontsLoaded: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family.replace(/["']/g, "")} ${f.weight} ${f.style}`))],
    typeRamp,
    headings,
    textColors: top(textColors, 10),
    backgrounds: top(bgColors, 14),
    borders: top(borders, 10),
    radii: top(radii, 12),
    shadows: top(shadows, 8),
    gaps: top(gaps, 12),
    maxWidths: top(maxWidths, 10),
    contentLeftEdges: top(lefts, 8),
    sections,
    nav,
    buttons: top(btnMap, 12),
    transitions: top(transitions, 8),
    animations: top(animations, 10),
    filters: top(filters, 6),
    rootVars,
  };
})();
