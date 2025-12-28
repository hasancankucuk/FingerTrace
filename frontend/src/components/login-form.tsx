import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useCallback } from "react";
import { loginUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import { toast, Toaster } from "sonner";
import { Turnstile } from "@/components/helpers/Turnstile";
import type { TurnstileRef } from "@/components/helpers/Turnstile";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileVerified, setTurnstileVerified] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const turnstileRef = useRef<TurnstileRef>(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const handleTurnstileVerify = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      setTurnstileVerified(true);
    },
    []
  );

  const handleTurnstileError = useCallback(
    (error: string) => {
      console.error("Turnstile error:", error);
      setTurnstileToken(null);
      setTurnstileVerified(false);
      toast.error(t("auth.captcha_error"));
    },
    [t]
  );

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileVerified(false);
    toast.warning(t("auth.captcha_expired"));
  }, [t]);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileVerified(false);
    setTurnstileToken(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileVerified || !turnstileToken) {
      toast.error(t("auth.captcha_required"));
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(email, password, turnstileToken);

      if (result?.access_token) {
        useAuthStore.setState({ token: result.access_token });
        toast.success(t("auth.login_successful"));
        navigate("/dashboard");
      } else {
        toast.error(t("auth.toast.login_failed"));
        resetTurnstile();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("auth.toast.login_failed");
      toast.error(message);
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-border shadow-md overflow-hidden bg-card">
          <CardHeader className="space-y-1 text-center pb-2">
            <CardTitle className="text-xl font-bold">{t("auth.login")}</CardTitle>
            <CardDescription>{t("account.description")}</CardDescription>
          </CardHeader>
          <div className={`${loading ? "opacity-50 pointer-events-none" : ""}`} >
            {loading && <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />}
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">{t("common.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.email_placeholder")}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t("common.password")}</Label>
                      <a
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        {t("auth.forgot_password")}
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {siteKey && (
                    <div className="grid gap-3">
                      <Label>{t("auth.security_verification")}</Label>
                      <div className="flex justify-center">
                        <Turnstile
                          ref={turnstileRef}
                          siteKey={siteKey}
                          onVerify={handleTurnstileVerify}
                          onError={handleTurnstileError}
                          onExpire={handleTurnstileExpire}
                          theme="auto"
                          size="normal"
                        />
                      </div>
                      {turnstileVerified && (
                        <p className="text-sm text-green-600 text-center">
                          ✓ {t("auth.captcha_verified")}
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || (siteKey && !turnstileVerified)}
                  >
                    {loading ? t("auth.logging_in") : t("auth.login")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </>
  );
}
