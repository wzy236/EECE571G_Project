import React, { useEffect, useState } from "react";
import { Button, Alert, Snackbar, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { injected } from "../utils/connectors";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers, Signer, upgrades } from "ethers";

// import Web3ABI from "../../pages/Web3"
// let w3 = new Web3ABI();

export default function MetaMaskAuth() {
  const [userAddress, setUserAddress] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { active, account, library, activate, deactivate } = useWeb3React();
  const [signer, setSigner] = useState();
  const [trustableFundcontract, setTrustableFundContract] = useState();
  const [trustableFundcontractAddr, setTrustableFundContractAddr] =
    useState("");
  const [connectAlert, setConnectAlert] = useState(false);
  const [disconnectAlert, setDisconnectAlert] = useState(false);

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  function handleDeployContract(event) {
    if (!signer) {
      window.alert("no signer");
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

        const address = await TrustableFundContract.getAddress();

        window.alert(`TrustableFund deployed to: ${address}`);

        setTrustableFundContractAddr(address);
      } catch (error) {
        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    deployTrustableFundContract(signer);
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
      setDisconnectAlert(true);
      console.log(disconnectAlert);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
      setConnectAlert(true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function handleCloseConnectAlert() {
    setConnectAlert(false);
  }

  async function handleCloseDisconnectAlert() {
    setDisconnectAlert(false);
  }

  return active ? (
    <>
      <Snackbar
        open={connectAlert}
        autoHideDuration={5000}
        onClose={handleCloseConnectAlert}
      >
        <Alert
          onClose={handleCloseConnectAlert}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully connected with{" "}
          {account.slice(0, 4) + "...." + account.slice(-4)}
        </Alert>
      </Snackbar>
      <Box sx={{ color: "white", display: "flex", flexDirection: "column" }}>
        <Button sx={{ color: "white" }} onClick={disconnect}>
          Disconnect
        </Button>
      </Box>
    </>
  ) : (
    <>
      <Snackbar
        open={disconnectAlert}
        autoHideDuration={5000}
        onClose={handleCloseDisconnectAlert}
      >
        <Alert
          onClose={handleCloseDisconnectAlert}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully disconnected with your wallet.
        </Alert>
      </Snackbar>

      <Button onClick={connect} sx={{ color: "white" }}>
        Connect Wallet
      </Button>
    </>
  );
}
