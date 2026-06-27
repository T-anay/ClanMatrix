import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import * as authService from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const renderLogin = () =>
  render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthProvider>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    renderLogin();
    expect(screen.getByText('ClanMatrix')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('kullaniciadi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument();
  });

  it('shows error on invalid credentials', async () => {
    authService.authService.login.mockRejectedValueOnce({
      response: { data: 'Kullanıcı adı veya şifre hatalı.' },
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('kullaniciadi'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }));

    await waitFor(() => {
      expect(screen.getByText(/şifre hatalı/i)).toBeInTheDocument();
    });
  });

  it('form fields are accessible by id', () => {
    renderLogin();
    expect(document.getElementById('login-username')).toBeTruthy();
    expect(document.getElementById('login-password')).toBeTruthy();
    expect(document.getElementById('login-submit')).toBeTruthy();
  });
});
