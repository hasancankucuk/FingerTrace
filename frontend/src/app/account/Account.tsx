import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updatePassword, updateProfile } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DeleteAccountModal } from "./DeleteAccountModal";

export default function Account() {
  const { user, setUser } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateProfile(user);
      setUser(updatedUser);
      toast.success(t("account.toast.profile_updated"));
    } catch (err) {
      toast.error(t("account.toast.update_failed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(user?.email || "", password);
      toast.success(t("account.toast.password_updated"));
      setPassword("");
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
              <form onSubmit={handleUpdate}>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="username">{t("common.name")}</FieldLabel>
                      <Input id="username" type="text" placeholder={user?.name} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">{t("common.email")}</FieldLabel>
                      <Input id="email" type="email" placeholder={user?.email} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">{t("common.phone")}</FieldLabel>
                      <Input id="phone" type="tel" placeholder={user?.phone} />
                    </Field>

                    <Field orientation="horizontal">
                      <Button type="submit" disabled={loading}>
                        {loading ? t("common.loading") : t("common.save")}
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldSet>
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
              <form onSubmit={handleUpdatePassword}>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="password">{t("common.password")}</FieldLabel>
                      <Input id="password" type="password" placeholder="••••••••••••" />
                    </Field>

                    <Field orientation="horizontal">
                      <Button type="submit" disabled={loading}>
                        {loading ? t("common.loading") : t("common.save")}
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </form>
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
            <CardContent className=" align-middle">
              <div className="flex items-center justify-between ">
                <p className="font-medium text-destructive">
                  {t("account.delete_warning")}
                </p>
                <DeleteAccountModal />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
