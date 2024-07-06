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

function PostGames() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(accessToken);
      setUserId(decoded.users_id); // Save logged in user ID

      try {
        const userResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${decoded.users_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userResponse.json();

        const postsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/user/${decoded.users_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData = await postsResponse.json();

        const enrichedPosts = postsData.map((post) => ({
          ...post,
          userFirstName: userData.first_name,
          userLastName: userData.last_name,
          userProfileImage: userData.user_image,
        }));

        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }

        // Fetch participants for each post
        const postsWithParticipants = await Promise.all(
          postsData.map(async post => {
            const participantsResponse = await fetch(
              `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate/${post.post_games_id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const participantsData = await participantsResponse.json();

            return {
              ...post,
              participants: participantsData
            };
          })
        );

        setItems(enrichedPosts);
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
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
              วันที่เจอกัน: {item.date_meet}
            </Typography>
            <Typography sx={{ color: "white" }}>
              เวลาที่เจอกัน: {item.time_meet}
            </Typography>

            <br />
            <Typography sx={{ color: "white" }}>{item.detail_post}</Typography>

            <Typography sx={{ color: "white" }}>
              สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
              ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
            </Typography>
            {/* num_people
                  participant */}
            <Typography sx={{ color: "white" }}>
              จำนวนคนจะไป : {item.participant}/{item.num_people}
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
                    zIndex: 0, // กำหนดค่า z-index เพื่อให้การ์ดอยู่เหนือ navbar
                  }}
                >
                  พูดคุย
                </Button>
              </Grid>
            </Grid>
          </div>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>ไม่พบโพสต์</Typography>
      )}
    </div>
  );
}

export default PostGames;
