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
  const { h } = rgbToHsl(r, g, b);
  const w = (Math.min(r, g, b) / 255) * 100;
  const bl = 100 - (Math.max(r, g, b) / 255) * 100;
  return { h, w: Math.round(w), b: Math.round(bl) };
};



// Add to src/utils/ColorMath.ts

export const getContrastRatio = (hex1: string, hex2: string) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  // Linearize sRGB
  const linearize = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  // Calculate Relative Luminance
  const luminance = (r: number, g: number, b: number) => {
    const R = linearize(r);
    const G = linearize(g);
    const B = linearize(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const L1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const L2 = luminance(rgb2.r, rgb2.g, rgb2.b);

  // Ensure L1 is the lighter color
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
};




// ... (Keep all existing functions like hexToRgb, rgbToHsl, rgbToCmyk, etc.)

export const rgbToHsb = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
};

export const hsbToHex = (h: number, s: number, v: number) => {
  s /= 100; v /= 100;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hslToHex = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};
