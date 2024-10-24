import React, { useState, useEffect } from "react";
import {
  Stack,
  Link,
  Toolbar,
  Typography,
  Container,
  AppBar,
  Button,
  Drawer,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // For navigation
import { auth } from '../firebaseConfig'; // Firebase configuration

const db = getFirestore();

const pages = [
  { name: "Home", id: "home", to: "/dashboard" },
  { name: "Analytics", id: "analytics", to: "/analytics" },
  { name: "Categories", id: "categories", to: "/categories" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Button
        variant="text"
        onClick={toggleDrawer(true)}
        sx={{ color: "white", display: { xs: "flex", sm: "none" }, justifyContent: "right" }}
      >
        <MenuIcon />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        sx={{
          display: { xs: "inherit", sm: "none" },
          "& .MuiDrawer-paper": {
            height: "100%",
            width: "100%",
            backgroundColor: "#1976d2", // Change background color for drawer
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button onClick={toggleDrawer(false)}>
            <CloseIcon sx={{ color: "white" }} />
          </Button>
        </Box>
        <NavList />
      </Drawer>
      <NavList
        sx={{
          display: { xs: "none", sm: "inherit" },
        }}
      />
    </>
  );
};

const NavList = (props) => {
  return (
    <Stack
      overflow="auto"
      direction={{ xs: "column", sm: "row" }}
      gap={3}
      width={{ xs: "100%", sm: "initial" }}
      textAlign={{ xs: "center", sm: "initial" }}
      fontSize={{ xs: "22px", sm: "initial" }}
      {...props}
    >
      {pages.map((page) => (
        <Link
          key={page.id}
          sx={{
            color: { xs: "white", sm: "white", margin: "1rem", textWrap: "nowrap" },
            textDecoration: "none",
            "&:hover": {
              color: "#ffcc00", // Hover color for links
            },
          }}
          href={page.to}
        >
          {page.name}
        </Link>
      ))}
      <SettingsMenu />
    </Stack>
  );
};

const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    profilePicture: '',
  });
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile'); // Navigate to profile page
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin'); // Redirect to login after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          color: "white",
        }}
      >
        <Avatar
          src={user.profilePicture || 'https://example.com/path/to/default-profile-pic.png'}
          alt="User Profile"
          sx={{
            border: '2px solid white',
          }}
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#1976d2", // Menu background color
            color: "white", // Menu item text color
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
  );
};

const Navbar = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
      <Container>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              PaperlessTrack
            </Typography>
            <Nav />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
