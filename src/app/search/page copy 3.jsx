"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostGames from "@/Page/PostGames";
import PostActivity from "@/Page/PostActivity";
import Header from "@/components/header/Header";
import Filter from "@/components/Filter";
import { Container, Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// TODO remove, this demo shouldn't need to reset the theme.
// กำหนดธีมสีเข้ม
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
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
});

export default function SearchPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [activities, setActivities] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        try {
          const [activitiesRes, gamesRes] = await Promise.all([
            fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity?search=${search}`),
            fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame?search=${search}`),
          ]);

          if (!activitiesRes.ok) {
            throw new Error(
              `Failed to fetch activities: ${activitiesRes.statusText}`
            );
          }
          if (!gamesRes.ok) {
            throw new Error(`Failed to fetch games: ${gamesRes.statusText}`);
          }

          const activitiesData = await activitiesRes.json();
          const gamesData = await gamesRes.json();

          console.log("Activities data:", activitiesData); // เพิ่มเพื่อตรวจสอบข้อมูลที่ได้รับ
          console.log("Games data:", gamesData); // เพิ่มเพื่อตรวจสอบข้อมูลที่ได้รับ

          setActivities(activitiesData);
          setGames(gamesData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      console.log("No search query found");
      setLoading(false);
    }
  }, [search]);

  // ตรวจสอบข้อมูลที่ได้รับก่อนทำการแสดงผล
  useEffect(() => {
    console.log("Activities state:", activities);
    console.log("Games state:", games);
  }, [activities, games]);

  if (loading) return <Typography color="white">กำลังโหลด...</Typography>;
  if (error)
    return <Typography color="white">เกิดข้อผิดพลาด: {error}</Typography>;

  return (
    <div>
      <Header />
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ marginTop: 10 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Typography
                variant="h4"
                color={"white"}
                sx={{ textAlign: "left" }}
              >
                นัดเล่นบอร์ดเกมแบบออนไซต์
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: "right" }}></Grid>
          </Grid>

          <hr className=" mt-5 mb-5" sx={{ background: "grey.800" }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
              <Filter />
            </Grid>
            <Grid item xs={12} md={8}>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <PostActivity key={activity.post_activity_id} {...activity} />
                ))
              ) : (
                <Typography color="white">
                  {/* ไม่พบกิจกรรมที่ตรงกับคำค้นหา */}
                </Typography>
              )}
              {games.length > 0 ? (
                games.map((game) => (
                  <PostGames key={game.post_games_id} {...game} />
                ))
              ) : (
                <Typography color="white">
                  ไม่พบโพสต์นัดเล่นที่ตรงกับคำค้นหา
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}
