// Generates inline SVG illustrations for image_question type.
// Driven by structured imageSpec from Claude — no regex guessing.

export interface ImageSpec {
  operation: 'multiplication' | 'division' | 'addition' | 'subtraction' | 'fraction' | 'counting' | 'comparison' | 'diagram' | 'timeline' | 'map' | 'scene' | 'generic';
  num1?: number;
  num2?: number;
  objectEmoji?: string;
  objectLabel?: string;
}

function toDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Fallback emoji map for when Claude doesn't provide one
const FALLBACK_EMOJI_MAP: [RegExp, string, string][] = [
  [/cupcake|muffin/i, '🧁', 'cupcakes'],
  [/donut|doughnut/i, '🍩', 'donuts'],
  [/cookie/i,         '🍪', 'cookies'],
  [/pizza/i,          '🍕', 'slices'],
  [/apple/i,          '🍎', 'apples'],
  [/orange/i,         '🍊', 'oranges'],
  [/banana/i,         '🍌', 'bananas'],
  [/strawberr/i,      '🍓', 'strawberries'],
  [/lemon/i,          '🍋', 'lemons'],
  [/cherry/i,         '🍒', 'cherries'],
  [/peach/i,          '🍑', 'peaches'],
  [/carrot/i,         '🥕', 'carrots'],
  [/egg/i,            '🥚', 'eggs'],
  [/coin/i,           '🪙', 'coins'],
  [/pencil/i,         '✏️', 'pencils'],
  [/crayon/i,         '🖍️', 'crayons'],
  [/book/i,           '📚', 'books'],
  [/balloon/i,        '🎈', 'balloons'],
  [/star/i,           '⭐', 'stars'],
  [/heart/i,          '❤️', 'hearts'],
  [/flower/i,         '🌸', 'flowers'],
  [/dog|puppy/i,      '🐶', 'dogs'],
  [/cat|kitten/i,     '🐱', 'cats'],
  [/fish/i,           '🐟', 'fish'],
  [/frog/i,           '🐸', 'frogs'],
  [/rabbit|bunny/i,   '🐰', 'rabbits'],
  [/bear/i,           '🐻', 'bears'],
  [/bird|chick/i,     '🐥', 'chicks'],
  [/butterfly/i,      '🦋', 'butterflies'],
  [/candy/i,          '🍬', 'candies'],
  [/block/i,          '🟦', 'blocks'],
  [/marble/i,         '🔵', 'marbles'],
  [/ball/i,           '⚽', 'balls'],
  [/car/i,            '🚗', 'cars'],
  [/box/i,            '📦', 'boxes'],
  [/bag/i,            '🎒', 'bags'],
  [/button/i,         '🔘', 'buttons'],
];

const FALLBACK_DEFAULTS = ['🔵', '⭐', '🍎', '🟡', '🔺'];

function resolveEmoji(spec: ImageSpec | null, questionText: string, seed: number): { emoji: string; label: string } {
  // 1. Trust Claude's spec first
  if (spec?.objectEmoji && spec?.objectLabel) {
    return { emoji: spec.objectEmoji, label: spec.objectLabel };
  }
  // 2. Extract from question text
  const text = questionText;
  for (const [re, emoji, label] of FALLBACK_EMOJI_MAP) {
    if (re.test(text)) return { emoji, label };
  }
  // 3. Seed-based fallback
  return { emoji: FALLBACK_DEFAULTS[Math.abs(seed) % FALLBACK_DEFAULTS.length], label: 'items' };
}

// ─── SVG Renderers ───────────────────────────────────────────────────────────

