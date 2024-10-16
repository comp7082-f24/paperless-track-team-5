import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SignOut from '../SignOut';  // Import the new SignOut component

const pages = [
    { name: "Home", id: "home", to: "/dashboard" },
    { name: "Analytics", id: "analytics", to: "/analytics" },
    { name: "Categories", id: "categories", to: "/categories" },
    { name: "User Profile", id: "userProfile", to: "/profile" }
  ];

  const Nav = () => {
    const [open, setOpen] = useState(false);
    const toggleDrawer = newOpen => () => {
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
              <CloseIcon />
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
  const NavList = ({ onSignOut, ...props }) => {
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
        {pages.map(page => (
          <Link
            key={page.id}
            sx={{
              color: { xs: "primary", sm: "white", margin: "1rem", textWrap: "nowrap" },
              textDecoration: "none",
            }}
            href={page.to}
          >
            {page.name}
          </Link>
        ))}
        <SignOut onSignOut={onSignOut} /> 
      </Stack>
    );
  };
  
  const Navbar = () => {
    return (
      <AppBar>
        <Container>
          <Toolbar>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography variant="h6">PaperlessTrack</Typography>
              <Nav />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    );
  };

  export default Navbar;

