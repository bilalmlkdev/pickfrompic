import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";
import { Save, X } from "lucide-react";
import ModalShell from "../molecules/ModalShell";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "palette" | "color" | "gradient";
  data: string | string[];
  initialName?: string;
}

const SaveItemModal: React.FC<Props> = ({ isOpen, onClose, type, data, initialName }) => {
  const { addPalette, addColor, addGradient } = useDashboard();
  const navigate = useNavigate();
  const [name, setName] = useState(initialName || "");

  if (!isOpen || !data) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    if (type === "palette" && (!Array.isArray(data) || data.length === 0)) return;
    if (type === "gradient" && (!Array.isArray(data) || data.length === 0)) return;
    if (type === "color" && typeof data !== "string") return;

    if (type === "palette") addPalette(name, "", data as string[]);
    else if (type === "color") addColor(name, data as string);
    else if (type === "gradient") addGradient(name, data as string[]);

    onClose();
    navigate(`/dashboard/${type}`);
  };

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const placeholders: Record<string, string> = {
    palette: "e.g. Sunset Vibes",
    color: "e.g. Primary Blue",
    gradient: "e.g. Ocean Fade",
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center">
              <Save size={16} className="text-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Save {typeLabel}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-muted-foreground mb-2">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={placeholders[type]}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default SaveItemModal;
