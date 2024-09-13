"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Avatar,
  Box,
  Button,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

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

const formatDateTime = (dateString) => {
  if (!dateString) return "ไม่ทราบ"; // ตรวจสอบว่าเป็น null หรือไม่
  try {
    const date = parseISO(dateString);
    const formattedDate = format(
      date,
      "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
      {
        locale: th,
      }
    );
    return formattedDate;
  } catch (error) {
    console.error("Invalid date format:", error);
    return "ไม่ทราบ";
  }
};

const formatThaiDate = (dateString) => {
  if (!dateString) return "ไม่ทราบ"; // ตรวจสอบว่าเป็น null หรือไม่
  try {
    const date = parseISO(dateString);
    const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", {
      locale: th,
    });
    return formattedDate;
  } catch (error) {
    console.error("Invalid date format:", error);
    return "ไม่ทราบ";
  }
};

const formatThaiTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // เก็บข้อมูลผู้ใช้ที่ถูกกรอง
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // ฟังก์ชันกรองข้อมูลผู้ใช้ตามคำค้นหา
  const handleSearch = () => {
    const searchValue = searchText.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.first_name
          ? user.first_name.toLowerCase().includes(searchValue)
          : false) ||
        (user.last_name
          ? user.last_name.toLowerCase().includes(searchValue)
          : false) ||
        (user.email ? user.email.toLowerCase().includes(searchValue) : false) ||
        (user.username
          ? user.username.toLowerCase().includes(searchValue)
          : false) ||
        (user.phone_number
          ? user.phone_number.toLowerCase().includes(searchValue)
          : false) ||
        (user.gender
          ? user.gender.toLowerCase().includes(searchValue)
          : false) ||
        (user.role ? user.role.toLowerCase().includes(searchValue) : false)
    );
    setFilteredUsers(filtered);
  };

  // ฟังก์ชันจัดการเมื่อกด Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // เรียกใช้ฟังก์ชันค้นหาเมื่อกด Enter
    }
  };

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://dicedreams-backend-deploy-to-render.onrender.com/api/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // เริ่มต้นด้วยข้อมูลผู้ใช้ทั้งหมด
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (event, userId) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUsers = async () => {
    try {
      await Promise.all(
        selectedUsers.map(async (userId) => {
          const response = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          if (!response.ok)
            throw new Error(`Failed to delete user with ID: ${userId}`);
        })
      );
      setSelectedUsers([]);
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <br />
        <br />
        <br />
        <br />
        <Typography
          variant="h4"
          sx={{ textAlign: "center", marginBottom: "40px" }}
          style={{ color: "white" }}
        >
          จัดการผู้ใช้
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Name, email, etc..."
            value={searchText}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress} // เพิ่มการจัดการเมื่อกดปุ่ม Enter
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              style: { color: "white" },
            }}
            sx={{ backgroundColor: "#333", color: "white", width: "30%" }}
          />
          <Button
            variant="contained"
            color="error"
            sx={{ height: "55px" }}
            onClick={() => setDialogOpen(true)}
            disabled={selectedUsers.length === 0}
          >
            ลบผู้ใช้ที่เลือก
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>เลือก</TableCell>
                <TableCell>ชื่อ-นามสกุล</TableCell>
                <TableCell>อีเมล</TableCell>
                <TableCell>วันเกิด</TableCell>
                <TableCell>ชื่อผู้ใช้</TableCell>
                <TableCell>เบอร์โทรศัพท์</TableCell>
                <TableCell>เพศ</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>วันที่สร้างบัญชี</TableCell>
                <TableCell>วันที่อัพเดทบัญชี</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.users_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.users_id)}
                        onChange={(event) =>
                          handleSelectUser(event, user.users_id)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatThaiDate(user.birthday)}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                    <TableCell>{formatDateTime(user.updatedAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: "white" }}
        />
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณแน่ใจหรือไม่ที่จะลบผู้ใช้เหล่านี้ออกจากระบบ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleDeleteUsers} color="error">
              ลบ
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
