import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import ModalShell from "../molecules/ModalShell";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const CreateProjectModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
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
    <ModalShell onClose={onClose} maxWidth="max-w-md" zIndex="z-110">
      <div className="p-7">
        <h2 className="text-xl font-bold text-center text-foreground mb-6">Create New Project</h2>

        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Project Name</label>
          <Input
            placeholder="e.g., Website Redesign"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Description (optional)
          </label>
          <textarea
            placeholder="What is this project about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth size="lg" onClick={handleCreate} disabled={!name}>
            Create
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default CreateProjectModal;
