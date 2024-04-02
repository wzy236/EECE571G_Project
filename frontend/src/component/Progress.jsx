import { TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, Container, Box, Typography, LinearProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));

export function ProgressBar(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection:"row", justifyContent:'center', width: props.width}} mb={10}>
            <Box sx={{ width: "100%", mr: 1 }}>
            <BorderLinearProgress  variant="determinate" value={props.value}/>
            </Box>
            <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${props.value}%`}</Typography>
            </Box>
        </Box>
    );
  }