function multiplicationSVG(rows: number, cols: number, obj: { emoji: string; label: string }): string {
  rows = Math.min(rows, 6);
  cols = Math.min(cols, 8);

  const cellW = 50, cellH = 50, pad = 10, rowGap = 8;
  const boxW = cols * cellW + pad * 2;
  const rowH = cellH + pad * 2;
  const topPad = 44, bottomPad = 42;
  const W = boxW + 48;
  const H = topPad + rows * rowH + (rows - 1) * rowGap + bottomPad;

  let rowBoxes = '';
  for (let r = 0; r < rows; r++) {
    const y = topPad + r * (rowH + rowGap);
    rowBoxes += `<rect x="24" y="${y}" width="${boxW}" height="${rowH}" rx="8" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>`;
    for (let c = 0; c < cols; c++) {
      const cx = 24 + pad + c * cellW + cellW / 2;
      const cy = y + pad + cellH / 2 + 13;
      rowBoxes += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="28">${obj.emoji}</text>`;
    }
  }

  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F8F9FF"/>
  <text x="${W/2}" y="28" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#7C3AED" font-weight="600">${rows} rows of ${cols} ${obj.label}</text>
  ${rowBoxes}
  <text x="${W/2}" y="${H-12}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="19" fill="#5B21B6" font-weight="700">${rows} × ${cols} = ?</text>
</svg>`);
}

function divisionSVG(total: number, groups: number, obj: { emoji: string; label: string }): string {
  const numGroups = Math.min(groups, 8);
  const perGroup = Math.max(1, Math.round(total / numGroups));
  const maxVisible = 6;
  const cappedPer = Math.min(perGroup, maxVisible);
  const eCols = Math.min(cappedPer, 3);
  const eRows = Math.ceil(cappedPer / Math.max(eCols, 1));

  const cellW = 40, cellH = 40, pad = 8;
  const boxW = Math.max(eCols * cellW + pad * 2, 60);
  const boxH = eRows * cellH + pad * 2 + (perGroup > maxVisible ? 22 : 0);
  const gap = 10;
  const topPad = 44, bottomPad = 42;
  const W = numGroups * boxW + (numGroups - 1) * gap + 32;
  const H = topPad + boxH + bottomPad;

  let boxes = '';
  for (let g = 0; g < numGroups; g++) {
    const bx = 16 + g * (boxW + gap);
    const by = topPad;
    boxes += `<rect x="${bx}" y="${by}" width="${boxW}" height="${boxH}" rx="8" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>`;
    for (let i = 0; i < cappedPer; i++) {
      const col = i % eCols, row = Math.floor(i / eCols);
      const cx = bx + pad + col * cellW + cellW / 2;
      const cy = by + pad + row * cellH + cellH / 2 + 13;
      boxes += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="24">${obj.emoji}</text>`;
    }
    if (perGroup > maxVisible) {
      boxes += `<text x="${bx + boxW/2}" y="${by + boxH - 6}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="11" fill="#6B7280" font-weight="600">×${perGroup}</text>`;
    }
  }

  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F0FDF4"/>
  <text x="${W/2}" y="28" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#16A34A" font-weight="600">${total} ${obj.label} into ${numGroups} equal groups</text>
  ${boxes}
  <text x="${W/2}" y="${H-12}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="19" fill="#15803D" font-weight="700">${total} ÷ ${groups} = ?</text>
</svg>`);
}

function additionSVG(a: number, b: number, obj: { emoji: string; label: string }): string {
  const capA = Math.min(a, 8), capB = Math.min(b, 8);
  const colsA = Math.min(capA, 4), rowsA = Math.ceil(capA / Math.max(colsA, 1));
  const colsB = Math.min(capB, 4), rowsB = Math.ceil(capB / Math.max(colsB, 1));
  const cellW = 46, cellH = 46, pad = 10, gap = 16, plusW = 40;
  const boxAW = colsA * cellW + pad * 2, boxAH = rowsA * cellH + pad * 2;
  const boxBW = colsB * cellW + pad * 2, boxBH = rowsB * cellH + pad * 2;
  const topPad = 44, bottomPad = 42;
  const W = 24 + boxAW + gap + plusW + gap + boxBW + 24;
  const H = topPad + Math.max(boxAH, boxBH) + bottomPad;
  const midY = topPad + Math.max(boxAH, boxBH) / 2;

  let itemsA = '', itemsB = '';
  for (let i = 0; i < capA; i++) {
    const col = i % colsA, row = Math.floor(i / colsA);
    itemsA += `<text x="${24 + pad + col * cellW + cellW/2}" y="${topPad + pad + row * cellH + cellH/2 + 13}" text-anchor="middle" font-size="26">${obj.emoji}</text>`;
  }
  const bx = 24 + boxAW + gap + plusW + gap;
  for (let i = 0; i < capB; i++) {
    const col = i % colsB, row = Math.floor(i / colsB);
    itemsB += `<text x="${bx + pad + col * cellW + cellW/2}" y="${topPad + pad + row * cellH + cellH/2 + 13}" text-anchor="middle" font-size="26">${obj.emoji}</text>`;
  }

  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFFBEB"/>
  <text x="${W/2}" y="28" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#D97706" font-weight="600">${capA} ${obj.label} and ${capB} more</text>
  <rect x="24" y="${topPad}" width="${boxAW}" height="${boxAH}" rx="8" fill="white" stroke="#FCD34D" stroke-width="2"/>
  ${itemsA}
  <text x="${24 + boxAW + gap + plusW/2}" y="${midY + 10}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="30" fill="#D97706" font-weight="700">+</text>
  <rect x="${bx}" y="${topPad}" width="${boxBW}" height="${boxBH}" rx="8" fill="white" stroke="#FCD34D" stroke-width="2"/>
  ${itemsB}
  <text x="${W/2}" y="${H-12}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="19" fill="#B45309" font-weight="700">${a} + ${b} = ?</text>
</svg>`);
}

