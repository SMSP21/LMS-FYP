import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaUserAlt, FaUserTag, FaUserShield } from 'react-icons/fa';

const ViewProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5002/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setUserProfile(response.data.userProfile);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setError(error.response.data.message || 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-heading">User Profile</h1>
      {userProfile ? (
        <div className="profile-details">
          <p><FaUserAlt size={28} /> <strong>User ID:</strong> {userProfile.user_id}</p>
          <p><FaUser size={28} /> <strong>Full Name:</strong> {userProfile.userFullName}</p>
          <p><FaEnvelope size={28} /> <strong>Email:</strong> {userProfile.userEmail}</p>
          <p><FaUserShield size={28} /> <strong>Username:</strong> {userProfile.userUserName}</p>
          <p><FaUserTag size={28} /> <strong>User Type:</strong> {userProfile.userType}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>No user profile found</p>
      )}
      <style jsx>{`
        .profile-container {
          background-color: #f6f6f6; 
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-heading {
          color: #333;
          font-size: 32px;
          text-align: center;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .profile-details {
          margin-top: 20px;
          border-top: 1px solid #ccc;
          padding-top: 20px;
        }

        .profile-details p {
          margin-bottom: 15px;
          color: #555;
          font-size: 18px;
          line-height: 1.5;
          display: flex;
          align-items: center;
        }

        .profile-details strong {
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default ViewProfile;
