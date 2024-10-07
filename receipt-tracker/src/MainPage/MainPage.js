import React, { useState, useEffect } from 'react';
import CameraCapture from './Camera';
import Tesseract from 'tesseract.js';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import '../MainPage.css';
import SignOut from '../SignOut';  // Import the new SignOut component

const db = getFirestore();

const Dashboard = ({ user, onSignOut }) => { 
    const [receipts, setReceipts] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
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
                const querySnapshot = await getDocs(collection(db, 'receipts'));
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

    const handleReceiptUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file ? file.name : null);
        processReceipt(file);
    };

    const processReceipt = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            Tesseract.recognize(
                reader.result,
                'eng',
                {
                    logger: (m) => console.log(m),
                }
            ).then(({ data: { text } }) => {
                storeReceiptData({ details: [{ itemName: text, itemPrice: 'N/A' }] });
            });
        };
        reader.readAsDataURL(file);
    };

    const handleCapture = (imageSrc) => {
        Tesseract.recognize(
            imageSrc,
            'eng',
            {
                logger: (m) => console.log(m),
            }
        ).then(({ data: { text } }) => {
            storeReceiptData({ details: [{ itemName: text, itemPrice: 'N/A' }] });
        });
    };

    const storeReceiptData = async (data) => {
        try {
            await addDoc(collection(db, 'receipts'), data);
            fetchReceipts(); // Refresh receipts after storing new data
        } catch (error) {
            console.error('Error adding receipt: ', error);
        }
    };

    const fetchReceipts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'receipts'));
            const receiptData = [];
            querySnapshot.forEach((doc) => {
                receiptData.push({ ...doc.data(), id: doc.id });
            });
            setReceipts(receiptData);
        } catch (error) {
            console.error('Error fetching receipts: ', error);
        }
    };

    const deleteReceipt = async (id) => {
        try {
            await deleteDoc(doc(db, 'receipts', id)); 
            fetchReceipts(); // Refresh receipts after deletion
        } catch (error) {
            console.error('Error deleting receipt: ', error);
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Welcome, {loading ? 'Loading...' : username}!</h1> {/* Display username or loading */}
                {/* Use the SignOut component */}
                <SignOut onSignOut={onSignOut} /> 
            </div>
            <div className="dashboard-title">
                <h2>Dashboard</h2>
            </div>
            <button onClick={() => setShowCamera(!showCamera)}>
                {showCamera ? 'Switch to Upload' : 'Scan with Camera'}
            </button>
            {showCamera ? (
                <CameraCapture onCapture={handleCapture} />
            ) : (
                <div className="upload-container" onClick={() => document.getElementById('file-input').click()}>
                    {selectedFile ? (
                        <p>{selectedFile}</p>
                    ) : (
                        <p>Drag or upload your document here</p>
                    )}
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            )}
            <h2>Your Receipts:</h2>
            <ul>
                {receipts.map(receipt => (
                    <li key={receipt.id}>
                        {Array.isArray(receipt.details) ? (
                            receipt.details.map((detail, index) => (
                                <div key={index}>
                                    <span>{detail.itemName}: </span>
                                    <span>{detail.itemPrice}</span>
                                </div>
                            ))
                        ) : (
                            <span>{receipt.details}</span> 
                        )}
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
