import React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MetaMaskAuth from './Metamask';

const NavBar = () => {

  


  return (
    <AppBar position="static">
      <Box sx={{ display: "flex", justifyContent:"space-between", alignItems: 'center', width: "100% ", height:"150px"}}>
        <Box sx={{ width: "50%", maxWidth:"400px" }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Your Logo
          </Link>
        </Box >

        <Box sx={{ width: "50%", display:"grid", gridTemplateColumns:"800px 200px 200px", }}>
          <Box sx={{ display: "flex", justifyContent:" space-between", alignItems: 'bottom' }}>
            <Button color="inherit" component={Link} to="/donate">Donate</Button>
            <Button color="inherit" component={Link} to="/fundraise">Fundraise</Button>
            <Button color="inherit" component={Link} to="/donatehistory">Donate History</Button>
            <Button color="inherit" component={Link} to="/fundraisingproject">Fundraising Project</Button>
          </Box>
          <div/>
          <MetaMaskAuth/>
        </Box>
      </Box>
    </AppBar>
  );
};

export default NavBar;