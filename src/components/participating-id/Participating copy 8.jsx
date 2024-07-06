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
import InputAdornment from "@mui/material/InputAdornment";
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

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from "jwt-decode";

import { useRouter } from "next/navigation";
//import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { format, parseISO, compareDesc } from "date-fns";
import { th } from "date-fns/locale";



const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'", {
    locale: th,
  });
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

function Participating() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (!userId) return; // ตรวจสอบว่ามีการตั้งค่า userId ก่อน

    async function fetchData() {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

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
        if (!participantsResponse.ok) throw new Error("Failed to fetch participants");
        const participants = await participantsResponse.json();

        const myParticipations = participants.filter(
          (part) => part.user_id === userId
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

          return {
            ...post,
            participants: myParticipations.filter(
              (p) => p.post_games_id === post.post_games_id
            ).length,
            userProfileImage: user.user_image,
            userFirstName: user.first_name,
            userLastName: user.last_name,
            hasParticipated: true,
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
          return compareDesc(new Date(a.creation_date), new Date(b.creation_date));
        });

        setItems(sortedPosts);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    fetchData();
  }, [userId]);

  if (loading) return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
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
          <Grid container spacing={2} alignItems="center" sx={{ marginBottom: "16px" }}>
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
              <Typography variant="subtitle1" gutterBottom sx={{ color: "white" }}>
                {`${item.userFirstName} ${item.userLastName}`}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.formattedCreationDate}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton sx={{ color: "white" }} aria-label="settings">
                <MoreVertOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>

          <div style={{ position: "relative" }}>
            <Image
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
            <Typography sx={{ color: "white", fontWeight: "bold" }}>{item.name_games}</Typography>
            <Typography sx={{ color: "white" }}>วันที่เจอกัน: {formatThaiDate(item.date_meet)}</Typography>
            <br />
            <Typography sx={{ color: "white" }}>{item.detail_post}</Typography>
            <Typography sx={{ color: "white" }}>
              สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน) ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
            </Typography>
            <Typography sx={{ color: "white" }}>
              จำนวนคนจะไป : {item.participants}/{item.num_people}
            </Typography>
            <br />

            <Grid container spacing={2} justifyContent="center">
              {!item.hasParticipated && !item.isPast && (
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
                  >
                    เข้าร่วม
                  </Button>
                </Grid>
              )}
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
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                      zIndex: 0,
                    }}
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
        <Typography sx={{ color: "white" }}>ไม่พบโพสต์ที่คุณเข้าร่วม</Typography>
      )}
    </div>
  );
}

export default Participating;
