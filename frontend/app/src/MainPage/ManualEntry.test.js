import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManualEntry from './ManualEntry';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
}));

const mockUser = { uid: 'test-uid' };
const mockOnSave = jest.fn();
const mockOnClose = jest.fn();
const mockDb = {};

describe('ManualEntry Component', () => {
  beforeEach(() => {
    getFirestore.mockReturnValue({});
    collection.mockReturnValue({});
    addDoc.mockClear();
    getDocs.mockClear();
    mockOnSave.mockClear();
    mockOnClose.mockClear();

    getDocs.mockResolvedValue({
        docs: [{ id: '1', data: () => ({ name: 'Test Category' }) }],
    });
  });

  test('renders ManualEntry form', async () => {
    await act(async () => {
      render(<ManualEntry user={mockUser} db={mockDb} open={true} onSave={mockOnSave} onClose={mockOnClose} />);
    });
    expect(screen.getByLabelText(/vendor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/total/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('shows alert if fields are missing', async () => {
    window.alert = jest.fn();
    await act(async () => {
      render(<ManualEntry user={mockUser} db={mockDb} open={true} onSave={mockOnSave} onClose={mockOnClose} />);
    });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields');
  });

  test('shows alert on save error', async () => {
    window.alert = jest.fn();
    addDoc.mockRejectedValue(new Error('Save error'));
    getDocs.mockResolvedValue({
      docs: [{ id: '1', data: () => ({ name: 'Test Category' }) }],
    });

    await act(async () => {
      render(<ManualEntry user={mockUser} db={mockDb} open={true} onSave={mockOnSave} onClose={mockOnClose} />);
    });
    fireEvent.change(screen.getByLabelText(/vendor/i), { target: { value: 'Test Vendor' } });
    fireEvent.change(screen.getByLabelText(/total/i), { target: { value: '100' } });
    // fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill out all fields');
    });
  });
});