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
import PostGames from "./PostGames";
import PostActivity from "./PostActivity";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function Search() {
  // TODO remove, this demo shouldn't need to reset the theme.
  // กำหนดธีมสีเข้ม
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#fff",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& label": {
              color: "white",
            },
            "& .MuiInputBase-root": {
              color: "white",
              "& fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          },
        },
      },
    },
  });

  const router = useRouter();
  const { search } = router.query;
  const [activities, setActivities] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        try {
          const [activitiesRes, gamesRes] = await Promise.all([
            fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity?search=${search}`),
            fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame?search=${search}`),
          ]);

          if (!activitiesRes.ok || !gamesRes.ok) {
            throw new Error("Failed to fetch data");
          }

          const activitiesData = await activitiesRes.json();
          const gamesData = await gamesRes.json();

          console.log("Fetched activities:", activitiesData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ
          console.log("Fetched games:", gamesData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ

          setActivities(activitiesData);
          setGames(gamesData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [search]);

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" color={"white"} sx={{ textAlign: "left" }}>
              นัดเล่นบอร์ดเกมแบบออนไซต์
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: "right" }}></Grid>
        </Grid>

        <hr className=" mt-5 mb-5" sx={{ background: "grey.800" }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
            <Filter />
          </Grid>
          <Grid item xs={12} md={8}>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <PostActivity key={activity.post_activity_id} {...activity} />
              ))
            ) : (
              <p>ไม่พบกิจกรรมที่ตรงกับที่ค้นหา</p>
            )}
            {games.length > 0 ? (
              games.map((game) => (
                <PostGames key={game.post_games_id} {...game} />
              ))
            ) : (
              <p>ไม่พบเกมที่ตรงกับที่ค้นหา</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Search;
