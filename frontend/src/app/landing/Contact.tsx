import { NavigationBar } from "@/components/landing/NavigationBar"
import { FooterSection } from "@/components/landing/FooterSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Mail, Clock, Send, Bug, HeadphonesIcon, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { useState } from "react"

const BASE_URL = import.meta.env.VITE_APP_URL
const contactMethods = [
    {
        icon: <Mail className="h-6 w-6" />,
        title: "Email Support",
        description: "Get help via email",
        contact: "support@fingertrace.app",
    },
    {
        icon: <Bug className="h-6 w-6" />,
        title: "Security Issues",
        description: "Report security vulnerabilities",
        contact: "security@fingertrace.app",
    },
    {
        icon: <HeadphonesIcon className="h-6 w-6" />,
        title: "Technical Support",
        description: "Integration and technical help",
        contact: "tech@fingertrace.app",
    },
]

interface ContactFormData {
    name: string
    email: string
    company: string
    subject: string
    message: string
    inquiry_type: string
}

export const Contact = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        inquiry_type: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [referenceId, setReferenceId] = useState("")
    const [error, setError] = useState("")
    const [copiedEmail, setCopiedEmail] = useState("")

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            const response = await fetch(`${BASE_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company || "",
                    subject: formData.subject,
                    message: formData.message,
                    inquiry_type: formData.inquiry_type,
                }),
            })

            // Check if response has content
            const contentType = response.headers.get("content-type")
            let data = null

            if (contentType && contentType.includes("application/json")) {
                const text = await response.text()
                if (text) {
                    try {
                        data = JSON.parse(text)
                    } catch (parseError) {
                        console.error('JSON parse error:', parseError)
                        throw new Error("Invalid response format from server")
                    }
                } else {
                    throw new Error("Empty response from server")
                }
            } else {
                const text = await response.text()
                console.error('Non-JSON response:', text)
                throw new Error("Server returned non-JSON response")
            }

            if (!response.ok) {
                throw new Error(data?.error || `Server error: ${response.status}`)
            }

            if (!data || !data.reference_id) {
                throw new Error("Invalid response data from server")
            }

            setReferenceId(data.reference_id)
            setIsSubmitted(true)
        } catch (error) {
            console.error("Error submitting contact form:", error)
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setError("Unable to connect to server. Please check your internet connection.")
            } else if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email)
            setCopiedEmail(email)
            setTimeout(() => setCopiedEmail(""), 2000)
        } catch (err) {
            console.error("Failed to copy email:", err)
        }
    }

    const isFormValid =
        formData.name &&
        formData.email &&
        formData.subject &&
        formData.message &&
        formData.inquiry_type

    const resetForm = () => {
        setIsSubmitted(false)
        setReferenceId("")
        setError("")
        setFormData({
            name: "",
            email: "",
            company: "",
            subject: "",
            message: "",
            inquiry_type: "",
        })
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <NavigationBar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold">
                            Message Sent Successfully!
                        </h1>
                        <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">
                                Thank you for contacting us. We'll get back to you within 24
                                hours.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Reference ID:{" "}
                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                    {referenceId}
                                </code>
                            </p>
                        </div>
                        <Alert>
                            <Mail className="h-4 w-4" />
                            <AlertDescription>
                                You should receive a confirmation email at{" "}
                                <strong>{formData.email}</strong> shortly.
                            </AlertDescription>
                        </Alert>
                        <Button onClick={resetForm}>Send Another Message</Button>
                    </div>
                </div>
                <FooterSection />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <NavigationBar />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <Badge variant="outline" className="px-4 py-2">
                        💬 Get in Touch
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Contact <span className="text-primary">Our Team</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Have questions about FingerTrace? We're here to help. Reach out to
                        our team and we'll get back to you as soon as possible.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you within 24
                                    hours.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    handleInputChange("name", e.target.value)
                                                }
                                                placeholder="Your full name"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleInputChange("email", e.target.value)
                                                }
                                                placeholder="your@email.com"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Company</Label>
                                            <Input
                                                id="company"
                                                value={formData.company}
                                                onChange={(e) =>
                                                    handleInputChange("company", e.target.value)
                                                }
                                                placeholder="Your company name"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="inquiryType">Inquiry Type *</Label>
                                            <Select
                                                value={formData.inquiry_type}
                                                onValueChange={(value) =>
                                                    handleInputChange("inquiry_type", value)
                                                }
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select inquiry type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">
                                                        General Question
                                                    </SelectItem>
                                                    <SelectItem value="technical">
                                                        Technical Support
                                                    </SelectItem>
                                                    <SelectItem value="enterprise">
                                                        Enterprise Solutions
                                                    </SelectItem>
                                                    <SelectItem value="partnership">
                                                        Partnership
                                                    </SelectItem>
                                                    <SelectItem value="security">
                                                        Security Issue
                                                    </SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                handleInputChange("subject", e.target.value)
                                            }
                                            placeholder="Brief description of your inquiry"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) =>
                                                handleInputChange("message", e.target.value)
                                            }
                                            placeholder="Please provide details about your inquiry..."
                                            rows={6}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={!isFormValid || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Contact Methods */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Use the form on the left or copy these email addresses.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactMethods.map((method, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                                            {method.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm">
                                                {method.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {method.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                                    {method.contact}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleCopyEmail(method.contact)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                                {copiedEmail === method.contact && (
                                                    <span className="text-xs text-green-600">
                                                        Copied!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Response Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Response Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">General Inquiries</span>
                                    <span className="text-sm font-medium">24 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Technical Support</span>
                                    <span className="text-sm font-medium">12 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Security Issues</span>
                                    <span className="text-sm font-medium text-red-600">2 hours</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Office Hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Office Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-medium">10:00 AM - 2:00 PM EST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-medium text-muted-foreground">
                                            Closed
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <FooterSection />
        </div>
    )
}