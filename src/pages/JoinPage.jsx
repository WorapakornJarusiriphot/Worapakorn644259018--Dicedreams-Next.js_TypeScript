import { useEffect, useState } from 'react';
import { Container, Avatar, Box, Button, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Header from '../components/header/Header';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";
const JoinPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


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
      console.log(response)
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

  const participants = [
    { name: 'Prabodhan Fitzgerald', email: '644259018@webmail.npru.ac.th', phone: '0623844415', status: 'ยังไม่อนุมัติ', avatar: '/path/to/avatar1.jpg' },
    { name: 'Hiro Joyce', email: '644259019@webmail.npru.ac.th', phone: '0623844415', status: 'ยังไม่อนุมัติ', avatar: '/path/to/avatar2.jpg' },
    { name: 'Lloyd Jefferson', email: '644259021@webmail.npru.ac.th', phone: '0623844415', status: 'ยังไม่อนุมัติ', avatar: '/path/to/avatar3.jpg' },
    { name: 'Ceiran Mayo', email: '644259022@webmail.npru.ac.th', phone: '0623844415', status: 'ยังไม่อนุมัติ', avatar: '/path/to/avatar4.jpg' },
    // Add more participants as needed
  ];

  const filteredParticipants = participants.filter((participant) => 
    participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ padding: '20px', color: 'white', backgroundColor: '#121212', minHeight: '100vh' }}>
        <Header />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>

      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '40px' }}>จัดการผู้เข้าร่วม</Typography>
      <Typography variant="h5" sx={{ textAlign: 'left', marginBottom: '20px' }}>Waiting Participants</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          variant="outlined"
          placeholder="Name, email, etc..."
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            style: { color: 'white' }
          }}
          sx={{ backgroundColor: '#333', color: 'white', width: '30%' }}
        />
        
        <TextField
          select
          label="Account status"
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{ backgroundColor: '#333', color: 'white', width: '30%' }}
        >
          <option value="">Property</option>
          <option value="ยังไม่อนุมัติ">ยังไม่อนุมัติ</option>
          {/* Add more options as needed */}
        </TextField>
        
        <Button variant="contained" color="success" sx={{ height: '55px' }}>ADD</Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', borderRadius: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>User</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Telephone Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Account status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParticipants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={participant.name} src={participant.avatar} sx={{ marginRight: '10px' }} />
                    <Typography sx={{ color: 'white' }}>{participant.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>{participant.email}</Typography></TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>{participant.phone}</Typography></TableCell>
                <TableCell>
                  <Button variant="contained" color="error" sx={{ borderRadius: '20px' }}>{participant.status}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredParticipants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: 'white' }}
        />
      </TableContainer>










      <Typography variant="h5" sx={{ textAlign: 'left', marginTop: '40px' , marginBottom: '20px'}}>Join Participants</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          variant="outlined"
          placeholder="Name, email, etc..."
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            style: { color: 'white' }
          }}
          sx={{ backgroundColor: '#333', color: 'white', width: '30%' }}
        />
        
        <TextField
          select
          label="Account status"
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{ backgroundColor: '#333', color: 'white', width: '30%' }}
        >
          <option value="">Property</option>
          <option value="ยังไม่อนุมัติ">ยังไม่อนุมัติ</option>
          {/* Add more options as needed */}
        </TextField>
        
        <Button variant="contained" color="error" sx={{ height: '55px' }}>REMOVE</Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', borderRadius: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>User</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Telephone Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Account status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParticipants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={participant.name} src={participant.avatar} sx={{ marginRight: '10px' }} />
                    <Typography sx={{ color: 'white' }}>{participant.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>{participant.email}</Typography></TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>{participant.phone}</Typography></TableCell>
                <TableCell>
                  <Button variant="contained" color="success" sx={{ borderRadius: '20px' }}>{participant.status}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredParticipants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: 'white' }}
        />
      </TableContainer>






    </Container>
    </Box>
  );
};

export default JoinPage;
