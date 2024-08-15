'use client';

import React from "react";
import { Container, Typography, Box, Link, ThemeProvider, createTheme } from "@mui/material";

// สร้างธีมสีเข้ม
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#424242", // กำหนดสีพื้นหลังเป็นสีเทาเข้ม
    },
    text: {
      primary: "#fff", // กำหนดสีข้อความเป็นสีขาว
    },
  },
});

function Footer() {
  return (
    <ThemeProvider theme={darkTheme}>
        <br />
        <br />
        <br />
        <hr className=" mt-5 mb-5" sx={{ background: "grey.800" }} />
      <Container maxWidth="lg" component="footer">
        <Box
          sx={{
            py: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            // backgroundColor: "background.default", // ใช้สีพื้นหลังจากธีม
            color: "text.primary", // ใช้สีข้อความจากธีม
          }}
        >
          <Typography variant="h6" component="p" gutterBottom>
            DiceDreams
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            © {new Date().getFullYear()} สงวนลิขสิทธิ์
          </Typography>
          <Box mt={1}>
            <Link href="#" underline="hover" color="inherit">
              นโยบายความเป็นส่วนตัว
            </Link>
            {" | "}
            <Link href="#" underline="hover" color="inherit">
              เงื่อนไขการให้บริการ
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Footer;
