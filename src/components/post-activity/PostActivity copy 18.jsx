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
import { format, parseISO, isBefore, isValid } from "date-fns";
import { th } from "date-fns/locale";

const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  if (!isValid(date)) return "Invalid date";
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
  if (!isValid(date)) return "Invalid date";
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", { locale: th });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  if (!timeString) return "Invalid time";
  const [hours, minutes] = timeString.split(":");
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

const isPastDateTime = (date, time) => {
  if (!date || !time) return false;
  const [hours, minutes] = time.split(":");
  const eventDate = new Date(date);
  eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return isBefore(eventDate, new Date());
};

function PostActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      try {
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          setUserId(decoded.users_id);

          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/store/${decoded.store_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          const postsData = await postsResponse.json();

          const storesResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/store/${decoded.store_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!storesResponse.ok) throw new Error("Failed to fetch store");
          const storeData = await storesResponse.json(); // คาดว่าข้อมูลนี้เป็น Object

          const postsWithStores = postsData
            .filter((post) => post.status_post !== "unActive")
            .map((post) => {
              const postStore = storeData; // ใช้ storeData แทน storesData.find

              const rawCreationDate = parseISO(post.creation_date);
              if (!isValid(rawCreationDate)) {
                console.error("Invalid date format:", post.creation_date);
              }

              const isPast = isPastDateTime(
                post.date_activity,
                post.time_activity
              );

              return {
                ...post,
                userFirstName: postStore ? postStore.name_store : "Unknown",
                userProfileImage: postStore
                  ? postStore.store_image.replace("http}", "http") // แก้ไข URL ของรูปภาพให้ถูกต้อง
                  : "/images/default-profile.png",
                rawCreationDate: rawCreationDate,
                creation_date: formatDateTime(post.creation_date),
                date_activity: formatThaiDate(post.date_activity),
                time_activity: formatThaiTime(post.time_activity),
                isPast: isPast,
              };
            });

          const sortedPosts = postsWithStores.sort((a, b) => {
            if (a.isPast && !b.isPast) return 1;
            if (!a.isPast && b.isPast) return -1;
            return b.rawCreationDate - a.rawCreationDate;
          });

          setItems(sortedPosts);
        } else {
          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity`
          );
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          const postsData = await postsResponse.json();

          const storesResponse = await fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/store`);
          if (!storesResponse.ok) throw new Error("Failed to fetch stores");
          const storesData = await storesResponse.json();

          const postsWithStores = postsData
            .filter((post) => post.status_post !== "unActive")
            .map((post) => {
              const postStore = storesData.find(
                (store) => store.store_id === post.store_id
              );

              const rawCreationDate = parseISO(post.creation_date);
              if (!isValid(rawCreationDate)) {
                console.error("Invalid date format:", post.creation_date);
              }

              const isPast = isPastDateTime(
                post.date_activity,
                post.time_activity
              );

              return {
                ...post,
                userFirstName: postStore ? postStore.name_store : "Unknown",
                userProfileImage: postStore
                  ? postStore.store_image.replace("http}", "http:") // แก้ไข URL ของรูปภาพให้ถูกต้อง
                  : "/images/default-profile.png",
                rawCreationDate: rawCreationDate,
                creation_date: formatDateTime(post.creation_date),
                date_activity: formatThaiDate(post.date_activity),
                time_activity: formatThaiTime(post.time_activity),
                isPast: isPast,
              };
            });

          const sortedPosts = postsWithStores.sort((a, b) => {
            if (a.isPast && !b.isPast) return 1;
            if (!a.isPast && b.isPast) return -1;
            return b.rawCreationDate - a.rawCreationDate;
          });

          setItems(sortedPosts);
        }
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  if (loading)
    return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.post_activity_id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#424242",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <Image
                src={item.userProfileImage}
                alt={`${item.userFirstName}`}
                width={50}
                height={50}
                layout="fixed"
                style={{ borderRadius: "50%" }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" gutterBottom>
                {item.userFirstName}
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

          <div style={{ position: "relative" }}>
            <Image
              src={item.post_activity_image}
              alt={item.name_activity}
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
                โพสต์กิจกรรมนี้ได้สิ้นสุดลงแล้ว
              </div>
            )}
          </div>

          <Typography variant="h6" component="h3" gutterBottom>
            {item.name_activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            วันที่กิจกรรมสิ้นสุด: {item.date_activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            เวลาที่กิจกรรมสิ้นสุด: {item.time_activity}
          </Typography>

          <br />

          <Typography variant="body1" gutterBottom>
            {item.detail_post}
          </Typography>
          <Typography variant="body1" gutterBottom>
            สถานที่: 43/5 ถนนราชดำเนิน (ถนนต้นสน)
            ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
          </Typography>
        </Box>
      ))}
      {items.length === 0 && <Typography sx={{ color: "white" }}></Typography>}
    </div>
  );
}

export default PostActivity;
