import React from 'react';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';

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
        <h2>Confirm Receipt Details</h2>
        <form>
          <label>Vendor</label>
          <input type="text" name="vendor" value={receiptDetails.vendor} onChange={handleChange} />

          <label>Total</label>
          <input type="text" name="total" value={receiptDetails.total} onChange={handleChange} />

          <label>Category</label>
          <input type="text" name="category" value={receiptDetails.category} onChange={handleChange} />

          <label>Date</label>
          <input type="text" name="date" value={receiptDetails.date} onChange={handleChange} />
          
          <button type="button" onClick={handleConfirm}>Confirm</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ReceiptConfirm;