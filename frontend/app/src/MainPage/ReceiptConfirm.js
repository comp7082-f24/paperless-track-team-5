import React from 'react';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';

const db = getFirestore();

const ReceiptConfirm = ({ user, fetchReceipts, receiptDetails, setReceiptDetails, setShowPopup }) => {

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
      setShowPopup(false); 
      fetchReceipts();

    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const handleChange = (e) => {
    setReceiptDetails({ ...receiptDetails, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShowPopup(false); 
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

          <TextField
            label="Category"
            variant="outlined"
            name="category"
            value={receiptDetails.category}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Date"
            variant="outlined"
            name="date"
            value={receiptDetails.date}
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
