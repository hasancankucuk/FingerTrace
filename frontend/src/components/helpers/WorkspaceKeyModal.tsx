import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export interface CreateWorkspaceKeyModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  workspaceId: string | null;
  onCreated: () => void;
}
export const CreateWorkspaceKeyModal = ({showModal, setShowModal, workspaceId, onCreated}: CreateWorkspaceKeyModalProps) => {
  const [copied, setCopied] = useState<{
    npm: boolean;
    yarn: boolean;
    code: boolean;
  }>({
    npm: false,
    yarn: false,
    code: false,
  });

  const handleCopy = async (text: string, type: "npm" | "yarn" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(
        () => setCopied({ npm: false, yarn: false, code: false }),
        1400
      );
    } catch {
      // ignore
    }
  };

  const renderCodeBlock = (code: string, type: "npm" | "yarn" | "code") => (
    <div className="relative">
      <SyntaxHighlighter language="javascript" style={atomDark} wrapLines>
        {code}
      </SyntaxHighlighter>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={() => handleCopy(code, type)}
      >
        {copied[type] ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-zinc-400" />
        )}
      </Button>
    </div>
  );
  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your Workspace ID</AlertDialogTitle>
          <AlertDialogDescription>
            Please save this Workspace ID securely. You won't be able to see it
            again!
            <br />
            <div className="mt-3">{renderCodeBlock(workspaceId || "", "code")}</div>
            <br />
            <span className="text-sm text-muted-foreground">
              This is your only chance to copy it. If you lose it, you'll have
              to create a new one.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
                setShowModal(false);
                onCreated();
            }}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
