import { useEffect, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

function JoinPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [selectedUnconfirmed, setSelectedUnconfirmed] = useState([]);
  const [selectedConfirmed, setSelectedConfirmed] = useState([]);
  const [unconfirmedSelectAll, setUnconfirmedSelectAll] = useState(false);
  const [confirmedSelectAll, setConfirmedSelectAll] = useState(false);
  const [participants, setParticipants] = useState([]);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleRemove = async () => {
    const promises = selectedConfirmed.map((name) => {
      const participant = filteredConfirmed.find((p) => p.user.email === name);
      if (participant) {
        return updateParticipantStatus(participant.part_Id, "unActive");
      }
      return null;
    });

    try {
      await Promise.all(promises);
      console.log("เปลี่ยนสถานะผู้ใช้ที่เลือกทั้งหมดเป็น unActive");
    } catch (error) {
      console.error("Failed to update status:", error);
    }

    // เคลียร์การเลือกทั้งหมดหลังจากเตะเสร็จ
    setSelectedConfirmed([]);
  };

  const handleRemoveClick = () => {
    if (selectedConfirmed.length > 0) {
      setConfirmDialogOpen(true);
    } else {
      console.error("No participants selected for removal");
    }
  };

  const handleRemoveConfirm = async () => {
    const promises = selectedConfirmed.map((name) => {
      const participant = filteredConfirmed.find((p) => p.user.email === name);
      if (participant) {
        return updateParticipantStatus(participant.part_Id, "unActive");
      }
      return null;
    });

    try {
      await Promise.all(promises);
      console.log("เปลี่ยนสถานะผู้ใช้ที่เลือกทั้งหมดเป็น unActive");
    } catch (error) {
      console.error("Failed to update status:", error);
    }

    // ปิด Dialog และเคลียร์การเลือกทั้งหมด
    setConfirmDialogOpen(false);
    setSelectedConfirmed([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event, type) => {
    if (type === "unconfirmed") {
      if (event.target.checked) {
        const newSelecteds = filteredUnconfirmed.map((n) => n.user.email);
        setSelectedUnconfirmed(newSelecteds);
        return;
      }
      setSelectedUnconfirmed([]);
    } else if (type === "confirmed") {
      if (event.target.checked) {
        const newSelecteds = filteredConfirmed.map((n) => n.user.email);
        setSelectedConfirmed(newSelecteds);
        return;
      }
      setSelectedConfirmed([]);
    }
  };

  const handleCheckboxClick = (event, name, type) => {
    let selectedArray =
      type === "unconfirmed" ? selectedUnconfirmed : selectedConfirmed;
    const selectedIndex = selectedArray.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedArray, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedArray.slice(1));
    } else if (selectedIndex === selectedArray.length - 1) {
      newSelected = newSelected.concat(selectedArray.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedArray.slice(0, selectedIndex),
        selectedArray.slice(selectedIndex + 1)
      );
    }

    if (type === "unconfirmed") {
      setSelectedUnconfirmed(newSelected);
    } else {
      setSelectedConfirmed(newSelected);
    }
  };

  const fetchParticipants = async (postId, accessToken) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch participants");
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      setError("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (participantId, status) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate/${participantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ participant_status: status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      fetchParticipants(router.query.id, accessToken); // Refresh data
    } catch (error) {
      setError("Failed to update status: " + error.message);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    let currentUserId = "";
    const decoded = jwtDecode(accessToken);
    currentUserId = decoded.users_id;
    setUserId(currentUserId);

    if (accessToken && router.isReady) {
      const postId = router.query.id;
      if (postId) {
        fetchParticipants(postId, accessToken);
      } else {
        console.error("postId is not defined");
      }
    }
  }, [router.isReady]);

  const filteredUnconfirmed = participants.filter(
    (participant) =>
      participant.participant_status === "unActive" &&
      (participant.user.email
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
        participant.user.email.toLowerCase().includes(searchText.toLowerCase()))
  );

  const filteredConfirmed = participants.filter(
    (participant) =>
      participant.participant_status === "active" &&
      (participant.user.email
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
        participant.user.email.toLowerCase().includes(searchText.toLowerCase()))
  );

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // return (

  const fetchJoinGame = async (gameId, accessToken) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/joinGame`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
    } catch (error) {
      setError("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
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
        fetchJoinGame(gameId, accessToken);
      } else {
        console.error("gameId is not defined");
      }
    }
  }, [router.isReady]);

  // const participants = [
  //   {
  //     name: "Prabodhan Fitzgerald",
  //     email: "644259018@webmail.npru.ac.th",
  //     phone: "0623844415",
  //     status: "ยังไม่อนุมัติ",
  //     avatar: "/path/to/avatar1.jpg",
  //   },
  //   {
  //     name: "Hiro Joyce",
  //     email: "644259019@webmail.npru.ac.th",
  //     phone: "0623844415",
  //     status: "ยังไม่อนุมัติ",
  //     avatar: "/path/to/avatar2.jpg",
  //   },
  //   {
  //     name: "Lloyd Jefferson",
  //     email: "644259021@webmail.npru.ac.th",
  //     phone: "0623844415",
  //     status: "ยังไม่อนุมัติ",
  //     avatar: "/path/to/avatar3.jpg",
  //   },
  //   {
  //     name: "Ceiran Mayo",
  //     email: "644259022@webmail.npru.ac.th",
  //     phone: "0623844415",
  //     status: "ยังไม่อนุมัติ",
  //     avatar: "/path/to/avatar4.jpg",
  //   },
  // ];

  // const filteredUnconfirmed = participants.filter(
  //   (participant) =>
  //     participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
  //     participant.email.toLowerCase().includes(searchText.toLowerCase())
  // );

  // const filteredConfirmed = [];

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      <Header />
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ marginTop: 10 }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: "40px" }}
            style={{ color: "white" }}
          >
            จัดการผู้เข้าร่วม
          </Typography>
          <Typography
            variant="h5"
            sx={{ textAlign: "left", marginBottom: "20px" }}
            style={{ color: "white" }}
          >
            ยังไม่ได้ยืนยันการเข้าร่วม
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
                style: { color: "white" },
              }}
              id="search"
              sx={{ backgroundColor: "#333", color: "white", width: "30%" }}
            />

            <Button
              variant="contained"
              color="success"
              sx={{ height: "55px" }}
              onClick={() =>
                selectedUnconfirmed.forEach((name) => {
                  const participant = filteredUnconfirmed.find(
                    (p) => p.user.email === name
                  );
                  if (participant) {
                    updateParticipantStatus(participant.part_Id, "active");
                  }
                })
              }
              id="add"
            >
              เพิ่มผู้เข้าร่วม
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#1e1e1e", borderRadius: "10px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      sx={{ color: "white" }}
                      indeterminate={
                        selectedUnconfirmed.length > 0 &&
                        selectedUnconfirmed.length < filteredUnconfirmed.length
                      }
                      checked={
                        filteredUnconfirmed.length > 0 &&
                        selectedUnconfirmed.length ===
                          filteredUnconfirmed.length
                      }
                      onChange={(event) =>
                        handleSelectAllClick(event, "unconfirmed")
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>User</TableCell>
                  <TableCell sx={{ color: "white" }}>Email</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Telephone Number
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>Account status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUnconfirmed
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((participant, index) => {
                    const isItemSelected =
                      selectedUnconfirmed.indexOf(participant.user.email) !==
                      -1;
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: isItemSelected
                            ? "rgba(255, 255, 255, 0.08)"
                            : "inherit",
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            sx={{ color: "white" }}
                            checked={isItemSelected}
                            onChange={(event) =>
                              handleCheckboxClick(
                                event,
                                participant.user.email,
                                "unconfirmed"
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              alt={participant.user.first_name}
                              src={`${participant.user.user_image}`}
                              sx={{ marginRight: "10px" }}
                            />
                            <Typography sx={{ color: "white" }}>
                              {participant.user.first_name}{" "}
                              {participant.user.last_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: "white" }}>
                            {participant.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: "white" }}>
                            {participant.user.phone_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ borderRadius: "20px" }}
                            id="Participation-unconfirmed"
                          >
                            ยังไม่ได้ยืนยันการเข้าร่วม
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUnconfirmed.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ color: "white" }}
            />
          </TableContainer>

          <Typography
            variant="h5"
            sx={{ textAlign: "left", marginTop: "40px", marginBottom: "20px" }}
            style={{ color: "white" }}
          >
            ยืนยันการเข้าร่วมแล้ว
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
                style: { color: "white" },
              }}
              id="search2"
              sx={{ backgroundColor: "#333", color: "white", width: "30%" }}
            />

            <Button
              variant="contained"
              color="error"
              sx={{ height: "55px" }}
              onClick={handleRemoveClick} // เรียกใช้ฟังก์ชันเปิด Dialog
              id="remove"
            >
              เตะ
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#1e1e1e", borderRadius: "10px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      sx={{ color: "white" }}
                      indeterminate={
                        selectedConfirmed.length > 0 &&
                        selectedConfirmed.length < filteredConfirmed.length
                      }
                      checked={
                        filteredConfirmed.length > 0 &&
                        selectedConfirmed.length === filteredConfirmed.length
                      }
                      onChange={(event) =>
                        handleSelectAllClick(event, "confirmed")
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>User</TableCell>
                  <TableCell sx={{ color: "white" }}>Email</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Telephone Number
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>Account status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConfirmed
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((participant, index) => {
                    const isItemSelected =
                      selectedConfirmed.indexOf(participant.user.email) !== -1;
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: isItemSelected
                            ? "rgba(255, 255, 255, 0.08)"
                            : "inherit",
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            sx={{ color: "white" }}
                            checked={isItemSelected}
                            onChange={(event) =>
                              handleCheckboxClick(
                                event,
                                participant.user.email,
                                "confirmed"
                              )
                            }
                            id="checkbox"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              alt={participant.user.first_name}
                              src={`${participant.user.user_image}`}
                              sx={{ marginRight: "10px" }}
                            />
                            <Typography sx={{ color: "white" }}>
                              {participant.user.first_name}{" "}
                              {participant.user.last_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: "white" }}>
                            {participant.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: "white" }}>
                            {participant.user.phone_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ borderRadius: "20px" }}
                            id="Participation-confirmed"
                          >
                            ยืนยันการเข้าร่วมแล้ว
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredConfirmed.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ color: "white" }}
            />
          </TableContainer>

          <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
          >
            <DialogTitle>ยืนยันการเตะ</DialogTitle>
            <DialogContent>
              <DialogContentText>
                คุณแน่ใจหรือไม่ที่จะเตะผู้ใช้นี้ออกจากการเข้าร่วม?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setConfirmDialogOpen(false)}
                color="inherit" // ใช้สีเทาเพื่อความเป็นกลาง
                id="cancel"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleRemoveConfirm}
                color="error" // ใช้สีแดงเพื่อเน้นการกระทำที่สำคัญ
                autoFocus
                id="confirm"
              >
                ยืนยัน
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </ThemeProvider>
      <Footer />
    </>
  );
}

export default JoinPage;
