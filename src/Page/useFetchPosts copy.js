import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPosts = (selectedCategory, searchTerm, number) => {
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
            "http://localhost:8080/api/postGame"
          );
          postData = postData.concat(postGames);
        }

        if (selectedCategory === "" || selectedCategory === "postActivity") {
          const { data: postActivities } = await axios.get(
            "http://localhost:8080/api/postActivity"
          );
          postData = postData.concat(postActivities);
        }

        // Filter based on searchTerm and number
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

        if (number) {
          postData = postData.filter((post) => post.num_people >= number);
        }

        setData(postData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm, number]);

  return { data, loading, error };
};

export default useFetchPosts;
