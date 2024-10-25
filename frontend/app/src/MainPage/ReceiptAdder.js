// ReceiptAdder.js
import React, { useState } from 'react';
import { Fab, Zoom, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import CameraCapture from './Camera';
import ReceiptConfirm from './ReceiptConfirm';
import ManualEntry from './ManualEntry';
import '../Adder.css';

const ReceiptAdder = ({ user, fetchReceipts }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [showReceiptConfirm, setShowReceiptConfirm] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [receiptDetails, setReceiptDetails] = useState({ vendor: '', total: '', category: '', date: '' });


    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleManualEntryOpen = () => setShowManualEntry(true);
    const handleManualEntryClose = () => setShowManualEntry(false);

    const handleReceiptSave = () => {
        fetchReceipts(); // Refresh receipts after save
        setShowManualEntry(false); // Close the manual entry dialog
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
        const formData = new FormData();
        formData.append('file', file);

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
                date: data.date || ''
            });

            setShowReceiptConfirm(true);

        } catch (error) {
            console.error('Error uploading the receipt:', error);
        }
    };

    return (
        <div className="receipt-adder">
            {/* Main + button */}
            <Tooltip title="Add Receipt" placement="left">
                <Fab color="primary" onClick={toggleExpand} className="main-button">
                    <AddIcon />
                </Fab>
            </Tooltip>

            {/* Expanded buttons */}
            <Zoom in={isExpanded} timeout={300}>
                <div className="action-buttons">
                    <Tooltip title="Enter Manually" placement="left">
                        <Fab color="secondary" onClick={handleManualEntryOpen} className="manual-entry-button">
                            <EditIcon />
                        </Fab>
                    </Tooltip>

                    <Tooltip title="Scan with Camera" placement="left">
                        <Fab color="secondary" onClick={() => setShowCamera(!showCamera)} className="camera-button">
                            <CameraAltIcon />
                        </Fab>
                    </Tooltip>

                    <Tooltip title="File Upload" placement="left">
                        <Fab color="secondary" onClick={() => document.getElementById('file-input').click()} className="upload-button">
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

            <ManualEntry user={user} open={showManualEntry} onClose={handleManualEntryClose} onSave={handleReceiptSave} />

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
