'use client';

import Image from 'next/image';
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
import { auth } from "@/firebase/firebaseConfig";
import Snackbar from '@mui/material/Snackbar';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { FileUpload, FileUploadProps } from '@/components/FileUpload/FileUpload';
import App from "./App";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import locationImage from './location.png';
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { InputLabel, MenuItem, Modal, Select } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from 'jwt-decode';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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
  numPeople: 2,
  dateMeet: dayjs(),
  timeMeet: dayjs(),
  gamesImage: '',
};

const validationSchema = Yup.object().shape({
  nameGames: Yup.string().required('กรุณากรอกชื่อโพสต์'),
  detailPost: Yup.string().required('กรุณากรอกรายละเอียดของโพสต์'),
  numPeople: Yup.number().min(2, 'กรุณาเลือกจำนวนผู้เล่นอย่างน้อย 2 คน').required('กรุณาเลือกจำนวนผู้เล่น'),
  dateMeet: Yup.date().required('กรุณาเลือกวันที่เจอกัน').test('dateMeet', 'เลือกวันที่เจอกันต้องไม่เป็นอดีต', function (value) {
    return dayjs(value).isAfter(dayjs(), 'day');
  }),
  timeMeet: Yup.date().required('กรุณาเลือกเวลาที่เจอกัน').test('timeMeet', 'เลือกเวลาที่เจอกันต้องไม่เป็นอดีต', function (value) {
    const selectedDate = this.parent.dateMeet;
    if (selectedDate && dayjs(selectedDate).isSame(dayjs(), 'day')) {
      return dayjs(value).isAfter(dayjs());
    }
    return true;
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

const Label = styled(({ className, componentName, valueType }: { className?: string, componentName: string, valueType: string }) => (
  <span className={className}>
    <strong>{componentName}</strong> ({valueType})
  </span>
))(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const renderTextField = (params: TextFieldProps) => (
  <TextField
    {...params}
    fullWidth
    sx={{ width: '100%' }}
  />
);

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

  const limitText = (text: string, limit: number): string => {
    return text.slice(0, limit);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNameGames(limitText(event.target.value, 100)); // Limit to 100 characters
  };

  const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDetailPost(limitText(event.target.value, 500)); // Limit to 500 characters
  };

  React.useEffect(() => {
    interface DecodedToken extends JwtPayload {
      users_id: string;
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      try {
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
                        onChange={(e) => {
                          handleChange(e);
                          handleNameChange(e);
                        }}
                        onBlur={handleBlur}
                        helperText={(touched.nameGames && errors.nameGames) ? errors.nameGames : `${values.nameGames.length} / 100`}
                        error={touched.nameGames && Boolean(errors.nameGames)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="รายละเอียดของโพสต์"
                        name="detailPost"
                        value={values.detailPost}
                        onChange={(e) => {
                          handleChange(e);
                          handleDetailChange(e);
                        }}
                        onBlur={handleBlur}
                        helperText={(touched.detailPost && errors.detailPost) ? errors.detailPost : `${values.detailPost.length} / 500`}
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
                        <DemoContainer components={['DatePicker', 'TimePicker']}>
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
                      <DemoItem label={'รูปภาพ *'}>
                        <App onImageUpload={(file) => handleImageUpload(file, setFieldValue)} />
                        {touched.gamesImage && errors.gamesImage && (
                          <Alert severity="error">{errors.gamesImage}</Alert>
                        )}
                      </DemoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <DemoItem label={'สถานที่ *'}>
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
