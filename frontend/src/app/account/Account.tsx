import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import { updateProfile } from "@/services/auth";

export default function Account() {
  const { user, setUser } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      toast.success(t("account.toast.profile_updated"));
    } catch (err) {
      toast.error(t("account.toast.update_failed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("account.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("account.description")}
        </p>
      </div>

      <div className="grid gap-8">
        <section className="grid md:grid-cols-[1fr_2fr] gap-6">
          <div>
            <h2 className="text-lg font-semibold">{t("account.profile_section")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("account.profile_desc")}
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("common.name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("common.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t("common.phone")}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? t("common.loading") : t("common.save")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid md:grid-cols-[1fr_2fr] gap-6">
          <div>
            <h2 className="text-lg font-semibold">{t("account.security_section")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("account.security_desc")}
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("common.password")}</p>
                  <p className="text-sm text-muted-foreground">
                    ••••••••••••
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {t("common.coming_soon")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid md:grid-cols-[1fr_2fr] gap-6">
          <div>
            <h2 className="text-lg font-semibold text-destructive">
              {t("account.delete_account")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("account.delete_desc")}
            </p>
          </div>
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">
                    {t("account.delete_warning")}
                  </p>
                </div>
                <DeleteAccountModal />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
