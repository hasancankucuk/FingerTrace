import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { sendPasswordResetEmails } from "@/services/auth";
import { Spinner } from "@/components/ui/spinner";
import { LanguageToggle } from "@/components/language-toggle";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { ModeToggle } from "@/components/mode-toggle";
type PasswordResetResponse = {
  email?: string;
  reset?: boolean;
  message?: string;
  link?: string;
  error?: string;
};

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response: PasswordResetResponse = await sendPasswordResetEmails(email);
        if (response?.error) {
          const errorMessage = response.error;

          if (errorMessage.includes("User not found")) {
            setSent(true);
            toast.success(t("auth.toast.reset_sent"));
          } else if (errorMessage.includes("UNAUTHORIZED_DOMAIN")) {
            toast.error(t("auth.toast.service_unavailable"));
          } else {
            toast.error(t("auth.toast.service_unavailable"));
          }
        } else {
          setSent(true);
          toast.success(t("auth.toast.reset_sent"));
        }
      } catch (err: unknown) {
        console.error("Forgot password error:", err);

        if (err instanceof Error) {
          const errorMessage = err.message.toLowerCase();

          if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
            toast.error(t("auth.toast.network_error"));
          } else {
            toast.error(t("auth.toast.service_unavailable"));
          }
        } else {
          toast.error(t("auth.toast.service_unavailable"));
        }
      } finally {
        setLoading(false);
      }
    },
    [email, t]
  );

  return (
    <>
      <Toaster />
      <div className="relative min-h-svh flex flex-col items-center justify-center p-6 dark:bg-zinc-950 bg-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <IconInnerShadowTop className="size-5" />
              </div>
              <span>Finger Trace</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>

          <Card className="w-full border-border shadow-md overflow-hidden bg-card">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-xl font-bold">{t("auth.reset_password")}</CardTitle>
              <CardDescription>
                {t("auth.forgot_password_desc")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {sent ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground text-center">
                    {t("auth.forgot_password_success_desc")}
                  </div>

                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSent(false);
                        setEmail("");
                      }}
                      className="text-sm"
                    >
                      {t("auth.try_different_email")}
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  aria-live="polite"
                  className="grid gap-6"
                >
                  <div className="grid gap-3">
                    <Label htmlFor="forgot-email">{t("common.email")}</Label>
                    <Input
                      id="forgot-email"
                      type="search"
                      placeholder={t("auth.email_placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}

                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {loading && <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />}
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? t("auth.sending") : t("auth.send_reset_link")}
                    </Button>
                  </div>

                  <div className="text-center text-sm">
                    {t("auth.already_have_account")}{" "}
                    <a
                      href="/login"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {t("auth.back_to_login")}
                    </a>
                  </div>
                </form>
              )}
            </CardContent>
            <div className="text-muted-foreground text-center text-xs pb-6 pt-2 whitespace-break-spaces">
              {t("auth.terms_and_privacy")}
            </div>
          </Card>

          <div className="text-center text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Finger Trace. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};
