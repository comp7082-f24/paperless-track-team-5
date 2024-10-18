import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput } from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const db = getFirestore(); // Initialize Firestore

const ManualEntry = ({ user }) => {
    const [vendor, setVendor] = useState('');
    const [total, setTotal] = useState('');
    const [category, setCategory] = useState(''); // Updated to a string for single selection
    const [date, setDate] = useState(''); // Add state for date
    const navigate = useNavigate();

    const categories = [
        'Groceries',
        'Eating out',
        // Add more categories as needed
    ];

    // Handle category selection
    const changeCategory = (event) => {
        setCategory(event.target.value); // Set category as a string
    };

    // Function to save the manually entered receipt data to Firestore
    const saveReceipt = async () => {
        if (!vendor || !total || !category || !date) {
            alert('Please fill out all fields');
            return;
        }

        try {
            // Reference the user's subcollection for receipts
            const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');

            // Save the receipt data
            await addDoc(receiptsCollectionRef, {
                vendor,
                total,
                category, // Category is now a single string
                date,     // Add date field to Firestore
                timestamp: new Date(), // You can add more attributes as needed
            });

            alert('Receipt saved successfully');
            // Reset the form fields after saving
            setVendor('');
            setTotal('');
            setCategory('');
            setDate(''); // Reset date field

            navigate("/dashboard");
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert('Error saving receipt');
        }
    };

    const handleCancel = () => {
        navigate("/dashboard"); // Navigate back to dashboard when cancel is clicked
    };

    return (
        <div>
            <h2>Enter Receipt Details</h2>

            <FormControl fullWidth margin="normal">
                <TextField
                    label="Vendor"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Total"
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={category} // Single string value for category
                        onChange={changeCategory}
                        input={<OutlinedInput label="Category" />}
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
                    variant="outlined"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                    margin="normal"
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={saveReceipt}
                    fullWidth
                    style={{ marginTop: '16px' }}
                >
                    Save
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    fullWidth
                    style={{ marginTop: '8px' }}
                >
                    Cancel
                </Button>
            </FormControl>
        </div>
    );
};

export default ManualEntry;
