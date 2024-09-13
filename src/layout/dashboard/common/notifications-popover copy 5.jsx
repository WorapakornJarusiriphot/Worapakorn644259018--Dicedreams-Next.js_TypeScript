"use client";

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
import { fToNow, formatThaiDate, formatThaiTime } from "@/utils/format-time";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // ฟังก์ชันสำหรับนำทางไปยังหน้า PostGameDetail หรือ Chat
  const handleButtonClick = (event, notification) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    if (notification.type === "participate") {
      router.push(`/PostGameDetail?id=${notification.data.post_games_id}`);
    } else if (notification.type === "chat") {
      router.push(`/PostGameDetail?id=${notification.data.post_games_id}#chat`);
    }
  };

  const fetchNotifications = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("Access token not found");
      setError("Access token not found");
      return;
    }

    try {
      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/notification",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setNotifications(
          data.messages.sort((a, b) => new Date(b.time) - new Date(a.time))
        );
      } else {
        console.error("Invalid data format:", data);
        setError("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Error fetching notifications");
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const intervalId = setInterval(fetchNotifications, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
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

  const handleMarkAllAsRead = async () => {
    if (Array.isArray(notifications)) {
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("Access token not found");
          setError("Access token not found");
          return;
        }

        const response = await fetch(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/notification/mark-all-as-read",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        setError("Error marking all notifications as read");
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access token not found");
        setError("Access token not found");
        return;
      }

      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/notification",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ notification_id: [id] }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notification_id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read");
    }
  };

  const filterNewNotifications = (notifications) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(
      (notification) => new Date(notification.time) > oneDayAgo
    );
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
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              ml: 0.75,
              width: 360,
              zIndex: 1500,
            },
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
            <Tooltip title="ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว">
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
                filterNewNotifications(notifications).map((notification) => (
                  <NotificationItem
                    key={notification.notification_id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onClick={(event) => handleButtonClick(event, notification)} // ปรับปรุงการส่งพารามิเตอร์
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
                  ก่อนหน้านี้
                </ListSubheader>
              }
            >
              {Array.isArray(notifications) &&
                notifications
                  .filter(
                    (notification) =>
                      !filterNewNotifications([notification]).length
                  )
                  .map((notification) => (
                    <NotificationItem
                      key={notification.notification_id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onClick={(event) =>
                        handleButtonClick(event, notification)
                      } // ปรับปรุงการส่งพารามิเตอร์
                    />
                  ))}
            </List>
          </Scrollbar>
        )}
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
      name_games: PropTypes.string,
      detail_post: PropTypes.string,
      participants: PropTypes.number,
      num_people: PropTypes.number,
      date_meet: PropTypes.string,
      time_meet: PropTypes.string,
      message: PropTypes.string, // เพิ่มสำหรับ chat
    }),
    type: PropTypes.string,
  }),
  onMarkAsRead: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired, // เพิ่ม propTypes สำหรับ onClick
};

function NotificationItem({ notification, onMarkAsRead, onClick }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.notification_id);
    }
  };

  const { avatar, title } = renderContent(
    notification,
    expanded,
    handleToggleExpand,
    handleMarkAsRead
  );

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(notification.read && {
          bgcolor: "action.selected",
          color: "text.disabled",
        }),
      }}
      onClick={onClick} // เพิ่ม onClick handler ที่ถูกส่งเข้ามา
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
              color: notification.read ? "text.disabled" : "text.primary",
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

function renderContent(
  notification,
  expanded,
  handleToggleExpand,
  handleMarkAsRead
) {
  let message = "";
  if (notification.type === "participate") {
    message = (
      <>
        มีผู้ใช้เข้าร่วมโพสต์นัดเล่นของคุณ:
        <br />
        <Typography component="span">ชื่อโพสต์:</Typography>{" "}
        <Typography
          component="span"
          sx={{ fontWeight: "bold", color: "black" }}
        >
          {notification.data.name_games}
        </Typography>
        <Typography component="span">
          {expanded ? (
            <>
              , <Typography component="span">รายละเอียดของโพสต์:</Typography>{" "}
              <Typography
                component="span"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                {notification.data.detail_post}
              </Typography>
              , <Typography component="span">จำนวนคนจะไป:</Typography>{" "}
              <Typography
                component="span"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                {notification.data.participants}/{notification.data.num_people}
              </Typography>
              , <Typography component="span">วันที่เจอกัน:</Typography>{" "}
              <Typography
                component="span"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                {formatThaiDate(notification.data.date_meet)}
              </Typography>
              , <Typography component="span">เวลาที่เจอกัน:</Typography>{" "}
              <Typography
                component="span"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                {formatThaiTime(notification.data.time_meet)}
              </Typography>
            </>
          ) : (
            ""
          )}
        </Typography>
        {notification.data.detail_post &&
          notification.data.detail_post.length > 0 && (
            <Button
              size="small"
              sx={{ color: "black" }}
              onClick={handleToggleExpand}
            >
              {expanded ? "แสดงน้อยลง" : "...เพิ่มเติม"}
            </Button>
          )}
      </>
    );
  } else if (notification.type === "chat") {
    message = (
      <>
        มีคนส่งข้อความถึงคุณ:
        <br />
        <Typography
          component="span"
          sx={{ fontWeight: "bold", color: "black" }}
        >
          {notification.data.message}
        </Typography>
      </>
    );
  }

  const title = (
    <Typography variant="subtitle2">
      <Typography component="span" sx={{ fontWeight: "bold", color: "black" }}>
        {notification.data.first_name} {notification.data.last_name}
      </Typography>
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
      <Avatar
        alt={notification.data.first_name}
        src={`https://dicedreams-backend-deploy-to-render.onrender.com/images/${notification.data.user_image}`}
      />
    ) : null,
    title,
  };
}
