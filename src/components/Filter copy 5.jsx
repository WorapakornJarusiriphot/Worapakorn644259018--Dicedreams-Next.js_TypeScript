"use client";

import {
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useRouter } from "next/navigation"; // เพิ่มการใช้ useRouter

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
    // กำหนดค่าเริ่มต้นของ TextField ให้เข้ากับธีมสีเข้ม
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
  selectedCategory,
  handleCategoryChange,
  handleSearch,
  handleSearchChange,
  searchTerm,
  handleNumberChange,
  number,
  handleCurrencyChange,
  selectedCurrency,
  handleDateChange, // เพิ่มฟังก์ชัน handleDateChange
  selectedDate, // เพิ่ม prop selectedDate
  handleTimeChange, // เพิ่ม handleTimeChange
  selectedTime, // เพิ่ม selectedTime
}) {
  const router = useRouter();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
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
            ค้นหาประเภทโพสต์และผู้คน
          </InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="ค้นหาประเภทโพสต์และผู้คน"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">โพสต์ทั้งหมดและผู้คน</MenuItem>
            <MenuItem value="post">โพสต์ทั้งหมด</MenuItem>
            <MenuItem value="postGames">โพสต์นัดเล่น</MenuItem>
            <MenuItem value="postActivity">โพสต์กิจกรรม</MenuItem>
            <MenuItem value="people">ผู้คน</MenuItem>
          </Select>
        </FormControl>

        <br />
        <br />

        <FormControl fullWidth>
          <InputLabel id="number-select-label">
            จำนวนผู้เล่นที่ว่างตั้งแต่
          </InputLabel>
          <Select
            labelId="number-select-label"
            id="number-select"
            value={number}
            label="จำนวนผู้เล่นที่ว่างตั้งแต่"
            onChange={handleNumberChange}
          >
            {/* วนลูปเพื่อสร้าง MenuItem สำหรับตัวเลือกตั้งแต่ 1 ถึง 75 */}
            {Array.from({ length: 75 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <br />
        <br />
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <DatePicker
              label="เลือกวัน"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker", "TimePicker"]}>
            <TimePicker
              label="เลือกเวลา"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider> */}
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
                  // slotProps={{
                  //   textField: {
                  //     variant: "outlined",
                  //     InputLabelProps: { style: { color: "white" } },
                  //     InputProps: { style: { color: "white" } },
                  //   },
                  // }}
                  value={selectedTime}
                  onChange={handleTimeChange}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              </DemoItem>
              {/* <DemoItem
                label={
                  <Label componentName="ค้นหาวันและเวลาที่เล่น" valueType="date time" />
                }
              >
<DatePicker
  slots={{
    textField: (params) => (
      <TextField
        {...params}
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{ style: { color: "white" } }}
      />
    ),
  }}
/>

              </DemoItem> */}
            </DemoContainer>
          </ThemeProvider>
        </LocalizationProvider>

        <br />

        <FormControl component="fieldset">
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ background: "white", color: "black", marginTop: "10px" }}
          >
            ค้นหา
          </Button>

          <br />

          <Typography variant="h6" gutterBottom style={{ color: "white" }}>
            เกมที่สนใจ
          </Typography>
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Werewolf"
            value="Werewolf"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Coup"
            value="Coup"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Uno"
            value="Uno"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Magic the gethering"
            value="Magic the gethering"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="เกมเศรษฐี"
            value="เกมเศรษฐี"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Warhummer 40k"
            value="Warhummer 40k"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Splendor"
            value="Splendor"
            sx={{ color: "white", borderColor: "white" }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label="Kill Team"
            value="Kill Team"
            sx={{ color: "white", borderColor: "white" }}
          />
        </FormControl>
      </ThemeProvider>
    </div>
  );
}

export default Filter;
