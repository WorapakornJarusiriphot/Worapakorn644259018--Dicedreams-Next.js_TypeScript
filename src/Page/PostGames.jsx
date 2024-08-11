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
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment"; // สำหรับปุ่มพูดคุย
import LoginIcon from "@mui/icons-material/Login"; // สำหรับปุ่มเข้าสู่ระบบ
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Link } from 'react-router-dom';
import Link from "next/link";
import Avatar from "@mui/material/Avatar"; // เพิ่มการนำเข้า Avatar

// สร้าง custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#00C853", // สีเขียวสดใสสำหรับปุ่ม "เข้าร่วม"
    },
    error: {
      main: "#D32F2F", // สีแดงสำหรับปุ่ม "ยกเลิก"
    },
  },
});

const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(
    date,
    "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
    {
      locale: th,
    }
  );
  return formattedDate;
};

const formatThaiDate = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", { locale: th });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

function PostGames() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // เพิ่มการประกาศ errorMessage
  const [successMessage, setSuccessMessage] = useState(""); // เพิ่มการประกาศ successMessage
  const [isFullSize, setIsFullSize] = useState(false);
  const router = useRouter();

  const handleImageClick = () => {
    setIsFullSize(!isFullSize);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const postsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        const usersResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/users`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();

        const participantsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!participantsResponse.ok)
          throw new Error("Failed to fetch participants");
        const participantsData = await participantsResponse.json();

        const accessToken = localStorage.getItem("access_token");
        let currentUserId = "";
        if (accessToken) {
          try {
            const decoded = jwtDecode(accessToken);
            currentUserId = decoded.users_id;
            setUserId(currentUserId);
          } catch (error) {
            setError("Invalid access token.");
          }
        }

        const postsWithParticipants = postsData
          .filter((post) => post.status_post === "active")
          .map((post) => {
            const postParticipants = participantsData.filter(
              (participant) => participant.post_games_id === post.post_games_id
            );

            const postUser = usersData.find(
              (user) => user.users_id === post.users_id
            );

            const isParticipated = postParticipants.some(
              (participant) => participant.user_id === currentUserId
            );

            return {
              ...post,
              participants: postParticipants.length + 1,
              userFirstName: postUser ? postUser.first_name : "Unknown",
              userLastName: postUser ? postUser.last_name : "Unknown",
              userProfileImage: postUser
                ? postUser.user_image
                : "default-image-url",
              rawCreationDate: post.creation_date,
              creation_date: formatDateTime(post.creation_date),
              date_meet: post.date_meet,
              time_meet: post.time_meet,
              isParticipated: isParticipated,
            };
          });

        const currentTime = new Date();
        const filteredPosts = postsWithParticipants.filter((post) => {
          const postDateTime = new Date(`${post.date_meet}T${post.time_meet}`);
          return postDateTime > currentTime;
        });

        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.rawCreationDate) - new Date(a.rawCreationDate)
        );

        setItems(sortedPosts);
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleJoinClick = (post) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

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
            user_id: userId,
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
                ? { ...item, isParticipated: true }
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

  const handleLinkClick = (event, id) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/PostGameDetail?id=${id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessMessage("");
  };

  const handleProfileClick = (userId) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/profile/${userId}`);
  };

  if (loading)
    return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.post_games_id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#121212", // Added to match the Figma background
            zIndex: 0, // กำหนดค่า z-index เพื่อให้การ์ดอยู่เหนือ navbar
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <div onClick={() => handleProfileClick(item.users_id)}>
                <Avatar
                  alt={`${item.userFirstName} ${item.userLastName}`}
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
                  }}
                >
                  {!item.userProfileImage &&
                    `${item.userFirstName?.[0] ?? ""}${item.userLastName?.[0] ?? ""}`}
                </Avatar>
              </div>
            </Grid>
            <Grid item xs>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "white", cursor: "pointer" }} // เพิ่ม cursor: pointer
                onClick={() => handleProfileClick(item.users_id)}
              >
                {item.userFirstName} {item.userLastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.creation_date}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                sx={{
                  color: "white",
                }}
                aria-label="settings"
              >
                <MoreVertOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>

          <a
            href={{
              pathname: "/PostGameDetail",
              query: { id: item?.post_games_id },
            }}
            onClick={(event) => handleLinkClick(event, item.post_games_id)}
          >
            <div
              style={{
                width: "100%",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            >
              <Image
                src={item.games_image}
                alt={item.name_games}
                layout="fill"
                objectFit="cover"
                style={{
                  transition: "transform 0.3s ease",
                  transform: isFullSize ? "scale(1)" : "scale(1)",
                }}
              />
            </div>

            <br />

            <div className="text-left">
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {item.name_games}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                วันที่เจอกัน: {formatThaiDate(item.date_meet)}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                เวลาที่เจอกัน: {formatThaiTime(item.time_meet)}
              </Typography>
              <br />
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {item.detail_post}
              </Typography>

              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
                ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                จำนวนคนจะไป : {item.participants}/{item.num_people}
              </Typography>
              <br />
            </div>
          </a>

          <Grid container spacing={2} justifyContent="center">
            {item.users_id !== userId && !item.isParticipated && (
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
            )}
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
          </Grid>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>
          ไม่พบโพสต์นัดเล่นเลยตอนนี้
        </Typography>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          กรุณาเข้าสู่ระบบก่อน
        </MuiAlert>
      </Snackbar>
      {errorMessage && (
        <Snackbar
          open={true}
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
      )}
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseSuccessSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>
      )}
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </div>
  );
}

export default PostGames;
