import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Categories from './Categories';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '@testing-library/jest-dom'; // Import jest-dom matchers

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock child components
jest.mock('./CategoryAdd', () => () => <div>CategoryAdd</div>);
jest.mock('./CategoryCard', () => ({ id, name, monthlyBudget, color }) => (
  <div data-testid="category-card">
    <div>{name}</div>
    <div>{monthlyBudget}</div>
    <div>{color}</div>
  </div>
));

describe('Categories', () => {
  const user = { uid: '123' };

  beforeEach(() => {
    getFirestore.mockReturnValue({});
    collection.mockReturnValue({});
  });

  test('renders "No categories created yet." when there are no categories', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(<Categories user={user} />);

    await waitFor(() => {
      expect(screen.getByText('No categories created yet.')).toBeInTheDocument();
    });
  });

  test('renders categories when they are fetched', async () => {
    const mockCategories = [
      { id: '1', data: () => ({ name: 'Category 1', monthlyBudget: '100', color: '#FF0000' }) },
      { id: '2', data: () => ({ name: 'Category 2', monthlyBudget: '200', color: '#00FF00' }) },
    ];
    getDocs.mockResolvedValueOnce({ docs: mockCategories });

    render(<Categories user={user} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('category-card')).toHaveLength(2);
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  test('renders CategoryAdd component', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(<Categories user={user} />);

    await waitFor(() => {
      expect(screen.getByText('CategoryAdd')).toBeInTheDocument();
    });
  });

  test('handles error when fetching categories', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getDocs.mockRejectedValueOnce(new Error('Error fetching categories'));

    render(<Categories user={user} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching categories: ', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});