import React from 'react';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';
import { TextField, Button, Box, Typography } from '@mui/material';

const db = getFirestore();

const ReceiptConfirm = ({ user, fetchReceipts, receiptDetails, setReceiptDetails, setShowPopup }) => {

  const handleConfirm = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const receiptsCollectionRef = collection(userRef, 'receipts'); // Subcollection under the user
      // Save the confirmed receipt details to Firestore
      await addDoc(receiptsCollectionRef, {
        vendor: receiptDetails.vendor,
        total: receiptDetails.total,
        category: receiptDetails.category,
        date: receiptDetails.date,
        timestamp: new Date() // Add a timestamp for each receipt
      });

      console.log('Receipt saved successfully');
      setShowPopup(false); // Close the pop-up after saving
      fetchReceipts();

    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const handleChange = (e) => {
    setReceiptDetails({ ...receiptDetails, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShowPopup(false); // Close the pop-up without saving
    console.log('Receipt addition cancelled');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <Typography variant="h4" gutterBottom>Confirm Receipt Details</Typography>
        <form>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Vendor"
              variant="outlined"
              name="vendor"
              value={receiptDetails.vendor}
              onChange={handleChange}
              fullWidth
              required
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

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default ReceiptConfirm;