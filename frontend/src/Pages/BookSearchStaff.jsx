import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onlinelibrary from "../assets/onlineLibrary1.png";
import profileIcon from "../assets/profileIcon.jpg";

// BookDetails Component
function BookDetails({ bookId, onDelete }) {
  const handleDeleteBook = async () => {
    try {
      await axios.delete(`http://localhost:5002/books/${bookId}`);
      toast.success('Book deleted successfully!');
      onDelete(bookId); // Notify the parent component about the deletion
    } catch (error) {
      toast.error('Error deleting book');
    }
  };

  return (
    <div>
      <button className="deleteButton" onClick={handleDeleteBook}>Delete Book</button>
    </div>
  );
}

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOption, setSearchOption] = useState('name');

  const handleSearch = async () => {
    try {
      let url;
      if (searchOption === 'id') {
        url = `http://localhost:5002/books/${searchTerm}`;
      } else {
        url = 'http://localhost:5002/search';
      }
      const response = await axios.post(url, { searchTerm, searchOption });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info('No books found');
      }
    } catch (error) {
      toast.error('Error searching for books');
      setSearchResults([]);
    }
  };

  const handleDelete = (deletedBookId) => {
    setSearchResults(searchResults.filter(book => book.id !== deletedBookId));
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
              <Link to="/add-books"><button className="menuButton">Add Books</button></Link>
              <Link to="/book-search"><button className="menuButton">Book Search</button></Link>
              <Link to="/book-update"><button className="menuButton">Book Update</button></Link>
              <Link to="/view-reservations"><button className="menuButton">View Reservation</button></Link>
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
                    <option value="id">ID</option>
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
                        <BookDetails bookId={book.id} onDelete={handleDelete} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="noResults">No books found</p>
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
          .deleteButton {
            background-color: #ff0000; /* Red color */
            color: #fff; /* White text color */
            padding: 1rem 2rem; /* Larger padding for bigger button */
            font-size: 1.2rem; /* Larger font size */
            border: none; /* No border */
            border-radius: 8px; /* Rounded corners */
            cursor: pointer; /* Show pointer cursor on hover */
          }
          
          .deleteButton:hover {
            background-color: #cc0000; /* Darker red color on hover */
          }
          
      `}</style>
    </>
  );
}

export default SearchComponent;
