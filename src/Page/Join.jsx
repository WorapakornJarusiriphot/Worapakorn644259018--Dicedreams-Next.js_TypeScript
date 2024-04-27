'use client';

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  RadioGroup,
  Radio,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Header from "../components/header/Header";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Filter from "../components/Filter";
import SearchIcon from "@mui/icons-material/Search";
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "user", headerName: "User", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "telephone", headerName: "Telephone", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: "red",
          padding: "7px",
          borderRadius: "30px",
          width: "100%",
        }}
      >
        {params.value}
      </div>
    ),
  },
];

const rows = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    telephone: "1234567890",
    status: "ยังไม่ยอมรับ",
  },
  {
    id: 2,
    user: "Jane Doe",
    email: "jane@example.com",
    telephone: "1234567890",
    status: "ยังไม่ยอมรับ",
  },
  {
    id: 3,
    user: "Alice Smith",
    email: "alice@example.com",
    telephone: "1234567890",
    status: "ยังไม่ยอมรับ",
  },
  // เพิ่มรายการตามต้องการ
];
function Home() {
  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <Typography
          variant="h4"
          color={"white"}
          sx={{
            textAlign: "left",
            marginBottom: "50px",
            textAlignLast: "center",
          }}
        >
          จัดการผู้เข้าร่วม
        </Typography>
        <Typography
          variant="h5"
          color={"white"}
          sx={{
            textAlign: "left",
            marginBottom: "10px",
            textAlignLast: "left",
          }}
        >
          Waiting Participants
        </Typography>
        <Box sx={{ margin: "auto", background: "#212121", padding: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} sx={{ textAlign: "left" }}>
              <form className="max-w-md mx-auto mb-3">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-black focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="ค้นหาโพสต์"
                    required
                  />
                </div>
              </form>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: "left" }}>
              <div>
                <input
                  type="text"
                  placeholder="Property"
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </Grid>
          </Grid>

          <DataGrid
            sx={{ color: "white" }}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableColumnFilter
            disableColumnMenu
            disableSelectionOnClick
            checkboxSelection
          />
        </Box>
      </Container>
    </div>
  );
}

export default Home;
