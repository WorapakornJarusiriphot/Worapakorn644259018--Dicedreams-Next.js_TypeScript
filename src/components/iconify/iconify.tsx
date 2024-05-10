import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';

// ประกาศ interface สำหรับ props
interface IconifyProps {
  icon: string;
  color?: string;
  width?: number;
  sx?: object;
  other?: any;
}

const Iconify = forwardRef<HTMLDivElement, IconifyProps>(({ icon, color = 'defaultColor', width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon as any}  // แก้ไขการประกาศ component ให้รองรับ Icon จาก @iconify/react ที่เป็น JSX element
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

Iconify.displayName = 'Iconify';

// PropTypes ใช้สำหรับ runtime type checking ใน development mode
Iconify.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  sx: PropTypes.object,
  other: PropTypes.any,
};

export default Iconify;