function subtractionSVG(a: number, b: number, obj: { emoji: string; label: string }): string {
  const total = Math.min(a, 12);
  const removed = Math.min(b, total);
  const cols = Math.min(total, 6);
  const rows2 = Math.ceil(total / cols);
  const cellW = 52, cellH = 52, pad = 12;
  const boxW = cols * cellW + pad * 2, boxH = rows2 * cellH + pad * 2;
  const topPad = 44, bottomPad = 42;
  const W = boxW + 40, H = topPad + boxH + bottomPad;

  let items = '';
  for (let i = 0; i < total; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = 20 + pad + col * cellW + cellW / 2;
    const cy = topPad + pad + row * cellH + cellH / 2;
    const isGone = i >= total - removed;
    items += `<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="28" opacity="${isGone ? '0.2' : '1'}">${obj.emoji}</text>`;
    if (isGone) {
      items += `<line x1="${cx-15}" y1="${cy-15}" x2="${cx+15}" y2="${cy+15}" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>`;
      items += `<line x1="${cx+15}" y1="${cy-15}" x2="${cx-15}" y2="${cy+15}" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>`;
    }
  }

  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFF1F2"/>
  <text x="${W/2}" y="28" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#EF4444" font-weight="600">Start with ${a} ${obj.label}, take away ${b}</text>
  <rect x="20" y="${topPad}" width="${boxW}" height="${boxH}" rx="8" fill="white" stroke="#FCA5A5" stroke-width="2"/>
  ${items}
  <text x="${W/2}" y="${H-12}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="19" fill="#DC2626" font-weight="700">${a} − ${b} = ?</text>
</svg>`);
}

function countingSVG(count: number, obj: { emoji: string; label: string }): string {
  const total = Math.min(count, 20);
  const cols = Math.min(total, 5);
  const rows = Math.ceil(total / cols);
  const cellW = 54, cellH = 54, pad = 14;
  const boxW = cols * cellW + pad * 2, boxH = rows * cellH + pad * 2;
  const topPad = 44, bottomPad = 42;
  const W = boxW + 32, H = topPad + boxH + bottomPad;

  let items = '';
  for (let i = 0; i < total; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = 16 + pad + col * cellW + cellW / 2;
    const cy = topPad + pad + row * cellH + cellH / 2 + 14;
    items += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="30">${obj.emoji}</text>`;
  }

  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F8FAFC"/>
  <text x="${W/2}" y="28" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#6366F1" font-weight="600">Count the ${obj.label}</text>
  <rect x="16" y="${topPad}" width="${boxW}" height="${boxH}" rx="10" fill="white" stroke="#E2E8F0" stroke-width="1.5"/>
  ${items}
  <text x="${W/2}" y="${H-12}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="19" fill="#4338CA" font-weight="700">How many ${obj.label}?</text>
</svg>`);
}

function fractionSVG(num: number, den: number): string {
  const W = 300, H = 240;
  const pieR = 80, cx = W / 2, cy = 120;
  let segments = '';
  for (let i = 0; i < den; i++) {
    const s = (i / den) * 2 * Math.PI - Math.PI / 2;
    const e = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + pieR * Math.cos(s), y1 = cy + pieR * Math.sin(s);
    const x2 = cx + pieR * Math.cos(e), y2 = cy + pieR * Math.sin(e);
    const large = e - s > Math.PI ? 1 : 0;
    segments += `<path d="M${cx},${cy} L${x1},${y1} A${pieR},${pieR} 0 ${large} 1 ${x2},${y2} Z" fill="${i < num ? '#6366F1' : '#E0E7FF'}" stroke="white" stroke-width="2.5"/>`;
  }
  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#EEF2FF"/>
  <text x="${W/2}" y="24" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="13" fill="#4F46E5" font-weight="600">${num} out of ${den} parts shaded</text>
  ${segments}
  <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="24" fill="#4338CA" font-weight="700">${num} / ${den}</text>
</svg>`);
}

