import { useState, useEffect } from "react";
import {
  Container,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  CircularProgress,
  IconButton,
  styled
} from "@mui/material";
import {useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TrustableFundArtifact from "../contracts/TrustableFund.sol/TrustableFund.json";
import { useWeb3React } from "@web3-react/core";
import { ethers, Signer } from "ethers";
import React from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FundraisePage = () => {
  const { library } = useWeb3React();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(0);

  const [contract, setContract] = useState();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const navigate = useNavigate();

  //use the old address to test 0x4C613BC930360fb932379286b033CDe2329DC75F
  const address = "0x4AfEC11A9E24462E87cf33D8CB3C5f2B69018166"; //new one: 0x4AfEC11A9E24462E87cf33D8CB3C5f2B69018166

  const [uploadedImage, setUploadedImage] = useState(null);
  const ipfs = ipfsHttpClient({
    url: "http://127.0.0.1:5001/"
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // validate file type
    if (!file.type.startsWith("image/")) {
      return alert("Please select an image file");
    }
    try {
      const result = await ipfs.add(file);
      setUploadedImage({
        cid: result.cid,
        path: result.path,
      });
      setImage("https://ipfs.io/ipfs/" + result.path); //set image url
    } catch (error) {
      console.error("IPFS upload failed:", error);
      alert("Failed to upload the image to IPFS. Please ensure that your local IPFS Daemon is running, or use a direct URL to upload your image.");
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null); // Clear uploaded image url
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!library) {
      alert("please login into your account");
      return;
    }

    console.log("Start publishing fundraise");
    setIsProgressOpen(true);
  
    try {
      const txn = await contract.publishFundraise(
        ethers.utils.parseEther(amount),
        title,
        description,
        image,
        Math.floor(date / 1000)
      );
      const receipt = await txn.wait();

      console.log(receipt);

      const fundID = receipt.events?.filter((x) => x.event === "CreateFundSuccess")[0]?.args?.fundID;
      if (fundID) {
        alert("Fundraise has been created successfully.");
        navigate(`/donate/${fundID}`);
      } else {
        console.error(`Fund ID not found in the transaction receipt. ${receipt}`);
      }
      
    } catch (e) {
      alert("You have already have one openning Fundraise.");
    } finally {
      setIsProgressOpen(false);
    }    
  };

  // setting for upload button, copy by MUI Core
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

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
          {/* upload button will be replaced by the uploaded image */}
          {uploadedImage? (
            <div className="container">
              <div className="data">
                <img
                  className="image"
                  alt={`Uploaded`}
                  src={"https://ipfs.io/ipfs/" + uploadedImage.path}
                  style={{ maxWidth: "400px", height: "150px", width: "150px"}}
                />
                <IconButton aria-label="delete" onClick={handleRemoveImage}> {/* Button to remove uploaded image */}
                  <DeleteIcon />
                </IconButton>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h5 style={{ marginRight: "10px" }}>IPFS Url for your image:</h5>
                  <a href={"https://ipfs.io/ipfs/" + uploadedImage.path}>
                    <h6>{"https://ipfs.io/ipfs/" + uploadedImage.path}</h6>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="container">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload your image
                  <VisuallyHiddenInput type="file" name="file" accept="image/*" onChange={handleFileChange}/>
                </Button>
                {/* <input id="file-upload" type="file" name="file" accept="image/*" onChange={handleFileChange} /> */}
                {/* second option to upload image */}
                <TextField
                  label="Or you can input your Image Url"
                  fullWidth
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
            </div>
            
          )}

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
               //limite the date must be after now
                disablePast
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

      <Dialog
        fullScreen={fullScreen}
        open={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="progress-dialog-title">
          Publishing in Progress
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50px">
            <CircularProgress />
          </Box>
          <DialogContentText>Publishing...Please wait.</DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Container>
  );
};

export default FundraisePage;
