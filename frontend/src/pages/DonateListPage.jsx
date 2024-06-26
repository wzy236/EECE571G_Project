import React, { useState, useEffect } from "react";
import { mockData } from "../component/mockdata";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Container,
  Box,
  Typography,
  LinearProgress,
  Button,
  Divider,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ProgressBar } from "../component/Progress";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import TablePagination from "@mui/material/TablePagination";


const DonateListPage = () => {
  const { library } = useWeb3React();
  const [searchTerm, setSearchTerm] = useState("");
  const [fundList, setFundList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [contract, setContract] = useState();
  const navigate = useNavigate();

  const address = "0x4AfEC11A9E24462E87cf33D8CB3C5f2B69018166";

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  useEffect(() => {
    if (!library) {
      return;
    }
    setContract(
      new ethers.Contract(
        address,
        TrustableFundArtifact.abi,
        library.getSigner()
      )
    );
  }, [library]);

  useEffect(() => {
    if (!contract) {
      return;
    }
    _GetFundraise();
  }, [contract]);

  const _GetFundraise = async () => {
    const fundList = await contract.getFundList();
    //add update the bigint into number
    const updateFundList = fundList[0].map((f) => ({
      ownerAddress: f.ownerAddress,
      fundID: Number(f.fundID),
      goal: parseFloat(ethers.utils.formatEther(f.goal)),
      donation: parseFloat(ethers.utils.formatEther(f.donation)),
      donationList: f.donationList,
      deadLine: Number(f.deadLine),
      storyTitle: f.storyTitle,
      storyText: f.storyText,
      imageurl: f.imageurl,
      active: f.active,
    }));
    console.log(updateFundList);

    updateFundList.sort((a, b) => { 
      if (a.active !== b.active) {
        //if one is active but is expired or reached the goal, it will sort with inactive ones
        if(a.active && (a.donation >= a.goal || new Date() > new Date(a.deadLine * 1000))){ 
          return a.deadLine - b.deadLine; 
        }
        if(b.active && (b.donation >= b.goal || new Date() > new Date(b.deadLine * 1000))){
          return a.deadLine - b.deadLine; 
        }
        return b.active - a.active; //active project is placed first
      }
      if (a.active && b.active) {   //if both active, but one project has already reached the goal or expired
        if(a.donation >= a.goal || new Date() > new Date(a.deadLine * 1000)){
          return 1; 
        }
        if(b.donation >= b.goal || new Date() > new Date(b.deadLine * 1000)){
          return -1; 
        }
      }
      return a.deadLine - b.deadLine;  // The one with the earliest deadline is placed first
    });
    console.log(updateFundList);
    setFundList(updateFundList);
    setFilterList(updateFundList);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredItems = fundList.filter((item) =>
      item.storyTitle.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilterList(filteredItems);
  };

  const unixTimeToDate = (unixTime) => {
    // Multiply Unix time by 1000 to convert from seconds to milliseconds
    const milliseconds = unixTime * 1000;

    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);

    // Use any method to get the desired date format
    // For example, using toLocaleString() to get the date in the local time zone
    return date.toLocaleDateString(); // Adjust format as needed
  };

  return (
    <Container
      style={{ maxWidth: "80%", textAlign: "center", marginTop: "50px" }}
    >
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
      />
      <List>
        {filterList
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((item) => (
          <ListItem
            key={item.id}
            sx={{ height: "250px", alignItems: "center" }}
            divider={true}
            component={RouterLink}
            to={`/donate/${item.fundID}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "30% 30% 40%",
                my: "auto",
              }}
            >
              <img
                src={item.imageurl}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  my: "auto",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                  flexDirection: "column",
                }}
              >
                <Typography to={"/donate/" + item.fundID} variant="h5">
                  {item.storyTitle}
                </Typography>
                <Typography variant="h7">
                  Target Amount: {item.goal} <br />
                  End Date: {unixTimeToDate(item.deadLine)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                  flexDirection: "column",
                }}
              >
                <Typography>
                  Already Raised: {item.donation} <br />
                  Number of Donations: {item.donationList.length}
                </Typography>

                <ProgressBar
                  value={Math.round((item.donation / item.goal) * 100)}
                  width={"60%"}
                />

                {item.active &&
                item.donation < item.goal &&
                new Date() < new Date(item.deadLine * 1000) ? (
                  // if not canceled and not reached the goal and not ended
                  // show donation button
                  <Button
                    variant="contained"
                    sx={{ width: "60%" }}
                    onClick={() => {
                      navigate("/donate/" + item.fundID);
                    }}
                  >
                    Donate Now
                  </Button>
                ) : (
                  // show canceled button
                  <Button variant="outlined" sx={{ width: "60%" }} disabled>
                    Fundraising closed
                  </Button>
                )}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
      <TablePagination
        rowsPerPageOptions={[5,10,15]}
        component="div"
        count={fundList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default DonateListPage;
