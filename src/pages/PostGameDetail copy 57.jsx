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
import Image from "next/image";
import { format, parseISO, addHours } from "date-fns";
import { th } from "date-fns/locale";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Link from "next/link";
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
import CommentIcon from "@mui/icons-material/Comment";
import LoginIcon from "@mui/icons-material/Login";
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
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
import { UserPopover } from "@/layout/user-popover";

const BASE_URL = "https://dicedreams-backend-deploy-to-render.onrender.com/images/";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00C853",
    },
    error: {
      main: "#D32F2F",
    },
  },
});

const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  const dateInThailand = addHours(date, 7); // Add 7 hours to convert to Thailand time
  const formattedDate = format(
    dateInThailand,
    "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
    {
      locale: th,
    }
  );
  return formattedDate;
};

const formatThaiDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
              borderColor: "black",
            },
            "&:hover fieldset": {
              borderColor: "black",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
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
  const [chatMessage, setChatMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    userType: "",
    profilePictureUrl: "",
    userId: "",
  });

  const constructImageUrl = (imagePath) => `${BASE_URL}${imagePath}`;
  const constructImageUrl2 = (imagePath) => `${imagePath}`;

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
        setUserId(decoded.users_id); // Set userId from decoded token
      }
    }
  }, []);

  const fetchOwnerProfile = async (userId, accessToken) => {
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Owner Profile Data:", data);
        setOwnerProfile({
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image
            ? constructImageUrl2(data.user_image)
            : "",
        });
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching owner profile:", error);
    }
  };

  const fetchUserProfile = async (userId, accessToken, decodedToken) => {
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser({
          username: decodedToken.username,
          userType: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image
            ? constructImageUrl2(data.user_image)
            : "",
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
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = "";
    };
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
          setPostData((prevData) => ({
            ...prevData,
            isParticipated: true,
            participants: prevData.participants + 1,
          }));
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessMessage("");
  };

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
        setPostData((prevData) => ({
          ...prevData,
          isParticipated: true,
          participants: prevData.participants + 1,
        }));
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
        setComment("");
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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gameId = router.query.id;
      const accessToken = localStorage.getItem("access_token");
      const currentDateTime = new Date().toISOString();

      // ตรวจสอบค่า userId ก่อนส่งข้อมูล
      if (!userId) {
        throw new Error("User ID is not defined");
      }

      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: chatMessage,
            datetime_chat: currentDateTime,
            user_id: userId, // ใช้ userId ที่ได้รับจากการ decode token
            post_games_id: gameId,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setChatMessage("");
        window.location.reload();
      } else {
        console.error("Failed to send chat message:", await response.text());
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
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
      console.log("Post Data:", data);
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

      if (data.users_id) {
        fetchOwnerProfile(data.users_id, accessToken);
      }
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

  const fetchChatMessages = async (postId) => {
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/chat/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      } else {
        console.error("Failed to fetch chat messages:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
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
        fetchChatMessages(gameId);
      } else {
        console.error("gameId is not defined");
      }
    }
  }, [router.isReady]);

  console.log("Owner Profile State:", ownerProfile);

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
                src={
                  postData?.games_image
                    ? constructImageUrl2(postData.games_image)
                    : "default-image-url.jpg"
                }
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

              {postData?.users_id !== userId && !postData?.isParticipated && (
                <Button
                  onClick={handleJoinClick}
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
                <Avatar
                  alt={`${ownerProfile.firstName || "Owner"} ${
                    ownerProfile.lastName || ""
                  }`}
                  src={
                    ownerProfile.profilePictureUrl ||
                    "url-to-profile-picture.jpg"
                  }
                  sx={{
                    width: "50px",
                    height: "50px",
                    marginRight: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {!ownerProfile.profilePictureUrl &&
                    `${ownerProfile.firstName?.[0] ?? ""}${
                      ownerProfile.lastName?.[0] ?? ""
                    }`}
                </Avatar>
                {participants.map((participant) => (
                  <Avatar
                    key={participant.user_id}
                    alt={`${participant.user?.first_name ?? ""} ${
                      participant.user?.last_name ?? ""
                    }`}
                    src={
                      participant.user?.user_image
                        ? constructImageUrl(participant.user.user_image)
                        : "url-to-profile-picture.jpg"
                    }
                    sx={{
                      width: "50px",
                      height: "50px",
                      marginRight: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {!participant.user?.user_image &&
                      `${participant.user?.first_name?.[0] ?? ""}${
                        participant.user?.last_name?.[0] ?? ""
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

          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", marginTop: "20px" }}
          >
            มาพูดคุยกัน
          </Typography>

          {chatMessages.map((chat) => (
            <Paper
              key={chat.chat_id}
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
                  alt={`${chat.user.first_name} ${chat.user.last_name}`}
                  src={
                    chat.user.user_image
                      ? constructImageUrl(chat.user.user_image)
                      : "url-to-profile-picture.jpg"
                  }
                  sx={{ width: "50px", height: "50px", marginRight: "20px" }}
                />
                <Box>
                  <Typography variant="body1">
                    {chat.user.first_name} {chat.user.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {formatDateTime(chat.datetime_chat)}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{ marginTop: "10px", textAlign: "left", color: "gray" }}
              >
                {chat.message}
              </Typography>
            </Paper>
          ))}

          <Paper
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#ffffff",
              color: "#000000",
              textAlign: "left",
              marginTop: "20px",
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
                  {`${user.firstName || "firstName"} ${
                    user.lastName || "lastName"
                  }`}
                </Typography>
              </Box>
            </Box>
            <form onSubmit={handleChatSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                sx={{
                  marginBottom: "20px",
                  "& .MuiInputBase-root": {
                    color: "#000000",
                  },
                  "& fieldset": {
                    borderColor: "#000000",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000000",
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
                  backgroundColor: "#d3d3d3",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "#c0c0c0",
                  },
                }}
              >
                ส่งข้อความ
              </Button>
            </form>
          </Paper>
        </Container>
      </ThemeProvider>
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
      <Footer />
    </>
  );
}

export default PostGameDetail;
