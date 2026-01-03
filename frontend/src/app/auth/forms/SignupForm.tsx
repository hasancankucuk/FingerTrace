import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { registerUser } from "@/services/auth"
import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"

interface SignupUser {
    email: string;
    password: string;
    name: string;
}

export const SignupForm = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();

    const [user, setUser] = useState<SignupUser>({
        email: "",
        password: "",
        name: "",
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await registerUser(user.email, user.password, user.name);
            console.log("res", res);
            if (res?.access_token) {
                toast.success(t("auth.toast.register_success"));
                navigate("/dashboard");
            } else {
                toast.warning(t("auth.toast.no_token"));
            }
        } catch (error) {
            toast.error(t("auth.toast.register_failed"));
            console.log("test")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Toaster />
            <Card className="border-border shadow-md overflow-hidden bg-card">
                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-xl font-bold">{t("auth.signup")}</CardTitle>
                    <CardDescription>{t("auth.signup_desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldSet>
                                <Field>
                                    <FieldLabel htmlFor="name">{t("common.name")}</FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t("auth.name_placeholder")}
                                        required
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        disabled={loading}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">{t("common.email")}</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t("auth.email_placeholder")}
                                        required
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                                        value={user.password}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                        disabled={loading}
                                    />
                                </Field>

                                <Field orientation="horizontal">
                                    {loading && <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />}
                                    <Button type="submit" className="w-full" disabled={loading}>{loading ? t("auth.creating") : t("auth.create_account")}</Button>
                                </Field>

                                <Field>
                                    <Separator className="h-px bg-border my-6" />
                                    <p className="text-center pb-2 text-sm hover:underline">{t("auth.already_have_account")} <a className="ml-1 text-blue-500" href="/login">{t("auth.back_to_login")}</a></p>
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <div className="text-muted-foreground text-center text-xs px-4 leading-relaxed pt-4">
                {t("legal.terms.agreement_prefix")}{" "}
                <Link className="underline underline-offset-4 hover:text-primary" to="/terms">
                    {t("legal.terms.title")}
                </Link>{" "}
                {t("common.and")}{" "}
                <Link className="underline underline-offset-4 hover:text-primary" to="/privacy">
                    {t("legal.privacy.title")}
                </Link>
                {t("legal.terms.agreement_suffix")}
            </div>
        </div>
    )
}