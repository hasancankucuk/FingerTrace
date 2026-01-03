import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createWorkspace } from "@/services/workspaces";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [showWorkspaceKeyModal, setShowWorkspaceKeyModal] = useState(false);
  const queryClient = useQueryClient();

  if (!open) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error(t("nav.workspace.name_required"));
      return;
    }

    try {
      const res = await createWorkspace({ name: name.trim(), platform: platform.trim() });
      const id = (res && (res.id || (res as any).workspaceId)) ?? name.trim();

      setWorkspaceId(id);
      setShowWorkspaceKeyModal(true);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(t("nav.workspace.workspace_created"));
    } catch (error) {
      toast.error(t("nav.workspace.error_workspaces"));
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-md gap-0 p-0 overflow-hidden">
          <AlertDialogHeader className="p-6 pb-2">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              {t("nav.workspace.create")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Separator />

          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-2.5">
              <Label htmlFor="workspace-name" className="text-sm font-medium">
                {t("nav.workspace.workspace_name")}
              </Label>
              <Input
                id="workspace-name"
                type="text"
                placeholder={t("nav.workspace.workspace_example")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor="platform-select" className="text-sm font-medium">
                {t("common.platform")}
              </Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform-select" className="w-full bg-background">
                  <SelectValue placeholder={t("common.select_platform")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-xs uppercase tracking-widest opacity-60">
                      {t("common.available_platforms")}
                    </SelectLabel>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>

          <Separator />

          <AlertDialogFooter className="p-6 bg-muted/30">
            <AlertDialogCancel onClick={onClose}>
              {t("common.cancel", { defaultValue: "Cancel" })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {t("common.continue", { defaultValue: "Continue" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showWorkspaceKeyModal && workspaceId && (
        <CreateWorkspaceKeyModal
          showModal={showWorkspaceKeyModal}
          setShowModal={setShowWorkspaceKeyModal}
          onCreated={onCreated ?? (() => { })}
          workspaceId={workspaceId}
        />
      )}
    </>
  );
};