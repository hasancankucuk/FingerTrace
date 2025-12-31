import type { ContactFormDataInterface } from "@/models/ContactForm";
import { toast } from "sonner";
import { httpRequest } from "./http";

const API_BASE_URL = import.meta.env.VITE_APP_URL;

export const submitContactForm = async (formData: ContactFormDataInterface) => {
    try {
        const response = await httpRequest<any>(`${API_BASE_URL}/contact`, {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            toast.error("Error submitting contact form")
            return
        }

        const data = response.text();
        toast.success("Contact form submitted successfully")
        return data;

    } catch (error) {
        console.error("Error submitting contact form:", error)
        throw error
    }
}