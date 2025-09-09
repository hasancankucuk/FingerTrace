import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
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
import { resetPassword } from "@/services/auth";

export const ForgotPassword = ({ className }: { className?: string }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const value = email.trim();
      if (!value) {
        toast.error("Please enter your email");
        return;
      }

      setLoading(true);
      try {
        const res = await resetPassword(value);

        // support services that return Response or a simple object
        let ok = true;
        let body: unknown = null;
        if (res instanceof Response) {
          const text = await res.text();
          try {
            body = text ? JSON.parse(text) : null;
          } catch {
            body = text;
          }
          ok = res.ok;
        } else {
          body = res;
          ok = true;
        }

        if (!ok) {
          const msg =
            (body as any)?.message ??
            String(body) ??
            "Failed to send reset email";
          throw new Error(msg);
        }

        setSent(true);
        toast.success("If this email exists, a reset link has been sent.");
      } catch (err: unknown) {
        console.error("Forgot password error:", err);
        toast.error((err as any)?.message || "Failed to send reset email");
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  return (
    <>
      <Toaster />
      <div
        className={cn(
          "flex flex-col gap-6 items-center justify-center py-8",
          className
        )}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter the email associated with your account and we'll send a link
              to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="text-sm text-muted-foreground">
                If an account with that email exists, we've sent password reset
                instructions. Check your inbox.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-live="polite"
                className="grid gap-6"
              >
                <div className="grid gap-3">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setEmail("")}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Remembered your password?{" "}
                  <a
                    href="/login"
                    className="underline underline-offset-4"
                  >
                    Back to login
                  </a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-center text-xs">
          By continuing you agree to our{" "}
          <a className="underline" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline" href="#">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </>
  );
};
