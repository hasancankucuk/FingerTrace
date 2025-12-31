export interface InquiryTypeInterface {
    id: string
    name: string
}

export const InquiryTypes: InquiryTypeInterface[] = [
    { id: "general", name: "general" },
    { id: "technical", name: "technical" },
    { id: "enterprise", name: "enterprise" },
    { id: "partnership", name: "partnership" },
    { id: "security", name: "security" },
    { id: "other", name: "other" },
]

export interface ContactFormDataInterface {
    name: string
    email: string
    company: string
    subject: string
    message: string
    inquiry_type: string
}

export const ContactFormData = {
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiry_type: "",
}