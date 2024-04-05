import React, { useState, useEffect } from "react";
import {
  TextField,
  Container,
  Box,
  Typography,
  Button,
  ImageListItem,
  ImageListItemBar,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../component/Progress";
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
    .filter((f) => f.active && f.donation < f.goal && new Date() < new Date(f.deadLine * 1000));
    setFundList(updateFundList);
  };

  return (
    <Container
      style={{
        maxWidth: "80%",
        textAlign: "center",
        marginTop: "50px",
        alignItems: "center",
      }}
    >
      {/*box for top images and two bottons */}
      <Box style={{ marginButtom: "40px", height: "30%" }}>
        <Box
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "70% 30%",
          }}
        >
          <Box
            style={{
              width: "70%",
              alignItems: "center",
              mariginLeft: "400px",
              maxHeight: "300px",
            }}
          >
            <SimpleSlider />
          </Box>
          <Box style={{ width: "30%", marginTop: "50px" }}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/donate"
              style={{ marginTop: "30px", width: "300%", height: "40%" }}
            >
              <FaHandHoldingHeart
                style={{ width: "40%", height: "50%" }}
              ></FaHandHoldingHeart>
              <h3>Donate Now</h3>
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/fundraise"
              style={{ marginTop: "30px", width: "300%", height: "40%" }}
            >
              <FaRegPenToSquare
                style={{ width: "40%", height: "50%" }}
              ></FaRegPenToSquare>
              <h3>Fundraise Now</h3>
            </Button>
          </Box>
        </Box>

        {/*box for divider */}
      </Box>
      <Box style={{ marginTop: "200px", textAlign: "center" }}>
        <Divider variant="middle">
          <Typography variant="h6">Fundraising in progress </Typography>
        </Divider>
      </Box>

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
          <ImageListItem key={item.id}>
            <img src={item.imageurl} alt={item.title} />
            <ImageListItemBar
              title={<Typography variant="h5">{item.storyTitle}</Typography>}
              subtitle={
                <div>
                  <Typography variant="h6">
                    Already Raised: {item.donation} <br />
                    Number of Participant: {item.donationList.length}
                  </Typography>
                </div>
              }
              position="below"
              actionIcon={
                <Button
                  variant="contained"
                  style={{ width: "100%", marginTop: "30px" }}
                  onClick={() => {
                    navigate("/donate/" + item.fundID);
                  }}
                >
                  {" "}
                  Donation
                </Button>
              }
            />
          </ImageListItem>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;
