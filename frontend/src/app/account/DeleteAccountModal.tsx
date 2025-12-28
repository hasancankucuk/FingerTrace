import { deleteUser } from "@/services/auth"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export const DeleteAccountModal = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleLogout = useAuthStore((state) => state.logout)

  const deleteAccount = async () => {
    try {
      await deleteUser()
      toast.success(t("account.toast.account_deleted"))
      handleLogout()
      navigate("/")
    } catch {
      toast.error(t("account.toast.update_failed"))
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{t("account.delete_account")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("account.delete_account")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("account.delete_desc")} {t("account.delete_warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteAccount}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}