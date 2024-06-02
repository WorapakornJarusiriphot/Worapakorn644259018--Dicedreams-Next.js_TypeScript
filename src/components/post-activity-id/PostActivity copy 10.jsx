"use client";

import { Grid, Typography, Box, Button, IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment"; // สำหรับปุ่มพูดคุย
import LoginIcon from "@mui/icons-material/Login"; // สำหรับปุ่มเข้าสู่ระบบ
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { format, parseISO, isBefore, isValid } from "date-fns";
import { th } from "date-fns/locale";

import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";


const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  if (!isValid(date)) return "วันที่ไม่ถูกต้อง";
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
  if (!isValid(date)) return "วันที่ไม่ถูกต้อง";
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

const PostActivity = () => {
  const router = useRouter();
  const { id: storeId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) {
      console.error("Store ID is undefined");
      setError("Store ID is undefined");
      return;
    }

    const fetchUserAndPosts = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      try {
        const postsResponse = await fetch(
          `http://localhost:8080/api/postActivity/store/${storeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!postsResponse.ok) {
          const errorText = await postsResponse.text();
          throw new Error(`Failed to fetch posts: ${postsResponse.status} - ${errorText}`);
        }

        const postsData = await postsResponse.json();

        const storesResponse = await fetch(
          `http://localhost:8080/api/store/${storeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!storesResponse.ok) {
          const errorText = await storesResponse.text();
          throw new Error(`Failed to fetch store: ${storesResponse.status} - ${errorText}`);
        }

        const storeData = await storesResponse.json();

        const postsWithStores = postsData
          .filter((post) => post.status_post !== "unActive")
          .map((post) => {
            const postStore = storeData;

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
      } catch (error) {
        console.error("Failed to load data: " + error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [storeId]);

  if (loading) return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  return (
    <div>
      {items.length > 0 ? (
        items.map((item) => (
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
        ))
      ) : (
        <Typography sx={{ color: "white" }}>ไม่พบโพสต์กิจกรรม</Typography>
      )}
    </div>
  );
};

export default PostActivity;
