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

const Participating = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      try {
        const participantsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate/user/${userId}`,
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

        const postPromises = participants.map(async (participation) => {
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
            console.error("Post does not have users_id", post);
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
            participants: participants.filter(
              (p) => p.post_games_id === post.post_games_id
            ).length,
            userProfileImage: user.user_image,
            userFirstName: user.first_name,
            userLastName: user.last_name,
            hasParticipated: true, // เพิ่มสถานะการเข้าร่วม
          };
        });

        const posts = await Promise.all(postPromises);
        setItems(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
      setLoading(false);
    }

    fetchData();
  }, [userId]);

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
                {`${item.userFirstName} ${item.userLastName}`}
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
              จำนวนคนจะไป : {item.participants}/{item.num_people}
            </Typography>

            <br />

            <Grid container spacing={2} justifyContent="center">
              {!item.hasParticipated && ( // ตรวจสอบสถานะการเข้าร่วม
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
        <Typography sx={{ color: "white" }}>
          ไม่พบโพสต์ที่คุณเข้าร่วม
        </Typography>
      )}
    </div>
  );
}

export default Participating;
