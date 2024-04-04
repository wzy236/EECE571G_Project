import React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MetaMaskAuth from './Metamask';

const NavBar = () => {

  


  return (
    <AppBar position="static">
      <Box sx={{ display: "flex", justifyContent:"space-between", alignItems: 'center', width: "100% ", height:"150px"}}>
        <Box sx={{ width: "30%", maxWidth:"500px" }}>
            <img src= "http://www.w3.org/2000/svg" width="16" height="16"
            alt ="TrustFund"/>
        </Box >

        <Box sx={{ width: "70%", display: "flex", justifyContent: "flex-end", alignItems: 'center' }}>
          <Box sx={{ display: "flex", justifyContent:" space-between", alignItems: 'bottom' }}>
            <Button color="inherit" component={Link} to="/home">Home Page</Button>
            <Button color="inherit" component={Link} to="/donate">Donate</Button>
            <Button color="inherit" component={Link} to="/fundraise">Fundraise</Button>
            <Button color="inherit" component={Link} to="/donatehistory">Donate History</Button>
            <Button color="inherit" component={Link} to="/fundraisingproject">Fundraising Project</Button>
            <Button color="inherit"></Button>
          </Box>
          <MetaMaskAuth/>
        </Box>
      </Box>
    </AppBar>
  );
};

export default NavBar;