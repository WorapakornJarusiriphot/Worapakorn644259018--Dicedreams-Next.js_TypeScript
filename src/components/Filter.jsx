"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider, createTheme } from "@mui/material";
import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { useRouter, useSearchParams } from "next/navigation";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useState } from "react";

const ProSpan = styled("span")({
  display: "inline-block",
  height: "1em",
  width: "1em",
  verticalAlign: "middle",
  marginLeft: "0.3em",
  marginBottom: "0.08em",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundImage: "url(https://mui.com/static/x/pro.svg)",
});

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span style={{ color: "white" }}>
      <strong>{componentName}</strong>
    </span>
  );

  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5} component="span">
        <Tooltip title="Included on Pro package">
          <a
            href="https://mui.com/x/introduction/licensing/#pro-plan"
            aria-label="Included on Pro package"
          >
            <ProSpan />
          </a>
        </Tooltip>
        {content}
      </Stack>
    );
  }

  return content;
}

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

function Filter({
  selectedCategory = "", // กำหนดค่าเริ่มต้นเป็น string ว่าง
  handleCategoryChange,
  handleSearchChange,
  searchTerm,
  handleNumberChange,
  number, // กำหนดค่าเริ่มต้นให้ number เป็น 1 เพื่อป้องกัน undefined
  handleDateChange,
  selectedDate,
  handleTimeChange,
  selectedTime,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGames, setSelectedGames] = useState({
    "Magic the gathering": false,
    "Warhammer 40k": false,
    "Kill Team": false,
    Werewolf: false,
    Coup: false,
    Uno: false,
    เกมเศรษฐี: false,
    Splendor: false,
  });

  const handleCheckboxChange = (event) => {
    setSelectedGames({
      ...selectedGames,
      [event.target.value]: event.target.checked,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // ป้องกันการกระทำเริ่มต้น (เช่นการรีเฟรชหน้า)
      executeSearch(); // เรียกฟังก์ชันการค้นหา
    }
  };

  const executeSearch = () => {
    const query = new URLSearchParams();

    Object.keys(selectedGames).forEach((game) => {
      if (selectedGames[game]) {
        query.append("search", game);
      }
    });

    if (searchTerm && searchTerm.trim()) {
      const terms = searchTerm.trim().split(/\s+/); // แยกคำค้นหาด้วยเว้นวรรค
      terms.forEach((term) => {
        query.append("search", term); // เพิ่มคำค้นหาแต่ละคำใน query string
      });
    }

    if (selectedDate) {
      query.set("search_date_meet", dayjs(selectedDate).format("MM/DD/YYYY"));
    }

    if (selectedTime) {
      query.set("search_time_meet", dayjs(selectedTime).format("HH:mm"));
    }

    if (number) {
      query.set("search_num_people", number);
    }

    // ถ้ามีพารามิเตอร์การค้นหาใด ๆ ถูกตั้งค่า
    if (query.toString()) {
      router.push(`/search?${query.toString()}`); // ไปยังหน้าผลการค้นหาพร้อมกับ query string
    } else {
      // ถ้าไม่มีพารามิเตอร์การค้นหา ไปที่หน้าแรก (แสดงโพสต์ทั้งหมด)
      router.push(`/`);
    }
  };

  return (
    <div>
      <br />
      <ThemeProvider theme={darkTheme}>
        <TextField
          fullWidth
          type="search"
          id="default-search"
          label="ค้นหาโพสต์"
          variant="outlined"
          placeholder="ค้นหาโพสต์"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <br />
        <br />

        <FormControl fullWidth sx={{ marginTop: "10px" }}>
          <InputLabel id="category-select-label">
            ค้นหาประเภทโพสต์และผู้คนและร้านค้า
          </InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="โพสต์ทั้งหมดและผู้คนและร้านค้า"
            onChange={handleCategoryChange}
          >
            <MenuItem value="" id="All-posts-people-store">
              โพสต์ทั้งหมดและผู้คนและร้านค้า
            </MenuItem>
            <MenuItem value="postGames" id="postGames">
              โพสต์นัดเล่น
            </MenuItem>
            <MenuItem value="postActivity" id="postActivity">
              โพสต์กิจกรรม
            </MenuItem>
            <MenuItem value="peopleStore" id="peopleStore">
              ผู้คนและร้านค้า
            </MenuItem>
            <MenuItem value="people" id="people">
              ผู้คน
            </MenuItem>
            <MenuItem value="store" id="store">
              ร้านค้า
            </MenuItem>
          </Select>
        </FormControl>

        <br />
        <br />

        <FormControl fullWidth>
          <InputLabel id="number-select-label">จำนวนคนจะไป</InputLabel>
          <Select
            labelId="number-select-label"
            id="number-select"
            value={number}
            label="จำนวนคนจะไป"
            onChange={handleNumberChange}
          >
            {Array.from({ length: 75 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <br />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={darkTheme}>
            <DemoContainer
              components={[
                "DatePicker",
                "TimePicker",
                "DateTimePicker",
                "DateRangePicker",
              ]}
            >
              <DemoItem
                label={
                  <Label componentName="ค้นหาวันที่เล่น" valueType="date" />
                }
              >
                <DatePicker
                  id="search-date_meet"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      InputLabelProps: { style: { color: "white" } },
                      InputProps: { style: { color: "white" } },
                    },
                  }}
                />
              </DemoItem>
              <DemoItem
                label={
                  <Label componentName="ค้นหาเวลาที่เล่น" valueType="time" />
                }
              >
                <TimePicker
                  id="search-time_meet"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      InputLabelProps: { style: { color: "white" } },
                      InputProps: { style: { color: "white" } },
                    },
                  }}
                />
              </DemoItem>
            </DemoContainer>
          </ThemeProvider>
        </LocalizationProvider>

        <br />

        <FormControl component="fieldset">
          <Button
            variant="contained"
            id="search"
            onClick={executeSearch}
            sx={{ background: "white", color: "black", marginTop: "10px" }}
          >
            ค้นหา
          </Button>

          <br />

          <Typography variant="h6" gutterBottom style={{ color: "white" }}>
            บอร์ดเกมยอดฮิตที่แนะนำ
          </Typography>
          {Object.keys(selectedGames).map((game) => (
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ color: "white" }}
                  checked={selectedGames[game]}
                  onChange={handleCheckboxChange}
                  id="Checkbox-search"
                />
              }
              label={game}
              value={game}
              sx={{ color: "white", borderColor: "white" }}
              key={game}
            />
          ))}
        </FormControl>
      </ThemeProvider>
    </div>
  );
}

export default Filter;
