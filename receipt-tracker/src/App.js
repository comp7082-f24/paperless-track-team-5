import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import SignUp from './SignUp/SignUp';
import SignIn from './SignIn/SignIn';
import Dashboard from './MainPage/MainPage'; 
import './style.css'; 

const App = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); // Added loading state

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User state changed:', currentUser); // Log user state
            setLoading(false); // Set loading to false when user state changes
        });

        return () => unsubscribe(); 
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while checking auth state
    }

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={isSignUp ? <SignUp toggleForm={toggleForm} /> : <SignIn toggleForm={toggleForm} />} />
                    <Route path="/signin" element={<SignIn toggleForm={toggleForm} />} />
                    <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
