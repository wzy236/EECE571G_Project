import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box } from '@mui/material';
import { injected } from '../utils/connectors';

import { useWeb3React } from '@web3-react/core';

// import Web3ABI from "../../pages/Web3"
// let w3 = new Web3ABI();

export default function MetaMaskAuth() {
    const [userAddress, setUserAddress] = useState("");
    const [showModal, setShowModal] = useState(false)

    const { active, account, library, connector, activate, deactivate } = useWeb3React()
    const [signer, setSigner] = useState();
    const [greeterContract, setGreeterContract] = useState();
    const [greeterContractAddr, setGreeterContractAddr] = useState('');
    const [greeting, setGreeting] = useState('');
    const [greetingInput, setGreetingInput] = useState('');



    // useEffect(()=> {
    //     if (!library) {
    //       setSigner(undefined);
    //       return;
    //     }
    
    //     setSigner(library.getSigner());
    //   }, [library]);


    
    //   function handleDeployContract(event) {
    
    //     if (greeterContract || !signer) {
    //       return;
    //     }
    
    //     async function deployGreeterContract(signer) {
    //       const Greeter = new ethers.ContractFactory(
    //         GreeterArtifact.abi,
    //         GreeterArtifact.bytecode,
    //         signer
    //       );
    
    //       try {
    //         const greeterContract = await Greeter.deploy('Hello, Hardhat!');
    
    //         await greeterContract.deployed();
    
    //         const greeting = await greeterContract.greet();
    
    //         setGreeterContract(greeterContract);
    //         setGreeting(greeting);
    
    //         window.alert(`Greeter deployed to: ${greeterContract.address}`);
    
    //         setGreeterContractAddr(greeterContract.address);
    //       } catch (error) {
    //         window.alert(
    //           'Error!' + (error && error.message ? `\n\n${error.message}` : '')
    //         );
    //       }
    //     }
    
    //     deployGreeterContract(signer);
    //   }
    


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

                    <Button sx={{color:"white"}}  >deployContract</Button>
                </Box>
            </>
        ) : (
                <Button onClick={connect} sx={{color:"white"}}> Connect Wallet</Button>
        )
    );





}
