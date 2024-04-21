import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      // Perform validation for new password and confirm new password
      if (newPassword !== confirmNewPassword) {
        toast.error("New password and confirm password don't match");
        return;
      }
      const token = localStorage.getItem('token');
     console.log(token)
     const response = await axios.post('http://localhost:5002/change-password', {
      currentPassword,
      newPassword,
    }, {
      headers: { 'Authorization': `Bearer ${token}` }, // Move headers outside of data object
    });
  
      const { success, message } = response.data;

      if (success) {
        toast.success('Password changed successfully');
        // Clear input fields after successful password change
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        // Redirect to MemberLogin page
        window.location.href = '/member';
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
     
      <form className="change-password-form">
        <div className="form-group">
          <label htmlFor="currentPasswordInput">Current Password</label>
          <input
            type="password"
            id="currentPasswordInput"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPasswordInput">New Password</label>
          <input
            type="password"
            id="newPasswordInput"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPasswordInput">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPasswordInput"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="button" onClick={handleChangePassword} className="btn">
          Change Password
        </button>
      </form>
      <ToastContainer />
      <style jsx>{`
        .change-password-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          background-color: #f5f5f5;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-bottom: 20px;
          font-size: 24px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          font-weight: bold;
          color: #333;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .btn {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordPage;
