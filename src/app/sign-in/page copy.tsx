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

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import useAxiosPublic from "@/hook/useAxiosPublic";
import Modal from "@/components/Modal";
import useAuth from "@/hook/useAuth";
import Swal from "sweetalert2";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

export default function SignIn() {
  const [defaultTheme, setDefaultTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // ธีมจะถูกสร้างบนไคลเอนต์เท่านั้น
    setDefaultTheme(createTheme());
  }, []);

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      email: email,
      password: password,
    });
  };

  const { createUser, updateUserProfile, sigUpWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  interface FormData {
    name: string;
    email: string;
    password: string;
    photoURL: string;
  }

  const onSubmit = (data: FormData) => {
    createUser(data.email, data.password)
      .then((result: any) => {
      const user = result.user;

      updateUserProfile(data.name, data.photoURL).then(() => {
        //console.log("Form", data.name, data.photoURL);
        const userInfo = {
        name: data.name,
        email: data.email,
        };
        axiosPublic.post("/users", userInfo).then((response: any) => {
        //console.log(response);
        //console.log(user);
        Swal.fire({
          title: "Account created Successfully",
          icon: "success",
          timer: 1500,
        });
        navigate(from, { replace: true });
        });
      });
      // alert("Account created Successfully");
      })
      .catch((error: any) => {
      console.log(error);
      });
  };
  const googleSignUp = () => {
    const googleSignUp = () => {
      sigUpWithGoogle()
        .then((result: any) => {
          const user = result.user;
          const userInfo: FormData = {
            name: result.user?.displayName,
            email: result.user?.email,
            photoURL: result.user?.photoURL,
            password: ''
          };
          axiosPublic.post("/users", userInfo).then((response: any) => {
            //console.log(response);
            //console.log(user);
            Swal.fire({
              title: "Google Sign Up Successfully",
              icon: "success",
              timer: 1500,
            });
            navigate(from, { replace: true });
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    };
  };

  // ใช้ธีมเริ่มต้นถ้ามี หรือใช้ธีมมาตรฐานถ้ายังไม่ได้ถูกสร้าง
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
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            เข้าสู่ระบบ
          </Typography>
          <Box component="form" onSubmit={formSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="อีเมล"
              name="email"
              autoComplete="email"
              autoFocus
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
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  ลืมรหัสผ่านหรือไม่?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"ไม่มีบัญชีใช่ไหม? สมัครสมาชิก"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
