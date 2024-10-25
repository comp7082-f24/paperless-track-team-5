import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActions, Button, TextField, Box } from '@mui/material';
import { getFirestore, doc, deleteDoc, updateDoc, collection, query, getDocs } from 'firebase/firestore';

const db = getFirestore();

const CategoryCard = ({ name, monthlyBudget, color, user, id, fetchCategories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editMonthlyBudget, setEditMonthlyBudget] = useState(monthlyBudget || '');
  const [editColor, setEditColor] = useState(color);


  const handleSave = async () => {
    if (editName.trim() === '') {
      alert('Category name is required');
      return;
    }

    try {
      const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
      const normalizedEditName = editName.trim().toLowerCase();
      
      const querySnapshot = await getDocs(categoriesCollectionRef);
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name.toLowerCase(),
      }));

      const duplicateCategory = categories.find(category => category.name === normalizedEditName && category.id !== id);
      if (duplicateCategory) {
        alert('Category with this name already exists');
        return;
      }

      const updatedCategory = {
        name: editName.trim(),
        monthlyBudget: editMonthlyBudget || null,  // Optional field
        color: editColor,
      };

      const categoryDocRef = doc(db, 'users', user.uid, 'categories', id);
      await updateDoc(categoryDocRef, updatedCategory);

      setIsEditing(false);  // Exit edit mode after saving
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error saving category');
    }
  };


  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };


  const handleCancel = () => {
    setEditName(name);
    setEditMonthlyBudget(monthlyBudget || '');
    setEditColor(color);
    setIsEditing(false);  // Exit edit mode
  };


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
            <Typography variant="body2">
              <strong>Monthly Budget:</strong> {monthlyBudget && !isNaN(monthlyBudget) ? `$${monthlyBudget}` : 'Not Set'}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 'bold', marginRight: '8px' }}>Color:</Typography>
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
            <Button size="small" color="primary" onClick={handleSave} variant="outlined">
              Save
            </Button>
            <Button size="small" color="secondary" onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="small" color="primary" onClick={handleEdit} variant="outlined">
              Edit
            </Button>
            <Button size="small" color="secondary" onClick={handleDelete} variant="outlined">
              Delete
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default CategoryCard;