import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfileEditPage = () => {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${id}`, { withCredentials: true });
        setEmail(response.data.email);
        setBio(response.data.bio);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      await axios.put(`http://localhost:5000/profile/${id}`, formData, { withCredentials: true });
      alert('Profile data updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div className="profile-edit-page">
      <h1>Edit Profile</h1>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Bio:</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
      </div>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default ProfileEditPage;
