export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'booking' | 'volunteer' | 'partnership';
  preferredContact: 'email' | 'phone';
  newsletter: boolean;
}

export interface ContactSubmission extends ContactForm {
  id: string;
  submittedAt: string;
  status: 'pending' | 'responded' | 'resolved';
}