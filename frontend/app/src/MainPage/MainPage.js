import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import '../MainPage.css';
import ReceiptAdder from './ReceiptAdder';
import ReceiptCard from './ReceiptCard';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import MonthYearPicker from './MonthYearPicker';


const db = getFirestore();

const Dashboard = ({ user }) => { 
    const [receipts, setReceipts] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs());

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

        const fetchReceipts = async () => {
            try {
                const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');
                const querySnapshot = await getDocs(receiptsCollectionRef);
                const receiptData = [];
                querySnapshot.forEach((doc) => {
                    receiptData.push({ ...doc.data(), id: doc.id });
                });
                setReceipts(receiptData);
            } catch (error) {
                console.error('Error fetching receipts: ', error);
            }
        };

        fetchUserData();
        fetchReceipts();
    }, [user]);

    const fetchReceipts = async () => {
        try {
            if (user) {
                const receiptsCollectionRef = collection(db, 'users', user.uid, 'receipts');
                const querySnapshot = await getDocs(receiptsCollectionRef);
                const receiptData = [];
                querySnapshot.forEach((doc) => {
                    receiptData.push({ ...doc.data(), id: doc.id });
                });
                setReceipts(receiptData);
            }
        } catch (error) {
            console.error('Error fetching receipts: ', error);
        }
    };

    return (
        <div className="dashboard" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
    {/* <div className="header welcome-message">
        <h1>Welcome, {loading ? 'Loading...' : username}!</h1>
    </div> */}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="h4" gutterBottom>
                    Receipts:
                </Typography>
                <MonthYearPicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>
            <div className="receipt-list">
                {receipts.map(receipt => (
                    <ReceiptCard
                        key={receipt.id}
                        vendor={receipt.vendor}
                        total={receipt.total}
                        date={receipt.date}
                        category={receipt.category}
                        user={user}
                        id={receipt.id}
                        fetchReceipts={fetchReceipts}
                    />
                ))}
            </div>

            <ReceiptAdder
                user={user}
                fetchReceipts={fetchReceipts}
            />
        </div>
    );
};

export default Dashboard;
