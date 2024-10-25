import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, doc, getDocs } from 'firebase/firestore';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Select, MenuItem } from '@mui/material';

const db = getFirestore();

const ReceiptConfirm = ({ user, fetchReceipts, receiptDetails, setReceiptDetails, setShowReceiptConfirm }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false); // Track when categories are loaded

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const categoriesCollectionRef = collection(userRef, 'categories');
        const categorySnapshot = await getDocs(categoriesCollectionRef);
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryList);
        setCategoriesLoaded(true); // Indicate categories have loaded
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [user.uid]);

  const handleConfirm = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const receiptsCollectionRef = collection(userRef, 'receipts'); 
      await addDoc(receiptsCollectionRef, {
        vendor: receiptDetails.vendor,
        total: receiptDetails.total,
        category: receiptDetails.category,
        date: receiptDetails.date,
        timestamp: new Date()
      });

      console.log('Receipt saved successfully');
      setShowReceiptConfirm(false); 
      fetchReceipts();

    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const handleChange = (e) => {
    setReceiptDetails({ ...receiptDetails, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShowReceiptConfirm(false); 
    console.log('Receipt addition cancelled');
  };

  return (
    <Dialog open={true} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Receipt Details</DialogTitle>
      <DialogContent sx={{ paddingTop: '16px' }}> 
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Vendor"
            variant="outlined"
            name="vendor"
            value={receiptDetails.vendor}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: '16px' }} 
          />

          <TextField
            label="Total"
            variant="outlined"
            type="number"
            name="total"
            value={receiptDetails.total}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Category Dropdown */}
          {categoriesLoaded && (
            <Select
              label="Category"
              name="category"
              value={categories.some(cat => cat.name === receiptDetails.category) ? receiptDetails.category : ''}
              onChange={handleChange}
              fullWidth
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          )}

          <TextField
            label="Date"
            variant="outlined"
            type="date"
            name="date"
            value={receiptDetails.date || new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
        <Button
          variant="outlined" 
          color="secondary"
          onClick={handleCancel}
          sx={{ color: '#9c27b0' }} 
        >
          Cancel
        </Button>
        <Button
          variant="outlined" 
          color="primary"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptConfirm;
