import { createWorkspace } from "@/services/workspaces";
import { useState } from "react";
import { toast } from "sonner";
import { CreateWorkspaceKeyModal } from "./WorkspaceKeyModal";


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
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [showWorkspaceKeyModal, setShowWorkspaceKeyModal] = useState(false);

  if (!open) return null;

  const create = async () => {
    if (!name.trim()) {
      return setError("Name required");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createWorkspace({ name: name.trim() });
      // try to read id from response, fallback to name if absent
      const id = (res && (res.id || (res as any).workspaceId)) ?? name.trim();
      setWorkspaceId(id);
      setShowWorkspaceKeyModal(true);
      toast.success("Workspace created!");
      // if (onCreated) await onCreated();
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
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-background border border-border rounded-lg p-6 w-full max-w-md z-10 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Create Workspace</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          className="w-full px-3 py-2 border rounded-md text-sm placeholder:text-muted-foreground disabled:opacity-50 mb-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          disabled={loading}
        />
        {error && <div className="text-sm text-destructive mb-3">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-md text-sm border border-border hover:bg-accent/50 transition-colors disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            onClick={create}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
    {showWorkspaceKeyModal && workspaceId && (
      <CreateWorkspaceKeyModal
        showModal={showWorkspaceKeyModal}
        setShowModal={setShowWorkspaceKeyModal}
        onCreated={onCreated ?? (() => {})}
        workspaceId={workspaceId}
      />
    )}
    </>
  );
}
