export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
  status: 'active' | 'pending_verification' | 'suspended';
}
