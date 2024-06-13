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

// import { useRouter } from "next/navigator";

import { useEffect, useState } from "react";

import { format, parseISO, compareDesc } from "date-fns";
import { th } from "date-fns/locale";

// const items = [
//   {
//     id: 1,
//     date: "วันอาทิตย์ที่ 21 กุมภาพันธ์  พ.ศ. 2566",
//     date_meet: "วันอาทิตย์ที่ 24 มีนาคม  พ.ศ. 2566",
//     time_meet: "14:00 น.",
//     user: "วรปกร จารุศิริพจน์",
//     title: "Werewolf",
//     description: "เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก",
//     num_people: 5,
//     participant: 1,
//     image:
//       "https://promotions.co.th/wp-content/uploads/2018/06/Lazada-Boardgame-2.jpg",
//     profile:
//       "https://scontent.fkdt3-1.fna.fbcdn.net/v/t1.6435-1/128520468_708312693415305_7662898639450323422_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEvGCGsdcArxffFEo_CTsIpevnKI8_KTQd6-cojz8pNB_RFB8aAFgtrdC7tmNreCahg44tkLiiF9vuCBD2S08Ga&_nc_ohc=Uw6hP78zOX8Ab7yzKhn&_nc_ht=scontent.fkdt3-1.fna&oh=00_AfD0jl3Q2NBLvhHUH6x2YPsK1-ceW-HjDuvEBfVdhg03Kw&oe=66548C26",
//   },
//   {
//     id: 2,
//     date: "วันอาทิตย์ที่ 22 กุมภาพันธ์  พ.ศ. 2566",
//     date_meet: "วันอาทิตย์ที่ 31 มีนาคม  พ.ศ. 2566",
//     time_meet: "15:00 น.",
//     user: "ณัฐวุฒิ แก้วมหา",
//     title: "ซาเลม 1692",
//     description: "เอา ซาเลม 1692 ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก",
//     num_people: 5,
//     participant: 1,
//     image: "https://live.staticflickr.com/65535/49262314468_e307bd2a55_b.jpg",
//     profile:
//       "https://scontent.fkdt3-1.fna.fbcdn.net/v/t1.6435-9/64302371_2291674051160875_4818937659546140672_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHF4xk0-rddhfIOGu4A6ETaMhraglDnixIyGtqCUOeLEkoQnYryeJa9YPA-E8HzB9-nuCR5wGZLAxZhEO_qTdBB&_nc_ohc=Ppnix1PQWx8Q7kNvgFqzbpa&_nc_ht=scontent.fkdt3-1.fna&oh=00_AfCSiyasCgBQsH6Xmg0ziOu_tBrRCrYSdY0q5dai1ocNHQ&oe=6654AB75",
//   },
//   {
//     id: 3,
//     date: "วันอาทิตย์ที่ 23 กุมภาพันธ์  พ.ศ. 2566",
//     date_meet: "วันอาทิตย์ที่ 7 เมษายน  พ.ศ. 2566",
//     time_meet: "16:00 น.",
//     user: "นวพร บุญก่อน",
//     title: "Spyfall",
//     description: "เอา Spyfall ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก",
//     num_people: 5,
//     participant: 1,
//     image:
//       "https://whatsericplaying.files.wordpress.com/2016/01/spyfall-006.jpg?w=1180",
//     profile:
//       "https://scontent.fkdt3-1.fna.fbcdn.net/v/t1.6435-9/69261198_442076069735088_3232231141012406272_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHFaL86TpC1_vVNPWG1a9sA8ifm7PFiOUjyJ-bs8WI5SPf7tix49NIxmVDJWLnsGeLTePhvqTBajsbKjgIVq6Ar&_nc_ohc=d6YjEwdNkRgQ7kNvgHqfUje&_nc_ht=scontent.fkdt3-1.fna&oh=00_AfAvG3bUk9BKuYKdGhXnNoglRZid_wtaaqu-a_ICL2EOeQ&oe=6654B669",
//   },
// ];

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

function Participating() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(accessToken);
      setUserId(decoded.users_id);

      try {
        const participantsResponse = await fetch(
          `http://localhost:8080/api/participate`,
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
          (part) => part.user_id === decoded.users_id
        );
        const postPromises = myParticipations.map(async (participation) => {
          const postResponse = await fetch(
            `http://localhost:8080/api/postGame/${participation.post_games_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!postResponse.ok) throw new Error("Failed to fetch post");
          const post = await postResponse.json();

          console.log("Post data:", post);

          if (!post.users_id) {
            console.error("Post does not have users_id", post);
            throw new Error("Post does not have users_id");
          }

          const userResponse = await fetch(
            `http://localhost:8080/api/users/${post.users_id}`,
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
            participants: postParticipants.length + 1, // นับผู้เข้าร่วมทั้งหมด
            userProfileImage: user.user_image,
            userFirstName: user.first_name,
            userLastName: user.last_name,
            hasParticipated: postParticipants.some(
              (p) => p.user_id === decoded.users_id
            ),
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
        console.error("Error fetching data:", error);
        setError(error.message);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

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
        <Typography sx={{ color: "white" }}>
          ไม่พบโพสต์ที่คุณเข้าร่วม
        </Typography>
      )}
    </div>
  );
}

export default Participating;
