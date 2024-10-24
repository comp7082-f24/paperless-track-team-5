import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Google } from '@mui/icons-material';
import '../Authen.css'; // Assuming this contains custom CSS for animations and background

const SignIn = () => {
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
      await updateDoc(doc(firestore, 'users', user.uid), { lastLogin: new Date() });
      alert('Sign-in successful!');
      navigate('/dashboard');
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
      await updateDoc(doc(firestore, 'users', user.uid), { lastLogin: new Date() });
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="signin-container" maxWidth="100%">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="signin-card"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))', 
          backdropFilter: 'blur(10px)', 
          padding: '3rem', 
          borderRadius: '15px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }}
      >
        <Typography variant="h4" className="signin-title" style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSignIn} className="signin-form">
          <TextField
            label="Work Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            className="signin-input"
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
            className="signin-input"
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
            className="signin-btn"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
          </Button>

          <Typography variant="body2" className="signin-link" style={{ textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#fff' }}>
              Forgot your password?
            </Link>
          </Typography>

          <Typography variant="body2" className="signin-link" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#00FF88' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SignIn;
