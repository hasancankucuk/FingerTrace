const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ContactFormData {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  inquiry_type: string
}

export interface ContactResponse {
  success: boolean
  message: string
  reference_id: string
}

export const contactService = {
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || '',
          subject: data.subject,
          message: data.message,
          inquiry_type: data.inquiry_type
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send message')
      }

      return responseData
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  },

  async testEmailConfig(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/test`)
      return await response.json()
    } catch (error) {
      console.error('Error testing email config:', error)
      throw error
    }
  },

  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`)
      return await response.json()
    } catch (error) {
      console.error('Error checking health:', error)
      throw error
    }
  }
}