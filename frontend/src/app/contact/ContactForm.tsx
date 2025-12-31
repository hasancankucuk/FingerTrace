import { AlertCircle, CheckCircle, Loader2, Mail, Send } from "lucide-react"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { ContactFormData, InquiryTypes, type ContactFormDataInterface } from "@/models/ContactForm"
import { submitContactForm } from "@/services/contact"


export const ContactForm = () => {
    const { t } = useTranslation("landing")
    const [formData, setFormData] = useState<ContactFormDataInterface>(ContactFormData)
    const [status, setStatus] = useState<{
        isSubmitting: boolean;
        isSubmitted: boolean;
        error: string | null;
        referenceId: string | null;
    }>({
        isSubmitting: false,
        isSubmitted: false,
        error: null,
        referenceId: null,
    })

    const isFormValid = formData.name && formData.email && formData.subject && formData.message && formData.inquiry_type

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, inquiry_type: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus(prev => ({ ...prev, isSubmitting: true, error: null }))

        try {
            const response = await submitContactForm(formData)
            setStatus({
                isSubmitting: false,
                isSubmitted: true,
                referenceId: response.reference_id,
                error: null
            })
        } catch (err) {
            setStatus(prev => ({
                ...prev,
                isSubmitting: false,
                error: t("contact.errors.generic_error")
            }))
        }
    }

    const resetForm = () => {
        setFormData(ContactFormData)
        setStatus({ isSubmitting: false, isSubmitted: false, error: null, referenceId: null })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300">
            {status.isSubmitted ? (
                <SuccessView
                    t={t}
                    email={formData.email}
                    refId={status.referenceId}
                    onReset={resetForm}
                />
            ) : (
                <>
                    <CardHeader>
                        <CardTitle className="text-2xl">{t("contact.form.title")}</CardTitle>
                        <CardDescription>{t("contact.form.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status.error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{t("contact.errors.title")}</AlertTitle>
                                <AlertDescription>{status.error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormGroup label={t("contact.form.name")} id="name">
                                    <Input id="name" value={formData.name} onChange={handleChange} required disabled={status.isSubmitting} />
                                </FormGroup>
                                <FormGroup label={t("contact.form.email")} id="email">
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required disabled={status.isSubmitting} />
                                </FormGroup>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormGroup label={t("contact.form.company")} id="company">
                                    <Input id="company" value={formData.company} onChange={handleChange} disabled={status.isSubmitting} />
                                </FormGroup>
                                <FormGroup label={t("contact.form.inquiry_type")} id="inquiry_type">
                                    <Select value={formData.inquiry_type} onValueChange={handleSelectChange} disabled={status.isSubmitting}>
                                        <SelectTrigger id="inquiry_type">
                                            <SelectValue placeholder={t("contact.form.placeholders.inquiry_type")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {InquiryTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {t(`contact.form.options.${type.name}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormGroup>
                            </div>

                            <FormGroup label={t("contact.form.subject")} id="subject">
                                <Input id="subject" value={formData.subject} onChange={handleChange} required disabled={status.isSubmitting} />
                            </FormGroup>

                            <FormGroup label={t("contact.form.message")} id="message">
                                <Textarea id="message" rows={4} value={formData.message} onChange={handleChange} required disabled={status.isSubmitting} />
                            </FormGroup>

                            <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || status.isSubmitting}>
                                {status.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("contact.form.sending")}
                                    </>
                                ) : (
                                    <>
                                        {t("contact.form.submit")}
                                        <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </>
            )}
        </Card>
    )
}


const FormGroup = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </Label>
        {children}
    </div>
)

const SuccessView = ({ t, email, refId, onReset }: any) => (
    <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t("contact.success.title")}</h2>
        <p className="text-muted-foreground mb-4">{t("contact.success.description")}</p>

        {refId && (
            <div className="bg-muted p-3 rounded-md mb-6 inline-block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    {t("contact.success.reference_id")}
                </span>
                <code className="font-mono font-bold text-primary">{refId}</code>
            </div>
        )}

        <Alert className="mb-6 bg-primary/5 border-primary/20">
            <Mail className="h-4 w-4" />
            <AlertDescription>
                {t("contact.success.email_confirm", { email })}
            </AlertDescription>
        </Alert>

        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
            {t("contact.success.send_another")}
        </Button>
    </div>
)