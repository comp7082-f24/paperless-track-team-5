// src/ForgotPassword.js
import React from 'react';

const ForgotPassword = () => {
    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            <p>Please enter your email address to reset your password.</p>
            <input type="email" placeholder="Email" required />
            <button type="submit">Reset Password</button>
            {/* Implement your reset password functionality here */}
        </div>
    );
};

export default ForgotPassword;
