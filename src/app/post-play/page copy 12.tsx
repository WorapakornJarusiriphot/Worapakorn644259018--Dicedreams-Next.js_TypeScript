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

import locationImage from './location.png';

// import {
//   FormControl,
//   FormControlLabel,
//   Checkbox,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material";
// import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
// import Button from "@mui/material/Button";
// import dayjs from "dayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel, MenuItem, Modal, Select } from "@mui/material";
// import { useState } from 'react';
import InputAdornment from "@mui/material/InputAdornment";
// import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
// import { DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";


// import jwtDecode from 'jwt-decode';

import { jwtDecode } from "jwt-decode";

// import { JwtPayload } from 'jsonwebtoken';

import { JwtPayload } from 'jwt-decode';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';


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

interface PostData {
  nameGames: string;
  detailPost: string;
  numPeople: number;
  dateMeet: dayjs.Dayjs;
  timeMeet: dayjs.Dayjs;
  gamesImage: string;
}

const initialValues: PostData = {
  nameGames: '',
  detailPost: '',
  numPeople: 0,
  dateMeet: dayjs(),
  timeMeet: dayjs(),
  gamesImage: '',
};

const validationSchema = Yup.object().shape({
  nameGames: Yup.string().required('กรุณากรอกชื่อโพสต์'),
  detailPost: Yup.string().required('กรุณากรอกรายละเอียดของโพสต์'),
  numPeople: Yup.number().min(1, 'กรุณาเลือกจำนวนผู้เล่น').required('กรุณาเลือกจำนวนผู้เล่น'),
  dateMeet: Yup.date().required('กรุณาเลือกวันที่เจอกัน').test('dateMeet', 'เลือกวันที่เจอกันต้องไม่เป็นอดีต', function (value) {
    return dayjs(value).isAfter(dayjs(), 'day');
  }),
  timeMeet: Yup.date().required('กรุณาเลือกเวลาที่เจอกัน').test('timeMeet', 'เลือกเวลาที่เจอกันต้องไม่เป็นอดีต', function (value) {
    return dayjs(value).isAfter(dayjs());
  }),
  gamesImage: Yup.mixed().required('กรุณาอัพโหลดรูปภาพด้วย')
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

// กำหนดประเภทของฟังก์ชัน handleWordLimit
const handleWordLimit = (text: string, limit: number): string => {
  const words = text.split(/\s+/);
  if (words.length > limit) {
    return words.slice(0, limit).join(' ');
  }
  return text;
};

export default function PostPlay() {

  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');
  const [nameGames, setNameGames] = React.useState('');
  const [detailPost, setDetailPost] = React.useState('');
  const [numPeople, setNumPeople] = React.useState(2);
  const [dateMeet, setDateMeet] = React.useState(dayjs());
  const [timeMeet, setTimeMeet] = React.useState(dayjs());
  const [statusPost, setStatusPost] = React.useState('');
  const [gamesImage, setGamesImage] = React.useState(''); // Base64 image
  const [userId, setUserId] = React.useState(''); // Set userId dynamically

  const [googleMapLink, setGoogleMapLink] = useState('');

  const [fullImageOpen, setFullImageOpen] = useState(false); // State for the modal

  // const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   const newText = handleWordLimit(event.target.value, 20);
  //   setNameGames(newText);
  // };

  // const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   const newText = handleWordLimit(event.target.value, 50);
  //   setDetailPost(newText);
  // };

  // Function to limit the text input
  const limitText = (text: string, limit: number): string => {
    return text.slice(0, limit);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNameGames(limitText(event.target.value, 100)); // Limit to 100 characters
  };

  const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDetailPost(limitText(event.target.value, 500)); // Limit to 500 characters
  };


  // React.useEffect(() => {
  //   // ดึงข้อมูลผู้ใช้จากฐานข้อมูลหลังจากที่ผู้ใช้เข้าสู่ระบบ
  //   const fetchUserId = async () => {
  //     try {
  //       const response = await axios.get('https://dicedreams-backend-deploy-to-render.onrender.com/api/auth/me', {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('access_token')}`
  //         }
  //       });
  //       setUserId(response.data.users_id);
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   };

  //   fetchUserId();
  // }, []);


  // React.useEffect(() => {
  //   // สมมติว่า JWT เก็บไว้ใน LocalStorage หลังจากผู้ใช้เข้าสู่ระบบ
  //   const token = localStorage.getItem('jwtToken');
  //   if (token) {
  //     const decoded: { users_id: string } = jwtDecode(token); // ถอดรหัส JWT เพื่อรับข้อมูลผู้ใช้
  //     setUserId(decoded.users_id); // ใช้ `users_id` จาก JWT
  //   }
  // }, []);


  React.useEffect(() => {
    // กำหนดประเภทของข้อมูลใน JWT
    interface DecodedToken extends JwtPayload {
      users_id: string;
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        // แปลงโทเค็นเป็นประเภท DecodedToken
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);
        setUserId(decoded.users_id); // ตั้งค่า userId
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('JWT Token is missing');
    }
  }, []);


  React.useEffect(() => {
    if (location) {
      setGoogleMapLink(`https://www.google.com/maps/place/Outcast+Gaming/@13.819525,99.9742148,12z/data=!4m19!1m12!4m11!1m3!2m2!1d100.0641653!2d13.8180247!1m6!1m2!1s0x30e2e58a2b199583:0x4cac0a358181f29!2zNDMgNSDguJYuIOC4o-C4suC4iuC4lOC4s-C5gOC4meC4tOC4mSDguJXguLPguJrguKXguJ7guKPguLDguJvguJDguKHguYDguIjguJTguLXguKLguYwg4LmA4Lih4Li34Lit4LiHIOC4meC4hOC4o-C4m-C4kOC4oSA3MzAwMA!2m2!1d100.0566166!2d13.8195387!3m5!1s0x30e2e58a2b199583:0x4cac0a358181f29!8m2!3d13.8195387!4d100.0566166!16s%2Fg%2F11tt2sj6yd?entry=ttu`);
    }
  }, []);



  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', {
  //       name_games: nameGames,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_meet: dateMeet.format('MM/DD/YYYY'),
  //       time_meet: timeMeet.format('HH:mm:ss'),
  //       // status_post: statusPost, // Use user input for status_post
  //       status_post: 'active', // Fixed status_post to 'active'
  //       users_id: userId, // Use the dynamic user ID
  //       games_image: gamesImage // Use Base64 image
  //     });
  //     setAlertMessage('สร้างโพสต์สำเร็จ!');
  //     setAlertSeverity('success');
  //     router.push('/sign-in'); // Redirect or refresh after success
  //   } catch (error) {
  //     console.error('Error posting game:', error);
  //     setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // Show notification
  // };

  // // ฟังก์ชัน handleSubmit ถูกเรียกใช้เมื่อมีการส่งฟอร์มเพื่อสร้างโพสต์
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // รับ JWT จากที่ที่คุณเก็บข้อมูลไว้ (เช่น Local Storage)
  //   const token = localStorage.getItem('jwtToken');

  //   // กำหนดค่า Authorization header ในคำขอ axios
  //   try {
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', {
  //       name_games: nameGames,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_meet: dateMeet.format('MM/DD/YYYY'),
  //       time_meet: timeMeet.format('HH:mm:ss'),
  //       status_post: 'active',
  //       users_id: userId,
  //       games_image: gamesImage,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}` // แนบ JWT ในรูปแบบ Bearer token
  //       }
  //     });

  //     setAlertMessage('สร้างโพสต์สำเร็จ!');
  //     setAlertSeverity('success');
  //     router.push('/sign-in'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //   } catch (error) {
  //     console.error('Error posting game:', error);
  //     setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // แสดงการแจ้งเตือน
  // };


  //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();

  //     // รับ JWT จากที่ที่คุณเก็บข้อมูลไว้ (เช่น Local Storage)
  //     const token = localStorage.getItem('jwtToken');

  //     // ตรวจสอบว่ามี token หรือไม่
  //     if (!token) {
  //         console.error('JWT token is missing');
  //         setAlertMessage('การสร้างโพสต์ไม่สำเร็จ: ไม่มี token การตรวจสอบสิทธิ์');
  //         setAlertSeverity('error');
  //         setOpenSnackbar(true);
  //         return;
  //     }

  //     // กำหนดค่า Authorization header ในคำขอ axios
  //     try {
  //         const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', {
  //             name_games: nameGames,
  //             detail_post: detailPost,
  //             num_people: numPeople,
  //             date_meet: dateMeet.format('MM/DD/YYYY'),
  //             time_meet: timeMeet.format('HH:mm:ss'),
  //             status_post: 'active',
  //             users_id: userId,
  //             games_image: gamesImage,
  //         }, {
  //             headers: {
  //                 Authorization: `Bearer ${token}` // แนบ JWT ในรูปแบบ Bearer token
  //             }
  //         });

  //         setAlertMessage('สร้างโพสต์สำเร็จ!');
  //         setAlertSeverity('success');
  //         router.push('/sign-in'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //     } catch (error) {
  //         console.error('Error posting game:', error);
  //         setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //         setAlertSeverity('error');
  //     }
  //     setOpenSnackbar(true); // แสดงการแจ้งเตือน
  // };


  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // ดึง JWT token จาก localStorage
  //   const token = localStorage.getItem('jwtToken');

  //   // ตรวจสอบว่ามี token หรือไม่
  //   if (!token) {
  //     console.error('JWT token is missing');
  //     setAlertMessage('การสร้างโพสต์ไม่สำเร็จ: ไม่มี token การตรวจสอบสิทธิ์');
  //     setAlertSeverity('error');
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   try {
  //     // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
  //     await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', {
  //       name_games: nameGames,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_meet: dateMeet.toISOString().split('T')[0],
  //       time_meet: timeMeet.toString().split(' ')[0],
  //       status_post: 'active',
  //       games_image: gamesImage,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     setAlertMessage('สร้างโพสต์สำเร็จ!');
  //     setAlertSeverity('success');
  //     router.push('/sign-in'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //   } catch (error) {
  //     console.error('Error posting game:', error);
  //     setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // แสดงการแจ้งเตือน
  // };


  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // รับ JWT token จาก localStorage
  //   const token = localStorage.getItem('jwtToken');

  //   // ตรวจสอบว่ามี token หรือไม่
  //   if (!token) {
  //     console.error('JWT token is missing');
  //     setAlertMessage('ไม่มี JWT token กรุณาเข้าสู่ระบบก่อน');
  //     setAlertSeverity('error');
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   try {
  //     // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
  //     await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', {
  //       name_games: nameGames,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_meet: dateMeet.format('YYYY-MM-DD'),
  //       time_meet: timeMeet.format('HH:mm:ss'),
  //       status_post: 'active',
  //       games_image: gamesImage,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     setAlertMessage('สร้างโพสต์สำเร็จ!');
  //     setAlertSeverity('success');
  //     router.push('/sign-in'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //   } catch (error) {
  //     console.error('Error posting game:', error);
  //     setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // แสดงการแจ้งเตือน
  // };


  // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   // ดึง JWT token จาก local storage
  //   const token = localStorage.getItem('access_token');

  //   // ตรวจสอบว่ามี token หรือไม่
  //   if (!token) {
  //     console.error('JWT token is missing');
  //     setAlertMessage('ไม่พบ JWT token กรุณาเข้าสู่ระบบอีกครั้ง');
  //     setAlertSeverity('error');
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   try {
  //     // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
  //     await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', {
  //       name_games: nameGames,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_meet: dateMeet.format('YYYY-MM-DD'),
  //       time_meet: timeMeet.format('HH:mm:ss'),
  //       status_post: 'active',
  //       games_image: gamesImage,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     setAlertMessage('สร้างโพสต์สำเร็จ!');
  //     setAlertSeverity('success');
  //     router.push('/sign-in'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //   } catch (error) {
  //     console.error('Error posting game:', error);
  //     setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // แสดงการแจ้งเตือน
  // }


  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // รับ JWT token จาก local storage
  //   const token = localStorage.getItem('access_token');

  //   // ตรวจสอบและแสดง `users_id`
  //   console.log('users_id:', userId);

  //   // ตรวจสอบว่ามี token หรือไม่
  //   if (!token) {
  //     console.error('JWT token is missing');
  //     setAlertMessage('ไม่พบ JWT token กรุณาเข้าสู่ระบบอีกครั้ง');
  //     setAlertSeverity('error');
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   // สร้างรูปแบบข้อมูลที่เหมือนกับที่ใช้ใน Postman
  //   const data = {
  //     name_games: nameGames,
  //     detail_post: detailPost,
  //     num_people: numPeople,
  //     date_meet: dateMeet.format('MM/DD/YYYY'),
  //     time_meet: timeMeet.format('HH:mm:ss'),
  //     status_post: 'active',
  //     users_id: userId, // ตรวจสอบว่า userId ถูกต้อง
  //     games_image: gamesImage // ตรวจสอบรูปแบบ Base64
  //   };

  //   try {
  //     // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', data, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.status === 200) {
  //       setAlertMessage('สร้างโพสต์สำเร็จ!');
  //       setAlertSeverity('success');
  //       router.push('/sign-in'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //     } else {
  //       setAlertMessage(`การสร้างโพสต์ไม่สำเร็จ: ได้รับสถานะ ${response.status}`);
  //       setAlertSeverity('error');
  //     }
  //   } catch (error: any) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       console.error('Error response:', error.response);
  //       setAlertMessage(`สร้างโพสต์ไม่สำเร็จ: ${error.response.data.message || 'เกิดข้อผิดพลาด'}`);
  //     } else {
  //       console.error('Unknown error:', error);
  //       setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
  //     }
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // แสดงการแจ้งเตือน
  // };




  const handleSubmit = async (values: PostData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setAlertMessage('ไม่พบ JWT token กรุณาเข้าสู่ระบบอีกครั้ง');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      setSubmitting(false);
      return;
    }

    const data = {
      name_games: values.nameGames,
      detail_post: values.detailPost,
      num_people: values.numPeople,
      date_meet: values.dateMeet.format('MM/DD/YYYY'),
      time_meet: values.timeMeet.format('HH:mm:ss'),
      status_post: 'active',
      users_id: userId,
      games_image: values.gamesImage
    };

    try {
      const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setAlertMessage('สร้างโพสต์สำเร็จ!');
        setAlertSeverity('success');
        router.push('/'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
      } else {
        setAlertMessage(`การสร้างโพสต์ไม่สำเร็จ: ได้รับสถานะ ${response.status}`);
        setAlertSeverity('error');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setAlertMessage(`สร้างโพสต์ไม่สำเร็จ: ${error.response.data.message || 'เกิดข้อผิดพลาด'}`);
      } else {
        setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
      }
      setAlertSeverity('error');
    }
    setOpenSnackbar(true);
    setSubmitting(false);
  };

  const handleImageUpload = (file: File, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    if (!(file instanceof File)) {
      console.error('The uploaded file is not of the expected type File.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFieldValue('gamesImage', base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleImageClick = () => {
    setFullImageOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setFullImageOpen(false); // Close the modal
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <br />
            <br />
            <Typography component="h1" variant="h5">
              สร้างโพสต์นัดเล่น
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="ชื่อโพสต์"
                        name="nameGames"
                        value={values.nameGames}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={touched.nameGames && errors.nameGames}
                        error={touched.nameGames && Boolean(errors.nameGames)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="รายละเอียดของโพสต์"
                        name="detailPost"
                        value={values.detailPost}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={touched.detailPost && errors.detailPost}
                        error={touched.detailPost && Boolean(errors.detailPost)}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="number-select-label">จำนวนผู้เล่นที่จะนัดเจอกัน *</InputLabel>
                        <Select
                          labelId="number-select-label"
                          name="numPeople"
                          value={values.numPeople}
                          label="จำนวนผู้เล่นที่จะนัดเจอกัน"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.numPeople && Boolean(errors.numPeople)}
                        >
                          {Array.from({ length: 74 }, (_, index) => (
                            <MenuItem key={index + 2} value={index + 2}>
                              {index + 2}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.numPeople && errors.numPeople && (
                          <Alert severity="error">{errors.numPeople}</Alert>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker', 'TimePicker']}>
                          <DemoItem label={'เลือกวันที่เจอกัน *'}>
                            <DatePicker
                              name="dateMeet"
                              value={values.dateMeet}
                              onChange={(newDate) => setFieldValue('dateMeet', newDate)}
                              onBlur={handleBlur}
                              error={touched.dateMeet && Boolean(errors.dateMeet)}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            {touched.dateMeet && errors.dateMeet && (
                              <Alert severity="error">{errors.dateMeet}</Alert>
                            )}
                          </DemoItem>
                          <DemoItem label={'เลือกเวลาที่เจอกัน *'}>
                            <TimePicker
                              name="timeMeet"
                              value={values.timeMeet}
                              onChange={(newTime) => setFieldValue('timeMeet', newTime)}
                              onBlur={handleBlur}
                              error={touched.timeMeet && Boolean(errors.timeMeet)}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            {touched.timeMeet && errors.timeMeet && (
                              <Alert severity="error">{errors.timeMeet}</Alert>
                            )}
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <DemoItem
                        label={'รูปภาพ *'}
                      >
                        <App onImageUpload={(file) => handleImageUpload(file, setFieldValue)} />
                        {touched.gamesImage && errors.gamesImage && (
                          <Alert severity="error">{errors.gamesImage}</Alert>
                        )}
                      </DemoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <DemoItem
                        label={'สถานที่ *'}
                      >
                        <img src={locationImage.src} alt="Location" style={{ width: '100%', cursor: 'pointer', marginTop: '10px' }} onClick={handleImageClick} />
                        <Modal open={fullImageOpen} onClose={handleModalClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Box sx={{ width: '80%', height: '80%' }}>
                            <img src={locationImage.src} alt="Location" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </Box>
                        </Modal>
                        {googleMapLink && (
                          <Link href={googleMapLink} target="_blank" rel="noopener noreferrer">
                            ดูลิงค์แผนที่จาก Google Maps
                          </Link>
                        )}
                      </DemoItem>
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
                      '&:hover': {
                        backgroundColor: 'darkred',
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    สร้างโพสต์นัดเล่น
                  </Button>
                  <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
                      {alertMessage}
                    </Alert>
                  </Snackbar>
                </Box>
              )}
            </Formik>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
