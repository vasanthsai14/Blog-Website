import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const{setUserInfo,userInfo}=useContext(UserContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/profile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();//data has (username ,id and iat)
        setUserInfo(data);
        console.log("Profile Data:", data);
        // Handle the fetched data as needed, e.g., update state
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchData();
  }, []);

  function logout(){
    fetch('http://localhost:5000/logout',{
      credentials:'include',
      method:'POST',
    });
    setUserInfo(null);
  }
  const username=userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">
        WordPress
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <Link onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
