import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(email, password, name);
      if (res?.access_token) {
        useAuthStore.setState({ token: res.access_token });
        navigate("/dashboard");
      } else {
        toast.warning("Registration succeeded but no token returned");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Toaster />
      <div
        className={cn(
          "flex flex-col gap-6",
          className
        )}
        {...props}
      >
        <Card className="w-full border-border shadow-md overflow-hidden bg-card">
          <CardHeader className="space-y-1 text-center pb-2">
            <CardTitle className="text-xl font-bold">{t("auth.create_account")}</CardTitle>
            <CardDescription>{t("auth.signup_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">{t("common.name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.name_placeholder")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email_placeholder")}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("auth.creating") : t("auth.create_account")}
              </Button>
              <div className="text-center text-sm">
                {t("auth.already_have_account")}{" "}
                <a href="/login" className="underline underline-offset-4">
                  {t("auth.back_to_login")}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-center text-xs">
          By continuing you agree to our{" "}
          <a className="underline" href="/terms">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline" href="/privacy">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </>
  );
}
