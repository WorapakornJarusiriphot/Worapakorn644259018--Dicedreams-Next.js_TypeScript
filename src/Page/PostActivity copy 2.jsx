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
import Header from "../components/header/Header";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Filter from "../components/Filter";
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
import CustomizedMenus from "../components/CustomizedMenus";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

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

function PostActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(accessToken);
        setUserId(decoded.users_id);

        const postsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity`, // ดึงโพสต์ทั้งหมด
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        // ดึงข้อมูลผู้ใช้ทั้งหมด
        const usersResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();

        const postsWithUsers = postsData.map((post) => {
          // หา user ที่ตรงกับ store_id ของโพสต์
          const postUser = usersData.find(user => user.users_id === post.store_id);

          return {
            ...post,
            userFirstName: postUser ? postUser.first_name : "Unknown", // ใช้ข้อมูลจาก user
            userLastName: postUser ? postUser.last_name : "Unknown", // ใช้ข้อมูลจาก user
            userProfileImage: postUser ? postUser.user_image : "/images/default-profile.png", // ใช้ภาพเริ่มต้นที่อยู่ใน public folder
            rawCreationDate: post.creation_date, // เก็บข้อมูลวันที่ดิบเพื่อใช้ในการเรียงลำดับ
            creation_date: formatDateTime(post.creation_date),
            date_activity: formatThaiDate(post.date_activity),
            time_activity: formatThaiTime(post.time_activity),
          };
        });

        // เรียงโพสต์ตาม rawCreationDate จากใหม่ไปเก่า
        const sortedPosts = postsWithUsers.sort((a, b) =>
          new Date(b.rawCreationDate) - new Date(a.rawCreationDate)
        );

        setItems(sortedPosts);
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
                alt={`${item.userFirstName} ${item.userLastName}`}
                width={50} // ปรับขนาดตามที่ต้องการ
                height={50}
                layout="fixed"
                style={{ borderRadius: "50%" }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" gutterBottom>
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
            src={item.post_activity_image}
            alt={item.name_activity}
            width={526} // กำหนดขนาดที่เหมาะสม
            height={296}
            layout="responsive"
            sx={{ borderRadius: 1, marginBottom: 2 }} // เพิ่มระยะห่างด้านล่าง
          />

          <br />

          <Typography variant="h6" component="h3" gutterBottom>
            {item.name_activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            วันที่เจอกัน: {item.date_activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            เวลาที่เจอกัน: {item.time_activity}
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
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>ไม่พบโพสต์</Typography>
      )}
    </div>
  );
}

export default PostActivity;
