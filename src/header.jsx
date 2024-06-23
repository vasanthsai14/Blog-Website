import { useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import ReactSearchBox from "react-search-box";
import { SearchContext } from "./SearchContext.jsx"; // Import the SearchContext

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext); // Use SearchContext for searchTerm and setSearchTerm

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile', {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
        console.log("Profile Data:", data);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchData();
  }, [setUserInfo]);

  async function logout() {
    await fetch('http://localhost:5000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    navigate('/');
  }

  const username = userInfo?.username;

  const handleSearch = (value) => {
    setSearchTerm(value); // Set the search term in SearchContext
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Blogify
      </Link>

      {location.pathname === '/' && ( // Conditionally render the search bar only on the index page
        <div className="search-bar">
          <ReactSearchBox
            placeholder="Search category.."
            value={searchTerm}
            callback={(record) => console.log(record)}
            onChange={(e) => handleSearch(e)}
          />
        </div>
      )}

      <nav>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <Link to={`/profile/${userInfo.id}`}>Profile</Link>
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