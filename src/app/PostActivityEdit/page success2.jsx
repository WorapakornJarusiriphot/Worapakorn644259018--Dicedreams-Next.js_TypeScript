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
  nameActivity: Yup.string()
    .required("กรุณากรอกชื่อโพสต์")
    .max(100, "ไม่สามารถพิมพ์เกิน 100 ตัวอักษรได้"),
  detailPost: Yup.string()
    .required("กรุณากรอกรายละเอียดของโพสต์")
    .max(500, "ไม่สามารถพิมพ์เกิน 500 ตัวอักษรได้"),
  dateActivity: Yup.date()
    .required("กรุณาเลือกวันที่เจอกัน")
    .test("dateActivity", "เลือกวันที่เจอกันต้องไม่เป็นอดีต", function (value) {
      const selectedDate = dayjs(value);
      const currentDate = dayjs().startOf("day");
      return selectedDate.isAfter(currentDate);
    }),
  timeActivity: Yup.date()
    .required("กรุณาเลือกเวลาที่เจอกัน")
    .test(
      "timeActivity",
      "เลือกเวลาที่เจอกันต้องไม่เป็นอดีตหรือปัจจุบัน",
      function (value) {
        const selectedDate = this.parent.dateActivity;
        if (selectedDate && dayjs(selectedDate).isSame(dayjs(), "day")) {
          return dayjs(value).isAfter(dayjs());
        }
        return true;
      }
    ),
  postActivityImage: Yup.mixed().required("กรุณาอัพโหลดรูปภาพด้วย"),
});

const PostActivityEditContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [postData, setPostData] = useState(null);
  const [formattedTimeMeet, setFormattedTimeActivity] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [googleMapLink, setGoogleMapLink] = useState("");

  const [fullImageOpen, setFullImageOpen] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPostData(response.data);
          const formattedTime = dayjs(response.data.time_activity, "HH:mm:ss");
          setFormattedTimeActivity(formattedTime);
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
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPostData(response.data);
          const formattedTime = dayjs(
            response.data.time_activity,
            "HH:mm:ss"
          ).format("hh:mm A");
          setFormattedTimeActivity(formattedTime);
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

    // ตรวจสอบว่ารูปภาพมี URL ที่ถูกต้องหรือไม่
    let postActivityImage = values.postActivityImage;

    // ถ้ารูปภาพมี URL อยู่แล้ว ให้ใช้ค่าเดิม ไม่ต้องต่อ URL เพิ่ม
    if (postActivityImage && postActivityImage.startsWith("http")) {
      postActivityImage = postActivityImage.replace(
        "http://dicedreams-backend-deploy-to-render.onrender.com/images/",
        ""
      );
    }

    const data = {
      name_activity: values.nameActivity,
      detail_post: values.detailPost,
      date_activity: values.dateActivity.format("MM/DD/YYYY"),
      time_activity: values.timeActivity.format("HH:mm:ss"),
      post_activity_image: postActivityImage, // ส่งค่ารูปภาพที่ถูกต้อง
    };

    try {
      const response = await axios.put(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setAlertMessage("แก้ไขโพสต์กิจกรรมสำเร็จ!");
        setAlertSeverity("success");
        window.location.href = "/";
      } else {
        setAlertMessage(
          `การแก้ไขโพสต์กิจกรรมไม่สำเร็จ: ได้รับสถานะ ${response.status}`
        );
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setAlertMessage("การแก้ไขโพสต์กิจกรรมไม่สำเร็จ: เกิดข้อผิดพลาด");
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
      setFieldValue("postActivityImage", base64String);
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
            <br />
            <br />
            <Typography component="h1" variant="h5">
              แก้ไขโพสต์กิจกรรม
            </Typography>
            <Suspense fallback={<div>Loading...</div>}>
              <Formik
                initialValues={{
                  nameActivity: postData.name_activity,
                  detailPost: postData.detail_post,
                  dateActivity: dayjs(postData.date_activity),
                  timeActivity: dayjs().add(5, "minute"),
                  postActivityImage: postData.post_activity_image,
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
                          label="ชื่อโพสต์"
                          name="nameActivity"
                          value={values.nameActivity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={`${values.nameActivity.length} / 100 ${touched.nameActivity && errors.nameActivity ? ` - ${errors.nameActivity}` : ""}`}
                          error={
                            touched.nameActivity && Boolean(errors.nameActivity)
                          }
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
                          helperText={`${values.detailPost.length} / 500 ${touched.detailPost && errors.detailPost ? ` - ${errors.detailPost}` : ""}`}
                          error={
                            touched.detailPost && Boolean(errors.detailPost)
                          }
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer
                            components={["DateTimePicker", "TimePicker"]}
                          >
                            <DemoItem label={"เลือกวันที่เจอกัน *"}>
                              <DatePicker
                                name="dateActivity"
                                value={values.dateActivity}
                                onChange={(newDate) =>
                                  setFieldValue("dateActivity", newDate)
                                }
                                onBlur={handleBlur}
                                error={
                                  touched.dateActivity &&
                                  Boolean(errors.dateActivity)
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                              {touched.dateActivity && errors.dateActivity && (
                                <Alert severity="error">
                                  {errors.dateActivity}
                                </Alert>
                              )}
                            </DemoItem>
                            <DemoItem label={"เลือกเวลาที่เจอกัน *"}>
                              <TimePicker
                                name="timeActivity"
                                value={dayjs(values.timeActivity, "hh:mm A")}
                                onChange={(newTime) =>
                                  setFieldValue("timeActivity", newTime)
                                }
                                onBlur={handleBlur}
                                error={
                                  touched.timeActivity &&
                                  Boolean(errors.timeActivity)
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
                              {touched.timeActivity && errors.timeActivity && (
                                <Alert severity="error">
                                  {errors.timeActivity}
                                </Alert>
                              )}
                            </DemoItem>
                          </DemoContainer>
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <DemoItem label={"รูปภาพเก่า *"}>
                          <img
                            src={values.postActivityImage}
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
                            initialImage={`https://dicedreams-backend-deploy-to-render.onrender.com/images/${values.postActivityImage}`} // ส่ง URL ของรูปภาพให้กับ App.js
                          />
                          {touched.postActivityImage &&
                            errors.postActivityImage && (
                              <Alert severity="error">
                                {errors.postActivityImage}
                              </Alert>
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
                      แก้ไขโพสต์กิจกรรม
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

const PostActivityEdit = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostActivityEditContent />
    </Suspense>
  );
};

export default PostActivityEdit;
