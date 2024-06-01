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

function PostGames({ id }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');

      try {
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!userResponse.ok) throw new Error('Failed to fetch user details');
        const userData = await userResponse.json();

        const postsResponse = await fetch(
          `http://localhost:8080/api/postGame/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();

        const participantsResponse = await fetch(
          `http://localhost:8080/api/participate`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!participantsResponse.ok)
          throw new Error('Failed to fetch participants');
        const participantsData = await participantsResponse.json();

        const postsWithParticipants = postsData.map((post) => {
          const postParticipants = participantsData.filter(
            (participant) => participant.post_games_id === post.post_games_id
          );
          return {
            ...post,
            participants: postParticipants.length + 1,
            userFirstName: userData.first_name,
            userLastName: userData.last_name,
            userProfileImage: userData.user_image,
            creation_date: post.creation_date,
          };
        });

        setItems(postsWithParticipants);
      } catch (error) {
        setError('Failed to load data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Typography>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            borderColor: 'grey.800',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 2,
            marginTop: 3,
            color: 'white',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#121212',
            zIndex: 0,
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems='center'
            sx={{ marginBottom: '16px' }}
          >
            <Grid item>
              <img
                src={item.userProfileImage}
                alt={`${item.userFirstName} ${item.userLastName}`}
                width='50'
                height='50'
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '50px',
                  height: '50px',
                }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant='subtitle1' gutterBottom>
                {item.userFirstName} {item.userLastName}
              </Typography>
              <Typography variant='body2'>{item.creation_date}</Typography>
            </Grid>
            <Grid item>
              <IconButton
                sx={{
                  color: 'white',
                }}
                aria-label='settings'
              >
                <MoreVertOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Image
            src={item.games_image}
            alt={item.name_games}
            width={526}
            height={296}
            layout='responsive'
            style={{ marginBottom: '16px' }}
          />

          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
            {item.name_games}
          </Typography>
          <Typography sx={{ color: 'white' }}>
            วันที่เจอกัน: {item.date_meet}
          </Typography>
          <Typography sx={{ color: 'white' }}>
            เวลาที่เจอกัน: {item.time_meet}
          </Typography>

          <br />
          <Typography sx={{ color: 'white' }}>{item.detail_post}</Typography>

          <Typography sx={{ color: 'white' }}>
            สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน) ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
          </Typography>
          <Typography sx={{ color: 'white' }}>
            จำนวนคนจะไป : {item.participants}/{item.num_people}
          </Typography>

          <br />

          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} sm={6}>
              <Button
                variant='contained'
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                }}
              >
                เข้าร่วม
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant='contained'
                fullWidth
                startIcon={<CommentIcon />}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  border: '1px solid white',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                  zIndex: 0,
                }}
              >
                พูดคุย
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: 'white' }}>ไม่พบโพสต์ที่คุณเคยโพสต์</Typography>
      )}
    </div>
  );
}

export default PostGames;