import React, { useState } from 'react';
import { mockData } from '../component/mockdata';
import { TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, Container, Box, Typography, LinearProgress, Button } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import {ProgressBar} from '../component/Progress';


const DonateListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(mockData);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredItems =  mockData.filter(item =>
      item.storyTitle.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setItems(filteredItems);
  };


  const unixTimeToDate=(unixTime)=> {
    // Multiply Unix time by 1000 to convert from seconds to milliseconds
    const milliseconds = unixTime * 1000;
    
    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);
    
    // Use any method to get the desired date format
    // For example, using toLocaleString() to get the date in the local time zone
    return date.toLocaleDateString(); // Adjust format as needed
  }


  return (
    <Container style={{ maxWidth: '80%', textAlign: 'center', marginTop: '50px' }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <List>
        {items.map(item => (
          <ListItem key={item.id} sx={{height:"400px", alignItems:"center"}}>
            <Box sx={{width:"100%", display:"grid", gridTemplateColumns:"30% 30% 40%", height:"300px"}}>
              <img src={item.imageurl} style={{width:"100%", height:"100%"}}/>
              <Box sx={{display:"flex", justifyContent:"space-between", padding:"40px", flexDirection:"column"}}>
                <Typography variant="h5">
                {item.storyTitle}
                </Typography>
                <Typography variant="h6">
                Target Amount:  {item.goal} <br/>
                End Time: {unixTimeToDate(item.deadLine)}
                </Typography>
              </Box>
              
              <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", paddingLeft:"20px", flexDirection:"column", }}>
                <Typography mb={3}>
                  Already Raised:  {item.donation} <br/>
                  Number of  Participant: {item.donationList.length}
                </Typography>

                <ProgressBar value={Math.round(item.donation/item.goal*100)} width={"60%"} />
                <Button variant="contained" sx={{width:"200px"}} onClick={()=>{navigate('/donate/'+item.fundID)}}> Donation</Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default DonateListPage;