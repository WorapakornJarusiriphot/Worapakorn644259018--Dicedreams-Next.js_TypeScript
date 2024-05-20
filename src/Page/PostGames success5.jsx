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
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // ดึงโพสต์ทั้งหมดโดยไม่ตรวจสอบ access token
        const postsResponse = await fetch(
          `http://localhost:8080/api/postGame`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        // ดึงข้อมูลผู้ใช้ทั้งหมด
        const usersResponse = await fetch(`http://localhost:8080/api/users`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();

        // ดึงข้อมูล participants
        const participantsResponse = await fetch(
          `http://localhost:8080/api/participate`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!participantsResponse.ok)
          throw new Error("Failed to fetch participants");
        const participantsData = await participantsResponse.json();

        const postsWithParticipants = postsData
          .filter((post) => post.status_post === "active") // กรองโพสต์ที่สถานะเป็น active
          .map((post) => {
            const postParticipants = participantsData.filter(
              (participant) => participant.post_games_id === post.post_games_id
            );

            // หา user ที่ตรงกับ users_id ของโพสต์
            const postUser = usersData.find(
              (user) => user.users_id === post.users_id
            );

            return {
              ...post,
              participants: postParticipants.length + 1, // Adding 1 to the count of participants
              userFirstName: postUser ? postUser.first_name : "Unknown", // ใช้ข้อมูลจาก user
              userLastName: postUser ? postUser.last_name : "Unknown", // ใช้ข้อมูลจาก user
              userProfileImage: postUser
                ? postUser.user_image
                : "default-image-url", // ใช้ข้อมูลจาก user
              rawCreationDate: post.creation_date, // เก็บข้อมูลวันที่ดิบเพื่อใช้ในการเรียงลำดับ
              creation_date: formatDateTime(post.creation_date),
              date_meet: post.date_meet,
              time_meet: post.time_meet,
            };
          });

        // กรองโพสต์ที่เวลานัดหมายผ่านไปแล้ว
        const currentTime = new Date();
        const filteredPosts = postsWithParticipants.filter((post) => {
          const postDateTime = new Date(`${post.date_meet}T${post.time_meet}`);
          return postDateTime > currentTime;
        });

        // เรียงโพสต์ตาม rawCreationDate จากใหม่ไปเก่า
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

    const fetchUserAndPosts = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          setUserId(decoded.users_id);
        } catch (error) {
          setError("Invalid access token.");
        }
      }

      await fetchPosts();
    };

    fetchUserAndPosts();
  }, []);

  const handleButtonClick = (event, redirectUrl) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000); // รอ 2 วินาทีก่อนเปลี่ยนหน้า
      return;
    }

    router.push(redirectUrl);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
              <img
                src={item.userProfileImage}
                alt={`${item.userFirstName} ${item.userLastName}`}
                width="50"
                height="50"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "50px",
                  height: "50px",
                }}
              />
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

          <Image
            src={item.games_image}
            alt={item.name_games}
            width={526} // ควรให้ค่าเป็นตัวเลขพิกเซล
            height={296} // ควรให้ค่าเป็นตัวเลขพิกเซล
            layout="responsive" // ใช้ layout แบบ responsive เพื่อให้ภาพปรับขนาดตามขนาดของ container
            style={{ marginBottom: "16px" }} // กำหนด margin ด้านล่าง
          />
          <div className="text-left">
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {item.name_games}
            </Typography>
            <Typography sx={{ color: "white" }}>
              วันที่เจอกัน: {formatThaiDate(item.date_meet)}
            </Typography>
            <Typography sx={{ color: "white" }}>
              เวลาที่เจอกัน: {formatThaiTime(item.time_meet)}
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
              {item.users_id !== userId && (
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
                    onClick={(event) =>
                      handleButtonClick(
                        event,
                        `/postGames/${item.post_games_id}`
                      )
                    }
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
                    "&:hover": {
                      backgroundColor: "#333333",
                    },
                    zIndex: 0,
                  }}
                  onClick={(event) =>
                    handleButtonClick(
                      event,
                      `/postGames/${item.post_games_id}/chat`
                    )
                  }
                >
                  พูดคุย
                </Button>
              </Grid>
            </Grid>
          </div>
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
    </div>
  );
}

export default PostGames;
