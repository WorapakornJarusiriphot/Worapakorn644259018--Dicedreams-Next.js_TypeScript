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

const isPastDateTime = (date, time) => {
  const [hours, minutes] = time.split(":");
  const eventDate = new Date(date);
  eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return eventDate < new Date();
};

function Participating({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [user_id, setUserid] = useState("");

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(accessToken);
      setLoggedInUserId(decoded.users_id);

      try {
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
        const participants = await participantsResponse.json();

        const myParticipations = participants.filter(
          (part) =>
            part.user_id === userId && part.participant_status !== "unActive"
        );

        const postPromises = myParticipations.map(async (participation) => {
          const postResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${participation.post_games_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!postResponse.ok) throw new Error("Failed to fetch post");
          const post = await postResponse.json();

          if (!post.users_id) {
            throw new Error("Post does not have users_id");
          }

          const userResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${post.users_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user");
          const user = await userResponse.json();

          const postParticipants = participants.filter(
            (p) => p.post_games_id === post.post_games_id
          );

          return {
            ...post,
            participants: postParticipants.length + 1,
            userProfileImage: user.user_image || "/images/default-user.png", // ตรวจสอบ userProfileImage
            userFirstName: user.first_name,
            userLastName: user.last_name,
            hasParticipated: postParticipants.some(
              (p) => p.user_id === decoded.users_id
            ),
            isOwner: post.users_id === loggedInUserId, // เพิ่มเงื่อนไขเช็คเจ้าของโพสต์
            formattedCreationDate: formatDateTime(post.creation_date),
            date_meet: post.date_meet,
            time_meet: post.time_meet,
            isPast: isPastDateTime(post.date_meet, post.time_meet),
          };
        });

        const posts = await Promise.all(postPromises);
        const sortedPosts = posts.sort((a, b) => {
          if (a.isPast && !b.isPast) return 1;
          if (!a.isPast && b.isPast) return -1;
          return compareDesc(
            new Date(a.creation_date),
            new Date(b.creation_date)
          );
        });

        setItems(sortedPosts);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    fetchData();
  }, [loggedInUserId, userId]);

  const handleProfileClick = (user_id) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/profile/${user_id}`);
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
                    color: "white", // ตั้งค่าสีตัวอักษรเป็นสีขาว
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
                sx={{ color: "white" }}
                onClick={() => handleProfileClick(item.users_id)}
              >
                {`${item.userFirstName} ${item.userLastName}`}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.formattedCreationDate}
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

          <div style={{ position: "relative" }}>
            <img
              src={item.games_image}
              alt={item.name_games}
              width={526}
              height={296}
              layout="responsive"
              style={{
                borderRadius: "0%",
                marginBottom: "16px",
              }}
            />
            {item.isPast && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  borderRadius: "50%",
                  width: "60%",
                  height: "60%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "3vw",
                  zIndex: 20,
                }}
              >
                โพสต์นี้เลยนัดเล่นไปแล้ว
              </div>
            )}
          </div>

          <div className="text-left">
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {item.name_games}
            </Typography>
            <Typography sx={{ color: "white" }}>
              วันที่เจอกัน: {formatThaiDate(item.date_meet)}
            </Typography>
            <br />
            <Typography sx={{ color: "white" }}>{item.detail_post}</Typography>

            <Typography sx={{ color: "white" }}>
              สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
              ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
            </Typography>
            <Typography sx={{ color: "white" }}>
              จำนวนคนจะไป : {item.participants}/{item.num_people}
            </Typography>

            <br />

            <Grid container spacing={2} justifyContent="center">
              {/* {!item.isOwner && !item.hasParticipated && !item.isPast && (
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
          </div>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>
          ไม่พบโพสต์นัดเล่นที่คุณเคยเข้าร่วม
        </Typography>
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
}

export default Participating;
