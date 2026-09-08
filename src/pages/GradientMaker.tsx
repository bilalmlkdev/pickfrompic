import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Dices, Download, Save } from "lucide-react";
import SaveItemModal from "../components/modals/SaveItemModal";
import Button from "../components/atoms/Button";
import ToolCard from "../components/templates/ToolCard";

const GradientMaker = () => {
  const [colors, setColors] = useState([
    { hex: "#ff0000", pos: 0 },
    { hex: "#0000ff", pos: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState("Linear");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const gradientString =
    type === "Linear"
      ? `linear-gradient(${angle}deg, ${colors.map((c) => `${c.hex} ${c.pos}%`).join(", ")})`
      : `radial-gradient(circle, ${colors.map((c) => `${c.hex} ${c.pos}%`).join(", ")})`;

  const randomize = () => {
    const c1 = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    const c2 = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColors([
      { hex: c1, pos: 0 },
      { hex: c2, pos: 100 },
    ]);
  };

  const downloadSvg = () => {
    const a = document.createElement("a");
    a.href = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${colors[0].hex}'/><stop offset='100%' stop-color='${colors[1].hex}'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/></svg>`;
    a.download = "gradient.svg";
    a.click();
  };

  return (
    <div className="flex-1 w-full py-8 px-4 mt-20">
      <div className="max-w-[780px] mx-auto mb-4">
        <h1 className="text-6xl font-medium text-center text-foreground mb-2">Gradient Maker</h1>
        <p className="text-center text-muted-foreground text-xl mb-6">
          Simple, creative, versatile - perfect gradients made easy
        </p>
        <Link
          to="/dashboard/gradient"
          className="text-link text-sm font-medium hover:underline mb-5 flex items-center gap-1.5 w-fit"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <ToolCard>
        <div className="flex flex-col md:flex-row gap-7">
          <div className="md:w-1/2 h-80 rounded-2xl border border-border" style={{ background: gradientString }}></div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="relative h-5 rounded-full overflow-hidden mb-7" style={{ background: gradientString }}>
                {colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-white cursor-pointer shadow"
                    style={{ left: `${c.pos}%` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full m-auto mt-[1px]" style={{ backgroundColor: c.hex }}></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Color</label>
                  <div className="flex items-center border border-border rounded-lg p-1.5 bg-card">
                    <input
                      type="text"
                      value={colors[0].hex}
                      onChange={(e) => setColors([{ ...colors[0], hex: e.target.value }, colors[1]])}
                      className="flex-1 border-none bg-transparent text-foreground text-sm focus:outline-none font-mono"
                    />
                    <input
                      type="color"
                      value={colors[0].hex}
                      onChange={(e) => setColors([{ ...colors[0], hex: e.target.value }, colors[1]])}
                      className="w-6 h-6 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Position</label>
                  <select
                    value={colors[0].pos}
                    onChange={(e) => setColors([{ ...colors[0], pos: Number(e.target.value) }, colors[1]])}
                    className="w-full border border-border rounded-lg p-2 text-sm bg-card text-foreground"
                  >
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Rotation</label>
                  <select
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full border border-border rounded-lg p-2 text-sm bg-card text-foreground"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-border rounded-lg p-2 text-sm bg-card text-foreground"
                  >
                    <option>Linear</option>
                    <option>Radial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-7">
              <Button variant="secondary" fullWidth size="lg" icon={<Dices size={15} />} onClick={randomize}>
                Random
              </Button>
              <Button variant="secondary" fullWidth size="lg" icon={<Download size={15} />} onClick={downloadSvg}>
                Download
              </Button>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                icon={<Save size={15} />}
                onClick={() => setIsSaveModalOpen(true)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </ToolCard>

      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        type="gradient"
        data={colors.map((c) => c.hex)}
      />
    </div>
  );
};

export default GradientMaker;
