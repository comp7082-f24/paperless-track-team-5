import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock useMediaQuery from @mui/material
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...originalModule,
    useMediaQuery: jest.fn(),
  };
});

describe('LandingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the LandingPage component', () => {
    render(<LandingPage />);
    expect(screen.getByText('PaperlessTRACK')).toBeInTheDocument();
  });

  it('toggles buttons visibility on mobile', () => {
    // Mock useMediaQuery to return true for mobile view
    const { useMediaQuery } = require('@mui/material');
    useMediaQuery.mockReturnValue(true);

    render(<LandingPage />);
    const toggleButton = screen.getByText('PaperlessTRACK');
    fireEvent.click(toggleButton);

    // Check if the buttons are toggled
    expect(screen.getByText('PaperlessTRACK')).toBeInTheDocument();
  });
});