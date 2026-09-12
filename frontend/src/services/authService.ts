import axios from 'axios';
import { AuthResponse } from '../types/auth';

const API_BASE_URL = '/api/auth';

class AuthService {
  async verifyToken(idToken: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify`, {
        idToken,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }
}

export const authService = new AuthService();
