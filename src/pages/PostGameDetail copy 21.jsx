"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import {
  Grid,
  Checkbox,
  FormControlLabel,
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
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Image from "next/image";
import { JwtPayload } from "jwt-decode";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
// import { Link } from 'react-router-dom';
import Link from "next/link";

import { usePopover } from "@/hook/use-popover";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
// import DrawerMobileNavigation from "../DrawerMobileNavigation";
import { UserPopover } from "@/layout/user-popover";
// import NotificationsPopover from "@/layout/dashboard/common/notifications-popover";


// สร้าง custom theme
const theme = createTheme({
  palette: {
    // mode: 'dark', // โหมด Dark Mode
    primary: {
      main: "#00C853", // สีเขียวสดใสสำหรับปุ่ม "เข้าร่วม"
    },
    error: {
      main: "#D32F2F", // สีแดงสำหรับปุ่ม "ยกเลิก"
    },
  },
});

// const formatDateTime = (dateString) => {
//   const date = parseISO(dateString);
//   const formattedDate = format(
//     date,
//     "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
//     {
//       locale: th,
//     }
//   );
//   return formattedDate;
// };

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
            "& fieldset": {
              borderColor: "black", // Set the border color to black
            },
            "&:hover fieldset": {
              borderColor: "black", // Set the border color to black when hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "black", // Set the border color to black when focused
            },
          },
        },
      },
    },
  },
});

