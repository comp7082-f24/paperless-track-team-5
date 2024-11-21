import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Toolbar,
  Typography,
  Container,
  AppBar,
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
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Theme } from "../themes/Theme"

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
      <Button
        variant="text"
        onClick={toggleDrawer(true)}
        sx={{ color: Theme.palette.text.contrast, display: { xs: "flex", sm: "none" }, justifyContent: "right" }}
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
            backgroundColor: Theme.palette.primary.main,
            color: "white",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button onClick={toggleDrawer(false)}>
            <CloseIcon sx={{ color: "white" }} />
          </Button>
        </Box>
        <NavList toggleDrawer={toggleDrawer} />
      </Drawer>

      <NavList sx={{ display: { xs: "none", sm: "inherit" } }} />
    </>
  );
};

const NavList = ({ toggleDrawer, ...props }) => {
  const location = useLocation(); // Access the current route

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
        <Button
          key={page.id}
          sx={{
            color: location.pathname === page.to ? "#ffcc00" : "white",
            fontWeight: location.pathname === page.to ? "bold" : "normal",
            backgroundColor: "transparent",
            textTransform: "none",
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
        </Button>
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
    if (toggleDrawer) toggleDrawer(false)();
    navigate("/profile");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (toggleDrawer) toggleDrawer(false)();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Button onClick={handleClick} sx={{ color: Theme.palette.text.contrast }}>
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
            backgroundColor: Theme.palette.primary.main,
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
    <AppBar position="fixed" sx={{ backgroundColor: Theme.palette.primary.main }}>
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
                color: Theme.palette.text.contrast,
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
