'use client';

import Image from 'next/image';

// import mealIcon from '@/assets/icons/meal.png';
// import communityIcon from '@/assets/icons/community.png';
// import eventsIcon from '@/assets/icons/events.png';
// import classes from './page.module.css';
// import "./styles.css";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { styled } from "@mui/material/styles";


import { TimePicker } from '@mui/x-date-pickers/TimePicker';


import { TextFieldProps } from '@mui/material/TextField';


import Alert from '@mui/material/Alert';


import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig"; // ตรวจสอบว่า path ถูกต้อง


// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';


import { useRouter } from 'next/navigation'; // Import useRouter from next/router


import axios, { AxiosError } from 'axios';


import { useState } from 'react';


// import React from 'react';
import { FileUpload, FileUploadProps } from '@/components/FileUpload/FileUpload';


import App from "./App";


import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';




// TODO remove, this demo shouldn't need to reset the theme.
// กำหนดธีมสีเข้ม
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "white",
          },
          "& .MuiInputBase-root": {
            color: "white",
            "& fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
});




const fileUploadProp: FileUploadProps = {
  accept: 'image/*',
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files !== null &&
      event.target?.files?.length > 0
    ) {
      console.log(`Saving ${event.target.value}`)
    }
  },
  onDrop: (event: React.DragEvent<HTMLElement>) => {
    console.log(`Drop ${event.dataTransfer.files[0].name}`)
  },
}




// สร้าง styled component สำหรับ Label แสดงชื่อ Component และประเภทข้อมูล
const Label = styled(({ className, componentName, valueType }: { className?: string, componentName: string, valueType: string }) => (
  <span className={className}>
    <strong>{componentName}</strong> ({valueType})
  </span>
))(({ theme }) => ({
  color: theme.palette.primary.main,
}));


// ฟังก์ชัน renderInput จะรับ params ของ type TextFieldProps จาก @mui/x-date-pickers
const renderTextField = (params: TextFieldProps) => (
  <TextField
    {...params}
    fullWidth  // กำหนดให้เต็มความกว้าง
    sx={{ width: '100%' }} // กำหนดความกว้างให้เท่ากันกับ TextField อื่น
  />
);


// กำหนด function สำหรับ renderInput อย่างถูกต้อง
const renderInput = (params: TextFieldProps) => (
  <TextField
    {...params}
    InputLabelProps={{ style: { color: 'white' } }}
    InputProps={{ style: { color: 'white', borderColor: 'white' } }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
      },
    }}
  />
);


interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  birthday?: string;
  phone_number?: string;
  gender?: string;
  role: string;
}


export default function PostPlay() {


  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');
  const [nameGames, setNameGames] = React.useState('');
  const [detailPost, setDetailPost] = React.useState('');
  const [numPeople, setNumPeople] = React.useState(1);
  const [dateMeet, setDateMeet] = React.useState(dayjs());
  const [timeMeet, setTimeMeet] = React.useState(dayjs());
  const [statusPost, setStatusPost] = React.useState('');
  const [gamesImage, setGamesImage] = React.useState(''); // Base64 image
  const [userId, setUserId] = React.useState(''); // Set userId dynamically


  React.useEffect(() => {
    // Replace with logic to fetch the user ID, e.g., from authentication
    const fetchedUserId = 'example-user-id'; // Example user ID
    setUserId(fetchedUserId);
  }, []);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/postGame', {
        name_games: nameGames,
        detail_post: detailPost,
        num_people: numPeople,
        date_meet: dateMeet.format('MM/DD/YYYY'),
        time_meet: timeMeet.format('HH:mm:ss'),
        status_post: statusPost, // Use user input for status_post
        users_id: userId, // Use the dynamic user ID
        games_image: gamesImage // Use Base64 image
      });
      setAlertMessage('สร้างโพสต์สำเร็จ!');
      setAlertSeverity('success');
      router.push('/sign-in'); // Redirect or refresh after success
    } catch (error) {
      console.error('Error posting game:', error);
      setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
      setAlertSeverity('error');
    }
    setOpenSnackbar(true); // Show notification
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setGamesImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleImageUpload = (file: Blob) => {
    // แปลงไฟล์เป็น Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setGamesImage(base64String); // กำหนด gamesImage เป็น Base64
    };
    reader.readAsDataURL(file);
  };


  interface AppProps {
    onImageUpload: (file: any) => void;
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component="h1" variant="h5">
              สร้างโพสต์นัดเล่น
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nameGames"
                    label="ชื่อโพสต์"
                    value={nameGames}
                    onChange={(e) => setNameGames(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="detailPost"
                    label="รายละเอียดของโพสต์"
                    value={detailPost}
                    onChange={(e) => setDetailPost(e.target.value)}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="numPeople"
                    label="จำนวนคน"
                    value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="วันที่เจอกัน"
                      value={dateMeet}
                      onChange={(newDate) => setDateMeet(newDate ?? dayjs())}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="เวลาที่เจอกัน"
                      value={timeMeet}
                      onChange={(newTime) => setTimeMeet(newTime ?? dayjs())}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="statusPost"
                    label="สถานะโพสต์"
                    value={statusPost}
                    onChange={(e) => setStatusPost(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <App onImageUpload={handleImageUpload} />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: 'white',
                  backgroundColor: 'blue',
                  '&:hover': { backgroundColor: 'darkred' }
                }}
              >
                สร้างโพสต์นัดเล่น
              </Button>
              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
                  {alertMessage}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