// Science: concept-map style diagram — central node with spokes
function diagramSVG(obj: { emoji: string; label: string }): string {
  const W = 340, H = 240;
  const cx = W / 2, cy = H / 2;
  const nodeR = 44;
  // 4 satellite positions
  const satellites = [
    { x: cx - 110, y: cy - 55 },
    { x: cx + 110, y: cy - 55 },
    { x: cx - 110, y: cy + 55 },
    { x: cx + 110, y: cy + 55 },
  ];
  let spokes = '', boxes = '';
  satellites.forEach(({ x, y }) => {
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#C4B5FD" stroke-width="2" stroke-dasharray="4 3"/>`;
    boxes += `<rect x="${x - 36}" y="${y - 14}" width="72" height="28" rx="6" fill="white" stroke="#A78BFA" stroke-width="1.5"/>`;
    boxes += `<rect x="${x - 34}" y="${y - 12}" width="68" height="24" rx="5" fill="#EDE9FE"/>`;
  });
  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F5F3FF"/>
  ${spokes}
  ${boxes}
  <circle cx="${cx}" cy="${cy}" r="${nodeR}" fill="#7C3AED" opacity="0.12"/>
  <circle cx="${cx}" cy="${cy}" r="${nodeR - 6}" fill="white" stroke="#7C3AED" stroke-width="2"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26">${obj.emoji}</text>
  <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="9" fill="#5B21B6" font-weight="700">${obj.label.toUpperCase()}</text>
  <text x="${W / 2}" y="16" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="11" fill="#7C3AED" font-weight="600">Concept Diagram</text>
</svg>`);
}

// History: horizontal timeline with event markers
function timelineSVG(obj: { emoji: string; label: string }): string {
  const W = 380, H = 200;
  const lineY = H / 2, pad = 40;
  const markers = [pad, pad + 90, pad + 180, pad + 270];
  const highlighted = 1; // second marker is the "key" event
  let dots = '', labels = '';
  markers.forEach((x, i) => {
    const isKey = i === highlighted;
    const r = isKey ? 18 : 10;
    const fill = isKey ? '#7C3AED' : '#C4B5FD';
    const stroke = isKey ? '#5B21B6' : '#A78BFA';
    dots += `<circle cx="${x}" cy="${lineY}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    if (isKey) {
      dots += `<text x="${x}" y="${lineY + 7}" text-anchor="middle" font-size="18">${obj.emoji}</text>`;
      labels += `<text x="${x}" y="${lineY + 36}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="10" fill="#5B21B6" font-weight="700">${obj.label}</text>`;
    } else {
      labels += `<rect x="${x - 22}" y="${lineY + 22}" width="44" height="12" rx="3" fill="#EDE9FE"/>`;
    }
  });
  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FAF5FF"/>
  <text x="${W / 2}" y="20" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#7C3AED" font-weight="600">Historical Timeline</text>
  <line x1="${pad - 20}" y1="${lineY}" x2="${W - pad + 20}" y2="${lineY}" stroke="#C4B5FD" stroke-width="3" stroke-linecap="round"/>
  ${dots}
  ${labels}
  <polygon points="${W - pad + 20},${lineY} ${W - pad + 10},${lineY - 6} ${W - pad + 10},${lineY + 6}" fill="#A78BFA"/>
