import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";
import ModalShell from "../molecules/ModalShell";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "palette" | "color" | "gradient";
  data: string | string[];
}

const SaveItemModal: React.FC<Props> = ({ isOpen, onClose, type, data }) => {
  const { addPalette, addColor, addGradient } = useDashboard();
  const navigate = useNavigate();
  const [name, setName] = useState("My New Item");
  const [collection, setCollection] = useState("Untitled Collection");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name) return;

    if (type === "palette") addPalette(name, collection, data as string[]);
    else if (type === "color") addColor(name, data as string);
    else if (type === "gradient") addGradient(name, data as string[]);

    onClose();
    navigate(`/dashboard/${type}`);
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md">
      <div className="p-7">
        <h2 className="text-xl font-bold text-center text-foreground mb-6">
          Save {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>

        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {type === "palette" && (
          <div className="mb-6">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Collection</label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            >
              <option>Untitled Collection</option>
              <option>Branding</option>
              <option>Web Design</option>
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth size="lg" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default SaveItemModal;
