"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostGames from "@/Page/PostGames";
import PostActivity from "@/Page/PostActivity";
import Header from "@/components/header/Header";
import Filter from "@/components/Filter";
import { Container, Grid, Typography } from "@mui/material";

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
          console.log("Fetching data for search:", search); // เพิ่ม log เพื่อตรวจสอบคำค้นหา
          const [activitiesRes, gamesRes] = await Promise.all([
            fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity?search=${search}`),
            fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame?search=${search}`),
          ]);

          console.log("Activities response status:", activitiesRes.status);
          console.log("Games response status:", gamesRes.status);

          if (!activitiesRes.ok) {
            throw new Error(`Failed to fetch activities: ${activitiesRes.statusText}`);
          }
          if (!gamesRes.ok) {
            throw new Error(`Failed to fetch games: ${gamesRes.statusText}`);
          }

          const activitiesData = await activitiesRes.json();
          const gamesData = await gamesRes.json();

          console.log("Fetched activities:", activitiesData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ
          console.log("Fetched games:", gamesData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ

          setActivities(activitiesData);
          setGames(gamesData);
        } catch (error) {
          console.error("Error fetching data:", error); // เพิ่ม log เพื่อตรวจสอบข้อผิดพลาด
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

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" color={"white"} sx={{ textAlign: "left" }}>
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
              <p>ไม่พบกิจกรรมที่ตรงกับคำค้นหา</p>
            )}
            {games.length > 0 ? (
              games.map((game) => (
                <PostGames key={game.post_games_id} {...game} />
              ))
            ) : (
              <p>ไม่พบเกมที่ตรงกับคำค้นหา</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
