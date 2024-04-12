import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import onlinelibrary from "../assets/onlineLibrary1.png";
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";

const UserDetail = () => {
  const [userDetail, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTotal, setUserTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOption, setSearchOption] = useState('userFullName');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  useEffect(() => {
    fetchUserDetails();
    userCount();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5002/searchUsers', {
        searchTerm,
        searchOption
      });
      if (response.data.length === 0) {
        // Handle case when no users are found
        if (!searchTerm) {
          toast.info('Please enter a search term');
        } else {
          toast.info('No users found matching the search criteria');
        }
      } else {
        setSearchResults(response.data);
      }
    } catch (error) {
      // Handle error when searching for users
      toast.error('An error occurred while searching for users');
      setSearchResults([]);
    }
  };
  

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5002/userget');
      setUserDetails(response.data.result);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching user detail');
      setLoading(false);
    }
  };

  const userCount = async () => {
    try {
      const response = await axios.get('http://localhost:5002/userTotal');
      console.log(response)
      const data = response.data;
      console.log(data.totalUsers)
      if (data.success) {
        setUserTotal(data.totalUsers); // Update userTotal state variable with the fetched data
      } else {
        toast.error('Error fetching total Users');
      }
    } catch (error) {
      toast.error('Error fetching total Users');
      console.error('Error fetching total Users:', error);
    }
  };
  
  
  

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/deleteUser/${id}`);
      toast.success('User deleted successfully');
      fetchUserDetails(); // Refresh the list of reserved books after deletion
      userCount(); // Refresh the reservation count after deletion
    } catch (error) {
      toast.error('User has Book Reserved or has Fine to be Payed');
      console.error('User has Book Reserved or has Fine to be Payed:', error);
    }
  };

  return (
    <>
      <div className="titleAndProfile">
        <h1 className="title">Library Management System</h1>
        <div className="profileIcon">
          <button className="panel-button view-profile-button" onClick={toggleProfileModal}>
            View Profile
          </button>
        </div>
      </div>
      <img src={onlinelibrary} alt="" className="backgroundImage" />
      <section className="banner">
        <div className="wrapper">
          <header className="header">
            <nav className="navigationContainer">
              <Link to="/add-shelfs">
                <button className="menuButton">Add Shelfs</button>
              </Link>
              <Link to="/add-books"><button className="menuButton">Add Books</button></Link>
              <Link to="/book-searchs"><button className="menuButton">Book Search</button></Link>
              <Link to="/RegistrationStaff"><button className="menuButton">Register User</button></Link>
              <Link to="/view-reservations"><button className="menuButton">View Reservation</button></Link>
              <button className="menuButton">User Detail</button>
              
              <Link to="/Signout">
                <Button>
                  Signout
                </Button>
              </Link>
            </nav>
          </header>
          <main className="mainContent">
            <section className="reservedBooksSection">
              <div className='p-3 d-flex justify-content-around mt-3'>
                <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
                  <div className='text-center pb-1'>
                    <h4 className="reservationTitle">Users</h4>
                  </div>
                  <div className=''>
                    <table className="totalReservationTable">
                      <tbody>
                        <tr>
                          <td>Total Users</td>
                          <td className="reservationCount">
                            {userCount}{userTotal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <h2 className="searchHeader">Search User</h2>
              <div className="searchContainer">
                <div className="searchInput">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter search term" />
                  <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
               
                    <option value="userFullName">Full Name</option>
                    <option value="userUserName">User Name</option>
                   
                  </select>
                  <button onClick={handleSearch} className="searchButton">Search</button>
                </div>
              </div>
              <h2 className="heading">User Details</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="tableContainer">
                  <table className="bookTable">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>User Name</th>
                       
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.length > 0 ? (
                        // Display search results if available
                        searchResults.map((book) => (
                          <tr key={book.user_id}>
                          <td>{book.userFullName}</td>
                            <td>{book.userEmail}</td>
                            <td>{book.userUserName}</td>
                            <td>
                              <button className="deleteButton" onClick={() => deleteUser(book.user_id)}>Delete</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Display user details if no search results
                        userDetail.map((book) => (
                          <tr key={book.user_id}>
                            <td>{book.userFullName}</td>
                            <td>{book.userEmail}</td>
                            <td>{book.userUserName}</td>
                            
                            <td>
                              <button className="deleteButton" onClick={() => deleteUser(book.user_id)}>Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </section>
      {/* View Profile Modal */}
      {isProfileModalOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleProfileModal}>
              &times;
            </span>
            <ViewProfile />
          </div>
        </div>
      )}
      <ToastContainer />

      <style jsx>{`
        .titleAndProfile {
          display: flex;
          align-items: center;
        }

        .title {
          margin: 5rem;
          font-size: 3rem;
          color: #f5f5f5;
        }

        .profileIcon {
          cursor: pointer;
          width: 15px;
          margin-left: 15rem;
        }

        .backgroundImage {
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          object-position: center;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          opacity: 0.8;
        }

        .banner {
          position: relative;
        }

        .wrapper {
          position: relative;
          z-index: 1;
        }

        .header {
          background-color: transparent;
          padding-top: 8px;
        }

        .navigationContainer {
          background-color: rgba(119, 51, 51, 0.99);
          display: flex;
          justify-content: space-around;
          padding: 1rem 0;
          color: #f5f5f5;
        }

        .menuButton {
          font-family: Inter, sans-serif;
          border-radius: 30px;
          box-shadow: 0px 20px 4px 0px rgba(0, 0, 0, 0.25);
          padding: 1rem;
          background-color: rgba(29, 2, 33, 0.58);
          color: #e6f624;
          cursor: pointer;
        }

        .mainContent {
          padding: 2rem;
        }

        .noResults {
          color: #555;
        }

        .tableContainer {
          overflow-x: auto;
          margin-top: 20px;
        }

        .bookTable {
          width: 100%;
          border-collapse: collapse;
        }

        .bookTable th,
        .bookTable td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          background-color: #fff;
          color: #333;
          transition: background-color 0.3s ease;
        }

        .bookTable th {
          background-color: #f2f2f2;
        }

        .bookTable tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .bookTable tr:not(:first-child):hover {
          background-color: #f2f2f2;
        }

        .heading {
          font-size: 2.5rem;
          color: #f2f2f2; /* Brighter color */
          text-align: center;
          margin-bottom: 20px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Text shadow */
        }

        .reservationTitle {
          font-size: 24px;
          color: #f5f5f5;
        }

        .reservationCount {
          font-size: 24px; /* Bigger font size */
          color: #007bff; /* Better color */
        }

        .totalReservationTable {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #f5f5f5; /* Whitish color */
        }

        .totalReservationTable td {
          padding: 15px; /* Adjust padding as needed */
          text-align: center;
          border-bottom: 1px solid #ddd;
          color: #333; /* Adjust text color as needed */
        }

        .totalReservationTable td:first-child {
          font-weight: bold;
        }

        .deleteButton {
          padding: 8px 16px;
          background-color: #ff6347;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .deleteButton:hover {
          background-color: #ff4c32;
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
        .popup {
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

        .popup-content {
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
        .searchSection {
          margin-top: 2rem;
          padding: 2rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
        }

        .searchHeader {
          color: white;
          margin-bottom: 1rem;
        }

        .searchContainer {
          margin-top: 1rem;
        }

        .searchInput {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .searchInput input[type="text"],
        .searchInput select {
          margin-right: 1rem;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .searchButton {
          background-color: #2b27ee;
          color: #fff;
          cursor: pointer;
          padding: 0.5rem 1rem;
          font-size: 18px;
          border: none;
          border-radius: 4px;
        }

        .searchButton:hover {
          background-color: #1a18b6;
        }
      `}</style>
    </>
  );
}

export default UserDetail;
