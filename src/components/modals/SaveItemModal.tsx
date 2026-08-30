import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "palette" | "color" | "gradient";
  data: any;
}

const SaveItemModal: React.FC<Props> = ({ isOpen, onClose, type, data }) => {
  const { addPalette, addColor, addGradient } = useDashboard();
  const navigate = useNavigate();
  const [name, setName] = useState("My New Item");
  const [collection, setCollection] = useState("Untitled Collection");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name) return;

    if (type === "palette") addPalette(name, collection, data);
    else if (type === "color") addColor(name, data);
    else if (type === "gradient") addGradient(name, data);

    onClose();
    navigate(`/dashboard/${type}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Save {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-500"
          />
        </div>

        {type === "palette" && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection
            </label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-500"
            >
              <option>Untitled Collection</option>
              <option>Branding</option>
              <option>Web Design</option>
            </select>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveItemModal;
