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
  overflowY: 'auto',
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
    height: '100%',
    overflow: 'auto',
  },
  '& .simplebar-placeholder': {
    display: 'none', // ซ่อน placeholder เพื่อป้องกันช่องว่างที่ไม่ต้องการ
  },
}));
