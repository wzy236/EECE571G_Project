import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box } from '@mui/material';
import { injected } from '../utils/connectors';
import TrustableFundArtifact from '../contracts/TrustableFund.sol/TrustableFund.json'
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';

// import Web3ABI from "../../pages/Web3"
// let w3 = new Web3ABI();

export default function MetaMaskAuth() {
    const [userAddress, setUserAddress] = useState("");
    const [showModal, setShowModal] = useState(false)

    const { active, account, library, activate, deactivate } = useWeb3React()
    const [signer, setSigner] = useState();
    const [trustableFundcontract, setTrustableFundContract] = useState();
    const [trustableFundcontractAddr, setTrustableFundContractAddr] = useState('');

    


    useEffect(()=> {
        if (!library) {
          setSigner(undefined);
          return;
        }
    
        setSigner(library.getSigner());
      }, [library]);


    

      function handleDeployContract(event) {
    
        if (!signer) {
          window.alert("no signer")
          return;
        }
    
        async function deployTrustableFundContract() {


          const TrustableFund = new ethers.ContractFactory(
            TrustableFundArtifact.abi,
            TrustableFundArtifact.bytecode,
            signer
          );
    
          try {


            const TrustableFundContract = await TrustableFund.deploy();
    
            const address=await TrustableFundContract.getAddress();
    
            

            window.alert(`TrustableFund deployed to: ${address}`);
    
            setTrustableFundContractAddr(address);
          } catch (error) {
            window.alert(
              'Error!' + (error && error.message ? `\n\n${error.message}` : '')
            );
          }
        }
    
        deployTrustableFundContract(signer);
      }
    


    async function disconnect() {
        try {
          deactivate()
          localStorage.setItem('isWalletConnected', false)
        } catch (ex) {
          console.log(ex)
        }
      }



 

    async function connect() {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }

    
    return (
        active ? (
            <>
                <Box sx={{color:"white", display:"flex", flexDirection:"column"}}>
                    <Button sx={{color:"white"}} onClick={connect}>
                        Connected with {account.slice(0,4)+ "...."+ account.slice(-4)}
                    </Button>
                    <div>My Account</div>

                    <Button sx={{color:"white"}} onClick={disconnect} >Disconnect</Button>

                    <Button sx={{color:"white"}} onClick={handleDeployContract}  >deployContract</Button>
                </Box>
            </>
        ) : (
                <Button onClick={connect} sx={{color:"white"}}> Connect Wallet</Button>
        )
    );





}
