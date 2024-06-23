import React, { useEffect, useState, useContext } from "react";
import Post from "../post";
import Post2 from "../post2";
import Post3 from "../post3";
import { SearchContext } from "../SearchContext"; // Import SearchContext

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [token, setToken] = useState(null);
  const { searchTerm } = useContext(SearchContext); // Use searchTerm from SearchContext

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    console.log('Stored Token in IndexPage:', storedToken);
    setToken(storedToken);

    fetch('http://localhost:5000/post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(posts => {
        setPosts(posts);
      })
      .catch(error => console.error('Error fetching data:', error));

    fetch('http://localhost:5000/all-posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(allPosts => {
        const otherPosts = allPosts.filter(post => !posts.some(userPost => userPost._id === post._id));
        setAllPosts(otherPosts);
      })
      .catch(error => console.error('Error fetching all posts:', error));
  }, [token]);

  const filteredPosts = searchTerm 
    ? allPosts.filter(post => post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    : allPosts;

  return (
    <>
      {filteredPosts.length > 0 && filteredPosts.map(post => (
        <Post key={post._id} {...post} />
      ))}
      <Post2 />
      <Post3 />
    </>
  );
}
