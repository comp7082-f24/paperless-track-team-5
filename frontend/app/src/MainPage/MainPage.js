import React, { useState, useEffect } from 'react';
import CameraCapture from './Camera';
import Tesseract from 'tesseract.js';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, deleteDoc, where, query } from 'firebase/firestore';
import '../MainPage.css';
import SignOut from '../SignOut';  // Import the new SignOut component
import ManualUpload from './ManualEntry';
import { useNavigate } from "react-router-dom";
import ReceiptConfirm from './ReceiptConfirm';



const db = getFirestore();

const Dashboard = ({ user }) => { 
    const [receipts, setReceipts] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [receiptDetails, setReceiptDetails] = useState({ vendor: '', total: '', category: '', date: ''});

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

    const handleReceiptUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file ? file.name : null);
        processReceipt(file);
    };

    const handleReceiptCapture = async (imageSrc) => {
        try {
            const base64Response = await fetch(imageSrc);
            const blob = await base64Response.blob();
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
            processReceipt(file);
        } catch (error) {
            console.error('Error capturing image: ', error);
        }
    };

    const processReceipt = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            // Send the file to the backend for processing using Veryfi
            const response = await fetch('http://localhost:5000/api/process-receipt', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to process the receipt');
            }
    
            // Extract the JSON response from the backend
            const data = await response.json();
            console.log('Backend Response:', data);
    
            // Set the receipt details received from the backend for user confirmation
            setReceiptDetails({
                vendor: data.vendor || '',
                total: data.total || '',
                category: data.category || '',
                date: data.date || ''
            });
    
            // Open the pop-up for confirmation
            setShowPopup(true);
            
        } catch (error) {
            // Handle any errors that occur during the fetch or response processing
            console.error('Error uploading the receipt:', error);
        }
    };

    const handleReceiptConfirm = async () => {
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

    const handleReceiptChange = (e) => {
        setReceiptDetails({ ...receiptDetails, [e.target.name]: e.target.value });
    };

    const handleReceiptCancel = () => {
        setShowPopup(false); // Close the pop-up without saving
        console.log('Receipt addition cancelled');
    };

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
            <button
                onClick={() => navigate("/record")}
            >
                Manual Entry
            </button>
            {/* <div className="dashboard-title">
                <h2>Dashboard</h2>
            </div> */}
            <button onClick={() => setShowCamera(!showCamera)}>
                {showCamera ? 'Switch to Upload' : 'Scan with Camera'}
            </button>

            {showCamera ? (
                <CameraCapture onCapture={handleReceiptCapture} />
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
            {showPopup && (
                <ReceiptConfirm 
                  receiptDetails={receiptDetails} 
                  onConfirm={handleReceiptConfirm}
                  onCancel={handleReceiptCancel}
                  onChange={handleReceiptChange} 
                />
            )}
        </div>
    );
};

export default Dashboard;
