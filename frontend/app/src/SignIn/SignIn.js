// src/SignIn.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebaseConfig'; // Ensure firestore is imported
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore'; // Import updateDoc for Firestore

const SignIn = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update last login date in Firestore
            await updateDoc(doc(firestore, 'users', user.uid), {
                lastLogin: new Date(), // Store the last login date
            });

            alert('Sign-in successful!');
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Update last login date in Firestore
            await updateDoc(doc(firestore, 'users', user.uid), {
                lastLogin: new Date(), // Store the last login date
            });

            console.log('User signed in: ', user);
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (error) {
            console.error('Error during Google sign-in: ', error);
            setError(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <button type="button" onClick={handleGoogleSignIn}>
                    Sign In with Google
                </button>
                <p className="forgot-password">
                    <Link to="/forgot-password">Forgot your password?</Link>
                </p>
                <button type="button" className="toggle-button" onClick={toggleForm}>
                    Need an account? Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignIn;
