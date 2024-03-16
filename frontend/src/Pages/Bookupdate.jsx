import React, { useState } from 'react';
import onlinelibrary from '../assets/onlineLibrary1.png';
import { Link } from 'react-router-dom';
import profileIcon from '../assets/profileIcon.jpg';

function Bookupdate() {
  const menuItems = [
    { label: "Add books", link: "/add-books" },
    { label: "Book Search", link: "/book-searchs" },
    { label: "Book Update", link: "/book-update" },
    { label: "View Reservation", link: "/view-reservation" },
    { label: "Signout", link: "/signout" },
  ];
  const [bookId, setBookId] = useState('');
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`../../backend/Controller/User/book/${bookId}`);
      if (!response.ok) {
        throw new Error('Book not found');
      }
      const data = await response.json();
      setBookData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookId(e.target.value);
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
              {menuItems.map((item, index) => (
                <Link to={item.link} key={index}>
                  <button className="menuButton">{item.label}</button>
                </Link>
              ))}
            </nav>
          </header>
          <main className="mainContent">
            <section className="searchSection">
              <h2>Book Update</h2>
              <div className="bookDetails">
                <div className="bookIdContainer">
                  <label htmlFor="bookIdInput" className="bookIdLabel">Book ID</label>
                  <div className="bookIdInputContainer">
                    <input type="text" id="bookIdInput" className="bookIdInput" value={bookId} onChange={handleInputChange} />
                    <button className="addButton" onClick={handleSearch}>Search</button>
                  </div>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {bookData && (
                  <div className="bookInfoContainer">
                    <p>Book Name: {bookData.bookName}</p>
                    <p>Alternate Title: {bookData.alternateTitle}</p>
                    <p>Author: {bookData.author}</p>
                    <p>Cost Per Book: {bookData.CostPerBook}</p>
                    <p>Publisher: {bookData.publisher}</p>
                    <p>Book Count Available: {bookData.bookCountAvailable}</p>
                    <p>Book Status: {bookData.bookStatus}</p>
                    <p>Shelf: {bookData.shelf}</p>
                    <p>Catalogs: {bookData.catalogs.join(', ')}</p> {/* Assuming catalogs is an array */}
                    {/* Add other book details here */}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </section>


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
          background-color: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border-radius: 10px;
          margin-top: 50px;
        }

        .searchSection h2 {
          margin-top: 0;
        }

        .bookDetails {
          display: flex;
          margin-top: -10px;
        }

        .bookImageContainer {
          width: 40%;
        }

        .bookImage {
          width: 100%;
          object-fit: cover;
        }

        .bookInfoContainer {
          flex-grow: 1;
          margin-left: 20px;
        }

        .bookIdContainer {
          display: flex;
          align-items: center;
          margin-bottom: 100px;
        }

        .bookIdLabel {
          width: 100px;
          margin-right: 10px;
          font-size: 18px;
        }

        .bookIdInputContainer {
          display: flex;
          align-items: center;
        }

        .bookIdInput {
          width: 200px;
          height: 30px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          margin-right: 10px;
          padding: 5px; /* Add padding to make the text more readable */
        }

        .addButton {
          padding: 10px 20px;
          background-color: rgba(230, 246, 36, 0.5);
          border: none;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s; /* Add transition effect */
        }

        .addButton:hover {
            background-color: rgba(255, 0, 0, 0.8); /* Change background color to red on hover */
        }

        .statisticsContainer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .statisticsButton {
          padding: 10px 20px;
          background-color: rgba(230, 246, 36, 0.5);
          border: none;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
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
      `}</style>
    </>
  );
}

export default Bookupdate;
