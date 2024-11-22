import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CategoryAdd from './CategoryAdd';
import CategoryCard from './CategoryCard';
import '../Categories.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

const Categories = ({ user }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
        const querySnapshot = await getDocs(categoriesCollectionRef);
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Include the document ID
          ...doc.data() // Spread the rest of the document data (name, monthlyBudget, color, etc.)
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
      const querySnapshot = await getDocs(categoriesCollectionRef);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };

  return (
    <div>
      {/* <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
        Categories
      </Typography> */}
      
      {/* Scrollable container for categories */}
      <div className="categories-container">
        {categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                monthlyBudget={category.monthlyBudget || 'Not Set'}
                color={category.color || '#FFFFFF'}
                user={user}
                fetchCategories={fetchCategories}
              />
            ))}
          </div>
        ) : (
          <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', marginTop: '20px' }}>
            No categories created yet.
          </Typography>
        )}
         <CategoryAdd
        user={user}
        fetchCategories={fetchCategories}
        />

      </div>
    </div>
  );
};

export default Categories;
