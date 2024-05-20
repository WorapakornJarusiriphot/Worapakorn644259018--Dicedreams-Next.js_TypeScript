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

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [number, setNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // เพิ่ม useState สำหรับ selectedDate
  const { data, loading, error } = useFetchPosts(
    selectedCategory,
    searchTerm,
    number,
    selectedDate // เพิ่ม selectedDate
  );

  // เพิ่มฟังก์ชัน handleDateChange
  const handleDateChange = (newDate) => {
    console.log("Date selected:", newDate);
    setSelectedDate(newDate);
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

  // เปลี่ยน const เป็น let เพื่อให้สามารถเปลี่ยนแปลงค่าได้
  let filteredData = data.filter((post) => {
    if (selectedCategory === "postGames" && post.name_games) {
      return post.participants >= number;
    } else if (selectedCategory === "postActivity" && post.name_activity) {
      return true;
    } else if (selectedCategory === "") {
      return post.participants >= number;
    }
    return false;
  });

  console.log("Filtered data HOME:", filteredData);

  // ตรวจสอบการกรองข้อมูลตามวันที่และประเภทโพสต์
  if (selectedDate) {
    filteredData = filteredData.filter((post) => {
      const postDate = post.date_meet || post.date_activity;
      return dayjs(postDate).isSame(selectedDate, "day");
    });
    console.log("Filtered data by date:", filteredData);
  }

  const [value, setValue] = React.useState(dayjs("2022-04-17T15:30"));
  // const [number, setNumber] = useState("");

  const handleChange = (event) => {
    setNumber(event.target.value);
  };

  const [selectedCurrency, setSelectedCurrency] = useState(""); // เพิ่มตัวแปร state นี้

  // const handleNumberChange = (event) => {
  //   setNumber(event.target.value);
  // };

  const handleCurrencyChange = (event) => {
    // สร้างฟังก์ชัน handleCurrencyChange
    setSelectedCurrency(event.target.value);
  };

  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  // const handleCategoryChange = (event) => {
  //   setSelectedCategory(event.target.value);
  // };

  const handleSearch = () => {
    console.log("Search term:", searchTerm); // ตรวจสอบคำที่ใช้ในการค้นหา
    console.log("Selected category:", selectedCategory); // ตรวจสอบหมวดหมู่ที่เลือก
    console.log("Number of participants:", number); // ตรวจสอบจำนวนผู้เข้าร่วม
    console.log("Selected date:", selectedDate); // ตรวจสอบวันที่เลือก
    if (searchTerm.trim()) {
      router.push(`/search?search=${searchTerm}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const currencies = [
    {
      value: "โพสต์ทั้งหมด",
      label: "โพสต์ทั้งหมด",
    },
    {
      value: "โพสต์นัดเล่น",
      label: "โพสต์นัดเล่น",
    },
    {
      value: "โพสต์กิจกรรม",
      label: "โพสต์กิจกรรม",
    },
  ];

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
            <Filter
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              handleSearch={handleSearch}
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleNumberChange={handleNumberChange}
              number={number}
              handleCurrencyChange={handleCurrencyChange}
              selectedCurrency={selectedCurrency}
              handleDateChange={handleDateChange} // เพิ่ม handleDateChange
              selectedDate={selectedDate} // เพิ่ม selectedDate
            />
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedCategory === "postActivity" || selectedCategory === "" ? (
              <PostActivity
                data={filteredData}
                loading={loading}
                error={error}
              />
            ) : null}
            {selectedCategory === "postGames" || selectedCategory === "" ? (
              <PostGames data={filteredData} loading={loading} error={error} />
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
