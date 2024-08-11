'use client';

import React from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, Box, AppBar, Toolbar } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const rules = [
  {
    title: "เคารพผู้ใช้งานคนอื่น",
    description: "ผู้ใช้งานทุกคนควรปฏิบัติต่อกันด้วยความเคารพ ห้ามมีการล่วงละเมิด, การเลือกปฏิบัติ และการใช้ภาษาที่ไม่เหมาะสม."
  },
  {
    title: "ห้ามส่งสแปม",
    description: "การส่งข้อความซ้ำซ้อนและการโฆษณาจะไม่ได้รับการยอมรับ."
  },
  {
    title: "ปฏิบัติตามกฎหมาย",
    description: "ผู้ใช้งานต้องปฏิบัติตามกฎหมายและระเบียบที่เกี่ยวข้อง กิจกรรมที่ผิดกฎหมายจะไม่ได้รับการยอมรับ."
  },
  {
    title: "รักษาความเป็นส่วนตัว",
    description: "ห้ามเผยแพร่ข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต และเคารพความเป็นส่วนตัวของผู้อื่น."
  },
  {
    title: "เนื้อหาต้องเหมาะสม",
    description: "เนื้อหาทั้งหมดต้องเหมาะสมสำหรับทุกวัย ห้ามมีเนื้อหาที่เป็นการล่วงละเมิดหรือไม่เหมาะสม."
  }
];

const WebsiteRules = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" style={{ paddingBottom: '40px' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              กฏของเว็บไซต์
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper elevation={3} style={{ padding: '30px', marginTop: '20px' }}>
          <Box textAlign="center" marginBottom="20px">
            <Typography variant="h4" gutterBottom>
              กฏของเว็บไซต์
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              โปรดอ่านและปฏิบัติตามกฏเหล่านี้เพื่อให้ทุกคนมีประสบการณ์ที่ดีบนเว็บไซต์ของเรา
            </Typography>
          </Box>
          <Divider />
          <List>
            {rules.map((rule, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={<Typography variant="h6">{rule.title}</Typography>}
                    secondary={rule.description}
                  />
                </ListItem>
                {index < rules.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default WebsiteRules;
