import { useState } from "react"
import { useTranslation } from "react-i18next"

import { ContactFormData, type ContactFormDataInterface } from "@/models/ContactForm"
import { submitContactForm } from "@/services/contact"

export const useContactForm = () => {
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

    return {
        formData,
        status,
        isFormValid,
        handleChange,
        handleSelectChange,
        handleSubmit,
        resetForm
    }
}
