import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPosts = (selectedCategory, searchTerm, number, selectedDate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let postData = [];

      try {
        if (selectedCategory === "" || selectedCategory === "postGames") {
          const { data: postGames } = await axios.get(
            "https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame"
          );
          postData = postData.concat(postGames);
        }

        if (selectedCategory === "" || selectedCategory === "postActivity") {
          const { data: postActivities } = await axios.get(
            "https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity"
          );
          postData = postData.concat(postActivities);
        }

        // Log ข้อมูลที่ได้รับจาก API
        console.log("Fetched postData:", postData);

        // Filter based on searchTerm
        if (searchTerm) {
          postData = postData.filter(
            (post) =>
              post.name_games
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              post.name_activity
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }

        // Log ข้อมูลหลังจากกรองด้วย searchTerm
        console.log("Filtered by searchTerm:", postData);

        // Filter based on number of participants
        if (number) {
          postData = postData.filter((post) => post.participants >= number);
        }

        // Log ข้อมูลหลังจากกรองด้วย number
        console.log("Filtered by number:", postData);

        // Filter based on selectedDate
        if (selectedDate) {
          postData = postData.filter((post) => {
            const postDate = post.date_meet || post.date_activity;
            return dayjs(postDate).isSame(selectedDate, 'day');
          });
        }

        // Log ข้อมูลหลังจากกรองด้วย selectedDate
        console.log("Filtered by selectedDate:", postData);

        setData(postData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm, number, selectedDate]);

  return { data, loading, error };
};

export default useFetchPosts;
