import React from 'react';

const ReceiptConfirmation = ({ receiptDetails, onConfirm, onCancel, onChange }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Confirm Receipt Details</h2>
        <form>
          <label>Vendor</label>
          <input type="text" name="vendor" value={receiptDetails.vendor} onChange={onChange} />

          <label>Total</label>
          <input type="text" name="total" value={receiptDetails.total} onChange={onChange} />

          <label>Category</label>
          <input type="text" name="category" value={receiptDetails.category} onChange={onChange} />

          <label>Date</label>
          <input type="text" name="date" value={receiptDetails.date} onChange={onChange} />
          
          <button type="button" onClick={onConfirm}>Confirm</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ReceiptConfirmation;