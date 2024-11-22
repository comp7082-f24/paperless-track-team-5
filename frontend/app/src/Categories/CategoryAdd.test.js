import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryAdd from './CategoryAdd';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
}));

const mockUser = { uid: 'test-uid' };
const mockFetchCategories = jest.fn();

describe('CategoryAdd Component', () => {
  beforeEach(() => {
    getFirestore.mockReturnValue({});
    collection.mockReturnValue({});
    addDoc.mockResolvedValue({});
    getDocs.mockResolvedValue({
      docs: [],
    });
  });

  test('renders add category button', () => {
    render(<CategoryAdd user={mockUser} fetchCategories={mockFetchCategories} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  test('opens dialog on add button click', () => {
    render(<CategoryAdd user={mockUser} fetchCategories={mockFetchCategories} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('allows input of category details', () => {
    render(<CategoryAdd user={mockUser} fetchCategories={mockFetchCategories} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/monthly budget/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/color/i), { target: { value: '#FF0000' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Category');
    expect(screen.getByLabelText(/monthly budget/i)).toHaveValue(100);
    expect(screen.getByLabelText(/color/i)).toHaveValue('#ff0000');
  });

  test('saves category on save button click', async () => {
    render(<CategoryAdd user={mockUser} fetchCategories={mockFetchCategories} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/monthly budget/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/color/i), { target: { value: '#FF0000' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        name: 'Test Category',
        monthlyBudget: '100',
        color: '#ff0000'
      }));
    });
  });
});