import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import SignUp from './SignUp/SignUp';
import SignIn from './SignIn/SignIn';
import Navbar from './Navbar/Navbar'; 
import Analytics from './Analytics';
import Categories from './Categories';
import UserProfile from './Userprofile';
import ForgotPassword from './ForgotPassword';
import Dashboard from './MainPage/MainPage'; 
import './style.css'; 
import ManualUpload from './MainPage/ManualEntry';

const App = () => {
    const [isSignUp, setIsSignUp] = useState(false); 
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    const toggleForm = () => {
        setIsSignUp(!isSignUp); 
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User state changed:', currentUser); 
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <Router>
            <div className="app-container">
                {/* Add Navbar here, so it's displayed on all pages */}
                {user && <Navbar />}
                <Routes>
                    <Route path="/" element={isSignUp ? <SignUp toggleForm={toggleForm} /> : <SignIn toggleForm={toggleForm} />} />
                    <Route path="/signin" element={<SignIn toggleForm={toggleForm} />} />
                    <Route path="/signup" element={<SignUp toggleForm={toggleForm} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} /> 
                    <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/signin" />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/categories" element={user ? <Categories user={user} /> : <Navigate to="/signin" />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/record" element={user ? <ManualUpload user={user} /> : <Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
