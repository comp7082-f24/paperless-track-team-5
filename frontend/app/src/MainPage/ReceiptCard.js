import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import { getFirestore, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
        marginBottom: '24px', // Add margin between cards
        padding: { xs: '10px', sm: '20px', md: '25px', lg: '30px' }, // Responsive padding
        margin: '16px auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': { // Adding a hover effect for better interaction
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
            <TextField
              label="Category"
              fullWidth
              margin="dense"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              required
            />
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
            <Typography variant="body2">Total: ${total}</Typography>
            <Typography variant="body2">Category: {category}</Typography>
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
