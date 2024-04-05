import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Grid,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useNavigate } from "react-router-dom";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";

// import for image-slider component
import SimpleSlider from "../component/SimpleSlider";

const HomePage = () => {
  const { library } = useWeb3React();
  const [fundList, setFundList] = useState([]);
  const [contract, setContract] = useState();
  const navigate = useNavigate();

  const address = "0x4AfEC11A9E24462E87cf33D8CB3C5f2B69018166";

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
    const updateFundList = fundList[0]
      .map((f) => ({
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
      }))
      .filter(
        (f) =>
          f.active &&
          f.donation < f.goal &&
          new Date() < new Date(f.deadLine * 1000)
      );
    setFundList(updateFundList);
  };

  return (
    <Container
      style={{
        maxWidth: "80%",
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "30px",
        alignItems: "center",
      }}
    >
      {/*box for top images and two bottons */}
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Box sx={{ mx: 2, width: "90%" }}>
              <SimpleSlider />
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ mx: "auto", my: "auto" }}>
            <Box>
              <Button
                startIcon={<FaHandHoldingHeart />}
                fullWidth={true}
                variant="outlined"
                color="inherit"
                component={Link}
                bold
                to="/donate"
                sx={{ mx: "auto", fontSize: "h6.fontSize" }}
                // style={{ justifyContent: "flex-start" }}
                // style={{ width: "300%", height: "40%" }}
              >
                Donate Now
              </Button>
              <p />
              <Button
                startIcon={<FaRegPenToSquare />}
                fullWidth={true}
                variant="outlined"
                color="inherit"
                component={Link}
                to="/fundraise"
                sx={{ mx: "auto", fontSize: "h6.fontSize" }}
                // style={{ justifyContent: "flex-start" }}
                // style={{ marginTop: "30px", width: "300%", height: "40%" }}
              >
                Fundraise Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/*box for divider */}
      <container>
        <Box sx={{ my: 3 }} style={{ textAlign: "center" }}>
          <Divider variant="middle">
            <Typography variant="h6">Fundraising in progress </Typography>
          </Divider>
        </Box>
      </container>

      {/*box for the fundraising project list */}
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {fundList.map((item) => (
          <Card sx={{ maxWidth: 345 }} key={item.id}>
            <CardActionArea
              onClick={() => {
                navigate("/donate/" + item.fundID);
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image={item.imageurl}
                title={item.storyTitle}
              />
              <CardContent>
                <Typography gutterBottom variant="h7" component="div">
                  {item.storyTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.storyText.slice(0, 100) + "..."}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;
