// Import necessary modules
import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import onlinelibrary from "../assets/onlineLibrary1.png";
import profileIcon from "../assets/profileIcon.jpg"; // Import your profile icon image

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userData, setUserData] = useState(null); // Add state to store user data

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/search?query=${query}`);
      setResults(response.data);
      setShowSearchPopup(true); // Show the search popup after fetching results
    } catch (error) {
      console.error('Error during search:', error);
      // Handle errors or display a user-friendly message
    }
  };
  const handleProfileClick = async () => {
    try {
      // Fetch user profile data
      const response = await axios.get('http://localhost:5002/profile'); // Replace with your endpoint
      setUserData(response.data);
      setShowProfilePopup(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle errors or display a user-friendly message
    }
  };
  const buttons = [
    { id: "booksSearch", text: "Books Search"},
    { id: "viewDataInfo", text: "View Data Info", route: "/View-Data-Info" },
    { id: "returnBook", text: "Return Book", route: "/Return-Book" },
    { id: "placeOrder", text: "Reservation", route: "/Place-reservations" },
    { id: "logout", text: "Logout", route: "/Signout" }
  ];

  const closeProfilePopup = () => {
    setShowProfilePopup(false);
  };

  const closeSearchPopup = () => {
    setShowSearchPopup(false);
  };

  return (
    <>
      
        <div className="titleAndProfile">
          <h1 className="title">Library Management System</h1>
          {/* Profile icon at the top right */}
          <div className="profileIcon" onClick={() => setShowProfilePopup(true)}>
            <img src={profileIcon} alt="Profile Icon" />
          </div>
        </div>
      

      <img src={onlinelibrary} alt="" className="backgroundImage" />
      <section className="banner">
        <div className="wrapper">
          <header className="header">
            <nav className="navigationContainer">
              {buttons.map((button) => (
                <Link key={button.id} to={button.route || "/"}>
                  <button
                    className="menuButton"
                    onClick={button.onClick || (() => {})}
                  >
                    {button.text}
                  </button>
                </Link>
              ))}
            </nav>
          </header>
          <main className="mainContent">
            <section className="searchSection">
              <h2>Books Search</h2>
              <form className="searchForm">
                <label htmlFor="bookName" className="visually-hidden">
                  Book name
                </label>
                <input
                  type="text"
                  id="bookName"
                  className="textInput"
                  placeholder="Book name"
                  aria-label="Book name"
                />
                <button
                  type="button"
                  className="searchButton"
                  onClick={() => setShowSearchPopup(true)}
                >
                  Search
                </button>
              </form>
              <form className="searchForm">
                <label htmlFor="bookId" className="visually-hidden">
                  Book ID
                </label>
                <input
                  type="text"
                  id="bookId"
                  className="textInput"
                  placeholder="Book ID"
                  aria-label="Book ID"
                />
              </form>
              <form className="searchForm">
                <label htmlFor="authorName" className="visually-hidden">
                  Author Name
                </label>
                <input
                  type="text"
                  id="authorName"
                  className="textInput"
                  placeholder="Author Name"
                  aria-label="Author Name"
                />
              </form>
            
            </section>
          </main>
        </div>
      </section>

      {showProfilePopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closeProfilePopup}>
              &times;
            </span>
            <p>User Profile Content</p>
             {/* Display user profile data */}
             {userData && (
              <>
                <p>User ID: {userData.userId}</p>
                <p>Username: {userData.username}</p>
                <p>UserEmail: {userData.userEmail}</p>
                <p>UserType: {userData.userType}</p>
              
              </>
            )}
          </div>
        </div>
      )}
       {showSearchPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closeSearchPopup}>
              &times;
            </span>
            <p>Search Popup Content</p>
            <ul>
              {results.map((book) => (
                <li key={book.id}>
                  {book.title} by {book.author}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
            width: 15px; /* Adjust size as needed */
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
            opacity: 0.8; /* Added opacity */
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
  
          .searchSection h2 {
            color: #f5f5f5;
            margin: 0 0 1rem 0;
          }
  
          .searchForm {
            display: flex;
            margin-bottom: 1rem;
            justify-content: space-between;
          }
  
          .textInput {
            padding: 0.5rem;
            margin-right: 1rem;
          }
  
          .searchButton {
            background-color: rgba(29, 2, 33, 0.58);
                    color: #e6f624;     
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    font-size: 18px;
                    border: none;
                    margin-top: 10px;
          }
          .searchButton:hover {
            background-color: #2b27ee;
            color: #fff;
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
          .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            border 0;
            padding: 0;
            white-space: nowrap;
            clip-path: inset(50%);
            clip: rect(0 0 0 0);
            overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default BookSearch;
