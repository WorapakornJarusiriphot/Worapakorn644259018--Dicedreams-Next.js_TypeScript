import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material/styles';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';

export interface Product {
  id: string;
  image: string;
  name: string;
  updatedAt: Date;
}

export interface PeopleProps {
  products?: Product[];
  sx?: SxProps;
}

export function People({ products = [], sx }: PeopleProps): React.JSX.Element {
  return (
    <Box sx={{ width: '100%', ...sx }}>
      {products.map((product, index) => (
        <Card key={product.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}>
          <ListItemAvatar>
            {product.image ? (
              <Box component="img" src={product.image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
            ) : (
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: 'var(--mui-palette-neutral-200)',
                  height: '48px',
                  width: '48px',
                }}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={product.name}
            primaryTypographyProps={{ variant: 'subtitle1' }}
            secondary={`Updated ${dayjs(product.updatedAt).format('MMM D, YYYY')}`}
            secondaryTypographyProps={{ variant: 'body2' }}
            sx={{ marginLeft: 2 }}
          />
          <Button
            variant="contained"
            sx={{ marginLeft: 'auto', marginRight: 2 }}
          >
            เพิ่มเป็นเพื่อน
          </Button>
          <IconButton edge="end">
            <DotsThreeVerticalIcon weight="bold" />
          </IconButton>
        </Card>
      ))}
    </Box>
  );
}

export default People;
