import { useTurnstile } from "@/components/helpers/Turnstile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { loginUser } from "@/services/auth"
import { useAuthStore } from "@/store/useAuthStore"
import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"

export const LoginForm = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const { Turnstile: TurnstileWidget, verified: turnstileVerified, reset, token } = useTurnstile();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!turnstileVerified) {
            toast.error(t("auth.captcha_required"));
            return;
        }

        setLoading(true);
        try {
            const result = await loginUser({ email, password, token });
            if (result?.access_token) {
                useAuthStore.setState({ token: result.access_token });
                toast.success(t("auth.login_successful"));
                navigate("/dashboard");
            } else {
                toast.error(t("auth.toast.login_failed"));
                reset();
            }
        } catch (error) {
            toast.error(t("auth.toast.login_failed"));
            reset();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toaster />
            <Card className="border-border shadow-md overflow-hidden bg-card">
                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-xl font-bold">{t("auth.login")}</CardTitle>
                    <CardDescription>{t("account.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldSet>
                                <Field>
                                    <FieldLabel htmlFor="email">{t("common.email")}</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t("auth.email_placeholder")}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </Field>

                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">{t("common.password")}</FieldLabel>
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
                                        placeholder={t("auth.password_placeholder")}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </Field>

                                <Field>
                                    <TurnstileWidget />
                                </Field>

                                <Field orientation="horizontal">
                                    {loading && <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />}
                                    <Button type="submit" className="w-full" disabled={loading || !turnstileVerified}>{loading ? t("auth.logging_in") : t("auth.login")}</Button>
                                </Field>

                                <Field>
                                    <Separator className="h-px bg-border my-6" />
                                    <p className="text-center pb-2 text-sm hover:underline">{t("auth.dont_have_account")} <a className="ml-1 text-blue-500" href="/signup">{t("auth.signup")}</a></p>
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div >
    )
}