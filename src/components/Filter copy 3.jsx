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
  selectedCategory,
  handleCategoryChange,
  handleSearchChange,
  searchTerm,
  handleNumberChange,
  number,
  handleDateChange,
  selectedDate,
  handleTimeChange,
  selectedTime,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGames, setSelectedGames] = React.useState({
    Werewolf: false,
    Coup: false,
    Uno: false,
    "Magic the gathering": false,
    เกมเศรษฐี: false,
    "Warhammer 40k": false,
    Splendor: false,
    "Kill Team": false,
  });

  const handleCheckboxChange = (event) => {
    setSelectedGames({
      ...selectedGames,
      [event.target.value]: event.target.checked,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  };

  const executeSearch = () => {
    const query = new URLSearchParams(searchParams);
  
    // รีเซ็ตพารามิเตอร์การค้นหาก่อนที่จะเพิ่มพารามิเตอร์ใหม่
    query.delete("search");
    query.delete("search_date_meet");
    query.delete("search_time_meet");
    query.delete("search_num_people");
  
    Object.keys(selectedGames).forEach((game) => {
      if (selectedGames[game]) {
        query.append("search", game);
      }
    });
  
    if (selectedDate) {
      query.set("search_date_meet", dayjs(selectedDate).format("YYYY-MM-DD"));
    }
  
    if (selectedTime) {
      query.set("search_time_meet", dayjs(selectedTime).format("HH:mm"));
    }
  
    if (number) {
      query.set("search_num_people", number);
    }
  
    // ตรวจสอบว่ามีการตั้งค่าพารามิเตอร์การค้นหาหรือไม่ ถ้าไม่มีให้นำทางไปที่หน้าแรก
    if (!query.toString()) {
      router.replace("/");
    } else {
      // แทนที่ URL ปัจจุบันด้วยพารามิเตอร์การค้นหาใหม่
      router.replace(`/search?${query.toString()}`);
    }
  
    // แทนที่การใช้ router.reload ด้วยการโหลดหน้าใหม่
    router.push(router.asPath); // หรือ router.push(router.asPath) เพื่อให้หน้ารีโหลดใหม่
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
            <MenuItem value="">โพสต์ทั้งหมดและผู้คนและร้านค้า</MenuItem>
            <MenuItem value="postGames">โพสต์นัดเล่น</MenuItem>
            <MenuItem value="postActivity">โพสต์กิจกรรม</MenuItem>
            <MenuItem value="peopleStore">ผู้คนและร้านค้า</MenuItem>
            <MenuItem value="people">ผู้คน</MenuItem>
            <MenuItem value="store">ร้านค้า</MenuItem>
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
