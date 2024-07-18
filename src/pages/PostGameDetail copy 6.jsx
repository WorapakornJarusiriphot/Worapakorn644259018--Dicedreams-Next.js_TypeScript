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

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = ""; // Reset when the component unmounts
    };
  }, []);

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
      setPostData(data);
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
              <Typography variant="body1" sx={{ color: "gray" }}>
                {postData?.detail_post}
              </Typography>

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
                จำนวนคนจะไป {postData?.num_people}/10
              </Typography>
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
                alt="Profile Picture"
                src="url-to-profile-picture.jpg"
                sx={{
                  width: "50px",
                  height: "50px",
                  marginRight: "20px",
                  marginBottom: "20px",
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight="bold" color={"#000000"}>
                  Ideacode Development
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
