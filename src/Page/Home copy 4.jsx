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
import useFetchPosts from "./useFetchPosts";
import { useState } from "react";
import { useRouter } from "next/navigation"; // เพิ่มการใช้ useRouter
import dayjs from "dayjs";
import { People } from "@/components/dashboard/overview/people";
import { useEffect } from "react";
import axios from "axios";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [number, setNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [postGames, setPostGames] = useState([]);
  const [postActivities, setPostActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [
        usersResponse,
        storesResponse,
        postGamesResponse,
        postActivitiesResponse,
      ] = await Promise.all([
        axios.get(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/users"
        ),
        axios.get(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/store"
        ),
        axios.get(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/search"
        ),
        axios.get(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/search"
        ),
      ]);

      // Update state only if data has changed
      setUsers((prev) =>
        JSON.stringify(prev) !== JSON.stringify(usersResponse.data)
          ? usersResponse.data
          : prev
      );
      setStores((prev) =>
        JSON.stringify(prev) !== JSON.stringify(storesResponse.data)
          ? storesResponse.data
          : prev
      );
      setPostGames((prev) =>
        JSON.stringify(prev) !== JSON.stringify(postGamesResponse.data)
          ? postGamesResponse.data
          : prev
      );
      setPostActivities((prev) =>
        JSON.stringify(prev) !== JSON.stringify(postActivitiesResponse.data)
          ? postActivitiesResponse.data
          : prev
      );
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const handleDateChange = (newDate) => {
    console.log("Date selected:", newDate);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    console.log("Time selected:", newTime);
    setSelectedTime(newTime);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
    console.log("Selected category:", selectedCategory);
    console.log("Number of participants:", number);
    console.log("Selected date:", selectedDate);
    if (searchTerm.trim()) {
      router.push(`/search?search=${searchTerm}`);
    }
  };

  const filteredPostGames = postGames.filter((post) => {
    if (selectedDate) {
      const postDate = post.date_meet;
      return dayjs(postDate).isSame(selectedDate, "day");
    }
    return true;
  });

  const filteredPostActivities = postActivities.filter((post) => {
    if (selectedDate) {
      const postDate = post.date_activity;
      return dayjs(postDate).isSame(selectedDate, "day");
    }
    return true;
  });

  const filteredUsers = users.filter((user) => {
    return (
      user.first_name.includes(searchTerm) ||
      user.last_name.includes(searchTerm) ||
      user.username.includes(searchTerm)
    );
  });

  const filteredStores = stores.filter((store) => {
    return store.name_store.includes(searchTerm);
  });

  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Typography
              variant="h4"
              color={"white"}
              sx={{
                textAlign: "left",
                fontSize: {
                  xs: "1.5rem", // ขนาดตัวอักษรสำหรับหน้าจอเล็ก
                  sm: "2rem", // ขนาดตัวอักษรสำหรับหน้าจอปานกลาง
                  md: "2.5rem", // ขนาดตัวอักษรสำหรับหน้าจอขนาดใหญ่ขึ้น
                  lg: "3rem", // ขนาดตัวอักษรสำหรับหน้าจอขนาดใหญ่
                },
              }}
            >
              นัดเล่นบอร์ดเกมแบบออนไซต์
            </Typography>
          </Grid>
        </Grid>

        <hr className=" mt-5 mb-5" sx={{ background: "grey.800" }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
            <Filter
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              handleSearch={handleSearch}
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleNumberChange={handleNumberChange}
              number={number}
              handleDateChange={handleDateChange}
              selectedDate={selectedDate}
              handleTimeChange={handleTimeChange}
              selectedTime={selectedTime}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedCategory === "postActivity" || selectedCategory === "" ? (
              <PostActivity data={filteredPostActivities} />
            ) : null}
            {selectedCategory === "postGames" || selectedCategory === "" ? (
              <PostGames data={filteredPostGames} />
            ) : null}
            {selectedCategory === "people" ? (
              <People users={filteredUsers} stores={[]} />
            ) : null}
            {selectedCategory === "store" ? (
              <People users={[]} stores={filteredStores} />
            ) : null}
            {selectedCategory === "peopleStore" ? (
              <People users={filteredUsers} stores={filteredStores} />
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
