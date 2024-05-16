'use client';

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

function Home() {
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
            <PostActivity />
            <PostGames />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
