import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { useParams } from "react-router-dom";
import { Check, Copy, Heart, MoreHorizontal, Pencil, Pipette } from "lucide-react";
import {
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  rgbToXyz,
  rgbToLab,
  rgbToLuv,
  rgbToHwb,
  rgbToHsb,
  hsbToHex,
  hslToHex,
  isValidHex,
} from "../utils/ColorMath";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import Dropdown from "../components/atoms/Dropdown";
import ToolCard from "../components/templates/ToolCard";

const ColorConversion = () => {
  const { hex } = useParams();
  const initialHex = hex ? `#${hex.replace("#", "")}` : "#2596be";

  const [currentHex, setCurrentHex] = useState(initialHex);
  const [format, setFormat] = useState("picker");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const rgb = hexToRgb(currentHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const luv = rgbToLuv(rgb.r, rgb.g, rgb.b);
  const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

  const formats = [
    { label: "HEX", value: currentHex },
    { label: "HSL", value: `${hsl.h}, ${hsl.s}, ${hsl.l}` },
    { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
    { label: "XYZ", value: `${xyz.x}, ${xyz.y}, ${xyz.z}` },
    { label: "CMYK", value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}` },
    { label: "LUV", value: `${luv.L}, ${luv.U}, ${luv.V}` },
    { label: "LAB", value: `${lab.L}, ${lab.a}, ${lab.b}` },
    { label: "HWB", value: `${hwb.h}, ${hwb.w}, ${hwb.b}` },
  ];

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper API not in TS lib types
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) setCurrentHex(result.sRGBHex);
      } catch {
        // cancelled
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  const handleHsbChange = (key: "h" | "s" | "v", value: number) => {
    if (isNaN(value)) return;
    const newHsb = { ...hsb, [key]: value };
    setCurrentHex(hsbToHex(newHsb.h, newHsb.s, newHsb.v));
  };

  const handleHslChange = (key: "h" | "s" | "l", value: number) => {
    if (isNaN(value)) return;
    const newHsl = { ...hsl, [key]: value };
    setCurrentHex(hslToHex(newHsl.h, newHsl.s, newHsl.l));
  };

  const handleRgbChange = (key: "r" | "g" | "b", value: number) => {
    if (isNaN(value)) return;
    const newRgb = { ...rgb, [key]: value };
    const toHex = (c: number) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    setCurrentHex(`#${toHex(newRgb.r)}${toHex(newRgb.g)}${toHex(newRgb.b)}`);
  };

  const hueGradient =
    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";
  const hsbSGradient = `linear-gradient(to right, #888888, ${currentHex})`;
  const hsbVGradient = `linear-gradient(to right, #000000, ${currentHex})`;
  const hslSGradient = `linear-gradient(to right, #888888, ${currentHex})`;
  const hslLGradient = "linear-gradient(to right, #000000, #ffffff)";

  return (
    <div className="flex-1 w-full py-6 px-4 mt-16">
      <div className="max-w-[780px] mx-auto mb-3">
        <h1 className="text-5xl text-center font-medium text-foreground mb-2">
          #{currentHex.replace("#", "").toUpperCase()}
        </h1>
        <p className="text-muted-foreground text-center text-lg mb-3">
          Generate color codes, variations, harmonies, and check contrast
          ratios.
        </p>
      </div>

      <ToolCard>
        <div className="grid grid-cols-1 lg:grid-cols-[30%_68%] gap-4">
          <div className="md:w-full relative">
            <h2 className="text-base font-semibold text-foreground mb-3.5">
              Color Conversion
            </h2>

            <HexColorPicker
              color={currentHex}
              onChange={setCurrentHex}
              className="w-full h-44!"
            />

            <div className="mt-3.5 border border-border rounded-lg p-3 bg-muted/50 space-y-3.5">
              {format === "picker" && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isValidHex(val)) setCurrentHex(val);
                      else if (val === "" || val === "#") setCurrentHex(val);
                    }}
                    className="flex-1 border border-border rounded-lg p-2 bg-card text-foreground text-sm font-mono focus:outline-none"
                  />
                  <div
                    className="w-8 h-8 rounded-lg border border-border"
                    style={{ backgroundColor: currentHex }}
                  ></div>
                </div>
              )}

              {format === "hsb" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">H</span>
                    <input
                      type="number"
                      value={hsb.h}
                      onChange={(e) =>
                        handleHsbChange("h", parseInt(e.target.value))
                      }
                      className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={hsb.h}
                    onChange={(e) =>
                      handleHsbChange("h", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: hueGradient }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">S</span>
                    <input
                      type="number"
                      value={hsb.s}
                      onChange={(e) =>
                        handleHsbChange("s", parseInt(e.target.value))
                      }
                      className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={hsb.s}
                    onChange={(e) =>
                      handleHsbChange("s", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: hsbSGradient }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">B</span>
                    <input
                      type="number"
                      value={hsb.v}
                      onChange={(e) =>
                        handleHsbChange("v", parseInt(e.target.value))
                      }
                      className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={hsb.v}
                    onChange={(e) =>
                      handleHsbChange("v", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: hsbVGradient }}
                  />
                </div>
              )}

              {format === "hsl" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">H</span>
                    <input
                      type="number"
                      value={hsl.h}
                      onChange={(e) =>
                        handleHslChange("h", parseInt(e.target.value))
                      }
                      className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={hsl.h}
                    onChange={(e) =>
                      handleHslChange("h", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: hueGradient }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">S</span>
                    <input
                      type="number"
                      value={hsl.s}
                      onChange={(e) =>
                        handleHslChange("s", parseInt(e.target.value))
                      }
                      className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={hsl.s}
                    onChange={(e) =>
                      handleHslChange("s", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: hslSGradient }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">L</span>
                    <input
                      type="number"
                      value={hsl.l}
                      onChange={(e) =>
                        handleHslChange("l", parseInt(e.target.value))
                      }
                      className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={hsl.l}
                    onChange={(e) =>
                      handleHslChange("l", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: hslLGradient }}
                  />
                </div>
              )}

              {format === "rgb" && (
                <div className="space-y-2.5">
                  {(["r", "g", "b"] as const).map((key) => {
                    const channelGradient =
                      key === "r"
                        ? `linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`
                        : key === "g"
                          ? `linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`
                          : `linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`;
                    return (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground uppercase">
                          {key}
                        </span>
                        <input
                          type="number"
                          value={rgb[key]}
                          onChange={(e) =>
                            handleRgbChange(key, parseInt(e.target.value))
                          }
                          className="w-16 border border-border rounded px-2 py-1 text-right text-sm bg-card text-foreground"
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={rgb[key]}
                        onChange={(e) =>
                          handleRgbChange(key, parseInt(e.target.value))
                        }
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ background: channelGradient }}
                      />
                    </div>
                  )})}
                </div>
              )}

              {format === "cmyk" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {(["c", "m", "y", "k"] as const).map((key) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground uppercase">
                        {key}
                      </label>
                      <input
                        type="number"
                        value={cmyk[key]}
                        readOnly
                        className="w-full border border-border rounded px-2 py-1 text-sm bg-card text-foreground"
                      />
                    </div>
                  ))}
                </div>
              )}

              {format === "lab" && (
                <div className="grid grid-cols-3 gap-2.5">
                  {(["L", "a", "b"] as const).map((key) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground">
                        {key}
                      </label>
                      <input
                        type="number"
                        value={lab[key]}
                        readOnly
                        className="w-full border border-border rounded px-2 py-1 text-sm bg-card text-foreground"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-2.5">
                <Dropdown
                  options={[
                    { label: "Picker", value: "picker" },
                    { label: "HSB", value: "hsb" },
                    { label: "HSL", value: "hsl" },
                    { label: "RGB", value: "rgb" },
                    { label: "CMYK", value: "cmyk" },
                    { label: "LAB", value: "lab" },
                  ]}
                  value={format}
                  onChange={(val) => setFormat(String(val))}
                  className="w-auto min-w-[100px]"
                />
                <div className="flex items-center gap-2.5">
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleCopy("hex-copy", currentHex)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy"
                  >
                    {copiedId === "hex-copy" ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              icon={<Pipette size={15} />}
              onClick={pickFromScreen}
              className="mt-3.5"
            >
              Pick from Screen
            </Button>
          </div>

          <div className="flex-1">
            <div
              className="rounded-2xl p-10 mb-5 flex items-center justify-between"
              style={{ backgroundColor: currentHex }}
            >
              <h2
                className="text-xl font-bold drop-shadow-sm"
                style={{
                  color:
                    rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 150
                      ? "#000000"
                      : "#ffffff",
                }}
              >
                {currentHex.toUpperCase()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="rounded-full p-2 transition-colors"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color:
                      rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 150
                        ? "#000000"
                        : "#ffffff",
                  }}
                  title="Save Color"
                >
                  <Heart size={16} />
                </button>
                <button
                  className="rounded-full p-2 transition-colors"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color:
                      rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 150
                        ? "#000000"
                        : "#ffffff",
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {formats.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between border border-border rounded-lg p-2.5 bg-card/50"
                >
                  <span className="text-base text-muted-foreground w-11 shrink-0">
                    {f.label}
                  </span>
                  <span className="font-mono text-base text-foreground flex-1 ml-2 truncate">
                    {f.value}
                  </span>
                  <button
                    onClick={() => handleCopy(`format-${f.label}`, f.value)}
                    className="text-foreground transition-colors shrink-0"
                  >
                    {copiedId === `format-${f.label}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="color"
        data={currentHex}
      />
    </div>
  );
};

export default ColorConversion;
