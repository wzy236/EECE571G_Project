import React, { useState, useEffect } from 'react';
import { mockData } from '../component/mockdata';
import {List, ListItem, useMediaQuery , Container, Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import {ProgressBar} from '../component/Progress';
import TrustableFundArtifact from '../contracts/TrustableFund.sol/TrustableFund.json'
import { useWeb3React } from '@web3-react/core';
import { ethers} from 'ethers';
import { unixTimeToDate } from './DonateListPage';

const FundraisingProjectPage = () => {

  const { library} = useWeb3React()
  const [fundRaiseList, setFundList] = useState([]);
  const [contract, setContract] = useState();
  const navigate = useNavigate();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");

  const [refresh, setRefresh] = useState(false);

  const address='0x4AfEC11A9E24462E87cf33D8CB3C5f2B69018166'

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
    _GetFundraiseList()
    setRefresh(false);
  }, [contract, refresh]);

  const _GetFundraiseList = async ()=>{
    const fundRaiseList = await contract.getFundraiseByUser(); 
    //add update the bigint into number
    const updateFundRaiseList= fundRaiseList[0].map(f=>({
      ownerAddress: f.ownerAddress,
      fundID: Number(f.fundID),
      goal: parseFloat(ethers.utils.formatEther(f.goal)),
      donation: parseFloat(ethers.utils.formatEther(f.donation)),
      donationList: f.donationList,
      deadLine: Number(f.deadLine),
      storyTitle: f.storyTitle,
      storyText: f.storyText,
      imageurl: f.imageurl,
      active: f.active
    }));
    console.log(updateFundRaiseList);
    setFundList(updateFundRaiseList);
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

  const handleOpenWithdrawDialog = () => {
    setOpenWithdrawDialog(true);
  };
  
  const handleCloseWithdrawDialog = () => {
    setOpenWithdrawDialog(false);
  };
  
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };
  
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const withdrawFunds = async (e) => {
    e.preventDefault();
    if (!library) {
      alert("Please log in to your account.");
      return;
    }
    
    try {
      console.log("Start withdrawing funds...");

      setProgressMessage("Withdrawing funds... Please wait.");
      setIsProgressOpen(true);

      const txn = await contract.withdrawFundraise();
      await txn.wait();

      console.log("Funds withdrawn:", txn);

      handleCloseWithdrawDialog();
    } catch (error) {
      window.alert(
        "Error!" + (error && error.message ? `\n\n${error.message}` : "")
      );
    }
    setIsProgressOpen(false);
    alert("Funds have been withdrawn");
    setRefresh(true);
  };

  const cancelFundraise = async (e) => {
    e.preventDefault();
    if (!library) {
      alert("Please log in to your account.");
      return;
    }
    
    try {
      console.log("Start canceling fundraise...");

      setProgressMessage("Canceling fundraising project... Please wait.");
      setIsProgressOpen(true);

      const currentTime = new Date();

      const txn = await contract.cancelFundraise(
        currentTime.toISOString()
      );
      await txn.wait();

      console.log("Fundraise canceled:", txn);

      handleCloseCancelDialog();
    } catch (error) {
      window.alert(
        "Error!" + (error && error.message ? `\n\n${error.message}` : "")
      );
    }
    setIsProgressOpen(false);
    alert("Fundraising project has been canceled")
    setRefresh(true);
  };


  return (
    <Container style={{ maxWidth: '80%', textAlign: 'center', marginTop: '50px' }}>
      <List>
        {fundRaiseList.map(item => (
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
                  Number of Participants: {item.donationList.length}
                </Typography>

                <ProgressBar value={Math.round(item.donation/item.goal*100)} width={"60%"} />

                {!item.active ? (
                  <Button variant="outlined" sx={{width:"200px"}} disabled>Fundraising Closed</Button>
                ) :(
                  // Withdraw and Cancel button
                  <>
                  {/* Only allow withdraw funds if goal has reached or deadline has passed */}
                  {!(item.donation < item.goal && new Date() < new Date(item.deadLine * 1000)) && (
                    <div>
                      <Button variant="contained" sx={{width:"200px", marginBottom: '20px'}}
                      onClick={handleOpenWithdrawDialog}> Withdraw Funds</Button>
                      <Dialog
                        fullScreen={fullScreen}
                        open={openWithdrawDialog}
                        onClose={handleCloseWithdrawDialog}
                        aria-labelledby="responsive-dialog-withdraw-title"
                      >
                        <DialogTitle id="responsive-dialog-withdraw-title">{"Confirm Withdrawal?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                          Are you sure you want to withdraw the funds? This action cannot be undone.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={withdrawFunds} color="primary">
                            Yes
                          </Button>
                          <Button onClick={handleCloseWithdrawDialog} color="primary" autoFocus>
                            No
                          </Button>
                        </DialogActions>
                      </Dialog>
                  </div>
                )}

                <div>
                    <Button variant="contained" sx={{width:"200px"}} onClick={handleOpenCancelDialog}> Cancel Fundraise </Button>
                    <Dialog
                      fullScreen={fullScreen}
                      open={openCancelDialog}
                      onClose={handleCloseCancelDialog}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">{"Are you sure you want to delete this fundraising project?"}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                        The funds already raised will be refunded to each donors&#39; MetaMask account.
                        Please note that this action cannot be undone.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button autoFocus onClick={cancelFundraise} color="primary">
                          Yes
                        </Button>
                        <Button onClick={handleCloseCancelDialog} color="primary" autoFocus>
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
                </div>

                <Dialog
                  fullScreen={fullScreen}
                  open={isProgressOpen}
                  onClose={() => setIsProgressOpen(false)}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="progress-dialog-title">Transaction in Progress</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                    {progressMessage}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                  </DialogActions>
                </Dialog>

                </>
                )}

              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FundraisingProjectPage;