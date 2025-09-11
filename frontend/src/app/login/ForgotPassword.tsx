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
import { sendPasswordResetEmails } from "@/services/auth";

type PasswordResetResponse = {
  email?: string;
  reset?: boolean;
  message?: string;
  link?: string;
  error?: string;
};

export const ForgotPassword = ({ className }: { className?: string }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
            toast.success("If this email exists, a reset link has been sent.");
          } else if (errorMessage.includes("UNAUTHORIZED_DOMAIN")) {
            toast.error(
              "Email service temporarily unavailable. Please try again later."
            );
          } else {
            toast.error("Failed to send reset email. Please try again.");
          }
        } else if (response?.reset || response?.message) {
          setSent(true);
          toast.success("If this email exists, a reset link has been sent.");
        } else {
          setSent(true);
          toast.success("If this email exists, a reset link has been sent.");
        }
      } catch (err: unknown) {
        console.error("Forgot password error:", err);

        if (err instanceof Error) {
          const errorMessage = err.message.toLowerCase();

          if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
            toast.error(
              "Network error. Please check your connection and try again."
            );
          } else if (errorMessage.includes("unauthorized")) {
            toast.error("Service temporarily unavailable. Please try again later.");
          } else {
            toast.error("Failed to send reset email. Please try again.");
          }
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
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
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  If an account with that email exists, we've sent password reset
                  instructions. Check your inbox and spam folder.
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
                    Try different email
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
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loading}
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
                    className="underline underline-offset-4 hover:text-primary"
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
          <a className="underline hover:text-primary" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline hover:text-primary" href="#">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </>
  );
};
