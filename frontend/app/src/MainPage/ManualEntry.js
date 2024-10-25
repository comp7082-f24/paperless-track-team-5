import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Typography } from '@mui/material';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const db = getFirestore(); // Initialize Firestore

const ManualEntry = ({ user }) => {
    const [vendor, setVendor] = useState('');
    const [total, setTotal] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
            const querySnapshot = await getDocs(categoriesCollectionRef);
            const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name);
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, [user.uid]);

    const changeCategory = (event) => {
        setCategory(event.target.value);
    };

    const saveReceipt = async () => {
        if (!vendor || !total || !category || !date) {
            alert('Please fill out all fields');
            return;
        }

        try {
            const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');
            await addDoc(receiptsCollectionRef, {
                vendor,
                total,
                category,
                date,
                timestamp: new Date(),
            });

            alert('Receipt saved successfully');
            setVendor('');
            setTotal('');
            setCategory('');
            setDate('');

            navigate("/dashboard");
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert('Error saving receipt');
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Enter Receipt Details</Typography>
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
                        value={category}
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
