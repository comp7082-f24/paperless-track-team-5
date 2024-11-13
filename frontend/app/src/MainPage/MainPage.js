import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import '../MainPage.css';
import ReceiptAdder from './ReceiptAdder';
import ReceiptCard from './ReceiptCard';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import SearchBar from './SearchBar';

const db = getFirestore();

const Dashboard = ({ user }) => {
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUsername(userDoc.data().username || 'User');
                }
            }
            setLoading(false);
        };

        fetchReceipts();
        fetchCategories();
        fetchUserData();
    }, [user]);

    const fetchReceipts = async () => {
        try {
            const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');
            const querySnapshot = await getDocs(receiptsCollectionRef);
            const receiptData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            
            receiptData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setReceipts(receiptData);
            setFilteredReceipts(receiptData);
        } catch (error) {
            console.error('Error fetching receipts: ', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
            const querySnapshot = await getDocs(categoriesCollectionRef);
            const categoriesData = Array.from(
                new Set(querySnapshot.docs.map(doc => doc.data().name.trim().toLowerCase()))
            );
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories: ', error);
        }
    };

    const handleSearch = (query) => {
        if (!query) {
            setFilteredReceipts(receipts);
        } else {
            const searchResults = receipts.filter(receipt =>
                (receipt.vendor && receipt.vendor.toLowerCase().includes(query.toLowerCase())) ||
                (receipt.category && receipt.category.toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredReceipts(searchResults);
        }
    };

    const handleFilterApply = (filters) => {
        const { category, status, sortOrder, startDate, endDate } = filters;
    
        let filteredData = [...receipts];
        
        if (category.length > 0) {
            filteredData = filteredData.filter(receipt => 
                category.includes(receipt.category?.toLowerCase())
            );
        }

        if (status) {
            filteredData = filteredData.filter(receipt => receipt.status === status);
        }

        if (startDate) {
            filteredData = filteredData.filter(receipt => 
                dayjs(receipt.date).isAfter(dayjs(startDate).subtract(1, 'day'), 'day')
            );
        }
        if (endDate) {
            filteredData = filteredData.filter(receipt => 
                dayjs(receipt.date).isBefore(dayjs(endDate).add(1, 'day'), 'day')
            );
        }

        filteredData.sort((a, b) => {
            return sortOrder === 'ascending' 
                ? new Date(a.date) - new Date(b.date) 
                : new Date(b.date) - new Date(a.date);
        });

        setFilteredReceipts(filteredData);
    };

    return (
        <Box 
            className="dashboard"
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ width: '100%', margin: '0 auto', padding: '20px' }}
        >
            {/* Fixed SearchBar Container aligned to the right */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    position: 'fixed',
                    top: 60,
                    right: 0,
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end', // Aligns the SearchBar to the right
                    backgroundColor: 'white',
                    zIndex: 1000,
                }}
            >
                <SearchBar 
                    onSearch={handleSearch} 
                    onFilterApply={handleFilterApply} 
                    categories={categories} 
                />
            </Box>

            {/* Main content offset to account for fixed SearchBar */}
            <Box
                className="receipt-list"
                sx={{
                    width: '100%',
                    maxWidth: '1400px', // Increased max width for wider cards
                    marginTop: '100px', // Offset to avoid overlap with fixed SearchBar
                    padding: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                {filteredReceipts.length > 0 ? (
                    filteredReceipts.map(receipt => (
                        <ReceiptCard
                            key={receipt.id}
                            vendor={receipt.vendor}
                            total={receipt.total}
                            date={receipt.date}
                            category={receipt.category}
                            user={user}
                            id={receipt.id}
                            fetchReceipts={fetchReceipts}
                            sx={{
                                width: '100%', // Take full width of the container
                                maxWidth: '500px', // Wider card max width
                            }}
                        />
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', marginTop: '20px' }}>
                        No receipts found.
                    </Typography>
                )}
            </Box>

            <ReceiptAdder user={user} fetchReceipts={fetchReceipts} />
        </Box>
    );
};

export default Dashboard;
