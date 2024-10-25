import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActions, Button, TextField, Box } from '@mui/material';
import { getFirestore, doc, deleteDoc, updateDoc, collection, query, getDocs } from 'firebase/firestore';

const db = getFirestore();

const CategoryCard = ({ name, monthlyBudget, color, user, id, fetchCategories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editMonthlyBudget, setEditMonthlyBudget] = useState(monthlyBudget || '');
  const [editColor, setEditColor] = useState(color);

  // Handle save logic with duplicate name check
  const handleSave = async () => {
    if (editName.trim() === '') {
      alert('Category name is required');
      return;
    }

    try {
      // Check if there is another category with the same name (case-insensitive)
      const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
      const normalizedEditName = editName.trim().toLowerCase();
      
      const querySnapshot = await getDocs(categoriesCollectionRef);
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name.toLowerCase(),
      }));

      // If there is another category with the same normalized name and different id, prevent saving
      const duplicateCategory = categories.find(category => category.name === normalizedEditName && category.id !== id);
      if (duplicateCategory) {
        alert('Category with this name already exists');
        return;
      }

      // Proceed with updating the category if no duplicate is found
      const updatedCategory = {
        name: editName.trim(),
        monthlyBudget: editMonthlyBudget || null,  // Optional field
        color: editColor,
      };

      // Update the Firestore document in the subcollection of the user
      const categoryDocRef = doc(db, 'users', user.uid, 'categories', id);
      await updateDoc(categoryDocRef, updatedCategory);

      setIsEditing(false);  // Exit edit mode after saving
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error saving category');
    }
  };

  // Handle delete logic
  const handleDelete = async () => {
    try {
      // Reference the specific category in the user's subcollection
      await deleteDoc(doc(db, 'users', user.uid, 'categories', id));

      // Refresh the categories after deletion
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Reset form values when canceling edit
  const handleCancel = () => {
    setEditName(name);
    setEditMonthlyBudget(monthlyBudget || '');
    setEditColor(color);
    setIsEditing(false);  // Exit edit mode
  };

  // Set editing values back to the default when entering edit mode
  const handleEdit = () => {
    setEditName(name);
    setEditMonthlyBudget(monthlyBudget || '');
    setEditColor(color);
    setIsEditing(true);
  };

  return (
    <Card
      sx={{
        width: '100%',
        marginBottom: '16px',
        padding: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': { // Adding a hover effect for better interaction
        transform: 'scale(1.02)',
        }
      }}
    >
      <CardHeader title={isEditing ? 'Edit Category' : name} />
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Category Name"
              fullWidth
              margin="dense"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <TextField
              label="Monthly Budget (Optional)"
              type="number"
              fullWidth
              margin="dense"
              value={editMonthlyBudget}
              onChange={(e) => setEditMonthlyBudget(e.target.value)}
            />
            <TextField
              label="Color"
              fullWidth
              margin="dense"
              type="color"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
            />
          </>
        ) : (
          <>
            {/* Only show the dollar sign if monthlyBudget is set */}
            <Typography variant="body2">
              Monthly Budget: {monthlyBudget && !isNaN(monthlyBudget) ? `$${monthlyBudget}` : 'Not Set'}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" style={{ marginRight: '8px' }}>Color:</Typography>
              {/* Show a tiny square or rectangle with the category's color */}
              <Box
                sx={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color,
                  border: '1px solid #ccc',
                }}
              />
            </Box>
          </>
        )}
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <Button size="small" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button size="small" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="small" color="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button size="small" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default CategoryCard;
