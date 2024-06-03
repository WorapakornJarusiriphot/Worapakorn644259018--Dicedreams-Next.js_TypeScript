import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PostGames from '@/components/post-play-id/PostGames';
import Participating from '@/components/participating-id/Participating';
import PostActivity from '@/components/post-activity-id/PostActivity';

interface TabsProfileProps {
  userId: string;
  storeId?: string;
}

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

export default function TabsProfile({ userId, storeId }: TabsProfileProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="โพสต์" {...a11yProps(0)} />
          <Tab label="ประวัติการเข้าร่วม" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {storeId && <PostActivity storeId={storeId} />} {/* ใช้ storeId ที่นี่ */}
        <PostGames userId={userId} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Participating userId={userId} />
      </CustomTabPanel>
    </Box>
  );
}
