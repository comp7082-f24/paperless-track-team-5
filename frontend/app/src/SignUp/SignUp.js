import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Container, TextField, Button, Typography, Box, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
import '../Authen.css';

const db = getFirestore();

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [incomeType, setIncomeType] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                incomeType,
                registrationDate: new Date(),
                lastLogin: new Date(),
            });

            alert('Sign-up successful! Please sign in.');
            navigate('/signin');
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

<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <FormControl 
        fullWidth 
        variant="outlined" 
        style={{ marginBottom: '1rem' }} 
    >
        <InputLabel style={{ color: 'white' }}>Select Income Type</InputLabel>
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value)}
                required
                style={{ color: 'white', backgroundColor: '#7B68EE', borderRadius: '10px', width: '100%' }} // Add width: '100%' here
                MenuProps={{
                    PaperProps: {
                        style: {
                            backgroundColor: '#9370DB',
                            color: 'white',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.2s ease',
                        },
                    },
                }}
            >
                <MenuItem value="" disabled style={{ color: 'gray' }}>Select Income Type</MenuItem>
                <MenuItem 
                    value="Income" 
                    style={{ color: 'white', backgroundColor: '#9370DB', transition: 'background-color 0.3s ease' }} 
                    onMouseOver={(e) => e.target.style.backgroundColor = '#DDA0DD'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#BA55D3'}
                >
                    Income
                </MenuItem>
                <MenuItem 
                    value="Tax" 
                    style={{ color: 'white', backgroundColor: '#9370DB', transition: 'background-color 0.3s ease' }} 
                    onMouseOver={(e) => e.target.style.backgroundColor = '#DDA0DD'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#BA55D3'}
                >
                    Tax
                </MenuItem>
            </Select>
        </motion.div>
    </FormControl>
</div>


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
