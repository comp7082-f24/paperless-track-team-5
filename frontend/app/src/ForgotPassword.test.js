import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it('renders the ForgotPassword component', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  it('handles successful password reset', async () => {
    sendPasswordResetEmail.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Check your email for password reset instructions.')).toBeInTheDocument();
    });

    jest.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('handles password reset error', async () => {
    const errorMessage = 'Failed to send reset email';
    sendPasswordResetEmail.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});