import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import '../MainPage.css';
import SignOut from '../SignOut';  // Import the new SignOut component
import ManualUpload from './ManualEntry';
import { useNavigate } from "react-router-dom";
import ReceiptConfirm from './ReceiptConfirm';
import ReceiptAdder from './ReceiptAdder';


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

    const deleteReceipt = async (id) => {
        try {
            // Reference the specific receipt in the user's subcollection
            await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
    
            // Refresh the receipts after deletion
            fetchReceipts();
        } catch (error) {
            console.error('Error deleting receipt:', error);
        }
    };

    const navigate = useNavigate()

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
            <ul>
                {receipts.map(receipt => (
                    <li key={receipt.id}>
                        <div>
                            <span>Vendor: {receipt.vendor}</span><br />
                            <span>Total: {receipt.total}</span><br />
                            <span>Category: {receipt.category}</span><br />
                            <span>Date: {receipt.date}</span><br />
                        </div>
                        <button className="delete-button" onClick={() => deleteReceipt(receipt.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Dashboard;
