import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActions, Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { getFirestore, doc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import '../MainPage.css';

const db = getFirestore();

const ReceiptCard = ({ vendor, total, category, date, user, id, fetchReceipts }) => {
  // State to track if the card is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State to track the edited values
  const [editVendor, setEditVendor] = useState(vendor);
  const [editTotal, setEditTotal] = useState(total);
  const [editDate, setEditDate] = useState(date);
  const [editCategory, setEditCategory] = useState(category);

  const [categories, setCategories] = useState([]); // State to hold fetched categories

  // Fetch categories when entering edit mode
  useEffect(() => {
    if (isEditing) {
      const fetchCategories = async () => {
        const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
        const querySnapshot = await getDocs(categoriesCollectionRef);
        const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name); // Extract the category names
        setCategories(fetchedCategories);
      };

      fetchCategories();
    }
  }, [isEditing, user.uid]);

  // Handle save logic
  const handleSave = async () => {
    const updatedReceipt = {
      vendor: editVendor,
      total: editTotal,
      date: editDate,
      category: editCategory,
    };

    try {
      const receiptDocRef = doc(db, 'users', user.uid, 'receipts', id);
      await updateDoc(receiptDocRef, updatedReceipt);
      setIsEditing(false); // Exit edit mode after saving
      fetchReceipts();
    } catch (error) {
      console.error('Error updating receipt:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
      fetchReceipts();
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  return (
    <Card
      sx={{
        width: { xs: '75%', sm: '75%', md: '85%', lg: '110%' }, // Responsive width for different screens
        marginBottom: '24px',
        padding: { xs: '10px', sm: '20px', md: '25px', lg: '30px' }, // Responsive padding
        margin: '16px auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
    >
      <CardHeader title={isEditing ? 'Edit Receipt' : vendor} subheader={isEditing ? '' : date} />
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Vendor"
              fullWidth
              margin="dense"
              value={editVendor}
              onChange={(e) => setEditVendor(e.target.value)}
              required
            />
            <TextField
              label="Total"
              type="number"
              fullWidth
              margin="dense"
              value={editTotal}
              onChange={(e) => setEditTotal(e.target.value)}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              fullWidth
              margin="dense"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <Typography variant="body2"><strong>Total:</strong> ${total}</Typography>
            <Typography variant="body2"><strong>Category:</strong> {category}</Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <Button size="small" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button size="small" color="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="small" color="primary" onClick={() => setIsEditing(true)}>
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

export default ReceiptCard;
