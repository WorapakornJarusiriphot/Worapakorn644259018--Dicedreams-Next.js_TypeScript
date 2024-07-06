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

import { useEffect } from 'react';


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

// กำหนดประเภทของฟังก์ชัน handleWordLimit
const handleWordLimit = (text: string, limit: number): string => {
  const words = text.split(/\s+/);
  if (words.length > limit) {
    return words.slice(0, limit).join(' ');
  }
  return text;
};

interface PostActivity {
  post_activity_id: string;
  name_activity: string;
  status_post: string;
  creation_date: Date;
  detail_post: string;
  date_activity: Date;
  time_activity: string;
  post_activity_image?: string;
  store_id: string;
}

export default function PostActivity() {

  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');
  const [nameActivity, setNameActivity] = React.useState('');
  const [detailPost, setDetailPost] = React.useState('');
  // const [numPeople, setNumPeople] = React.useState(2);
  const [dateActivity, setDateActivity] = React.useState(dayjs());
  const [timeActivity, setTimeActivity] = React.useState(dayjs());
  const [statusPost, setStatusPost] = React.useState('');
  const [postActivityImage, setPostActivityImage] = React.useState(''); // Base64 image
  const [storeId, setStoreId] = React.useState(''); // Set storeId dynamically

  const [postActivity, setPostActivity] = useState<PostActivity | null>(null);

  const [googleMapLink, setGoogleMapLink] = useState('');

  const [fullImageOpen, setFullImageOpen] = useState(false); // State for the modal

  const [userInfo, setUserInfo] = useState(null);

  // React.useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get('https://dicedreams-backend-deploy-to-render.onrender.com/api/users/me', {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  //       });
  //       setUserInfo(response.data);
  //       setStoreId(response.data.store_id);
  //     } catch (error) {
  //       console.error('Failed to fetch user data:', error);
  //       setAlertMessage('Failed to fetch user data');
  //       setAlertSeverity('error');
  //       setOpenSnackbar(true);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   const newText = handleWordLimit(event.target.value, 20);
  //   setNameActivity(newText);
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
    setNameActivity(limitText(event.target.value, 100)); // Limit to 100 characters
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
  //       setStoreId(response.data.store_id);
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
  //     const decoded: { store_id: string } = jwtDecode(token); // ถอดรหัส JWT เพื่อรับข้อมูลผู้ใช้
  //     setStoreId(decoded.store_id); // ใช้ `store_id` จาก JWT
  //   }
  // }, []);


  React.useEffect(() => {
    // กำหนดประเภทของข้อมูลใน JWT
    interface DecodedToken extends JwtPayload {
      store_id: string;
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        // แปลงโทเค็นเป็นประเภท DecodedToken
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);
        setStoreId(decoded.store_id); // ตั้งค่า storeId
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
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', {
  //       name_activity: nameActivity,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_activity: dateActivity.format('MM/DD/YYYY'),
  //       time_activity: timeActivity.format('HH:mm:ss'),
  //       // status_post: statusPost, // Use user input for status_post
  //       status_post: 'active', // Fixed status_post to 'active'
  //       store_id: storeId, // Use the dynamic user ID
  //       post_activity_image: postActivityImage // Use Base64 image
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
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', {
  //       name_activity: nameActivity,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_activity: dateActivity.format('MM/DD/YYYY'),
  //       time_activity: timeActivity.format('HH:mm:ss'),
  //       status_post: 'active',
  //       store_id: storeId,
  //       post_activity_image: postActivityImage,
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
  //         const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', {
  //             name_activity: nameActivity,
  //             detail_post: detailPost,
  //             num_people: numPeople,
  //             date_activity: dateActivity.format('MM/DD/YYYY'),
  //             time_activity: timeActivity.format('HH:mm:ss'),
  //             status_post: 'active',
  //             store_id: storeId,
  //             post_activity_image: postActivityImage,
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
  //     await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', {
  //       name_activity: nameActivity,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_activity: dateActivity.toISOString().split('T')[0],
  //       time_activity: timeActivity.toString().split(' ')[0],
  //       status_post: 'active',
  //       post_activity_image: postActivityImage,
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
  //     await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', {
  //       name_activity: nameActivity,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_activity: dateActivity.format('YYYY-MM-DD'),
  //       time_activity: timeActivity.format('HH:mm:ss'),
  //       status_post: 'active',
  //       post_activity_image: postActivityImage,
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
  //     await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', {
  //       name_activity: nameActivity,
  //       detail_post: detailPost,
  //       num_people: numPeople,
  //       date_activity: dateActivity.format('YYYY-MM-DD'),
  //       time_activity: timeActivity.format('HH:mm:ss'),
  //       status_post: 'active',
  //       post_activity_image: postActivityImage,
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

  //   // ตรวจสอบและแสดง `store_id`
  //   console.log('store_id:', storeId);

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
  //     name_activity: nameActivity,
  //     detail_post: detailPost,
  //     num_people: numPeople,
  //     date_activity: dateActivity.format('MM/DD/YYYY'),
  //     time_activity: timeActivity.format('HH:mm:ss'),
  //     status_post: 'active',
  //     store_id: storeId, // ตรวจสอบว่า storeId ถูกต้อง
  //     post_activity_image: postActivityImage // ตรวจสอบรูปแบบ Base64
  //   };

  //   try {
  //     // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', data, {
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





  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // รับ JWT token จาก local storage
  //   const token = localStorage.getItem('access_token');

  //   // ตรวจสอบและแสดง `store_id`
  //   console.log('store_id:', storeId);

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
  //     name_activity: nameActivity,
  //     detail_post: detailPost,
  //     // num_people: numPeople,
  //     date_activity: dateActivity.format('MM/DD/YYYY'),
  //     time_activity: timeActivity.format('HH:mm:ss'),
  //     status_post: 'active',
  //     store_id: storeId, // ตรวจสอบว่า storeId ถูกต้อง
  //     post_activity_image: postActivityImage // ตรวจสอบรูปแบบ Base64
  //   };

  //   try {
  //     // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', data, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.status === 201) {
  //       setAlertMessage('สร้างโพสต์สำเร็จ!');
  //       setAlertSeverity('success');
  //       console.log('Navigating to the homepage'); // บันทึกข้อมูลการนำทาง
  //       // router.push('/'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
  //       // router.replace('/'); // เปลี่ยนเส้นทางเมื่อโพสต์สำเร็จ
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




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ตรวจสอบว่ามี token หรือไม่
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('JWT token is missing');
      setAlertMessage('ไม่พบ JWT token กรุณาเข้าสู่ระบบอีกครั้ง');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }


    console.log('store_id:', storeId);

    // ตรวจสอบว่ามี store_id หรือไม่
    if (!storeId) {
      console.error('store_id is missing');
      setAlertMessage('ไม่พบ store_id กรุณาตรวจสอบข้อมูลผู้ใช้');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const formattedDate = dateActivity.format('MM/DD/YYYY');
    const formattedTime = timeActivity.format('HH:mm:ss');

    // สร้างรูปแบบข้อมูลที่เหมือนกับที่ใช้ใน Postman
    const data = {
      name_activity: nameActivity,
      detail_post: detailPost,
      creation_date: new Date().toISOString(),
      date_activity: formattedDate,
      time_activity: formattedTime,
      status_post: 'active',
      store_id: storeId,
      post_activity_image: postActivityImage,
    };

    try {
      // ส่งคำขอ HTTP POST ไปยังเซิร์ฟเวอร์ด้วย axios พร้อม token ใน Authorization header
      const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity', data, {
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
        console.error('Error response:', error.response);
        setAlertMessage(`สร้างโพสต์ไม่สำเร็จ: ${error.response.data.message || 'เกิดข้อผิดพลาด'}`);
      } else {
        console.error('Unknown error:', error);
        setAlertMessage('สร้างโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด');
      }
      setAlertSeverity('error');
    }
    setOpenSnackbar(true); // แสดงการแจ้งเตือน
  };







  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPostActivityImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };


  // const handleImageUpload = (file: File) => {
  //   // แปลงไฟล์เป็น Base64
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64String = reader.result as string;
  //     setPostActivityImage(base64String); // กำหนด postActivityImage เป็น Base64
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleImageUpload = (file: File) => {
    // Check that the input is a valid file before proceeding
    if (!(file instanceof File)) {
      console.error('The uploaded file is not of the expected type File.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPostActivityImage(base64String); // กำหนด postActivityImage เป็น Base64
    };
    reader.readAsDataURL(file); // Use FileReader to read the file as a data URL
  };


  interface AppProps {
    onImageUpload: (file: any) => void;
  }


  // const router = useRouter(); // Initialize the router
  // const [openSnackbar, setOpenSnackbar] = React.useState(false);
  // const [alertMessage, setAlertMessage] = React.useState('');
  // const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

  const [message, setMessage] = useState('');

  const [alert, setAlert] = React.useState<{ open: boolean; message: string; severity: string }>({ open: false, message: '', severity: '' });

  const [birthday, setBirthday] = React.useState<string | null>(null);

  // Capture the date selected in the DatePicker
  // const handleBirthdayChange = (date: dayjs.Dayjs | null) => {
  //   // Change the format to MM-DD-YYYY
  //   setBirthday(date ? date.format('MM-DD-YYYY') : null);
  // };

  // // อัพเดตส่วนของ handleSubmit เพื่อจัดการการแจ้งเตือน
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);

  //   // Construct userData with the birthday in the correct format
  //   const userData = {
  //     first_name: data.get('firstName') as string,
  //     last_name: data.get('lastName') as string,
  //     username: data.get('username') as string,
  //     password: data.get('password') as string,
  //     email: data.get('email') as string,
  //     birthday: birthday || undefined, // Birthday directly from state
  //     phone_number: data.get('phoneNumber') as string || undefined,
  //     gender: data.get('gender') as string || undefined,
  //     role: 'user',
  //   };

  //   console.log('User data being sent:', userData);

  //   try {
  //     // Create user in Firebase Auth
  //     const firebaseUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
  //     console.log('Firebase user created:', firebaseUser);

  //     // Save user data in MySQL
  //     const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/users', userData);
  //     console.log('Response from server:', response.data);

  //     setAlertMessage('สร้างโพสต์สำเร็จ!');
  //     setAlertSeverity('success');
  //     router.push('/sign-in'); // Navigate to the sign-in page after successful registration
  //   } catch (error: any) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Error response:', error.response);
  //     } else {
  //       console.error('Unknown error:', error);
  //     }

  //     setAlertMessage('สร้างโพสต์ไม่สำเร็จ: ' + (error.response?.data.message || 'เกิดข้อผิดพลาด'));
  //     setAlertSeverity('error');
  //   }
  //   setOpenSnackbar(true); // เปิดการแจ้งเตือน
  // };




  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const [cleared, setCleared] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => { };
  }, [cleared]);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // const [number, setNumber] = useState("");
  // const [numPeople, setNumPeople] = React.useState(1);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNumPeople(event.target.value);
  // };

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
              position: 'relative',  // Ensure this is positioned relative to its container
              zIndex: 2,  // Lower z-index than Header
            }}
          >
            <br />
            <br />
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
            <Typography component="h1" variant="h5">
              สร้างโพสต์กิจกรรม
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="ชื่อจริง"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="นามสกุล"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    // id="username"
                    // label="ชื่อโพสต์กิจกรรม"
                    // name="username"
                    // autoComplete="username"
                    // required
                    // fullWidth
                    // id="nameActivity"
                    label="ชื่อโพสต์กิจกรรม"
                    // helperText={`${nameActivity.split(/\s+/).filter(Boolean).length} / 20`}
                    helperText={`${nameActivity.length} / 100`}
                    value={nameActivity}
                    onChange={handleNameChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    // required
                    fullWidth
                    // name="phoneNumber"
                    label="รายละเอียดของโพสต์กิจกรรม"
                    type="tel"
                    // id="phoneNumber"
                    // autoComplete="tel"
                    multiline
                    rows={4}
                    // helperText={`${detailPost.split(/\s+/).filter(Boolean).length} / 100`}
                    helperText={`${detailPost.length} / 500`}
                    // required
                    // fullWidth
                    // id="detailPost"
                    // label="รายละเอียดของโพสต์กิจกรรม"
                    value={detailPost}
                    onChange={handleDetailChange} // Updated to use the handleDetailChange that limits words
                  // multiline
                  // rows={4}
                  // defaultValue="Default Value"
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="อีเมล"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="รหัสผ่าน"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="numPeople"
                    label="จำนวนคน"
                    value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                  />
                </Grid> */}


                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={['DateTimePicker', 'TimePicker']}
                    >
                      <DemoItem
                        label={'เลือกวันที่กิจกรรมเริ่ม *'}
                      >
                        <DatePicker
                          // label="Birthday"
                          // value={birthday ? dayjs(birthday, 'MM-DD-YYYY') : null}
                          // onChange={handleBirthdayChange}
                          value={dateActivity}
                          onChange={(newDate) => setDateActivity(newDate ?? dayjs())}
                        />
                      </DemoItem>
                      {cleared && (
                        <Alert
                          sx={{ position: 'absolute', bottom: 0, right: 0 }}
                          severity="success"
                        >
                          Field cleared!
                        </Alert>
                      )}
                      <DemoItem
                        label={'เลือกเวลาที่กิจกรรมเริ่ม *'}
                      >
                        <TimePicker
                          // label="Birthday"
                          value={timeActivity}
                          onChange={(newTime) => setTimeActivity(newTime ?? dayjs())}
                          // value={birthday ? dayjs(birthday, 'MM-DD-YYYY') : null}
                          // onChange={handleBirthdayChange}
                          viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                          }}
                        />
                      </DemoItem>

                      {cleared && (
                        <Alert
                          sx={{ position: 'absolute', bottom: 0, right: 0 }}
                          severity="success"
                        >
                          Field cleared!
                        </Alert>
                      )}
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <DemoItem
                    label={'รูปภาพ *'}
                  >
                    <App onImageUpload={handleImageUpload} />
                  </DemoItem>
                </Grid>

                <Grid item xs={12}>
                  <DemoItem
                    label={'สถานที่ *'}
                  >
                    <img src={locationImage.src} alt="Location" style={{ width: '100%', cursor: 'pointer', marginTop: '10px' }} onClick={handleImageClick} />

                    {/* Modal เพื่อขยายภาพ */}
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

                {/* <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">เพศ</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      // name="row-radio-buttons-group"
                      name="gender"
                    >
                      <FormControlLabel value="male" control={<Radio />} label="ชาย" />
                      <FormControlLabel value="female" control={<Radio />} label="หญิง" />
                    </RadioGroup>
                  </FormControl>
                </Grid> */}
                {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
              </Grid>

              <br />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: 'white',  // ตั้งค่าตัวอักษรเป็นสีขาว
                  backgroundColor: 'blue',  // ตั้งค่าพื้นหลังเป็นสีแดง
                  '&:hover': {
                    backgroundColor: 'darkred',  // ตั้งค่าพื้นหลังของปุ่มเมื่อ hover เป็นสีแดงเข้ม
                  }
                }}
              >
                สร้างโพสต์กิจกรรม
              </Button>
              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
                  {alertMessage}
                </Alert>
              </Snackbar>
              {/* <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/sign-in" variant="body2">
                    มีบัญชีอยู่แล้วใช่ไหม? เข้าสู่ระบบ
                  </Link>
                </Grid>
              </Grid> */}
            </Box>
          </Box>
          {/* <Copyright sx={{ mt: 5 }} /> */}
        </Container>
      </ThemeProvider>
    </>
  );
}