function PostGameDetail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [participants, setParticipants] = useState([]);

  const userPopover = usePopover();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    userType: "",
    firstName: "",
    lastName: "",
    profilePictureUrl: "",
    userId: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUser((prev) => ({
          ...prev,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userId: decoded.users_id,
        }));
      }
    }
  }, []);

  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // ล้าง token ที่เก็บไว้
    setUserLoggedIn(false); // อัปเดต state
    setUser({ firstName: "", lastName: "", profilePictureUrl: "" });
    router.push("/sign-in"); // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
  };
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  // ตัวอย่าง URL รูปโปรไฟล์ หากมีระบบที่ให้ผู้ใช้เปลี่ยนรูปโปรไฟล์เอง ควรดึงจากฐานข้อมูล
  const profilePictureUrl = "/profile-pic-url.png";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [username, setUsername] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUsername(decodedToken.users_id); // สมมุติว่ามี username ใน token
    }
  }, []);

  // ประกาศฟังก์ชัน fetchUserProfile ก่อนใช้งานใน useEffect
  const fetchUserProfile = async (userId, accessToken, decodedToken) => {
    try {
      console.log(
        `Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`
      );
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("API Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile Data:", data);
        setUser({
          username: decodedToken.username,
          userType: data.role, // ตรวจสอบและอัปเดต userType จาก API response
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image || "",
        });
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

  // Example code in Header.jsx
  useEffect(() => {
    const fetchUserProfile = async (userId, accessToken, decodedToken) => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const userId = decodedToken.users_id;

          console.log(
            `Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`
          );

          const response = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("API Response Status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Profile Data:", data);

            // ตั้งค่า profile image path และข้อมูลอื่นๆ
            setUser({
              username: decodedToken.username,
              userType: data.role, // ตรวจสอบและอัปเดต userType จาก API response
              firstName: data.first_name,
              lastName: data.last_name,
              profilePictureUrl: data.user_image || "",
            });
          } else {
            console.error(
              `API Error: ${response.status} ${response.statusText}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = ""; // Reset when the component unmounts
    };
  }, []);

  const joinGameClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gameId = router.query.id;
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/joinGame",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ post_games_id: gameId }),
        }
      );
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to save join:", await response.text());
      }
    } catch (error) {
      console.error("Error saving join:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gameId = router.query.id;
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/createComment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ comment, post_games_id: gameId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Comment saved:", result);
        setComment(""); // รีเซ็ตฟอร์มหลังจากบันทึกความคิดเห็น
        window.location.reload();
      } else {
        console.error("Failed to save comment:", await response.text());
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostGame = async (gameId, accessToken) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
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

      const postParticipants = participantsData.filter(
        (participant) => participant.post_games_id === data.post_games_id
      );

      setPostData({
        ...data,
        participants: postParticipants.length + 1,
      });
    } catch (error) {
      setError("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (gameId, accessToken) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate/post/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch participants");

      const participantsData = await response.json();
      setParticipants(participantsData);
    } catch (error) {
      setError("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    let currentUserId = "";
    const decoded = jwtDecode(accessToken);
    currentUserId = decoded.users_id;
    setUserId(currentUserId);

    if (accessToken && router.isReady) {
      const gameId = router.query.id;
      if (gameId) {
        fetchPostGame(gameId, accessToken);
        fetchParticipants(gameId, accessToken);
      } else {
        console.error("gameId is not defined");
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Header />
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ marginTop: 10 }}>
          <Typography
            variant="h2"
            gutterBottom
            style={{ color: "white", textAlign: "left", marginBottom: "30px" }}
          >
            {postData?.name_games}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#0B0D0E",
              color: "white",
              border: "1px solid #32383E",
              marginBottom: "30px",
            }}
          >
            <Box
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              <img
                src={postData?.games_image || "default-image-url.jpg"}
                alt="Game Image"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
              <Typography variant="body1" sx={{ color: "white" }}>
                {postData?.detail_post}
              </Typography>

              <br />

              <Typography variant="body1" sx={{ color: "white" }}>
                วันที่เจอกัน:{" "}
                {postData?.date_meet
                  ? formatThaiDate(postData.date_meet)
                  : "Invalid date"}
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                เวลาที่เจอกัน:{" "}
                {postData?.time_meet
                  ? formatThaiTime(postData.time_meet)
                  : "Invalid time"}
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
                ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
              </Typography>

              {postData?.users_id !== userId && (
                <Button
                  onClick={joinGameClick}
                  variant="contained"
                  sx={{ marginTop: "10px", background: "red" }}
                >
                  เข้าร่วมฟรี
                </Button>
              )}
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#0B0D0E",
              color: "white",
              border: "1px solid #32383E",
              marginBottom: "30px",
            }}
          >
            <Box
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                จำนวนคนจะไป : {postData?.participants}/{postData?.num_people}
              </Typography>
              <br />
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {participants.map((participant) => (
                  <Avatar
                    key={participant.user_id}
                    alt={`${participant.user?.firstName ?? ""} ${
                      participant.user?.lastName ?? ""
                    }`}
                    src={
                      participant.user?.profilePictureUrl ||
                      "url-to-profile-picture.jpg"
                    }
                    sx={{
                      width: "50px",
                      height: "50px",
                      marginRight: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {!participant.user?.profilePictureUrl &&
                      `${participant.user?.firstName?.[0] ?? ""}${
                        participant.user?.lastName?.[0] ?? ""
                      }`}
                  </Avatar>
                ))}
              </Box>
            </Box>
          </Paper>

          {postData?.users_id === userId && (
            <Paper
              elevation={3}
              sx={{
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#0B0D0E",
                color: "white",
                border: "1px solid #32383E",
                marginBottom: "30px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                <Typography variant="h4" sx={{ color: "white" }}>
                  Owner Controls
                </Typography>
                <a
                  href={`/JoinPage?id=${postData?.post_games_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    sx={{ marginTop: "10px", background: "red" }}
                  >
                    จัดการผู้เข้าร่วม
                  </Button>
                </a>
                <Button
                  sx={{
                    marginTop: "10px",
                    background: "white",
                    color: "black",
                  }}
                >
                  ปิดระบบนัดเล่น
                </Button>
              </Box>
            </Paper>
          )}

          <Typography variant="h4" sx={{ color: "white", textAlign: "center" }}>
            แสดงความคิดเห็น
          </Typography>

          {/* Loop through comments */}
          {postData?.comments &&
            postData.comments.map((comment) => (
              <Paper
                key={comment.comment_id}
                elevation={3}
                sx={{
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: "#0B0D0E",
                  color: "white",
                  border: "1px solid #32383E",
                  marginBottom: "30px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    textAlign: "left",
                  }}
                >
                  <Avatar
                    alt="Profile Picture"
                    src="url-to-profile-picture.jpg"
                    sx={{ width: "50px", height: "50px", marginRight: "20px" }}
                  />
                  <Box>
                    <Typography variant="body1">
                      {comment.user.username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {new Date(comment.creation_date).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <MoreVertIcon sx={{ color: "gray" }} />
                    </IconButton>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ marginTop: "10px", textAlign: "left", color: "gray" }}
                >
                  {comment.comment}
                </Typography>
              </Paper>
            ))}

          <Paper
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#ffffff",
              color: "#000000", // Change the text color to black
              textAlign: "left",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <Avatar
                alt={altText}
                src={user.profilePictureUrl || "url-to-profile-picture.jpg"}
                sx={{
                  width: "50px",
                  height: "50px",
                  marginRight: "20px",
                  marginBottom: "20px",
                }}
              >
                {!user.profilePictureUrl &&
                  `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold" color={"#000000"}>
                  {`${user.firstName || "firstName"} ${user.lastName || "lastName"}`}
                </Typography>
              </Box>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  marginBottom: "20px",
                  "& .MuiInputBase-root": {
                    color: "#000000", // Change the text color to black
                  },
                  "& fieldset": {
                    borderColor: "#000000", // Set the border color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000", // Set the border color to black
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000", // Set the border color to black when hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000000", // Set the border color to black when focused
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="medium"
                startIcon={<SendIcon />}
                disabled={loading}
                sx={{
                  backgroundColor: "#d3d3d3", // สีเทาอ่อน
                  color: "#000000", // ตัวหนังสือสีดำ
                  "&:hover": {
                    backgroundColor: "#c0c0c0", // สีเทาเข้มขึ้นเมื่อ hover
                  },
                }}
              >
                ส่งข้อความ
              </Button>
            </form>
          </Paper>
        </Container>
      </ThemeProvider>
      <Footer />
    </>
  );
}

export default PostGameDetail;
