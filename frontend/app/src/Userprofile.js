import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, signInWithEmailAndPassword } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import './Users.css';
import placeholderImage from './assets/default-profile-pic.png';
import { FaPencilAlt } from 'react-icons/fa';

const db = getFirestore();
const storage = getStorage();

const UserProfile = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        registrationDate: '',
        lastLogin: '',
        profilePicture: '',
        activityLog: [],
        notificationPreferences: {},
        privacySettings: {},
    });
    const [file, setFile] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordChangeActive, setIsPasswordChangeActive] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleUpload(selectedFile);
        }
        setShowOptions(false);
    };

    const handleUpload = async (selectedFile) => {
        try {
            const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, selectedFile);
            const url = await getDownloadURL(storageRef);

            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                profilePicture: url,
            });

            setUser((prevUser) => ({ ...prevUser, profilePicture: url }));
            alert('Profile picture uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload profile picture. Please try again.');
        }
    };

    const handleEditProfile = async (field) => {
        if (newValue.trim() !== '') {
            try {
                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    [field]: newValue,
                });
                setUser((prevUser) => ({ ...prevUser, [field]: newValue }));
                setEditingField(null);
                setNewValue('');
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            }
        }
    };

    const handleRemoveProfilePicture = async () => {
        try {
            const userId = auth.currentUser.uid;
            const storageRef = ref(storage, `profilePictures/${userId}`);
            await deleteObject(storageRef);
            await updateDoc(doc(db, 'users', userId), {
                profilePicture: '',
            });
            setUser((prevUser) => ({ ...prevUser, profilePicture: '' }));
            alert('Profile picture removed successfully!');
            setShowOptions(false);
        } catch (error) {
            console.error('Error removing profile picture:', error);
            alert('Failed to remove profile picture. Please try again.');
        }
    };

   

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('You have been logged out successfully!');
            navigate('/signin'); // Redirect to the sign-in page after successful logout
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred while logging out. Please try again.');
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
        return 'N/A';
    };

    const handleChangePassword = async () => {
        try {
            await signInWithEmailAndPassword(auth, user.email, oldPassword);
            const userCredential = auth.currentUser;
            await userCredential.updatePassword(newPassword);
            alert('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setIsPasswordChangeActive(false);
        } catch (error) {
            setPasswordError('Incorrect old password.');
            console.error('Error changing password:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if (user.profilePicture) {
            setShowOptions((prev) => !prev); // Toggle dropdown if profile picture exists
        } else {
            fileInputRef.current.click(); // Open file dialog if no profile picture
        }
    };

    return (
        <div className="user-profile" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1>User Profile</h1>
            <div className="profile-header" style={{ position: 'relative', textAlign: 'center' }}>
                <div
                    style={{ cursor: 'pointer', position: 'relative' }}
                    onClick={handleProfileClick} // Updated click handler
                >
                    <img
                        src={user.profilePicture || placeholderImage}
                        alt="Profile"
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    {showOptions && (
                        <div className="options-dropdown" ref={dropdownRef}>
                            <button onClick={() => fileInputRef.current.click()}>
                                Edit Profile Picture
                            </button>
                            <button onClick={handleRemoveProfilePicture}>
                                Remove Profile Picture
                            </button>
                        </div>
                    )}
                </div>
                <h2>{user.username}</h2>
                <p style={{ margin: '0', fontStyle: 'bold' }}>{user.email}</p>
            </div>

            {['username', 'address', 'nickname', 'dob'].map((field) => (
                <div className="user-detail" key={field}>
                    <span className="user-detail-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </span>
                    <span className="user-detail-value">
                        {editingField === field ? (
                            <input
                                type={field === 'dob' ? 'date' : 'text'}
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                onBlur={() => { handleEditProfile(field); setEditingField(null); }}
                                onFocus={() => setEditingField(field)}
                            />
                        ) : (
                            <span>{user[field]}</span>
                        )}
                    </span>
                    <span className="edit-icon" onClick={() => { setEditingField(field); setNewValue(user[field]); }}>
                        <FaPencilAlt />
                    </span>
                </div>
            ))}

            <div className="change-password">
                <h3>Change Password</h3>
                {isPasswordChangeActive ? (
                    <div>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => {
                                setOldPassword(e.target.value);
                                setPasswordError('');
                            }}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={oldPassword === ''}
                        />
                        <button className="change-password-button" onClick={handleChangePassword}>Submit</button>
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                ) : (
                    <button className="change-password-button" onClick={() => setIsPasswordChangeActive(true)}>
                        Change Password
                    </button>
                )}
            </div>

            <button className="logout-button" onClick={handleLogout}>Logout</button>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide file input
            />
        </div>
    );
};

export default UserProfile;
