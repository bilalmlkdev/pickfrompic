import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const CreateProjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { addProject } = useDashboard();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name) return;
    const newProject = addProject(name, description);
    onCreated(newProject.id);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Create New Project
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            placeholder="e.g., Website Redesign"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            placeholder="What is this project about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-500 resize-none"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              name
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
