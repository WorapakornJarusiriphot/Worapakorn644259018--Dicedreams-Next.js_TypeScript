'use client';

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import { fToNow } from "@/utils/format-time";

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access token not found");
        setError("Access token not found");
        return;
      }

      try {
        const response = await fetch("https://dicedreams-backend-deploy-to-render.onrender.com/api/notification", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.messages && Array.isArray(data.messages)) {
          setNotifications(data.messages);
        } else {
          console.error("Invalid data format:", data);
          setError("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications");
      }
    };

    fetchNotifications();
  }, []);

  const totalUnRead = Array.isArray(notifications)
    ? notifications.filter((item) => !item.read).length
    : 0;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    if (Array.isArray(notifications)) {
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    }
  };

  return (
    <>
      <Tooltip title="การแจ้งเตือน">
        <IconButton color={open ? "primary" : "default"} onClick={handleOpen}>
          <Badge badgeContent={totalUnRead} color="error">
            <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">การแจ้งเตือน</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              คุณมีข้อความที่ยังไม่ได้อ่าน {totalUnRead} ข้อความ
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {error ? (
          <Typography sx={{ color: "red", p: 2 }}>{error}</Typography>
        ) : (
          <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
            <List
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{ py: 1, px: 2.5, typography: "overline" }}
                >
                  ใหม่
                </ListSubheader>
              }
            >
              {Array.isArray(notifications) &&
                notifications
                  .slice(0, 2)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.notification_id}
                      notification={notification}
                    />
                  ))}
            </List>

            <List
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{ py: 1, px: 2.5, typography: "overline" }}
                >
                  ก่อนหน้านั้น
                </ListSubheader>
              }
            >
              {Array.isArray(notifications) &&
                notifications
                  .slice(2, 5)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.notification_id}
                      notification={notification}
                    />
                  ))}
            </List>
          </Scrollbar>
        )}

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            ดูทั้งหมด
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.string,
    notification_id: PropTypes.string,
    read: PropTypes.bool,
    data: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      user_image: PropTypes.string,
    }),
    type: PropTypes.string,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(notification.read && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify
              icon="eva:clock-outline"
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {notification.time ? fToNow(new Date(notification.time)) : ""}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  let message = "";
  if (notification.type === "participate") {
    message = "มีผู้ใช้เข้าร่วมโพสต์นัดเล่นของคุณ";
  } else if (notification.type === "chat") {
    message = "มีคนส่งข้อความถึงคุณ";
  }

  const title = (
    <Typography variant="subtitle2">
      {notification.data.first_name} {notification.data.last_name}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {message}
      </Typography>
    </Typography>
  );

  return {
    avatar: notification.data.user_image ? (
      <img alt={notification.data.first_name} src={notification.data.user_image} />
    ) : null,
    title,
  };
}
