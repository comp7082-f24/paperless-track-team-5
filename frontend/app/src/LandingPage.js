import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Container, Grid, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import scanImage from './assets/scan.png';
import './LandingPage.css';

const LandingPage = () => {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 960px)');
  const navigate = useNavigate();

  const toggleButtons = () => {
    setShowGetStarted(!showGetStarted);
  };

  return (
    <div className="landing-page">
      {/* Fixed AppBar positioning */}
      <AppBar position="fixed" style={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2rem' }}>
          <div className="logo">
            <h1>PaperlessTRACK</h1>
          </div>
          <Box className="box-container">
            {isMobile && (
              <Button
                variant="text"
                onClick={toggleButtons}
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  transform: showGetStarted ? 'rotate(90deg) scale(1.2)' : 'rotate(90deg) scale(1)',
                  transition: 'transform 0.5s ease',
                }}
              >
                {showGetStarted ? 'X' : 'III'}
              </Button>
            )}

            {(showGetStarted || !isMobile) && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button className="login-button" variant="outlined" color="inherit" onClick={() => navigate('/signin')}>
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Button className="get-started-button" variant="contained" color="primary" onClick={() => navigate('/signup')}>
                    SignUp for Free
                  </Button>
                </motion.div>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Animated line under the buttons */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #ff6f61, #ffb677, #6a0572)', // Colorful gradient
          position: 'absolute',
          top: '100px', // Positioned 100px below the top of the page
          left: 0,
          right: 0,
        }}
      />

      {/* Adjust container to account for fixed AppBar */}
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          height: 'calc(100vh - 64px)',
          padding: '2rem',
          marginTop: '64px',
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} sx={{ width: '50%', marginTop: '250px', paddingLeft: '20px' }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h2" gutterBottom sx={{ color: '#fff', fontWeight: 'bold', fontSize: '3.5rem' }}>
                Streamline Your Expenses with PaperlessTrack
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontSize: '1.5rem' }}>
                Effortless, precise, and secure receipt capture with seamless data extraction. Never lose track of your finances again.
              </Typography>
              <Typography variant="h6" sx={{ color: '#fff', marginTop: '20px' }}>
                Process your documents in less time than it takes to read this.
              </Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={scanImage}
                alt="Document processing illustration"
                className="landing-image"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '15px' }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LandingPage;
