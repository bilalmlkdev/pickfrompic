export const hexToRgb = (hex: string) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return { r, g, b };
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const rgbToCmyk = (r: number, g: number, b: number) => {
  const c = 1 - r / 255,
    m = 1 - g / 255,
    y = 1 - b / 255,
    k = Math.min(c, m, y);
  return {
    c: Math.round(((c - k) / (1 - k)) * 100) || 0,
    m: Math.round(((m - k) / (1 - k)) * 100) || 0,
    y: Math.round(((y - k) / (1 - k)) * 100) || 0,
    k: Math.round(k * 100) || 0,
  };
};

export const rgbToXyz = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;
  return { x: Math.round(x), y: Math.round(y), z: Math.round(z) };
};

export const rgbToLab = (r: number, g: number, b: number) => {
  const { x, y, z } = rgbToXyz(r, g, b);
  const refX = 95.047,
    refY = 100,
    refZ = 108.883;
  const fx =
    x / refX > 0.008856
      ? Math.pow(x / refX, 1 / 3)
      : 7.787 * (x / refX) + 16 / 116;
  const fy =
    y / refY > 0.008856
      ? Math.pow(y / refY, 1 / 3)
      : 7.787 * (y / refY) + 16 / 116;
  const fz =
    z / refZ > 0.008856
      ? Math.pow(z / refZ, 1 / 3)
      : 7.787 * (z / refZ) + 16 / 116;
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b_ = 200 * (fy - fz);
  return { L: Math.round(L), a: Math.round(a), b: Math.round(b_) };
};

export const rgbToLuv = (r: number, g: number, b: number) => {
  const { x, y, z } = rgbToXyz(r, g, b);
  const refX = 95.047,
    refY = 100,
    refZ = 108.883;
  const u = (4 * x) / (x + 15 * y + 3 * z);
  const v = (9 * y) / (x + 15 * y + 3 * z);
  const u_ = (4 * refX) / (refX + 15 * refY + 3 * refZ);
  const v_ = (9 * refY) / (refX + 15 * refY + 3 * refZ);
  const L =
    y / refY > 0.008856
      ? 116 * Math.pow(y / refY, 1 / 3) - 16
      : 903.3 * (y / refY);
  const U = 13 * L * (u - u_);
  const V = 13 * L * (v - v_);
  return { L: Math.round(L), U: Math.round(U), V: Math.round(V) };
};

export const rgbToHwb = (r: number, g: number, b: number) => {
  const { h, s, l } = rgbToHsl(r, g, b);
  const w = (Math.min(r, g, b) / 255) * 100;
  const bl = 100 - (Math.max(r, g, b) / 255) * 100;
  return { h, w: Math.round(w), b: Math.round(bl) };
};
