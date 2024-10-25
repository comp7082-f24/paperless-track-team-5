// ManualEntry.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const db = getFirestore();

const ManualEntry = ({ user, open, onClose, onSave }) => {
    const [vendor, setVendor] = useState('');
    const [total, setTotal] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
            const querySnapshot = await getDocs(categoriesCollectionRef);
            setCategories(querySnapshot.docs.map(doc => doc.data().name));
        };
        fetchCategories();
    }, [user.uid]);

    const saveReceipt = async () => {
        if (!vendor || !total || !category || !date) {
            alert('Please fill out all fields');
            return;
        }
        try {
            const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');
            await addDoc(receiptsCollectionRef, { vendor, total, category, date, timestamp: new Date() });
            setVendor('');
            setTotal('');
            setCategory('');
            setDate('');
            onSave(); // Notify parent of save
            onClose(); // Close dialog
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert('Error saving receipt');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Enter Receipt Details</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <TextField label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} required fullWidth />
                    <TextField label="Total" type="number" value={total} onChange={(e) => setTotal(e.target.value)} required fullWidth />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} input={<OutlinedInput label="Category" />} required>
                            {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} required fullWidth />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
                <Button onClick={saveReceipt} color="primary" variant="outlined">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManualEntry;

