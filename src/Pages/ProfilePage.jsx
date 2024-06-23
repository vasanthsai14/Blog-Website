import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${id}`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/post?userId=${id}`, { withCredentials: true });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [id]);

  return (
    <div className="profile-page">
      <div className="left-section">
        <h2>Your Posts</h2>
        {posts.map(post => (
          <div key={post._id} className="post">
            <h3>{post.title}</h3>
            <p className="summary">{post.summary}</p>
            <p className="author">Posted by: {post.author.username}</p>
            <Link to={`/post/${post._id}`} className="read-more">Read More</Link>
          </div>
        ))}
      </div>
      <div className="right-section">
        <h3>{user.username}'s Profile</h3>
        <div className="profile-picture">
          {user.profilePicture ? (
            <img src={`http://localhost:5000/${user.profilePicture}`} alt="Profile" />
          ) : (
            <p>No profile picture</p>
          )}
        </div>
        <div className="profile-details">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
        </div>
        <Link to={`/profile/${id}/edit`} className="edit-profile-button">Edit Profile</Link>
      </div>
    </div>
  );
};

export default ProfilePage;
