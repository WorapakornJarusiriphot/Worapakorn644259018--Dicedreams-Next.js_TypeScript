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

export default function TabsProfile({ userId }: TabsProfileProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="โพสต์นัดเล่น" {...a11yProps(0)} />
          <Tab label="ประวัติการเข้าร่วม" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ maxWidth: '900px', margin: '0 auto' }}> {/* ลดขนาดและทำให้เป็นศูนย์กลาง */}
          <PostGames userId={userId} />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ maxWidth: '900px', margin: '0 auto' }}> {/* ลดขนาดและทำให้เป็นศูนย์กลาง */}
          <Participating userId={userId} />
        </Box>
      </CustomTabPanel>
    </Box>
  );
}
