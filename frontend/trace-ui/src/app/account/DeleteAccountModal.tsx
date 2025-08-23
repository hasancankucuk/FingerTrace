import { deleteUser } from "@/services/auth"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface DeleteAccountModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
}

export const DeleteAccountModal = ({ showModal, setShowModal }: DeleteAccountModalProps) => {
  const navigate = useNavigate()

  const deleteAccount = async () => {
    try {
      await deleteUser()
      toast.success("Account deleted successfully")
      useAuthStore.getState().logout()
      navigate("/")
    } catch {
      toast.error("Failed to delete account")
    } finally {
      setShowModal(false)
    }
  }

  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteAccount}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}