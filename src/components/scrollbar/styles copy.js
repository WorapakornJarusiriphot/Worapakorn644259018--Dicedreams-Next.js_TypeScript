import SimpleBar from 'simplebar-react';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}));

export const StyledScrollbar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  overflowY: 'auto', // เพิ่ม overflowY เพื่อจัดการการเลื่อนในแนวตั้ง
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
  '& .simplebar-content-wrapper': {
    height: '100%', // เพิ่มการตั้งค่าส่วนนี้เพื่อลดช่องว่างที่ไม่ต้องการ
    overflow: 'auto',
  },
}));
