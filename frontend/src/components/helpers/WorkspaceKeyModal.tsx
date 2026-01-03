import { CopyIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";

export interface CreateWorkspaceKeyModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  workspaceId: string | null;
  onCreated: () => void;
}

export const CreateWorkspaceKeyModal = ({ showModal, setShowModal, workspaceId, onCreated }: CreateWorkspaceKeyModalProps) => {
  const { t } = useTranslation();
  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("nav.workspace.workspace_id")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("nav.workspace.key_modal_description")}
            <br />
            <div className="flex items-center gap-2">
              <input
                value={workspaceId?.toString()}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigator.clipboard.writeText(workspaceId?.toString() || "")}
              >
                <CopyIcon />
              </Button>

            </div>
            <br />
            <span className="text-sm text-muted-foreground">
              {t("nav.workspace.key_modal_warning")}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setShowModal(false);
              onCreated();
            }}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {t("nav.workspace.key_modal_close")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

}