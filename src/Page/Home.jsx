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
  const { data, loading, error } = useFetchPosts(
    selectedCategory,
    searchTerm,
    number
  );

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const filteredData = data.filter((post) => {
    if (selectedCategory === "postGames" && post.name_games) {
      return post.participants >= number;
    } else if (selectedCategory === "postActivity" && post.name_activity) {
      return true;
    } else if (selectedCategory === "") {
      return post.participants >= number;
    }
    return false;
  });

  // เพิ่มการล็อกข้อมูลเพื่อดูผลลัพธ์
  console.log("Filtered data HOME:", filteredData);

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
