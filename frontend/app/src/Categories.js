import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Box,
} from '@mui/material';

import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

const Categories = ({ user, onSignOut }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
  const fetchCategories = async () => {
      try {
          const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
          const querySnapshot = await getDocs(categoriesCollectionRef);
          const categoriesData = [];
          querySnapshot.forEach((doc) => {
              categoriesData.push(doc.data().name);
          });
          setCategories(categoriesData);
      } catch (error) {
          console.error('Error fetching receipts: ', error);
      }
    };

    fetchCategories();
  }, [user]);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        // Reference the user's subcollection for categories
        const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');

        // Save the categories data
        await addDoc(categoriesCollectionRef, {
            "name": newCategory,
            "createdAt": new Date()
        });

        alert('Category saved successfully');
        // Reset the form fields after saving
        setCategories([...categories, newCategory]);
        setNewCategory('');
    } catch (error) {
        console.error('Error saving receipt:', error);
        alert('Error saving receipt');
    }
    }
  };

  return (
    <Container maxWidth="sm" style={{ paddingTop: 0, paddingBottom: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>

      {/* Category Listing */}
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px', maxHeight: '300px', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Category List
        </Typography>
        <List>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={category} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No categories added yet." />
            </ListItem>
          )}
        </List>
      </Paper>

      <Divider />

      {/* Add Category Section */}
      <Paper style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h6" gutterBottom>
          Add New Category
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            label="Category Name"
            variant="outlined"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            style={{ marginRight: '16px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
          >
            Add
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Categories;