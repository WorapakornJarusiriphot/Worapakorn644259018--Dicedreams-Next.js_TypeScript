"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostGamesSearch from "@/Page/PostGames-search";
import PostActivitySearch from "@/Page/PostActivity-search";
import Header from "@/components/header/Header";
import Filter from "@/components/Filter";
import { Container, Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Suspense } from "react";

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
    const params = new URLSearchParams();

    if (search) {
      search.split("&").forEach((term) => {
        params.append("search", term);
      });
    }

    if (searchDateMeet) {
      params.append("search_date_meet", searchDateMeet);
    }

    if (searchTimeMeet) {
      params.append("search_time_meet", searchTimeMeet);
    }

    if (searchNumPeople) {
      params.append("search_num_people", searchNumPeople);
    }

    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = buildQueryParams();
        console.log("Fetching data with query:", queryParams);

        const gamesRes = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/search?${queryParams}`
        );

        if (!gamesRes.ok) {
          throw new Error(`Failed to fetch games: ${gamesRes.statusText}`);
        }

        let gamesData = await gamesRes.json();

        // Log ผลลัพธ์จาก API เพื่อให้แน่ใจว่า API ส่งข้อมูลกลับมาอย่างถูกต้อง
        console.log("Games data from API:", gamesData);

        // ตรวจสอบว่ามีค่า search หรือไม่ ถ้าไม่มีกำหนดให้เป็น string ว่าง
        const searchValue = search ? search.toLowerCase() : "";

        // ตรวจสอบว่าชื่อเกมหรือรายละเอียดตรงกับคำค้นหาหรือไม่
        gamesData = gamesData
          .filter(
            (game) =>
              game.name_games?.toLowerCase().includes(searchValue) ||
              game.detail_post?.toLowerCase().includes(searchValue)
          )
          .sort((a, b) => {
            const aMatches =
              a.name_games && a.name_games.toLowerCase().includes(searchValue);
            const bMatches =
              b.name_games && b.name_games.toLowerCase().includes(searchValue);

            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;

            return new Date(b.creation_date) - new Date(a.creation_date);
          });

        // Log gamesData ที่ถูกกรองแล้ว
        console.log("Filtered games data:", gamesData);

        // หากมีเพียงข้อมูลเดียวให้แสดงเฉพาะข้อมูลนั้น
        if (gamesData.length === 1) {
          setGames([gamesData[0]]);
        } else {
          setGames(gamesData);
        }
      } catch (error) {
        console.error("Error fetching games data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, searchDateMeet, searchTimeMeet, searchNumPeople]);

  useEffect(() => {
    if (search) {
      const fetchData = async () => {
        try {
          const queryParams = buildQueryParams();
          const activitiesRes = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/search?${queryParams}`
          );
          if (!activitiesRes.ok) {
            throw new Error(
              `Failed to fetch activities: ${activitiesRes.statusText}`
            );
          }

          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData);
          console.log("Fetched activities data:", activitiesData);
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
                  <PostActivitySearch
                    key={activity.post_activity_id}
                    {...activity}
                  />
                ))
              ) : (
                <Typography color="white">
                  ไม่พบกิจกรรมที่ตรงกับที่ค้นหา
                </Typography>
              )}
              {games.length === 1 ? (
                <PostGamesSearch key={games[0].post_games_id} {...games[0]} />
              ) : games.length > 0 ? (
                games.map((game) => (
                  <PostGamesSearch key={game.post_games_id} {...game} />
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
