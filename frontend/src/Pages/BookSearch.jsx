import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import onlinelibrary from "../assets/onlineLibrary1.png";
import profileIcon from "../assets/profileIcon.jpg"; 

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5002/search', { searchTerm: query });
      setResults(response.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleProfileClick = async () => {
    try {
      const response = await axios.get('http://localhost:5002/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const buttons = [
    { id: "booksSearch", text: "Books Search"},
    { id: "viewDataInfo", text: "View Data Info", route: "/View-Data-Info" },
    { id: "returnBook", text: "Return Book", route: "/Return-Book" },
    { id: "placeOrder", text: "Reservation", route: "/Place-reservations" },
    { id: "logout", text: "Logout", route: "/Signout" }
  ];

  return (
    <>
      <div className="titleAndProfile">
        <h1 className="title">Library Management System</h1>
        <div className="profileIcon" onClick={handleProfileClick}>
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
                  <button className="menuButton">
                    {button.text}
                  </button>
                </Link>
              ))}
            </nav>
          </header>
          <main className="mainContent">
            <section className="searchSection">
              <h2>Books Search</h2>
              <form className="searchForm" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <label htmlFor="bookName" className="visually-hidden">
                  Book name
                </label>
                <input
                  type="text"
                  id="bookName"
                  className="textInput"
                  placeholder="Book name"
                  aria-label="Book name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="searchButton"
                >
                  Search
                </button>
              </form>
            </section>
          </main>
        </div>
      </section>

      {userData && (
        <div>
          <p>User Profile Content</p>
          <p>User ID: {userData.userId}</p>
          <p>Username: {userData.username}</p>
          <p>UserEmail: {userData.userEmail}</p>
          <p>UserType: {userData.userType}</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p>Search Results:</p>
          <ul>
            {results.map((book) => (
              <li key={book.id}>
                {book.title} by {book.author}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default BookSearch;
