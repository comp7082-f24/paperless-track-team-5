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
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const pages = [
    { name: "Home", id: "home", to: "/dashboard" },
    { name: "Analytics", id: "analytics", to: "/analytics" },
    { name: "Categories", id: "categories", to: "/categories" },
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
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleChange = (event) => {
        setAuth(event.target.checked);
      };
    
      const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

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
        {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}><Link
                    key={"userProfile"}
                    sx={{
                    color: { sm: "black" },
                    textDecoration: "none",
                    }}
                    href={"/profile"}
                >
                    User Profile
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}><SignOut onSignOut={onSignOut} /></MenuItem>
              </Menu>
            </div>
          )}
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

