import React, { useState } from 'react';
import { mockData, mockDonationHistory } from '../component/mockdata';
import { TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, Container, Box, Typography, LinearProgress, Button, FormControl, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { useParams, useNavigate } from 'react-router-dom';
import { unixTimeToDate } from '../utils/converter';
import {ProgressBar} from '../component/Progress';
import DonationTable from '../component/donateTable'

const DonatePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams();
  const [fundRise, setFundRise] = useState(mockData[id]);


  const navigate = useNavigate();


  return (
    <Container style={{  maxWidth: '80%', textAlign: 'center', marginTop: '50px' }}>

      <Box mb={"100px"}>
        <Typography variant='h4' textAlign={'left'} mb={5}>{fundRise.storyTitle}</Typography>

        <Box sx={{display:'flex', alignItems:"center", justifyContent:"space-between"}}>
          <img src={fundRise.imageurl} style={{width:"60%"}}/>
          <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", width:"40%" }}>
            <Typography mb={3} variant='h5' textAlign={"left"}>
              Already Raised:     {fundRise.donation} <br/>
              Number of  Participant: {fundRise.donationList.length}<br/>
              Target Amount:  {fundRise.goal} <br/>
              End Time: {unixTimeToDate(fundRise.deadLine)}
            </Typography>

            <ProgressBar value={Math.round(fundRise.donation/fundRise.goal*100)} width={"40%"} />

              <TextField
                id="outlined-adornment-weight"
                label="Donation Amount"
                type="number"
                endAdornment={<InputAdornment position="end">ETH</InputAdornment>}
                sx={{marginBottom:"30px", width:"40%"}}
              />

            <Button variant="contained" sx={{width:"300px", height:"70px"}} onClick={()=>{navigate('/donate/'+fundRise.fundID)}}> Donation</Button>
          </Box>
        </Box>
      </Box>
  

      <Box sx={{display:'flex', alignItems:"center", justifyContent:"space-between"}}>
        <Typography variant='h6' textAlign={'left'} mb={5}>{fundRise.storyText}</Typography>

        <DonationTable/>
      </Box>
      

    </Container>
  );
};

export default DonatePage;