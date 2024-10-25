import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import '../Authen.css';

const db = getFirestore();

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [income, setIncome] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const defaultCategories = [
        { name: 'Housing', color: '#FF5733' },
        { name: 'Grocery', color: '#33FF57' },
        { name: 'Transportation', color: '#3357FF' },
        { name: 'Utilities', color: '#FF33A8' },
        { name: 'Entertainment', color: '#FFBD33' },
        { name: 'Travel', color: '#33FFF0' },
    ];

    const createDefaultCategories = async (userId) => {
        const categoriesCollectionRef = collection(db, 'users', userId, 'categories');
        try {
            for (const category of defaultCategories) {
                await addDoc(categoriesCollectionRef, {
                    name: category.name,
                    color: category.color,
                    monthlyBudget: null,
                    createdAt: new Date(),
                });
            }
        } catch (error) {
            console.error('Error creating default categories:', error);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                income, // Save as income instead of incomeType
                registrationDate: new Date(),
                lastLogin: new Date(),
            });

            await createDefaultCategories(user.uid);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="signup-container" maxWidth="100%">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="signup-card"
                style={{ 
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))', 
                    backdropFilter: 'blur(10px)', 
                    padding: '3rem', 
                    borderRadius: '15px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
                }}
            >
                <Typography variant="h4" className="signup-title" style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>
                    Sign Up
                </Typography>

                <Box component="form" onSubmit={handleSignUp} className="signup-form">
                    <TextField
                        label="Username"
                        variant="outlined"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        fullWidth
                        className="signup-input"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        className="signup-input"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        className="signup-input"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        label="Yearly Income"
                        variant="outlined"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                        fullWidth
                        className="signup-input"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />

                    {error && (
                        <Typography color="error" variant="body2" style={{ marginBottom: '1rem' }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        style={{ 
                            backgroundColor: '#00FF88', 
                            color: '#fff', 
                            padding: '0.75rem', 
                            marginBottom: '1rem', 
                            borderRadius: '30px' 
                        }}
                        fullWidth
                        disabled={loading}
                        className="signup-btn"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>

                    <Typography variant="body2" className="signup-link" style={{ textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link to="/signin" style={{ color: '#00FF88' }}>
                            Sign In
                        </Link>
                    </Typography>
                </Box>
            </motion.div>
        </Container>
    );
};

export default SignUp;