</svg>`);
}

// Geography: stylised map grid with a location pin
function mapSVG(obj: { emoji: string; label: string }): string {
  const W = 340, H = 240;
  const bx = 24, by = 32, bw = W - 48, bh = H - 56;
  // Grid lines
  let grid = '';
  for (let c = 1; c < 5; c++) {
    const x = bx + (bw / 5) * c;
    grid += `<line x1="${x}" y1="${by}" x2="${x}" y2="${by + bh}" stroke="#BAE6FD" stroke-width="1"/>`;
  }
  for (let r = 1; r < 4; r++) {
    const y = by + (bh / 4) * r;
    grid += `<line x1="${bx}" y1="${y}" x2="${bx + bw}" y2="${y}" stroke="#BAE6FD" stroke-width="1"/>`;
  }
  // Pin position — slightly off-center
  const pinX = bx + bw * 0.55, pinY = by + bh * 0.38;
  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F0F9FF"/>
  <text x="${W / 2}" y="20" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="12" fill="#0369A1" font-weight="600">Map View</text>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" fill="#E0F2FE" stroke="#7DD3FC" stroke-width="2"/>
  ${grid}
  <ellipse cx="${bx + bw * 0.3}" cy="${by + bh * 0.6}" rx="28" ry="18" fill="#BAE6FD" opacity="0.6"/>
  <ellipse cx="${bx + bw * 0.72}" cy="${by + bh * 0.7}" rx="20" ry="13" fill="#BAE6FD" opacity="0.5"/>
  <text x="${pinX}" y="${pinY + 6}" text-anchor="middle" font-size="28">${obj.emoji}</text>
  <rect x="${pinX - 38}" y="${pinY + 18}" width="76" height="18" rx="5" fill="white" stroke="#7DD3FC" stroke-width="1.5"/>
  <text x="${pinX}" y="${pinY + 31}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="10" fill="#0369A1" font-weight="600">${obj.label}</text>
  <text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="9" fill="#7DD3FC">N ↑</text>
</svg>`);
}

// Language: illustrated scene panel (like a book illustration)
function sceneSVG(obj: { emoji: string; label: string }): string {
  const W = 320, H = 220;
  const frameX = 20, frameY = 28, frameW = W - 40, frameH = H - 56;
  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFF7ED"/>
  <text x="${W / 2}" y="18" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="11" fill="#C2410C" font-weight="600">Story Scene</text>
  <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="10" fill="#FFEDD5" stroke="#FDBA74" stroke-width="2.5"/>
  <rect x="${frameX + 6}" y="${frameY + 6}" width="${frameW - 12}" height="${frameH - 12}" rx="7" fill="white" stroke="#FED7AA" stroke-width="1"/>
  <text x="${W / 2}" y="${frameY + frameH / 2 + 4}" text-anchor="middle" font-size="64">${obj.emoji}</text>
  <rect x="${frameX}" y="${frameY + frameH}" width="${frameW}" height="20" rx="0" fill="#FDBA74"/>
  <rect x="${frameX}" y="${frameY + frameH}" width="${frameW}" height="20" rx="0" fill="#FED7AA"/>
  <text x="${W / 2}" y="${frameY + frameH + 14}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="11" fill="#92400E" font-weight="600">${obj.label}</text>
</svg>`);
}

function genericSVG(obj: { emoji: string; label: string }): string {
  const count = 10;
  const cols = 5, rows = 2;
  const cellW = 56, cellH = 56, pad = 16;
  const boxW = cols * cellW + pad * 2, boxH = rows * cellH + pad * 2;
  const W = boxW + 32, H = boxH + 64;
  let items = '';
  for (let i = 0; i < count; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = 16 + pad + col * cellW + cellW / 2;
    const cy = 16 + pad + row * cellH + cellH / 2 + 14;
    items += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="32">${obj.emoji}</text>`;
  }
  return toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F8FAFC"/>
  <rect x="16" y="16" width="${boxW}" height="${boxH}" rx="10" fill="white" stroke="#E2E8F0" stroke-width="1.5"/>
  ${items}
  <text x="${W/2}" y="${H-8}" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif" font-size="13" fill="#94A3B8" font-weight="500">${obj.label}</text>
</svg>`);
}

// ─── Main entry point ────────────────────────────────────────────────────────

export function buildQuestionImage(spec: ImageSpec | null, questionText: string, seed: number): string {
  const obj = resolveEmoji(spec, questionText, seed);
  const op = spec?.operation ?? 'generic';
  const n1 = spec?.num1 ?? 0;
  const n2 = spec?.num2 ?? 0;

  switch (op) {
    case 'multiplication': return multiplicationSVG(n1, n2, obj);
    case 'division':       return divisionSVG(n1, n2, obj);
    case 'addition':       return additionSVG(n1, n2, obj);
    case 'subtraction':    return subtractionSVG(n1, n2, obj);
    case 'counting':       return countingSVG(n1, obj);
    case 'fraction':       return fractionSVG(n1, n2);
    case 'diagram':        return diagramSVG(obj);
    case 'timeline':       return timelineSVG(obj);
    case 'map':            return mapSVG(obj);
    case 'scene':          return sceneSVG(obj);
    default:               return genericSVG(obj);
  }
}
