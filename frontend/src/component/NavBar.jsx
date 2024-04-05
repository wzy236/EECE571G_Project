import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import MetaMaskAuth from "./Metamask";
import { useTheme } from "@emotion/react";

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab component={Link} aria-current={props.selected && "page"} {...props} />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

const NavBar = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== "click" ||
      (event.type === "click" && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar position="static">
        <Toolbar variant="dense">
          <img
            src="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            alt="TrustFund"
          />
          <Box flex="1" align="left">
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              TrustableFund
            </Typography>
          </Box>

          <Box
            justifyContent={"flex-end"}
            spacing={1}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="inherit"
              onChange={handleChange}
              aria-label="nav tabs example"
              role="navigation"
            >
              <LinkTab label="Home Page" to="/home" />
              <LinkTab label="Donate" to="/donate" />
              <LinkTab label="Fundraise" to="/fundraise" />
              <LinkTab label="Donate History" to="/donatehistory" />
              <LinkTab label="Fundraising Project" to="/fundraisingproject" />
            </Tabs>
          </Box>

          {/* <Button color="inherit" component={Link} to="/home">
            Home Page
          </Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Button color="inherit" component={Link} to="/donate">
            Donate
          </Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Button color="inherit" component={Link} to="/fundraise">
            Fundraise
          </Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Button color="inherit" component={Link} to="/donatehistory">
            Donate History
          </Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Button color="inherit" component={Link} to="/fundraisingproject">
            Fundraising Project
          </Button> */}

          <Button color="inherit"></Button>

          <MetaMaskAuth />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
