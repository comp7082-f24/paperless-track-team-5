import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import '../MainPage.css';
import { useNavigate } from "react-router-dom";
import ReceiptAdder from './ReceiptAdder';
import ReceiptCard from './ReceiptCard';
import { Container, Box } from '@mui/material';


const db = getFirestore();

const Dashboard = ({ user }) => { 
    const [receipts, setReceipts] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch username and receipts from Firestore
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
        <div>
            <div className="header">
                <h1>Welcome, {loading ? 'Loading...' : username}!</h1> {/* Display username or loading */}
            </div>

            <ReceiptAdder
                user={user}
                fetchReceipts={fetchReceipts}
            />

            <h2>Your Receipts:</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: '500px', maxWidth: '500px', }}>
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
        </div>
    );
};

export default Dashboard;
