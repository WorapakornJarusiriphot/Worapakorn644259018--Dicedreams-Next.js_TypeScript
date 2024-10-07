"use client";

import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  RadioGroup,
  Radio,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment";
import LoginIcon from "@mui/icons-material/Login";
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { format, parseISO, compareDesc, isValid } from "date-fns";
import { th } from "date-fns/locale";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";

const formatDateTime = (dateString) => {
  if (!dateString) return "Invalid date";
  const date = parseISO(dateString);
  if (isNaN(date)) return "Invalid date";
  const formattedDate = format(
    date,
    "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
    { locale: th }
  );
  return formattedDate;
};

const formatThaiDate = (dateString) => {
  if (!dateString) return "Invalid date";
  const date = parseISO(dateString);
  if (isNaN(date)) return "Invalid date";
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", { locale: th });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  if (!timeString) return "Invalid time";
  const [hours, minutes] = timeString.split(":");
  if (!hours || !minutes) return "Invalid time";
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

const isPastDateTime = (date, time) => {
  const [hours, minutes] = time.split(":");
  const eventDate = new Date(date);
  eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return eventDate < new Date();
};

const PostGames = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(accessToken);
      console.log("LoggedIn User ID:", decoded.users_id); // ตรวจสอบค่า loggedInUserId
      setLoggedInUserId(decoded.users_id);

      try {
        const userResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user details");
        const userData = await userResponse.json();

        const postsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        const participantsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!participantsResponse.ok)
          throw new Error("Failed to fetch participants");
        const participantsData = await participantsResponse.json();

        // กรองโพสต์ที่มีสถานะเป็น unActive
        const activePosts = postsData.filter(
          (post) => post.status_post !== "unActive"
        );

        const postsWithParticipants = activePosts.map((post) => {
          console.log("Post Owner ID:", post.users_id); // ตรวจสอบค่า post.users_id
          const postParticipants = participantsData.filter(
            (participant) =>
              participant.post_games_id === post.post_games_id &&
              participant.participant_status !== "unActive"
          );
          return {
            ...post,
            participants: postParticipants.length + 1, // Adding 1 to the count of participants
            userFirstName: userData.first_name,
            userLastName: userData.last_name,
            userProfileImage: userData.user_image || "/images/default-user.png", // ตรวจสอบ userProfileImage
            creation_date: post.creation_date,
            formattedCreationDate: formatDateTime(post.creation_date),
            date_meet: post.date_meet,
            time_meet: post.time_meet,
            isPast: isPastDateTime(post.date_meet, post.time_meet),
            hasParticipated: postParticipants.some(
              (p) => p.user_id === loggedInUserId
            ),
            isOwner: post.users_id === loggedInUserId, // เพิ่มการตรวจสอบว่าเป็นเจ้าของโพสต์หรือไม่
          };
        });

        // เรียงลำดับโพสต์ตามวันที่สร้างโพสต์ และแยกโพสต์ที่เลยนัดเล่นไปแล้วไปด้านล่าง
        const sortedPosts = postsWithParticipants.sort((a, b) => {
          if (a.isPast && !b.isPast) return 1;
          if (!a.isPast && b.isPast) return -1;
          return compareDesc(
            new Date(a.creation_date),
            new Date(b.creation_date)
          );
        });

        setItems(sortedPosts);
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [userId]);

  const handleButtonClick = (event, id) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/PostGameDetail?id=${id}#chat`);
  };

  const handleJoinClick = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleConfirmJoin = async () => {
    setOpenDialog(false);
    if (selectedPost) {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/participate",
          {
            participant_status: "active",
            participant_apply_datetime: new Date().toLocaleString("th-TH"),
            user_id: loggedInUserId,
            post_games_id: selectedPost.post_games_id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 201) {
          setSuccessMessage("คุณได้ทำการเข้าร่วมโพสต์นัดเล่นสำเร็จแล้ว");
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.post_games_id === selectedPost.post_games_id
                ? { ...item, hasParticipated: true }
                : item
            )
          );
        } else {
          setErrorMessage(
            "Failed to join the post with status: " + response.status
          );
        }
      } catch (error) {
        setErrorMessage("Error joining the post: " + error.message);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading)
    return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#121212",
            zIndex: 0,
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <Avatar
                alt={`${item.userFirstName} {item.userLastName}`}
                src={item.userProfileImage}
                sx={{
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  cursor: "pointer",
                  backgroundColor: item.userProfileImage
                    ? "transparent"
                    : "gray",
                  border: "2px solid white", // เพิ่มกรอบสีขาว
                  color: "white", // ตั้งค่าสีตัวอักษรเป็นสีขาว
                }}
              >
                {!item.userProfileImage &&
                  `${item.userFirstName?.[0] ?? ""}${item.userLastName?.[0] ?? ""}`}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "white" }}
              >
                {item.userFirstName} {item.userLastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.formattedCreationDate}
              </Typography>
            </Grid>
            <Grid item>
              {/* <IconButton
                sx={{
                  color: "white",
                }}
                aria-label="settings"
              >
                <MoreVertOutlinedIcon />
              </IconButton> */}
            </Grid>
          </Grid>

          <div style={{ position: "relative" }}>
            <Image
              src={
                item.games_image
                  ? item.games_image
                  : "https://raw.githubusercontent.com/WorapakornJarusiriphot/Worapakorn644259018--Dicedreams-Next.js_TypeScript/refs/heads/main/src/Page/default.png"
              }
              alt={item.name_games || "Default Image"}
              width={526}
              height={296}
              layout="responsive"
              style={{
                borderRadius: "0%",
                marginBottom: "16px",
              }}
            />
            {item.isPast ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  borderRadius: "50%",
                  width: "70%", // คงขนาดวงกลมเท่าเดิม
                  height: "70%", // คงขนาดวงกลมเท่าเดิม
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "2.5vw", // ใช้ vw เพื่อให้ขนาดยืดหยุ่นตามหน้าจอ
                  fontWeight: 600,
                  whiteSpace: "normal", // อนุญาตให้ข้อความแบ่งบรรทัดได้
                  wordBreak: "break-word", // ทำให้การตัดคำเกิดขึ้นที่ขอบคำ
                  maxWidth: "90%", // ให้ความกว้างของข้อความไม่เกินคอนเทนเนอร์
                  lineHeight: 1.2, // ปรับระยะห่างบรรทัดให้พอดี
                  textAlign: "center", // ทำให้ข้อความจัดชิดกลางในแนวตั้ง
                  padding: "10px", // เพิ่ม padding เพื่อไม่ให้ข้อความชนขอบ
                  zIndex: 20,
                }}
              >
                โพสต์นี้เลยนัดเล่นไปแล้ว
              </div>
            ) : item.participants >= item.num_people ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  borderRadius: "50%",
                  width: "70%", // คงขนาดวงกลมเท่าเดิม
                  height: "70%", // คงขนาดวงกลมเท่าเดิม
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "2.5vw", // ใช้ vw เพื่อให้ขนาดยืดหยุ่นตามหน้าจอ
                  fontWeight: 600,
                  whiteSpace: "normal", // อนุญาตให้ข้อความแบ่งบรรทัดได้
                  wordBreak: "break-word", // ทำให้การตัดคำเกิดขึ้นที่ขอบคำ
                  maxWidth: "90%", // ให้ความกว้างของข้อความไม่เกินคอนเทนเนอร์
                  lineHeight: 1.2, // ปรับระยะห่างบรรทัดให้พอดี
                  textAlign: "center", // ทำให้ข้อความจัดชิดกลางในแนวตั้ง
                  padding: "10px", // เพิ่ม padding เพื่อไม่ให้ข้อความชนขอบ
                  zIndex: 20,
                }}
              >
                โพสต์นี้คนเต็มแล้ว
              </div>
            ) : null}
          </div>

          <div className="text-left">
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                wordWrap: "break-word", // จัดให้ตัดคำเมื่อข้อความยาวเกินกรอบ
                overflowWrap: "break-word", // บังคับให้ตัดคำเมื่อคำยาวเกินไป
                whiteSpace: "normal", // อนุญาตให้ข้อความถูกตัดและย้ายไปบรรทัดถัดไป
              }}
            >
              {item.name_games}
            </Typography>
            <Typography sx={{ color: "white" }}>
              วันที่เจอกัน: {formatThaiDate(item.date_meet)}
            </Typography>
            <Typography sx={{ color: "white" }}>
              เวลาที่เจอกัน: {formatThaiTime(item.time_meet)}
            </Typography>
            <br />
            <Typography
              sx={{
                color: "white",
                wordWrap: "break-word", // จัดให้ตัดคำเมื่อข้อความยาวเกินกรอบ
                overflowWrap: "break-word", // บังคับให้ตัดคำเมื่อคำยาวเกินไป
                whiteSpace: "normal", // อนุญาตให้ข้อความถูกตัดและย้ายไปบรรทัดถัดไป
              }}
            >
              {item.detail_post}
            </Typography>
            <Typography sx={{ color: "white" }}>
              สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
              ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
            </Typography>
            <Typography sx={{ color: "white" }}>
              จำนวนคนจะไป : {item.participants}/{item.num_people}
            </Typography>
            <br />
            {console.log("Is Owner:", item.isOwner)}{" "}
            {/* ตรวจสอบว่า isOwner เป็นจริงหรือไม่ */}
            {!item.isOwner &&
              !item.hasParticipated &&
              item.participants < item.num_people &&
              !item.isPast && (
                <Grid container spacing={2} justifyContent="center">
                  {/* {!item.hasParticipated && !item.isPast && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<LoginIcon />}
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "darkred",
                          },
                        }}
                        onClick={() => handleJoinClick(item)}
                      >
                        เข้าร่วม
                      </Button>
                    </Grid>
                  )} */}
                  {!item.isPast && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<CommentIcon />}
                        sx={{
                          backgroundColor: "black",
                          color: "white",
                          border: "1px solid white",
                          "&:hover": { backgroundColor: "#333333" },
                          zIndex: 0,
                        }}
                        onClick={(event) =>
                          handleButtonClick(event, item.post_games_id)
                        }
                      >
                        พูดคุย
                      </Button>
                    </Grid>
                  )}
                </Grid>
              )}
          </div>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>ไม่พบโพสต์ที่เคยโพสต์</Typography>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>ยืนยันการเข้าร่วม</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจนะว่าจะเข้าร่วมโพสต์นัดเล่นโพสต์นี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirmJoin} color="primary" autoFocus>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <MuiAlert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <MuiAlert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default PostGames;
