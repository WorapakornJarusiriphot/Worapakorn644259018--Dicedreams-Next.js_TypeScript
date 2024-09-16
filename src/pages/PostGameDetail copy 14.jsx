import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Menu,
  MenuItem,
  Alert,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import Image from "next/image";
import { format, parseISO, addHours } from "date-fns";
import { th } from "date-fns/locale";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Link from "next/link";
import ImageIcon from "@mui/icons-material/Image";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment";
import LoginIcon from "@mui/icons-material/Login";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { UserPopover } from "@/layout/user-popover";
import * as React from "react";
import { JwtPayload } from "jwt-decode";
// import { Link } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BASE_URL =
  "https://dicedreams-backend-deploy-to-render.onrender.com/images/";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00C853",
    },
    error: {
      main: "#D32F2F",
    },
  },
});

const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  const dateInThailand = addHours(date, 7); // Add 7 hours to convert to Thailand time
  const formattedDate = format(
    dateInThailand,
    "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
    {
      locale: th,
    }
  );
  return formattedDate;
};

const formatThaiDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

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
            "& fieldset": {
              borderColor: "black",
            },
            "&:hover fieldset": {
              borderColor: "black",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
            },
          },
        },
      },
    },
  },
});

function PostGameDetail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const [comment, setComment] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isParticipated, setIsParticipated] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false); // State for close confirmation dialog
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isFullSize, setIsFullSize] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [posts, setPosts] = useState([]); // ประกาศตัวแปร posts
  // สร้าง state สำหรับเก็บ chat ที่กำลังถูกแก้ไข
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  // ฟังก์ชันสำหรับแสดง TextField เมื่อกดปุ่ม "แก้ไขพูดคุย"
  const handleEditChat = (chat) => {
    setEditingChatId(chat.chat_id); // เก็บ chat_id ของแชทที่กำลังแก้ไข
    setEditedMessage(chat.message); // แสดงข้อความที่ถูกแก้ไขจากฐานข้อมูลใน TextField
  };

  const handleSaveEditChat = async (chat) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/chat/${chat.chat_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: editedMessage, // ข้อความที่แก้ไขใหม่
          }),
        }
      );

      if (response.ok) {
        setEditingChatId(null); // ยกเลิกโหมดแก้ไขหลังจากบันทึก
        window.location.reload(); // โหลดข้อมูลใหม่เพื่ออัปเดตการเปลี่ยนแปลง
      } else {
        console.error("Failed to save edited chat:", await response.text());
      }
    } catch (error) {
      console.error("Error saving edited chat:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("No access token found. Please login again.");
        }

        // ตรวจสอบว่ามีการส่ง post_games_id เข้ามาหรือไม่
        const postId = router.query.id;
        if (!postId) {
          throw new Error("post_games_id is not defined.");
        }

        const response = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/chat/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.statusText}`);
        }

        const data = await response.json();
        setPosts(data); // กำหนดค่า posts จากข้อมูล API
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        setError(error.message); // เก็บ error message ไว้ใน state เพื่อแสดงใน UI
      }
    };

    fetchPosts(); // เรียกใช้ฟังก์ชันดึงข้อมูล
  }, [router.query.id]); // ใช้ router.query.id เป็น dependency

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    userType: "",
    profilePictureUrl: "",
    userId: "",
  });

  const constructImageUrl = (imagePath) => `${BASE_URL}${imagePath}`;
  const constructImageUrl2 = (imagePath) => `${imagePath}`;

  // ฟังก์ชันที่สร้างขึ้นมาเพื่อใช้สำหรับการคลิกไปที่ Avatar และนำทางไปยังหน้าโปรไฟล์
  const navigateToProfile = () => {
    // นำทางไปยังหน้าโปรไฟล์โดยไม่ต้องระบุ userId
    router.push(`/profile`);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUser((prev) => ({
          ...prev,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userId: decoded.users_id,
        }));
        setUserId(decoded.users_id); // Set userId from decoded token
      }
    }
  }, []);

  const handleProfileClick = (event, userId) => {
    // ตรวจสอบว่ามีการส่ง event เข้ามาหรือไม่
    if (event) {
      event.preventDefault(); // ป้องกันการเกิด action เริ่มต้น เช่น การเปลี่ยน URL โดยไม่ตั้งใจ
    }

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/profile/${userId}`);
  };

  const fetchOwnerProfile = async (userId, accessToken) => {
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Owner Profile Data:", data);
        setOwnerProfile({
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image
            ? constructImageUrl2(data.user_image)
            : "",
          users_id: data.users_id, // เพิ่มการตั้งค่า users_id ที่ถูกต้อง
        });
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching owner profile:", error);
    }
  };

  const fetchUserProfile = async (userId, accessToken, decodedToken) => {
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser({
          username: decodedToken.username,
          userType: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image
            ? constructImageUrl2(data.user_image)
            : "",
        });
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleJoinClick = (post) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleConfirmJoin = async () => {
    setOpenDialog(false);
    if (postData) {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/participate",
          {
            participant_status: "active",
            participant_apply_datetime: new Date().toLocaleString("th-TH"),
            user_id: userId,
            post_games_id: postData.post_games_id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 201) {
          setSuccessMessage("คุณได้ทำการเข้าร่วมโพสต์นัดเล่นสำเร็จแล้ว");
          setParticipants((prevParticipants) => [
            ...prevParticipants,
            { user_id: userId },
          ]);
          setIsParticipated(true); // อัพเดตสถานะผู้เข้าร่วมเป็น true
          window.location.reload(); // โหลดหน้าใหม่
        } else {
          setErrorMessage(
            "Failed to join the post with status: " + response.status
          );
        }
      } catch (error) {
        setErrorMessage("Error joining the post: " + error.message);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessMessage("");
  };

  const joinGameClick = (e) => {
    e.preventDefault();
    handleJoinClick(postData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gameId = router.query.id;
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/createComment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ comment, post_games_id: gameId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setComment("");
        window.location.reload();
      } else {
        console.error("Failed to save comment:", await response.text());
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gameId = router.query.id;
      const accessToken = localStorage.getItem("access_token");
      const currentDateTime = new Date().toISOString();

      // ตรวจสอบค่า userId ก่อนส่งข้อมูล
      if (!userId) {
        throw new Error("User ID is not defined");
      }

      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: chatMessage,
            datetime_chat: currentDateTime,
            user_id: userId, // ใช้ userId ที่ได้รับจากการ decode token
            post_games_id: gameId,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setChatMessage("");
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Failed to send chat message:", errorText);
        setErrorMessage(`Failed to send chat message: ${errorText}`);
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
      setErrorMessage("Error sending chat message: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostGame = async (gameId, accessToken) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      console.log("Post Data:", data);
      const participantsResponse = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!participantsResponse.ok)
        throw new Error("Failed to fetch participants");
      const participantsData = await participantsResponse.json();

      const postParticipants = participantsData.filter(
        (participant) => participant.post_games_id === data.post_games_id
      );

      setPostData({
        ...data,
        participants: postParticipants.length + 1,
      });

      if (data.users_id) {
        fetchOwnerProfile(data.users_id, accessToken);
      }

      setIsParticipated(
        postParticipants.some((participant) => participant.user_id === userId)
      );
    } catch (error) {
      setError("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (gameId, accessToken) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate/post/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch participants");

      const participantsData = await response.json();

      // กรองเอาเฉพาะ participants ที่มี participant_status ไม่ใช่ 'unActive'
      const activeParticipants = participantsData.filter(
        (participant) => participant.participant_status !== "unActive"
      );

      setParticipants(activeParticipants); // แสดงเฉพาะข้อมูลที่มีสถานะไม่ใช่ 'unActive'
    } catch (error) {
      setError("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async (postId) => {
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/chat/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      } else {
        console.error("Failed to fetch chat messages:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    let currentUserId = "";
    const decoded = jwtDecode(accessToken);
    currentUserId = decoded.users_id;
    setUserId(currentUserId);

    if (accessToken && router.isReady) {
      const gameId = router.query.id;
      if (gameId) {
        fetchPostGame(gameId, accessToken);
        fetchParticipants(gameId, accessToken);
        fetchChatMessages(gameId);
      } else {
        console.error("gameId is not defined");
      }
    }
  }, [router.isReady]);

  console.log("Owner Profile State:", ownerProfile);

  useEffect(() => {
    if (router.asPath.includes("#chat")) {
      document
        .getElementById("chat-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [router.asPath]);

  const handleCloseGame = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const gameId = router.query.id;

      const response = await axios.put(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${gameId}`,
        {
          status_post: "unActive", // อัพเดตสถานะเป็น unActive
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("ปิดระบบนัดเล่นเรียบร้อยแล้ว");
        router.push("/"); // เปลี่ยนหน้าไปที่หน้าแรก
      } else {
        setErrorMessage(
          "Failed to close the post with status: " + response.status
        );
      }
    } catch (error) {
      setErrorMessage("Error closing the post: " + error.message);
    } finally {
      setLoading(false);
      setCloseDialogOpen(false); // ปิด dialog หลังจากปิดโพสต์เสร็จสิ้น
    }
  };

  const handleOpenCloseDialog = () => {
    setCloseDialogOpen(true);
  };

  const handleCloseCloseDialog = () => {
    setCloseDialogOpen(false);
  };

  // เปิดเมนู Pop Up ตัวเลือก
  const handleMenuClick = (event, postId, post) => {
    console.log("Selected post: ", post); // ตรวจสอบค่าของโพสต์ที่ถูกเลือก
    if (!post) {
      console.error("โพสต์ไม่มีข้อมูล หรือเป็น undefined");
      setSnackbarMessage("ไม่พบข้อมูลของโพสต์นี้");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    setAnchorEl(event.currentTarget); // เปิดเมนูป๊อปอัป
    setSelectedPostId(postId); // บันทึก postId ของโพสต์ที่ถูกคลิก
    setSelectedPost(post); // ตั้งค่า selectedPost ให้ตรงกับโพสต์ที่ถูกเลือก
  };

  // ปิดเมนู Pop Up ตัวเลือก
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // เปิด/ปิด Dialog สำหรับแก้ไข
  const handleEditOpen = () => {
    setEditOpen(true);
    setAnchorEl(null); // ปิดเมนูเมื่อเปิดการแก้ไข
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  // เปิด/ปิด Dialog สำหรับลบ
  const handleDeleteOpen = () => {
    setDeleteOpen(true);

    setAnchorEl(null); // ปิดเมนูเมื่อเปิดการลบ
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  // ฟังก์ชันสำหรับปิด Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleImageClick = () => {
    setIsFullSize(!isFullSize);
  };

  const handleLinkClick = async (event, postId) => {
    event.preventDefault();

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setSnackbarMessage("กรุณาเข้าสู่ระบบก่อน");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken); // ถอดรหัส token เพื่อดึงข้อมูลผู้ใช้
      const userId = decoded.users_id; // ดึง users_id จาก token
      const userRole = decoded.role;

      // ตรวจสอบว่า role ของผู้ใช้เป็น "user" หรือไม่
      if (userRole !== "user") {
        setSnackbarMessage("คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (userId !== selectedPost.users_id) {
        setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      // ตรวจสอบว่า userId ตรงกับ users_id ของโพสต์ที่เลือกหรือไม่
      console.log("Current userId: ", userId); // ตรวจสอบ userId ของคุณ
      console.log("Selected post userId: ", selectedPost.users_id); // ตรวจสอบ users_id ของโพสต์

      // ถ้า userId ตรงกับ users_id ของโพสต์ ให้ทำการนำทางไปที่หน้าแก้ไขโพสต์
      setSelectedPostId(postId); // บันทึก postId ของโพสต์ที่ถูกคลิก
      router.push(`/PostPlayEdit?id=${postId}`);
    } catch (error) {
      setSnackbarMessage("Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      router.push("/sign-in");
    }
  };

  // ยืนยันการลบโพสต์
  // ฟังก์ชันสำหรับเปลี่ยนสถานะโพสต์เป็น unActive
  const handleUpdateStatus = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setSnackbarMessage("กรุณาเข้าสู่ระบบก่อน");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const userId = decoded.users_id;
      const userRole = decoded.role;

      console.log("Selected post: ", selectedPost); // ตรวจสอบค่าของ selectedPost ก่อนดำเนินการ
      if (!selectedPost) {
        setSnackbarMessage("ไม่พบข้อมูลของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (userId !== selectedPost.users_id) {
        setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // เรียก API PUT เพื่ออัปเดตสถานะโพสต์
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${selectedPostId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status_post: "unActive", // อัปเดตสถานะโพสต์เป็น "unActive"
          }),
        }
      );

      if (!response.ok) {
        throw new Error("การอัปเดตสถานะโพสต์ล้มเหลว");
      }

      setSnackbarMessage("โพสต์นัดเล่นนี้ได้ถูกลบเป็นที่เรียบร้อยแล้ว");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // อัปเดตสถานะของโพสต์ใน UI
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.post_games_id === selectedPostId
            ? { ...item, status_post: "unActive" }
            : item
        )
      );

      // รีเฟรชหน้าเว็บ
      window.location.reload();
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setDeleteOpen(false); // ปิด Dialog
    }
  };

  return (
    <>
      <Header />
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ marginTop: 10 }}>
          <Typography
            variant="h2"
            gutterBottom
            style={{ color: "white", textAlign: "left", marginBottom: "30px" }}
          >
            {postData?.name_games}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#0B0D0E",
              color: "white",
              border: "1px solid #32383E",
              marginBottom: "30px",
            }}
          >
            <Box
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              <img
                src={
                  postData?.games_image
                    ? constructImageUrl2(postData.games_image)
                    : "default-image-url.jpg"
                }
                alt="Game Image"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {postData?.detail_post}
              </Typography>

              <br />

              <Typography variant="body1" sx={{ color: "white" }}>
                วันที่เจอกัน:{" "}
                {postData?.date_meet
                  ? formatThaiDate(postData.date_meet)
                  : "Invalid date"}
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                เวลาที่เจอกัน:{" "}
                {postData?.time_meet
                  ? formatThaiTime(postData.time_meet)
                  : "Invalid time"}
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
                ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
              </Typography>

              {postData?.users_id !== userId && !isParticipated && (
                <Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkred",
                    },
                  }}
                  onClick={joinGameClick}
                >
                  เข้าร่วม
                </Button>
              )}
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#0B0D0E",
              color: "white",
              border: "1px solid #32383E",
              marginBottom: "30px",
            }}
          >
            <Box
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                จำนวนคนจะไป : {postData?.participants}/{postData?.num_people}
              </Typography>
              <br />
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {/* แสดงผล ownerProfile */}
                <div
                  onClick={(event) =>
                    ownerProfile.users_id
                      ? handleProfileClick(event, ownerProfile.users_id)
                      : console.error("User ID is undefined")
                  }
                >
                  <Avatar
                    alt={`${ownerProfile.firstName || "Owner"} ${
                      ownerProfile.lastName || ""
                    }`}
                    src={
                      ownerProfile.profilePictureUrl ||
                      "url-to-profile-picture.jpg"
                    }
                    sx={{
                      width: "50px",
                      height: "50px",
                      marginRight: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {!ownerProfile.profilePictureUrl &&
                      `${ownerProfile.firstName?.[0] ?? ""}${
                        ownerProfile.lastName?.[0] ?? ""
                      }`}
                  </Avatar>
                </div>

                {participants.map((participant, index) => (
                  <div
                    key={index}
                    onClick={(event) => {
                      // ตรวจสอบว่ามี users_id ใน user object ของ participant หรือไม่
                      if (participant.user?.users_id) {
                        handleProfileClick(event, participant.user.users_id); // ส่ง users_id ที่ถูกต้อง
                      } else {
                        console.error("User ID is undefined");
                      }
                    }}
                  >
                    <Avatar
                      alt={`${participant.user?.first_name ?? ""} ${participant.user?.last_name ?? ""}`}
                      src={
                        participant.user?.user_image
                          ? constructImageUrl(participant.user.user_image)
                          : "url-to-profile-picture.jpg"
                      }
                      sx={{
                        width: "50px",
                        height: "50px",
                        marginRight: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      {!participant.user?.user_image &&
                        `${participant.user?.first_name?.[0] ?? ""}${participant.user?.last_name?.[0] ?? ""}`}
                    </Avatar>
                  </div>
                ))}
              </Box>
            </Box>
          </Paper>

          {postData?.users_id === userId && (
            <Paper
              elevation={3}
              sx={{
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#0B0D0E",
                color: "white",
                border: "1px solid #32383E",
                marginBottom: "30px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                <Typography variant="h4" sx={{ color: "white" }}>
                  Owner Controls
                </Typography>
                <a
                  href={`/JoinPage?id=${postData?.post_games_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "10px",
                      marginRight: "10px", // เพิ่ม marginRight
                      backgroundColor: "red",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                  >
                    จัดการผู้เข้าร่วม
                  </Button>
                </a>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "10px",
                    marginRight: "10px",
                    backgroundColor: "white",
                    color: "red",
                    "&:hover": {
                      backgroundColor: "darkred",
                    },
                  }}
                  onClick={() =>
                    router.push(`/PostPlayEdit?id=${postData?.post_games_id}`)
                  }
                >
                  แก้ไขโพสต์
                </Button>
                <Button
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "#4d4d4d",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#121212",
                    },
                  }}
                  onClick={handleOpenCloseDialog} // เปิด dialog เพื่อยืนยันการปิดระบบนัดเล่น
                >
                  ปิดระบบนัดเล่น
                </Button>
              </Box>
            </Paper>
          )}

          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", marginTop: "20px" }}
          >
            มาพูดคุยกัน
          </Typography>

          {chatMessages.map((chat) => (
            <Paper
              key={chat.chat_id}
              elevation={3}
              sx={{
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#0B0D0E",
                color: "white",
                border: "1px solid #32383E",
                marginBottom: "30px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between", // จัดข้อความอยู่ซ้ายและไอคอนอยู่ขวา
                }}
              >
                <div
                  onClick={(event) =>
                    chat.user?.users_id
                      ? handleProfileClick(event, chat.user.users_id)
                      : console.error("User ID is undefined")
                  }
                >
                  <Avatar
                    alt={`${chat.user.first_name} ${chat.user.last_name}`}
                    src={
                      chat.user.user_image
                        ? constructImageUrl(chat.user.user_image)
                        : "url-to-profile-picture.jpg"
                    }
                    sx={{ width: "50px", height: "50px", marginRight: "20px" }}
                  />
                </div>
                <Grid item xs>
                  <div
                    onClick={(event) =>
                      chat.user?.users_id
                        ? handleProfileClick(event, chat.user.users_id)
                        : console.error("User ID is undefined")
                    }
                  >
                    <Typography variant="body1">
                      {chat.user.first_name} {chat.user.last_name}
                    </Typography>
                  </div>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {formatDateTime(chat.datetime_chat)}
                  </Typography>
                </Grid>
                <Grid item>
                  <div>
                    <IconButton
                      sx={{ color: "white", ml: "auto" }}
                      aria-label="settings"
                      onClick={(event) =>
                        handleMenuClick(event, chat.chat_id, chat)
                      }
                    >
                      <MoreVertOutlinedIcon />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleEditChat(chat)}>
                        <EditIcon sx={{ marginRight: 1 }} />
                        แก้ไขพูดคุย
                      </MenuItem>
                      <MenuItem onClick={handleDeleteOpen}>
                        <DeleteIcon sx={{ marginRight: 1 }} />
                        ลบพูดคุย
                      </MenuItem>
                    </Menu>
                  </div>
                </Grid>
              </Box>

              {/* ถ้ากำลังอยู่ในโหมดแก้ไขของแชทนี้ แสดง TextField */}
              {editingChatId === chat.chat_id ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    sx={{
                      marginTop: "10px",
                      backgroundColor: "#1c1c1c",
                      "& .MuiInputBase-root": { color: "#ffffff" },
                      "& fieldset": { borderColor: "#ffffff" },
                    }}
                  />
                  <Button
                    onClick={() => handleSaveEditChat(chat)}
                    variant="contained"
                    sx={{ marginTop: "10px" }}
                  >
                    บันทึก
                  </Button>
                  <Button
                    onClick={() => setEditingChatId(null)} // ยกเลิกโหมดแก้ไข
                    sx={{ marginTop: "10px", marginLeft: "10px" }}
                  >
                    ยกเลิก
                  </Button>
                </>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ marginTop: "10px", textAlign: "left", color: "gray" }}
                >
                  {chat.message}
                </Typography>
              )}
            </Paper>
          ))}

          <Paper
            sx={{
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "#ffffff",
              color: "#000000",
              textAlign: "left",
              marginTop: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <Avatar
                alt={altText}
                src={user.profilePictureUrl || "url-to-profile-picture.jpg"}
                sx={{
                  width: "50px",
                  height: "50px",
                  marginRight: "20px",
                  marginBottom: "20px",
                  cursor: "pointer", // เพิ่ม cursor pointer เพื่อให้รู้ว่าคลิกได้
                }}
                onClick={navigateToProfile} // เรียกใช้ฟังก์ชันเมื่อคลิก
              >
                {!user.profilePictureUrl &&
                  `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
              </Avatar>
              <Box onClick={navigateToProfile} sx={{ cursor: "pointer" }}>
                <Typography variant="body1" fontWeight="bold" color={"#000000"}>
                  {`${user.firstName || "firstName"} ${user.lastName || "lastName"}`}
                </Typography>
              </Box>
            </Box>
            <form onSubmit={handleChatSubmit}>
              <TextField
                fullWidth
                id="chat-section"
                multiline
                rows={4}
                variant="outlined"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                sx={{
                  marginBottom: "20px",
                  "& .MuiInputBase-root": {
                    color: "#000000",
                  },
                  "& fieldset": {
                    borderColor: "#000000",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000",
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000000",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="medium"
                startIcon={<SendIcon />}
                disabled={loading || !chatMessage.trim()}
                sx={{
                  backgroundColor: "#d3d3d3",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "#c0c0c0",
                  },
                }}
              >
                ส่งข้อความ
              </Button>
            </form>
          </Paper>
        </Container>
      </ThemeProvider>
      <Footer />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          กรุณาเข้าสู่ระบบก่อน
        </MuiAlert>
      </Snackbar>
      {errorMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
        >
          <MuiAlert
            onClose={() => setErrorMessage("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </MuiAlert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseSuccessSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>ยืนยันการเข้าร่วม</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจนะว่าจะเข้าร่วมโพสต์นัดเล่นโพสต์นี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirmJoin} color="primary" autoFocus>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={closeDialogOpen} onClose={handleCloseCloseDialog}>
        <DialogTitle>ยืนยันการปิดระบบนัดเล่น</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจหรือไม่ว่าต้องการปิดระบบนัดเล่นโพสต์นี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCloseDialog} color="error">
            ยกเลิก
          </Button>
          <Button onClick={handleCloseGame} color="primary" autoFocus>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PostGameDetail;
