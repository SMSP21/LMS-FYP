import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import onlinelibrary from '../assets/onlineLibrary1.png';
import { useUser } from './usercontext';
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";

function StaffDashboard() {
  const { state } = useUser();
  const { stfUserName, stfUserType } = state;
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const panelItems = [
    { key: 1, label: 'Add Shelfs', altText: 'Add Shelfs to library', route: '/add-shelfs' },
    { key: 2, label: 'Add Books', altText: 'Add books to library', route: '/add-books' },
    { key: 3, label: 'Book Search', altText: 'Search for books', route: '/book-searchs' },
    { key: 4, label: 'Register User', altText: 'Update books information', route: '/RegistrationStaff' },
    { key: 5, label: 'View Reservations', altText: 'View current reservations', route: '/view-reservations' },
    { key: 6, label: 'User Detail', altText: 'View user detail', route: '/user-detail' },
    
  ];

  return (
    <>
    <button className="panel-button view-profile-button" onClick={toggleProfileModal}>
    View Profile
  </button>
      <header className="main-container">
        <div className="background-overlay">
          <div className="title-container">
            <p>User Name: {username}</p>
            <p>User Type: {stfUserType}</p>
            <h1 className="main-title">Library Management System</h1>
          </div>
        </div>
      </header>
      <main className="content-area">
        <div className="buttons-container">
          {panelItems.slice(0, 6).map((item) => (
            <div key={item.key} className="button-container">
              {item.route ? (
                <Link to={item.route}>
                  <button className="panel-button">{item.label}</button>
                </Link>
              ) : (
                <button className={item.className} onClick={item.onClick}>
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="signout-container">
        <Link to="/Signout">
              <Button >
                Signout
              </Button>
              </Link>
        </div>
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleProfileModal}>&times;</span>
            <ViewProfile />
          </div>
        </div>
      )}
      <style jsx>{`
        .main-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .background-overlay {
          background: url(${onlinelibrary}) center/cover no-repeat;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.7;
        }

        .title-container {
          margin-bottom: 40px;
          padding-top: 20px;
          z-index: 2;
          text-align: center;
        }

        .main-title {
          color: #fff;
          font-size: 75px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .content-area {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          z-index: 1;
        }

        .buttons-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          margin-bottom: 20px;
          padding-top: 100px;
        }

        .button-container {
          margin: 20px;
        }

        .panel-button {
          width: 150px;
          border-radius: 12px;
          box-shadow: 0 10px 4px rgba(0, 0, 0, 0.2);
          background-color: #af8f8f;
          color: #fff;
          padding: 20px;
          font-size: 20px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
        }

        .panel-button:hover {
          background-color: #795353;
          transform: scale(1.1);
        }

        .signout-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .signout-button {
          width: 200px;
          background-color: maroon;
          color: #fff;
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 40px;
          }

          .background-overlay {
            background-size: cover;
          }
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        
        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        
        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          cursor: pointer;
          z-index: 2;
        }
        .panel-button.view-profile-button {
          position: absolute;
          top: 20px; /* Adjust the distance from the top as needed */
          right: 20px; /* Adjust the distance from the right as needed */
          z-index: 999; /* Ensure it's above other content */
          padding: 10px 20px;
          border-radius: 5px;
          background-color: #
        }
        .panel-button.view-profile-button:hover {
          background-color: #1a18b6;
        }
        
        
      `}</style>
    </>
  );
}

export default StaffDashboard;
