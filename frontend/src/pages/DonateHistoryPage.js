import React, { useState, useEffect } from 'react';
import {  mockDonationHistory } from '../component/mockdata';
import { TextField,  Container, Box, Typography, Button,  InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DonationHistory from '../component/donateHistory';
import TrustableFundArtifact from '../contracts/TrustableFund.sol/TrustableFund.json'
import { useWeb3React } from '@web3-react/core';
import { ethers} from 'ethers';


const DonateHistoryPage = () => {

  const [refresh, setRefresh] = useState(false);
  const [donationHistory, setDonationHistory] = useState([]);
  const [contract, setContract] = useState();

  const { library} = useWeb3React();
  
  const address='0x4C613BC930360fb932379286b033CDe2329DC75F';


  useEffect(()=> {
    if (!library) {
      return;
    }
    setContract(new ethers.Contract(address, TrustableFundArtifact.abi, library.getSigner()));
  }, [library]);

  useEffect(()=> {
    if (!contract) {
      return;
    }
    _GetDonationHistoryByUser();

    setRefresh(false);
    
  }, [contract, refresh]);

  const _GetDonationHistoryByUser = async ()=>{
    const _donationHistory = await contract.getDonationHistoryByUser(); 
  //   const _modifiedDonationHistory = _donationHistory[0].map(async item => {
  //     const fundTitle = await contract.getFundTitle(item.fundID);
  //     return { ...item, fundTitle };
  // });
    const _modifiedDonationHistory = _donationHistory[0].map(item => ({
      ...item,
      fundTitle: 'Your Fund Title', // Replace 'Your Fund Title' later
    }));
    console.log(_donationHistory[0])
    setDonationHistory(_modifiedDonationHistory)
  };

  return (
    <Container sx={{  maxWidth: '80%', textAlign: 'center', marginTop: '50px' }}>
      {donationHistory?(
        <>
              <DonationHistory data={donationHistory}/>
        </>
      ):(<></>)}
      

    </Container>
  );
};

export default DonateHistoryPage;