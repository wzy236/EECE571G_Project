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
import DonationHistory from "../component/donateHistory";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

const DonateHistoryPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [donationHistory, setDonationHistory] = useState([]);
  const [contract, setContract] = useState();

  const { library , account } = useWeb3React();

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
  }, [library , account]);

  useEffect(() => {
    if (!contract) {
      return;
    }
    _GetDonationHistoryByUser();

    setRefresh(false);
  }, [contract, refresh]);

  const _GetDonationHistoryByUser = async () => {
    const _donationHistory = await contract.getDonationHistoryByUser();
    const _modifiedDonationHistory = await Promise.all(_donationHistory[0].map(async (item) => {
      const fundTitle = await contract.getFundTitle(item.fundID);
      console.log(fundTitle);
      return { ...item, fundTitle };
    }));
    console.log(_donationHistory[0]);
    setDonationHistory(_modifiedDonationHistory);
  };

  return (
    <Container sx={{ maxWidth: "80%", textAlign: "center", marginTop: "50px" }}>
      {donationHistory ? (
        <>
          <DonationHistory data={donationHistory} />
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default DonateHistoryPage;
