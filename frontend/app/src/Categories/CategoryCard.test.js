import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryCard from './CategoryCard';
import { getFirestore, doc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

const mockUser = { uid: 'test-uid' };
const mockFetchCategories = jest.fn();

describe('CategoryCard Component', () => {
  beforeEach(() => {
    getFirestore.mockReturnValue({});
    collection.mockReturnValue({});
    getDocs.mockResolvedValue({
      docs: [],
    });
    doc.mockReturnValue({}); // Mock doc to return a valid reference
  });

  test('allows editing of category details', () => {
    render(<CategoryCard name="Test Category" monthlyBudget="100" color="#FF0000" user={mockUser} id="1" fetchCategories={mockFetchCategories} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Category' } });
    fireEvent.change(screen.getByLabelText(/monthly budget/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/color/i), { target: { value: '#00FF00' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Updated Category');
    expect(screen.getByLabelText(/monthly budget/i)).toHaveValue(200);
    expect(screen.getByLabelText(/color/i)).toHaveValue('#00ff00');
  });

  test('saves updated category details', async () => {
    render(<CategoryCard name="Test Category" monthlyBudget="100" color="#FF0000" user={mockUser} id="1" fetchCategories={mockFetchCategories} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Category' } });
    fireEvent.change(screen.getByLabelText(/monthly budget/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/color/i), { target: { value: '#00FF00' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
        name: 'Updated Category',
        monthlyBudget: '200',
        color: '#00ff00',
      });
    });
  });

  test('deletes category on delete button click', async () => {
    render(<CategoryCard name="Test Category" monthlyBudget="100" color="#FF0000" user={mockUser} id="1" fetchCategories={mockFetchCategories} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    });
  });
});