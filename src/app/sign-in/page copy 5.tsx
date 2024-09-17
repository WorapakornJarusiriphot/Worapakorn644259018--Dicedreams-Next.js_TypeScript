'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';


import { bgGradient } from '@/theme/css';

import Logo from '@/components/logo';
import Iconify from '@/components/iconify';

import { useFormik } from 'formik';
import * as Yup from 'yup';


import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig'; // นำเข้า auth จาก firebaseConfig

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

const validationSchema = Yup.object({
  identifier: Yup.string().required('กรุณากรอกอีเมลหรือชื่อผู้ใช้'),
  password: Yup.string().required('กรุณากรอกรหัสผ่าน'),
});

export default function SignIn() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = async (provider: GoogleAuthProvider | FacebookAuthProvider, providerName: string) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบแล้วหรือยัง โดยเรียก API ที่เราเพิ่มมาใหม่
      let response;
      try {
        response = await axios.get(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/findByEmail?email=${user.email}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // ถ้าไม่มีผู้ใช้อยู่ในระบบ ทำการสมัครสมาชิกอัตโนมัติ
          response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/users', {
            first_name: user.displayName?.split(' ')[0] || '',
            last_name: user.displayName?.split(' ')[1] || '',
            email: user.email,
            avatar: user.photoURL,
            provider: providerName,
          });
        } else {
          throw error; // หากเกิดข้อผิดพลาดอื่นให้แสดงข้อผิดพลาด
        }
      }

      // หลังจากสมัครสมาชิกหรือเข้าสู่ระบบสำเร็จ ให้ทำการสร้าง JWT Token
      const tokenResponse = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/auth/social-login', {
        email: user.email,
      });

      // เก็บ JWT Token ไว้ใน Local Storage
      localStorage.setItem('access_token', tokenResponse.data.access_token);

      // เมื่อเข้าสู่ระบบสำเร็จให้ไปที่หน้าแรก
      router.push('/');
    } catch (error: any) {
      setErrorMessage(`การเข้าสู่ระบบผ่าน ${providerName} ล้มเหลว`);
      console.error(error);
    }
  };


  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    handleSocialLogin(provider, 'Google');
  };

  const handleFacebookLogin = () => {
    const provider = new FacebookAuthProvider();
    handleSocialLogin(provider, 'Facebook');
  };

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = 'loaded';
      window.location.reload();
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const credentials = {
        identifier: values.identifier,
        password: values.password,
      };

      try {
        const response = await axios.post('https://dicedreams-backend-deploy-to-render.onrender.com/api/auth', credentials);
        localStorage.setItem('access_token', response.data.access_token);
        router.push('/');
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const responseMessage = error.response?.data.message;
          const isEmail = /\S+@\S+\.\S+/.test(values.identifier);

          if (responseMessage === 'User Not Exist') {
            if (isEmail) {
              setErrorMessage('คุณกรอก E-mail ไม่ถูกต้อง');
            } else {
              setErrorMessage('คุณกรอก Username ไม่ถูกต้อง');
            }
          } else if (responseMessage === 'Invalid Password') {
            setErrorMessage('คุณกรอก Password ผิด กรุณากรอก Password ให้ถูกต้อง');
          } else {
            setErrorMessage('คุณกรอก Password ผิด กรุณากรอก Password ให้ถูกต้อง');
          }
        } else {
          setErrorMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด');
        }
      }
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <br />
        <br />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            เข้าสู่ระบบ
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label="อีเมลหรือชื่อผู้ใช้"
              name="identifier"
              autoComplete="username"
              autoFocus
              value={formik.values.identifier}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.identifier && Boolean(formik.errors.identifier)}
              helperText={formik.touched.identifier && formik.errors.identifier}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="จดจำฉัน"
            />
            {errorMessage && (
              <Typography color="error" sx={{ mt: 1, mb: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เข้าสู่ระบบ
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
                onClick={handleGoogleLogin} // เพิ่มฟังก์ชันการล็อกอินด้วย Google
              >
                <Iconify icon="eva:google-fill" color="#DF3E30" />
              </Button>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
                onClick={handleFacebookLogin} // เพิ่มฟังก์ชันการล็อกอินด้วย Facebook
              >
                <Iconify icon="eva:facebook-fill" color="#1877F2" />
              </Button>
            </Stack>

            <br />
            <br />

            <Grid container>
              {/* <Grid item xs>
                <Link href="/" variant="body2">
                  ลืมรหัสผ่านหรือไม่?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"ไม่มีบัญชีใช่ไหม? สมัครสมาชิก"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}