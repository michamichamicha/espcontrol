import { state } from '../store';

export function sizeFromToken(token: string): number {
  if (token === "d") return 2;
  if (token === "w") return 3;
  if (token === "b") return 4;
  if (token === "t") return 5;
  if (token === "x") return 6;
  return 1;
}

export function sizeToken(size: number): string {
  if (size === 4) return "b";
  if (size === 2) return "d";
  if (size === 3) return "w";
  if (size === 5) return "t";
  if (size === 6) return "x";
  return "";
}

export function sizeRowSpan(size: number): number {
  return size === 5 ? 3 : (size === 2 || size === 4) ? 2 : 1;
}

export function sizeColSpan(size: number): number {
  return size === 6 ? 3 : (size === 3 || size === 4) ? 2 : 1;
}

export function sizeClass(size: number): string {
  if (size === 4) return "sp-btn-big";
  if (size === 2) return "sp-btn-double";
  if (size === 3) return "sp-btn-wide";
  if (size === 5) return "sp-btn-extra-tall";
  if (size === 6) return "sp-btn-extra-wide";
  return "";
}

export function coveredCells(pos: number, size: number, cols: number, includeOrigin: boolean): number[] {
  const cells: number[] = [];
  const rowSpan = sizeRowSpan(size);
  const colSpan = sizeColSpan(size);
  for (let r = 0; r < rowSpan; r++) {
    for (let c = 0; c < colSpan; c++) {
      if (!includeOrigin && r === 0 && c === 0) continue;
      cells.push(pos + r * cols + c);
    }
  }
  return cells;
}

export function sizeFitsAt(pos: number, size: number, maxSlots: number, cols: number): boolean {
  if (pos < 0 || pos >= maxSlots) return false;
  const col = pos % cols;
  const row = Math.floor(pos / cols);
  const rows = Math.ceil(maxSlots / cols);
  return col + sizeColSpan(size) <= cols &&
    row + sizeRowSpan(size) <= rows &&
    pos + (sizeRowSpan(size) - 1) * cols + sizeColSpan(size) - 1 < maxSlots;
}

export function parseOrder(str: string, numSlots: number, cols: number): number[] {
  const grid: number[] = Array(numSlots).fill(0);
  if (!str || !str.trim()) return grid;
  const parts = str.split(",");
  for (let i = 0; i < parts.length && i < numSlots; i++) {
    const s = parts[i].trim();
    if (!s) continue;
    const last = s.charAt(s.length - 1);
    const parsedSize = sizeFromToken(last);
    const n = parseInt(s, 10);
    if (n >= 1 && n <= numSlots && !isNaN(n)) {
      grid[i] = n;
      if (parsedSize > 1) state.sizes[n] = parsedSize;
    }
  }
  applySpans(grid, state.sizes, numSlots, cols);
  return grid;
}

export function applySpans(grid: number[], sizes: Record<number, number>, maxSlots: number, cols: number) {
  for (let i = 0; i < maxSlots; i++) {
    if (!(grid[i] > 0 || grid[i] === -2)) continue;
    const slot = grid[i];
    const size = sizes[slot] || 1;
    if (size <= 1) continue;
    if (!sizeFitsAt(i, size, maxSlots, cols)) {
      delete sizes[slot];
      continue;
    }
    const toRes = coveredCells(i, size, cols, false);
    let ok = true;
    for (let ci = 0; ci < toRes.length; ci++) {
      if (grid[toRes[ci]] > 0 || grid[toRes[ci]] === -2) {
        const displaced = grid[toRes[ci]];
        let placed = false;
        for (let j = 0; j < maxSlots; j++) {
          if (grid[j] === 0 && toRes.indexOf(j) === -1) { grid[j] = displaced; placed = true; break; }
        }
        if (!placed) { ok = false; break; }
        grid[toRes[ci]] = 0;
      }
    }
    if (!ok) { delete sizes[slot]; continue; }
    for (let mi = 0; mi < toRes.length; mi++) grid[toRes[mi]] = -1;
  }
}
