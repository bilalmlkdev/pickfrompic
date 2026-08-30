// Convert HEX array to CSS variables
export const convertToCss = (colors: string[]) => {
  return `/* CSS HEX */\n${colors.map((c, i) => `--color-${i + 1}: ${c};`).join("\n")}`;
};

// Convert HEX array to Code (Array / JSON)
export const convertToCode = (colors: string[]) => {
  return `/* Array */\n${JSON.stringify(colors)}`;
};

// Generate SVG string
export const generateSvg = (colors: string[]) => {
  const rects = colors
    .map(
      (color, i) =>
        `<rect x="${i * 50}" y="0" width="50" height="100" fill="${color}" />`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${colors.length * 50}" height="100" viewBox="0 0 ${colors.length * 50} 100">${rects}</svg>`;
};

// Generate PNG Data URL
export const generatePng = (colors: string[]) => {
  const canvas = document.createElement("canvas");
  const width = colors.length * 50;
  const height = 100;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  colors.forEach((color, index) => {
    ctx!.fillStyle = color;
    ctx!.fillRect(index * 50, 0, 50, height);
  });

  // Draw the "Exported from" bottom strip
  ctx!.fillStyle = "rgba(0,0,0,0.1)"; // Transparent grey
  ctx!.fillRect(0, 90, width, 10);
  ctx!.fillStyle = "black";
  ctx!.font = "8px Arial";
  ctx!.fillText("Exported from pickfrompic.com", 2, 97);

  return canvas.toDataURL("image/png");
};

// Helper to trigger download
export const downloadFile = (
  filename: string,
  content: string,
  type: string,
) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
