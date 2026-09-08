import { useState } from "react";
import { Check, Palette as PaletteIcon, Ruler, Lightbulb, X } from "lucide-react";
import { getContrastRatio, hexToRgb } from "../utils/ColorMath";
import ToolCard from "../components/templates/ToolCard";

const ContrastChecker = () => {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#2596be");

  const ratio = getContrastRatio(textColor, bgColor);

  const normalAARatio = 4.5;
  const normalAAARatio = 7;
  const largeAARatio = 3;
  const largeAAARatio = 4.5;

  const isNormalAA = ratio >= normalAARatio;
  const isNormalAAA = ratio >= normalAAARatio;
  const isLargeAA = ratio >= largeAARatio;
  const isLargeAAA = ratio >= largeAAARatio;

  let rating = "Poor";
  let ratingColor = "text-danger";
  let ratingBg = "bg-danger/10 border-danger/30";

  if (ratio >= 7) {
    rating = "Excellent";
    ratingColor = "text-success";
    ratingBg = "bg-success/10 border-success/30";
  } else if (ratio >= 4.5) {
    rating = "Good";
    ratingColor = "text-accent";
    ratingBg = "bg-accent/10 border-accent/30";
  } else if (ratio >= 3) {
    rating = "Moderate";
    ratingColor = "text-orange-500";
    ratingBg = "bg-orange-500/10 border-orange-500/30";
  }

  void hexToRgb;

  return (
    <div className="flex-1 w-full py-10 px-4">
      <div className="max-w-[780px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1.5">Color Contrast Checker</h1>
          <p className="text-muted-foreground text-[15px]">
            Test the contrast ratio between foreground and background colors to ensure accessibility.
          </p>
        </div>

        <ToolCard noPadding className="overflow-hidden">
          <div className="p-6 md:p-7 border-b border-border flex flex-col md:flex-row items-center justify-between gap-5 bg-muted/40">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-foreground">
                {ratio.toFixed(2)}
                <span className="text-xl text-muted-foreground">:1</span>
              </div>
              <p className="text-muted-foreground mt-1.5 text-sm">Contrast</p>
            </div>

            <div className={`flex items-center gap-3.5 px-5 py-3 rounded-2xl border ${ratingBg}`}>
              <div className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center font-bold text-sm text-foreground">
                AA
              </div>
              <div>
                <div className={`text-lg font-bold ${ratingColor}`}>{rating}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
            <div className="p-5 border-b md:border-b-0 md:border-r border-border">
              <h3 className="font-semibold text-sm mb-3 text-center text-foreground">Normal Text</h3>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-sm text-foreground">AA (4.5:1)</div>
                  <div className={`mt-1 flex justify-center ${isNormalAA ? "text-success" : "text-danger"}`}>
                    {isNormalAA ? <Check size={20} /> : <X size={20} />}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-foreground">AAA (7:1)</div>
                  <div className={`mt-1 flex justify-center ${isNormalAAA ? "text-success" : "text-danger"}`}>
                    {isNormalAAA ? <Check size={20} /> : <X size={20} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-sm mb-3 text-center text-foreground">Large Text</h3>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-sm text-foreground">AA (3:1)</div>
                  <div className={`mt-1 flex justify-center ${isLargeAA ? "text-success" : "text-danger"}`}>
                    {isLargeAA ? <Check size={20} /> : <X size={20} />}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-foreground">AAA (4.5:1)</div>
                  <div className={`mt-1 flex justify-center ${isLargeAAA ? "text-success" : "text-danger"}`}>
                    {isLargeAAA ? <Check size={20} /> : <X size={20} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 p-6 md:p-7">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
              <div className="flex gap-2 border-b border-border pb-3.5">
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted text-xs font-medium text-foreground">
                  <PaletteIcon size={13} /> Colors
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-muted-foreground text-xs">
                  <Ruler size={13} /> Adjust
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-muted-foreground text-xs">
                  <Lightbulb size={13} /> Suggestions
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Text Color</label>
                <div className="flex items-center border border-border rounded-lg overflow-hidden mb-2 bg-card">
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-2.5 bg-transparent text-foreground focus:outline-none font-mono text-sm"
                  />
                  <div className="w-9 h-9 border-l border-border" style={{ backgroundColor: textColor }}></div>
                </div>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-9 cursor-pointer rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Background Color</label>
                <div className="flex items-center border border-border rounded-lg overflow-hidden mb-2 bg-card">
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 p-2.5 bg-transparent text-foreground focus:outline-none font-mono text-sm"
                  />
                  <div className="w-9 h-9 border-l border-border" style={{ backgroundColor: bgColor }}></div>
                </div>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-9 cursor-pointer rounded-lg"
                />
              </div>
            </div>

            <div
              className="rounded-2xl border border-border p-6 flex flex-col items-center justify-center min-h-[360px]"
              style={{ backgroundColor: bgColor }}
            >
              <div className="text-center" style={{ color: textColor }}>
                <div className="text-7xl font-bold mb-3">Aa</div>
                <h2 className="text-2xl font-bold mb-1.5">Preview Title</h2>
                <p className="text-lg mb-3">The quick brown fox jumps over the lazy dog</p>
                <p className="text-xs mb-6">Small text example (12px)</p>

                <div className="flex justify-center gap-7 pt-3.5 border-t border-current/20 text-sm">
                  <div>
                    <p className="font-semibold">Text</p>
                    <p className="text-xs opacity-80">{textColor}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Background</p>
                    <p className="text-xs opacity-80">{bgColor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 p-6 md:p-7 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1.5">Level AA</h4>
              <p className="text-sm text-muted-foreground">
                Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. Required for most
                websites.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1.5">Level AAA</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced contrast ratio of 7:1 for normal text and 4.5:1 for large text. Recommended for
                optimal accessibility.
              </p>
            </div>
            <p className="text-xs text-muted-foreground col-span-full mt-2">
              Good contrast (AA) for normal text, excellent contrast (AAA) for large text.
            </p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default ContrastChecker;
