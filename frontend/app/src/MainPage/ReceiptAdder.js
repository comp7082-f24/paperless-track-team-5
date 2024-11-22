import React, { useState, useEffect } from 'react';
import { Fab, Zoom, Tooltip, CircularProgress, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import CameraCapture from './Camera';
import ReceiptConfirm from './ReceiptConfirm';
import ManualEntry from './ManualEntry';
import '../Adder.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Theme } from '../themes/Theme';


const db = getFirestore();

const ReceiptAdder = ({ user, fetchReceipts }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [showReceiptConfirm, setShowReceiptConfirm] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [receiptDetails, setReceiptDetails] = useState({ vendor: '', total: '', category: '', date: '' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
            const querySnapshot = await getDocs(categoriesCollectionRef);
            setCategories(querySnapshot.docs.map(doc => doc.data().name));
        };
        fetchCategories();
    }, [user.uid]);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleManualEntryOpen = () => setShowManualEntry(true);
    const handleManualEntryClose = () => {
        setShowManualEntry(false);
        toggleExpand();
    };

    const handleReceiptSave = () => {
        fetchReceipts(); // Refresh receipts after save
        setShowManualEntry(false); // Close the manual entry dialog
        toggleExpand();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file ? file.name : null);
        processReceipt(file);
    };

    const handleCameraCapture = async (imageSrc) => {
        try {
            const base64Response = await fetch(imageSrc);
            const blob = await base64Response.blob();
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
            setShowCamera(!showCamera);
            processReceipt(file);
        } catch (error) {
            console.error('Error capturing image: ', error);
        }
    };

    const processReceipt = async (file) => {
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append('file', file);
        formData.append('categories', JSON.stringify(categories));

        try {
            const response = await fetch('http://localhost:5000/api/process-receipt', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process the receipt');
            }

            const data = await response.json();
            console.log('Backend Response:', data);

            setReceiptDetails({
                vendor: data.vendor || '',
                total: data.total || '',
                category: data.category || '',
                date: data.date || '',
            });

            setLoading(false); // Stop loading once data is set
            setShowReceiptConfirm(true); // Now show the receipt confirmation popup
            toggleExpand();
        } catch (error) {
            console.error('Error uploading the receipt:', error);
            setLoading(false); // Stop loading in case of error
        }
    };

    return (
        <div className="receipt-adder">
            {/* Loading Dialog */}
            <Dialog open={loading} PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}>
                <div style={{ padding: '100px', display: 'flex', justifyContent: 'center',  alignItems: 'center'}}><CircularProgress /></div>
            </Dialog>

            {/* Main + button */}
            <Tooltip title="Add Receipt" placement="left">
                <Fab sx={{backgroundColor: Theme.palette.primary.main, color: Theme.palette.primary.contrastText}} onClick={toggleExpand} className="main-button">
                    <AddIcon  />
                </Fab>
            </Tooltip>

            {/* Expanded buttons */}
            <Zoom in={isExpanded} timeout={300}>
                <div className="action-buttons">
                    <Tooltip title="Enter Manually" placement="left">
                        <Fab style={{backgroundColor: Theme.palette.accent.main, color: Theme.palette.text.contrast}} onClick={handleManualEntryOpen} className="manual-entry-button">
                            <EditIcon />
                        </Fab>
                    </Tooltip>

                    <Tooltip title="Scan with Camera" placement="left" backgroundColor={Theme.palette.accent.main}> 
                        <Fab style={{backgroundColor: Theme.palette.accent.main, color: Theme.palette.text.contrast}} onClick={() => setShowCamera(!showCamera)} className="camera-button">
                            <CameraAltIcon />
                        </Fab>
                    </Tooltip>

                    <Tooltip title="File Upload" placement="left">
                        <Fab style={{backgroundColor: Theme.palette.accent.main, color: Theme.palette.text.contrast}} onClick={() => document.getElementById('file-input').click()} className="upload-button">
                            <UploadIcon />
                        </Fab>
                    </Tooltip>

                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            </Zoom>

            {showCamera && (
                <div className="camera-preview">
                    <CameraCapture onCapture={handleCameraCapture} />
                </div>
            )}

            <ManualEntry
                user={user}
                open={showManualEntry}
                onClose={handleManualEntryClose}
                onSave={handleReceiptSave}
            />

            {showReceiptConfirm && (
                <ReceiptConfirm
                    user={user}
                    fetchReceipts={fetchReceipts}
                    receiptDetails={receiptDetails}
                    setReceiptDetails={setReceiptDetails}
                    setShowReceiptConfirm={setShowReceiptConfirm}
                />
            )}
        </div>
    );
};

export default ReceiptAdder;
