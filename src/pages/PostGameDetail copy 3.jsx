"use client";

import React, { useEffect, useState } from "react";
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
                    borderColor: "#000000", // Change the border color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#000000", // Change the border color to black when hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000000", // Change the border color to black when focused
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="inherit"
                size="medium"
                startIcon={<SendIcon />}
                disabled={loading}
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
