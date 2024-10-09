// SignOut.js
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from './firebaseConfig';
import './MainPage.css'; // Import your CSS file

const SignOut = ({ onSignOut }) => {
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                onSignOut(); // Notify parent component
                console.log('User signed out successfully');
                navigate('/signin'); // Redirect to the sign-in page
            })
            .catch((error) => {
                console.error('Sign out error: ', error);
            });
    };

    return (
        <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
        </button>
    );
};

export default SignOut;
