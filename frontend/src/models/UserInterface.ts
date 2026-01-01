export interface User {
  name: string;
  email: string;
  phone: string;
  subscription_status?: 'trialing' | 'active' | 'cancelled' | 'past_due';
  trial_start_date?: string;
}