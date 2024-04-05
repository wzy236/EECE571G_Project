import { useState, useEffect } from "react";
import {
  Container,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { ethers, Signer } from "ethers";
import React from "react";

const FundraisePage = () => {
  const { library } = useWeb3React();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(0);

  const [contract, setContract] = useState();

  const address = "0x4AfEC11A9E24462E87cf33D8CB3C5f2B69018166";

  useEffect(() => {
    if (!library) {
      return;
    }
    const providers = new ethers.providers.Web3Provider(window.ethereum);

    setContract(
      new ethers.Contract(
        address,
        TrustableFundArtifact.abi,
        providers.getSigner()
      )
    );
  }, [library]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!library) {
      alert("please login into your account");
      return;
    }

    const _PublishFundraise = async () => {
      try {
        await contract.publishFundraise(
          ethers.utils.parseEther(amount),
          title,
          description,
          image,
          Math.floor(date / 1000)
        );
      } catch (e) {
        alert(e.data.message);
      }
    };

    _PublishFundraise();
  };

  return (
    <Container sx={{ maxWidth: "80%", textAlign: "start", marginTop: "50px" }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextField
            label="Image Url"
            fullWidth
            value={image}
            onChange={(e) => setImage(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "300px 600px",
              gridRowGap: "50px",
            }}
            my={"50px"}
          >
            <Typography variant="h6" marginY={"auto"}>
              {" "}
              Input your target amount:{" "}
            </Typography>
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
              sx={{ width: "200px" }}
            />

            <Typography variant="h6" marginY={"auto"}>
              {" "}
              Choose your end date:{" "}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem", width: "200px", height: "50px" }}
          >
            Post
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default FundraisePage;
