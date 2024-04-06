import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onlinelibrary from "../assets/onlineLibrary1.png";
import profileIcon from "../assets/profileIcon.jpg";

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOption, setSearchOption] = useState('name');
  const [reservationResult, setReservationResult] = useState(null);
  const userData =JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5002/search', {
        searchTerm,
        searchOption
      });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info('No books found');
      }
    } catch (error) {
      toast.error('Error searching for books');
      setSearchResults([]);
    }
  };

  const handleReservation = async (book) => {
    console.log(username)
    try {
      const response = await axios.post('http://localhost:5002/reservebook', {
       
        memberName: username, // Replace 'YourMemberName' with actual member name
        bookName: book.bookName,
        authorName: book.author
      });
      setReservationResult({ success: true, message: "Book reserved successfully" });
    } catch (error) {
      setReservationResult({ success: false, message: "Error reserving book: " + error.response.data.message });
    }
  };

  return (
    <>
      <div className="titleAndProfile">
        <h1 className="title">Library Management System</h1>
        <div className="profileIcon">
          <img src={profileIcon} alt="Profile Icon" />
        </div>
      </div>

      <img src={onlinelibrary} alt="" className="backgroundImage" />
      <section className="banner">
        <div className="wrapper">
          <header className="header">
            <nav className="navigationContainer">
              <Link to="/book-search"><button className="menuButton">Book Search</button></Link>
              <Link to="/View-Data-Info"><button className="menuButton">View Data Info</button></Link>
              <Link to="/Return-book"><button className="menuButton">Return Book</button></Link>
              
              <Link to="/Signout"><button className="menuButton">Logout</button></Link>
            </nav>
          </header>
          <main className="mainContent">
            <section className="searchSection">
              <h2 className="searchHeader">Search Books</h2>
              <div className="searchContainer">
                <div className="searchInput">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter search term" />
                  <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="author">Author</option>
                    <option value="shelf">Shelf</option>
                  </select>
                  <button onClick={handleSearch} className="searchButton">Search</button>
                </div>
              </div>
              {searchResults.length > 0 ? (
                <ul className="searchResults">
                  {searchResults.map((book) => (
                    <li key={book.id} className="searchResultItem">
                      <div className="bookInfo">
                        <h3 className="bookName">{book.bookName}</h3>
                        <p className="author">by {book.author}</p>
                        <p className="shelf">Shelf: {book.shelf}</p>
                        <button onClick={() => handleReservation(book)} className="reserveButton">Reserve Book</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="noResults">No books found</p>
              )}
              {reservationResult && (
                <div className={`reservationResult ${reservationResult.success ? 'success' : 'error'}`}>
                  {reservationResult.message}
                </div>
              )}
            </section>
          </main>
        </div>
      </section>
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

          .searchSection {
            margin-top: 2rem;
            padding: 2rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
          }

          .searchHeader {
            color: #333;
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

          .errorMessage {
            color: red;
            margin-top: 0.5rem;
          }

          .noResults {
            color: #555;
          }

          .searchResults {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .searchResultItem {
            padding: 1rem;
            margin-bottom: 1rem;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          }

          .bookInfo {
            font-size: 18px;
            color: #333;
          }

          .bookName {
            margin-bottom: 0.5rem;
          }

          .author {
            color: #666;
            margin-bottom: 0.5rem;
          }

          .shelf {
            color: #666;
          }
        
          .reserveButton {
            background-color: #2b27ee; /* Blue color */
            color: #fff;
            cursor: pointer;
            padding: 0.8rem 1.2rem; /* Adjust button size */
            font-size: 1rem; /* Adjust font size */
            border: none;
            border-radius: 4px;
          }
        
          .reserveButton:hover {
            background-color: #1a18b6; /* Darker shade of blue on hover */
          }
          .reservationResult {
            margin-top: 20px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
          }

          .reservationResult.success {
            background-color: #7eff7e;
            color: green;
          }

          .reservationResult.error {
            background-color: #ff7e7e;
            color: red;
          }
      `}</style>
    </>
  );
}

export default BookSearch;
