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
import Image from "next/image";

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';

const items = [
  {
    id: 1,
    date: "วันศุกร์ที่ 5 มกราคม  พ.ศ. 2567",
    date_meet: "วันศุกร์ที่ 5 มกราคม  พ.ศ. 2567",
    time_meet: "15:00 น.",
    user: "Outcast Gaming",
    title: "Magic The Gathering Commander 1st friendly match ",
    description:
      "กิจกรรมกระชับมิตรครั้งแรกของผู้เล่น Commander เข้าร่วมฟรี เล่นไม่เป็นสอนให้เป็นในงานเลย",
    num_people: 5,
    participant: 1,
    image:
      "https://scontent.fkdt3-1.fna.fbcdn.net/v/t39.30808-6/416476126_873313754801109_3349765332781373341_n.jpg?stp=dst-jpg_p526x296&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE9StcFBjPjUnnmkg_qw3uDAZ36wuoHI74BnfrC6gcjvmV7kMGBVULR1sHcswDGdEPffS4XMv4OS0PfSB-QyUpr&_nc_ohc=WVVZfeWeAQAAb6rBdUk&_nc_ht=scontent.fkdt3-1.fna&oh=00_AfC5msNeBucQwDn0522DJsnlc3BZy7m5VkpMpnnYhUYEaw&oe=6633192A",
    profile:
      "https://scontent.fkdt3-1.fna.fbcdn.net/v/t39.30808-6/304959616_494011612731327_7588110616456801443_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeELOG1jFmdUKJua60XNc9QbNVI4z2rYQkk1UjjPathCSfqVjWfTn6EK29pzpsExLYWyALGVKiRplkoIQorqTI_t&_nc_ohc=ZZ-AzEN-u9YAb4vGqJU&_nc_ht=scontent.fkdt3-1.fna&oh=00_AfA05y9fwfL3Yh6OB190ORmykLHgaTvQx9GJ6nGf4u-jcA&oe=6633041D",
  },
  // เพิ่มรายการตามต้องการ
];
function PostActivity() {
  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#424242",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <Image
                src={item.profile}
                alt={item.user}
                width={50} // ปรับขนาดตามที่ต้องการ
                height={50}
                layout="fixed"
                style={{ borderRadius: "50%" }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" gutterBottom>
                {item.user}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.date}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                sx={{
                  color: "white",
                }}
                aria-label="settings"
              >
                <MoreVertOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Image
            src={item.image}
            alt={item.title}
            width={526} // กำหนดขนาดที่เหมาะสม
            height={296}
            layout="responsive"
            sx={{ borderRadius: 1, marginBottom: 2 }} // เพิ่มระยะห่างด้านล่าง
          />

          <br />

          <Typography variant="h6" component="h3" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            วันที่เจอกัน: {item.date_meet}
          </Typography>
          <Typography variant="body1" gutterBottom>
            เวลาที่เจอกัน: {item.time_meet}
          </Typography>

          <br />

          <Typography variant="body1" gutterBottom>
            {item.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            สถานที่: 43/5 ถนนราชดำเนิน (ถนนต้นสน)
            ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
          </Typography>
          <Typography variant="body1" gutterBottom>
            จำนวนคนจะไป: {item.participant}/{item.num_people}
          </Typography>
        </Box>
      ))}
    </div>
  );
}

export default PostActivity;
