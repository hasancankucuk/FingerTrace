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
import { useState, useRef, useCallback } from "react";
import { loginUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
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
      toast.error("CAPTCHA verification failed. Please try again.");
    },
    []
  );

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileVerified(false);
    toast.warning("CAPTCHA expired. Please verify again.");
  }, []);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileVerified(false);
    setTurnstileToken(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileVerified || !turnstileToken) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(email, password, turnstileToken);

      if (result?.access_token) {
        useAuthStore.setState({ token: result.access_token });
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
        resetTurnstile();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className={cn("flex flex-col gap-6 py-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Login to your account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {/* Email ve Password alanları aynı */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
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
                    <Label>Security Verification</Label>
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
                        ✓ Verification completed
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || (siteKey && !turnstileVerified)}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
