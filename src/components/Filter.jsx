'use client';

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
import { useState } from 'react';
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

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

function Filter() {
  const [value, setValue] = React.useState(dayjs("2022-04-17T15:30"));
  const [number, setNumber] = useState("");

  const handleChange = (event) => {
    setNumber(event.target.value);
  };

  const [selectedCurrency, setSelectedCurrency] = useState(""); // เพิ่มตัวแปร state นี้

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    // สร้างฟังก์ชัน handleCurrencyChange
    setSelectedCurrency(event.target.value);
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
      <br />
      <ThemeProvider theme={darkTheme}>
        <TextField
          fullWidth
          type="search"
          id="default-search"
          label="ค้นหาโพสต์"
          variant="outlined"
          placeholder="ค้นหาโพสต์"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: { backgroundColor: "rgba(0, 0, 0, 0)" }, // ตั้งค่าพื้นหลังเป็นโปร่งใส
          }}
        />
        <br />
        <br />

        <FormControl fullWidth>
          <InputLabel id="currency-select-label">ค้นหาประเภทโพสต์</InputLabel>
          <Select
            labelId="currency-select-label"
            id="currency-select"
            value={selectedCurrency} // ใช้ตัวแปร selectedCurrency ที่นี่
            label="ค้นหาประเภทโพสต์"
            onChange={handleCurrencyChange} // เรียกใช้ฟังก์ชัน handleCurrencyChange เมื่อมีการเลือกตัวเลือก
          >
            {/* วนลูปเพื่อสร้าง MenuItem */}
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
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
            onChange={handleChange}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{ style: { color: "white" } }}
                    />
                  )}
                />
              </DemoItem>
              <DemoItem
                label={
                  <Label componentName="ค้นหาเวลาที่เล่น" valueType="time" />
                }
              >
                <TimePicker
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{ style: { color: "white" } }}
                    />
                  )}
                />
              </DemoItem>
              {/* <DemoItem
                label={
                  <Label componentName="ค้นหาวันและเวลาที่เล่น" valueType="date time" />
                }
              >
                <DateTimePicker
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{ style: { color: "white" } }}
                    />
                  )}
                />
              </DemoItem> */}
            </DemoContainer>
          </ThemeProvider>
        </LocalizationProvider>

        <br />

        <FormControl component="fieldset">
          <Button
            variant="contained"
            sx={{ background: "white", color: "black", marginRight: "10px" }}
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
