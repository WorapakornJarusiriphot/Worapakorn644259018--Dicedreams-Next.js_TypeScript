"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostGames from "@/Page/PostGames";
import PostActivity from "@/Page/PostActivity";
import Header from "@/components/header/Header";
import Filter from "@/components/Filter";
import { Container, Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Suspense } from 'react';

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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}

function SearchComponent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const searchDateMeet = searchParams.get("search_date_meet");
  const searchTimeMeet = searchParams.get("search_time_meet");
  const searchNumPeople = searchParams.get("search_num_people");
  const [activities, setActivities] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQueryParams = () => {
    let params = [];
    if (search) {
      search.split("&").forEach((term) => {
        params.push(`search=${term}`);
      });
    }
    if (searchDateMeet) {
      params.push(`search_date_meet=${searchDateMeet}`);
    }
    if (searchTimeMeet) {
      params.push(`search_time_meet=${searchTimeMeet}`);
    }
    if (searchNumPeople) {
      params.push(`search_num_people=${searchNumPeople}`);
    }
    return params.join("&");
  };

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        try {
          const queryParams = buildQueryParams();
          console.log("Fetching data with query:", queryParams);

          const gamesRes = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame?${queryParams}`
          );

          if (!gamesRes.ok) {
            throw new Error(`Failed to fetch games: ${gamesRes.statusText}`);
          }

          const gamesData = await gamesRes.json();
          console.log("Fetched games data:", gamesData);

          setGames(gamesData);
        } catch (error) {
          console.error("Error fetching games data:", error);
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
  }, [search, searchDateMeet, searchTimeMeet, searchNumPeople]);

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        try {
          const queryParams = buildQueryParams();
          const activitiesRes = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity?${queryParams}`
          );
          if (!activitiesRes.ok) {
            throw new Error(
              `Failed to fetch activities: ${activitiesRes.statusText}`
            );
          }

          const activitiesData = await activitiesRes.json();
          console.log("Fetched activities:", activitiesData);

          setActivities(activitiesData);
        } catch (error) {
          console.error("Error fetching activities data:", error);
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
  }, [search, searchDateMeet, searchTimeMeet, searchNumPeople]);

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
                  ไม่พบกิจกรรมที่ตรงกับที่ค้นหา
                </Typography>
              )}
              {games.length > 0 ? (
                games.map((game) => (
                  <PostGames key={game.post_games_id} {...game} />
                ))
              ) : (
                <Typography color="white">
                  ไม่พบโพสต์นัดเล่นที่ตรงกับที่ค้นหา
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}
