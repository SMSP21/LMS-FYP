import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaUserAlt, FaUserTag, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState('');

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

  const handleEditName = () => {
    setEditingName(true);
    setUpdatedName(userProfile.userFullName);
  };

  const handleSaveName = async () => {
    const confirmation = window.confirm('Are you sure you want to update your name?');
    if (confirmation) {
      try {
        // Send updated name to the server
        const response = await axios.put('http://localhost:5002/update-profile', {
          user_id: userProfile.user_id,
          updatedName
        });
  
        const { success, message } = response.data;
  
        if (success) {
          // Update user profile with the new name
          setUserProfile({ ...userProfile, userFullName: updatedName });
          setEditingName(false);
          // Show success pop-up alert
          window.alert('Name updated successfully');
        } else {
          setError(message);
          // Show error toast
          toast.error(message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to update name');
        // Show error toast
        toast.error('Failed to update name');
      }
    } else {
      // User clicked cancel, do nothing
    }
  };
  
  
  

  const handleNameChange = (e) => {
    setUpdatedName(e.target.value);
  };

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
          <div className="full-name">
            <FaUser size={28} />
            <strong>Full Name:</strong>
            {editingName ? (
              <>
                <input
                  type="text"
                  value={updatedName}
                  onChange={handleNameChange}
                />
                <button onClick={handleSaveName}>Save</button>
              </>
            ) : (
              <>
                <span>{userProfile.userFullName}</span>
                <button onClick={handleEditName}>Edit</button>
              </>
            )}
          </div>
          <p><FaEnvelope size={28} /> <strong>Email:</strong> {userProfile.userEmail}</p>
          <p><FaUserShield size={28} /> <strong>Username:</strong> {userProfile.userUserName}</p>
          <p><FaUserTag size={28} /> <strong>User Type:</strong> {userProfile.userType}</p>
          {/* Add more fields as needed */}
          <Link to="/change-password" className="change-password-btn">Change Password</Link> {/* Link to ChangePasswordPage */}
        </div>
      ) : (
        <p>No user profile found</p>
      )}
      <ToastContainer />
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

        /* Styles for the Change Password link/button */
        .profile-details a {
          display: block;
          margin-top: 10px;
          text-align: center;
          color: #007bff;
          text-decoration: none;
          font-size: 16px;
        }
        .change-password-btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .change-password-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ViewProfile;
