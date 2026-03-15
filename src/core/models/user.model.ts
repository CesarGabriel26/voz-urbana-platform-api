export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birthDate?: Date;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  notificationSettings?: {
    soundEnabled: boolean;
    subjects: {
      petitionAccepted: boolean;
      petitionVoted: boolean;
      petitionStatusChanged: boolean;
      complaintVoted: boolean;
      complaintAccepted: boolean;
      complaintStatusChanged: boolean;
    };
  };
  push_subscriptions?: any[];
  refreshToken?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  cpf: string;
  password?: string;
}

export interface SignupRequest {
  name: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone?: string;
  password?: string;
}
