import api from './api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  interests?: string[];
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export const authService = {
  signup: async (data: SignupData) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpData) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  verifyLoginOtp: async (data: VerifyOtpData) => {
    const response = await api.post('/auth/verify-login-otp', data);
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};

export const profileService = {
  createProfile: async (data: any) => {
    const response = await api.post('/profile', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateInterests: async (interests: string[]) => {
    const response = await api.patch('/profile/interests', { interests });
    return response.data;
  },
};

export const gameService = {
  getCurrentLevel: async () => {
    const response = await api.get('/game/current-level');
    return response.data;
  },

  answerQuestion: async (question: string, answer: string) => {
    const response = await api.post('/game/answer', { question, answer });
    return response.data;
  },

  completeLevel: async () => {
    const response = await api.post('/game/complete-level');
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/game/progress');
    return response.data;
  },
};

export const miniGameService = {
  playRPS: async (item: { bet: number; choice: 'rock' | 'paper' | 'scissors' }) => {
    const response = await api.post('/mini-game/rps/play', item);
    return response.data;
  },

  getSessionStatus: async () => {
    const response = await api.get('/mini-game/rps/session');
    return response.data;
  },

  surrenderRPS: async () => {
    const response = await api.post('/mini-game/rps/surrender');
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getLeaderboard: async (limit = 10) => {
    const response = await api.get(`/dashboard/leaderboard?limit=${limit}`);
    return response.data;
  },

  getAchievements: async () => {
    const response = await api.get('/dashboard/achievements');
    return response.data;
  },
};

export const socialService = {
  sendRequest: async (email: string) => {
    const response = await api.post('/social/request', { email });
    return response.data;
  },

  handleRequest: async (id: string, status: 'accepted' | 'rejected') => {
    const response = await api.post(`/social/handle/${id}`, { status });
    return response.data;
  },

  getFriends: async () => {
    const response = await api.get('/social/friends');
    return response.data;
  },

  getPending: async () => {
    const response = await api.get('/social/pending');
    return response.data;
  },

  searchUsers: async (query: string, offset: number = 0) => {
    const response = await api.get(`/social/search?q=${query}&offset=${offset}`);
    return response.data;
  },
};

export const chatService = {
  getHistory: async (friendId: string) => {
    const response = await api.get(`/chat/history/${friendId}`);
    return response.data;
  },
};

export * from './gameSocket';
