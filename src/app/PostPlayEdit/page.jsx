"use client";

import Image from "next/image";
import * as React from "react";
import { Suspense } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { styled } from "@mui/material/styles";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextFieldProps } from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import Snackbar from "@mui/material/Snackbar";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import App from "./App";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import locationImage from "./location.png";
import { InputLabel, MenuItem, Modal, Select } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";

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

const validationSchema = Yup.object().shape({
  nameGames: Yup.string()
    .required("กรุณากรอกชื่อโพสต์")
    .max(100, "ไม่สามารถพิมพ์เกิน 100 ตัวอักษรได้"),
  detailPost: Yup.string()
    .required("กรุณากรอกรายละเอียดของโพสต์")
    .max(500, "ไม่สามารถพิมพ์เกิน 500 ตัวอักษรได้"),
  numPeople: Yup.number()
    .min(2, "กรุณาเลือกจำนวนผู้เล่นอย่างน้อย 2 คน")
    .required("กรุณาเลือกจำนวนผู้เล่น"),
  dateMeet: Yup.date()
    .required("กรุณาเลือกวันที่เจอกัน")
    .test("dateMeet", "เลือกวันที่เจอกันต้องไม่เป็นอดีต", function (value) {
      const selectedDate = dayjs(value);
      const currentDate = dayjs().startOf("day");
      return selectedDate.isAfter(currentDate);
    }),
  timeMeet: Yup.date()
    .required("กรุณาเลือกเวลาที่เจอกัน")
    .test(
      "timeMeet",
      "เลือกเวลาที่เจอกันต้องไม่เป็นอดีตหรือปัจจุบัน",
      function (value) {
        const selectedDate = this.parent.dateMeet;
        if (selectedDate && dayjs(selectedDate).isSame(dayjs(), "day")) {
          return dayjs(value).isAfter(dayjs());
        }
        return true;
      }
    ),
  gamesImage: Yup.mixed().required("กรุณาอัพโหลดรูปภาพด้วย"),
});

const PostPlayEditContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [postData, setPostData] = useState(null);
  const [formattedTimeMeet, setFormattedTimeMeet] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [googleMapLink, setGoogleMapLink] = useState("");

  const [fullImageOpen, setFullImageOpen] = useState(false);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = 'loaded';
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPostData(response.data);
          const formattedTime = dayjs(response.data.time_meet, "HH:mm:ss");
          setFormattedTimeMeet(formattedTime);
        } else {
          setAlertMessage("ไม่สามารถดึงข้อมูลโพสต์ได้");
          setAlertSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        setAlertMessage("ไม่สามารถดึงข้อมูลโพสต์ได้");
        setAlertSeverity("error");
        setOpenSnackbar(true);
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPostData(response.data);
          const formattedTime = dayjs(
            response.data.time_meet,
            "HH:mm:ss"
          ).format("hh:mm A");
          setFormattedTimeMeet(formattedTime);
        } else {
          setAlertMessage("ไม่สามารถดึงข้อมูลโพสต์ได้");
          setAlertSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        setAlertMessage("ไม่สามารถดึงข้อมูลโพสต์ได้");
        setAlertSeverity("error");
        setOpenSnackbar(true);
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setAlertMessage("ไม่พบ JWT token กรุณาเข้าสู่ระบบอีกครั้ง");
      setAlertSeverity("error");
      setOpenSnackbar(true);
      setSubmitting(false);
      return;
    }

    const data = {
      name_games: values.nameGames,
      detail_post: values.detailPost,
      num_people: values.numPeople,
      date_meet: values.dateMeet.format("MM/DD/YYYY"),
      time_meet: values.timeMeet.format("HH:mm:ss"),
      games_image: values.gamesImage,
    };

    console.log("Submitted data:", data);

    try {
      const response = await axios.put(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setAlertMessage("แก้ไขโพสต์สำเร็จ!");
        setAlertSeverity("success");
        window.location.href = "/";
      } else {
        setAlertMessage(
          `การแก้ไขโพสต์ไม่สำเร็จ: ได้รับสถานะ ${response.status}`
        );
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setAlertMessage("การแก้ไขโพสต์ไม่สำเร็จ: เกิดข้อผิดพลาด");
      setAlertSeverity("error");
    }
    setOpenSnackbar(true);
    setSubmitting(false);
  };

  const handleImageUpload = (file, setFieldValue) => {
    if (!(file instanceof File)) {
      console.error("The uploaded file is not of the expected type File.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFieldValue("gamesImage", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  if (!postData || !formattedTimeMeet) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              กำลังโหลด...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  console.log("Post data:", postData);
  console.log("Formatted time meet:", formattedTimeMeet);

  const handleImageClick = () => {
    setFullImageOpen(true);
  };

  const handleModalClose = () => {
    setFullImageOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="md">
          {" "}
          {/* ใช้ความกว้างระดับ 'md' */}
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <br />
            <br />
            <Typography
              variant="h4"
              color={"white"}
              sx={{
                textAlign: "left",
                fontSize: {
                  xs: "1.5rem", // ขนาดสำหรับหน้าจอที่มีความกว้างน้อยกว่า 360px
                  sm: "1.7rem", // ขนาดสำหรับหน้าจอที่กว้าง 360px - 390px
                  md: "2rem", // ขนาดสำหรับหน้าจอปานกลาง 390px - 430px
                  lg: "2.5rem", // ขนาดสำหรับหน้าจอใหญ่ขึ้น
                },
                fontWeight: 600,
                whiteSpace: "normal", // อนุญาตให้ข้อความแบ่งบรรทัดได้
                wordBreak: "break-word", // ทำให้การตัดคำเกิดขึ้นที่ขอบคำ
                maxWidth: "100%", // ควบคุมความกว้างไม่ให้เกินคอนเทนเนอร์
                lineHeight: 1.2, // ปรับระยะห่างบรรทัดให้พอดี
              }}
            >
              แก้ไขโพสต์นัดเล่น
            </Typography>
            <Suspense fallback={<div>Loading...</div>}>
              <Formik
                initialValues={{
                  nameGames: postData.name_games,
                  detailPost: postData.detail_post,
                  numPeople: postData.num_people,
                  dateMeet: dayjs(postData.date_meet),
                  timeMeet: dayjs().add(5, "minute"),
                  gamesImage: postData.games_image,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting,
                }) => (
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="name_games"
                          label="ชื่อโพสต์"
                          name="nameGames"
                          value={values.nameGames}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={`${values.nameGames.length} / 100 ${touched.nameGames && errors.nameGames ? ` - ${errors.nameGames}` : ""}`}
                          error={touched.nameGames && Boolean(errors.nameGames)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="detail_post"
                          label="รายละเอียดของโพสต์"
                          name="detailPost"
                          value={values.detailPost}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={`${values.detailPost.length} / 500 ${touched.detailPost && errors.detailPost ? ` - ${errors.detailPost}` : ""}`}
                          error={
                            touched.detailPost && Boolean(errors.detailPost)
                          }
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="number-select-label">
                            จำนวนผู้เล่นที่จะนัดเจอกัน *
                          </InputLabel>
                          <Select
                            labelId="number-select-label"
                            name="numPeople"
                            id="num_people"
                            value={values.numPeople}
                            label="จำนวนผู้เล่นที่จะนัดเจอกัน"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.numPeople && Boolean(errors.numPeople)
                            }
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
                          <DemoContainer
                            components={["DateTimePicker", "TimePicker"]}
                          >
                            <DemoItem label={"เลือกวันที่เจอกัน *"}>
                              <DatePicker
                                name="dateMeet"
                                id="date_meet"
                                value={values.dateMeet}
                                onChange={(newDate) =>
                                  setFieldValue("dateMeet", newDate)
                                }
                                onBlur={handleBlur}
                                error={
                                  touched.dateMeet && Boolean(errors.dateMeet)
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                              {touched.dateMeet && errors.dateMeet && (
                                <Alert severity="error">
                                  {errors.dateMeet}
                                </Alert>
                              )}
                            </DemoItem>
                            <DemoItem label={"เลือกเวลาที่เจอกัน *"}>
                              <TimePicker
                                name="timeMeet"
                                id="time_meet"
                                value={dayjs(values.timeMeet, "hh:mm A")}
                                onChange={(newTime) =>
                                  setFieldValue("timeMeet", newTime)
                                }
                                onBlur={handleBlur}
                                error={
                                  touched.timeMeet && Boolean(errors.timeMeet)
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                                viewRenderers={{
                                  hours: renderTimeViewClock,
                                  minutes: renderTimeViewClock,
                                  seconds: renderTimeViewClock,
                                }}
                              />
                              {touched.timeMeet && errors.timeMeet && (
                                <Alert severity="error">
                                  {errors.timeMeet}
                                </Alert>
                              )}
                            </DemoItem>
                          </DemoContainer>
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <DemoItem label={"รูปภาพเก่า *"}>
                          <img
                            src={values.gamesImage}
                            alt="Location"
                            style={{
                              width: "100%",
                              cursor: "pointer",
                              marginTop: "10px",
                            }}
                          />
                        </DemoItem>
                      </Grid>
                      <Grid item xs={12}>
                        <DemoItem label={"รูปภาพใหม่ที่จะอัพโหลด *"}>
                          <App
                            onImageUpload={(file) =>
                              handleImageUpload(file, setFieldValue)
                            }
                            initialImage={`https://dicedreams-backend-deploy-to-render.onrender.com/images/${values.gamesImage}`} // ส่ง URL ของรูปภาพให้กับ App.js
                          />
                          {touched.gamesImage && errors.gamesImage && (
                            <Alert severity="error">{errors.gamesImage}</Alert>
                          )}
                        </DemoItem>
                      </Grid>
                      <Grid item xs={12}>
                        <DemoItem label={"สถานที่ *"}>
                          <img
                            src={locationImage.src}
                            alt="Location"
                            style={{
                              width: "100%",
                              cursor: "pointer",
                              marginTop: "10px",
                            }}
                            onClick={handleImageClick}
                          />
                          <Modal
                            open={fullImageOpen}
                            onClose={handleModalClose}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ width: "80%", height: "80%" }}>
                              <img
                                src={locationImage.src}
                                alt="Location"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          </Modal>
                          {googleMapLink && (
                            <Link
                              href={googleMapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ดูลิงค์แผนที่จาก Google Maps
                            </Link>
                          )}
                        </DemoItem>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      id="Edit-PostGames"
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2,
                        color: "white",
                        backgroundColor: "blue",
                        "&:hover": { backgroundColor: "darkred" },
                      }}
                      disabled={isSubmitting}
                    >
                      แก้ไขโพสต์
                    </Button>
                    <Snackbar
                      open={openSnackbar}
                      autoHideDuration={6000}
                      onClose={handleSnackbarClose}
                    >
                      <Alert
                        onClose={handleSnackbarClose}
                        severity={alertSeverity}
                        sx={{ width: "100%" }}
                      >
                        {alertMessage}
                      </Alert>
                    </Snackbar>
                  </Box>
                )}
              </Formik>
            </Suspense>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

const PostPlayEdit = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostPlayEditContent />
    </Suspense>
  );
};

export default PostPlayEdit;
