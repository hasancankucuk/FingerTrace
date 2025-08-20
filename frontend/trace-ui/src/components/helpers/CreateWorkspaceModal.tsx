import { createWorkspace } from "@/services/workspaces";
import { useState } from "react";

export default function CreateWorkspaceModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const create = async () => {
    if (!name.trim()) {
      return setError("Name required");
    } 

    setLoading(true);
    setError(null);

    try {
      await createWorkspace({name: name.trim()});
      setName("");
      onClose();
      if (onCreated) {
        await onCreated()
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create workspace");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background border border-border rounded p-4 w-full max-w-md z-10">
        <h3 className="text-lg font-medium mb-2">Create Workspace</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          className="w-full p-2 border rounded mb-3"
          disabled={loading}
        />
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-primary text-primary-foreground rounded"
            onClick={create}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}