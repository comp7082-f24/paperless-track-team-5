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
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

const db = getFirestore();

const pages = [
  { name: "Receipts", id: "receipts", to: "/dashboard" },
  { name: "Categories", id: "categories", to: "/categories" },
  { name: "Analytics", id: "analytics", to: "/analytics" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="text"
        onClick={toggleDrawer(true)}
        sx={{ color: "white", display: { xs: "flex", sm: "none" }, justifyContent: "right" }}
      >
        <MenuIcon />
      </Button>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        sx={{
          display: { xs: "inherit", sm: "none" },
          "& .MuiDrawer-paper": {
            height: "100%",
            width: "100%",
            backgroundColor: "#1976d2",
            color: "white",
          },
        }}
      >
        {/* Close Drawer Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button onClick={toggleDrawer(false)}>
            <CloseIcon sx={{ color: "white" }} />
          </Button>
        </Box>
        <NavList toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* Desktop Navigation */}
      <NavList sx={{ display: { xs: "none", sm: "inherit" } }} />
    </>
  );
};

const NavList = ({ toggleDrawer, ...props }) => {
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
              color: "#ffcc00",
            },
          }}
          href={page.to}
          onClick={() => {
            if (toggleDrawer) toggleDrawer(false)(); // Close the drawer on click
          }}
        >
          {page.name}
        </Link>
      ))}
      <SettingsMenu toggleDrawer={toggleDrawer} />
    </Stack>
  );
};

const SettingsMenu = ({ toggleDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    profilePicture: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
    if (toggleDrawer) toggleDrawer(false)(); // Close the mobile drawer if open
    navigate("/profile");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (toggleDrawer) toggleDrawer(false)(); // Close the mobile drawer if open
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{ color: "white" }}
      >
        <Avatar
          src={user.profilePicture || "https://example.com/path/to/default-profile-pic.png"}
          alt="User Profile"
          sx={{ border: "2px solid white" }}
        />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#1976d2",
            color: "white",
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
    <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
      <Container>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  fontFamily: "'Roboto Condensed', sans-serif",
                }}
              >
                PaperlessTRACK
              </Typography>
            <Nav />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
