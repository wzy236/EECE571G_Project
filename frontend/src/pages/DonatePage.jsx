import React, { useState, useEffect } from "react";
import { mockDonationHistory } from "../component/mockdata";
import {
  TextField,
  Container,
  Box,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { unixTimeToDate } from "../utils/converter";
import { ProgressBar } from "../component/Progress";
import DonationTable from "../component/donateTable";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

const DonatePage = () => {
  const [amount, setAmount] = useState(0);
  const { id } = useParams();
  const [fundRise, setFundRise] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [donationList, setDonationList] = useState([]);
  const [contract, setContract] = useState();

  const { library } = useWeb3React();

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
    _GetDonateByFund();

    setRefresh(false);
  }, [contract, refresh]);

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

    setFundRise(updateFundList[id]);
  };

  const _GetDonateByFund = async () => {
    const _donationList = await contract.getDonationByFundraise(
      BigInt(parseInt(id))
    );
    console.log(_donationList[0]);
    setDonationList(_donationList[0]);
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!library) {
      alert("please login into your account");
      return;
    }

    try {
      const currentTime = new Date();

      const txn = await contract.donation(
        BigInt(parseInt(id)),
        currentTime.toISOString(),
        { value: ethers.utils.parseEther(amount) }
      );

      await txn.wait();

      console.log(txn);
    } catch (error) {
      window.alert(
        "Error!" + (error && error.message ? `\n\n${error.message}` : "")
      );
    }

    alert("finished");

    setRefresh(true);
  };

  return (
    <Container sx={{ maxWidth: "80%", textAlign: "center", marginTop: "50px" }}>
      {fundRise ? (
        <>
          <Box mb={"100px"}>
            <Typography variant="h4" textAlign={"left"} mb={5}>
              {fundRise.storyTitle}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <img src={fundRise.imageurl} style={{ width: "60%" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "40%",
                }}
              >
                <Typography mb={3} variant="h5" textAlign={"left"}>
                  Already Raised: {fundRise.donation} <br />
                  Number of Participant: {fundRise.donationList.length}
                  <br />
                  Target Amount: {fundRise.goal} <br />
                  End Time: {unixTimeToDate(fundRise.deadLine)}
                </Typography>

                <ProgressBar
                  value={Math.round((fundRise.donation / fundRise.goal) * 100)}
                  width={"60%"}
                />

                <TextField
                  id="outlined-adornment-weight"
                  label="Donation Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">ETH</InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: "30px", width: "40%" }}
                />

                <Button
                  variant="contained"
                  sx={{ width: "300px", height: "70px" }}
                  onClick={handleDonate}
                >
                  {" "}
                  Donate
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              alignItems: "start",
            }}
            mb={"50px"}
          >
            <Typography variant="h6" textAlign={"left"} mb={5}>
              {fundRise.storyText}
            </Typography>
            <Box sx={{ width: "800px" }}>
              <DonationTable data={donationList} />
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default DonatePage;
