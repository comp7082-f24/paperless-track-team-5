// src/SignUp/SignUp.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const db = getFirestore(); // Initialize Firestore

const SignUp = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // New state for username
    const [incomeType, setIncomeType] = useState(''); // New state for dropdown
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username, // Save username
                email,
                incomeType,
            });

            alert('Sign-up successful! Please sign in.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Username" // Username input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <select
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Income Type</option>
                    <option value="Income">Income</option>
                    <option value="Tax">Tax</option>
                </select>
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <button type="button" className="toggle-button" onClick={toggleForm}>
                    Already have an account? Sign In
                </button>
            </form>
        </div>
    );
};

export default SignUp;
