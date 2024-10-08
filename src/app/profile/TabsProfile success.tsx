import * as React from 'react';
import { useSearchParams } from 'next/navigation'; // ใช้ useSearchParams จาก next/navigation
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccountDetailsForm from '@/components/dashboard/account/account-details-form';
import PostGames from '@/components/post-play/PostGames';
import Participating from '@/components/participating/Participating';
import PostActivity from '@/components/post-activity/PostActivity';
import { useState, useEffect } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabsProfile() {
  const searchParams = useSearchParams(); // ใช้ useSearchParams
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (searchParams) { // ตรวจสอบว่า searchParams ไม่เป็น null
      const tab = searchParams.get('tab'); // ดึงค่าจาก query string
      if (tab !== null) {
        const tabValue = parseInt(tab, 10);
        if (!isNaN(tabValue) && tabValue !== value) {
          setValue(tabValue);
        }
      }
    }
  }, [searchParams, value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    window.history.pushState(null, '', `/profile?tab=${newValue}`); // อัปเดต URL query string
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="โพสต์" {...a11yProps(0)} />
          <Tab label="ประวัติการเข้าร่วม" {...a11yProps(1)} />
          <Tab label="แก้ไขโปรไฟล์" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ maxWidth: '900px', margin: '0 auto' }}> {/* ลดขนาดและทำให้เป็นศูนย์กลาง */}
          <PostActivity />
          <PostGames />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ maxWidth: '900px', margin: '0 auto' }}> {/* ลดขนาดและทำให้เป็นศูนย์กลาง */}
          <Participating />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AccountDetailsForm />
      </CustomTabPanel>
    </Box>
  );
}
