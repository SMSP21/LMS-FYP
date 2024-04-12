import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import onlinelibrary from "../assets/onlineLibrary1.png";
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";

const ViewDataInfo = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserveTotal, setReserveTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOption, setSearchOption] = useState('name');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  useEffect(() => {
    fetchReservedBooks();
    reserveCount();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5002/searchreservedbook', {
        searchTerm,
        searchOption,
        username,
      });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        toast.info('No Reserved books found');
      }
    } catch (error) {
      toast.error('Error searching for Reserved books');
      setSearchResults([]);
    }
  };

  const fetchReservedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5002/reservebookget');
      setReservedBooks(response.data.result);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching reserved books');
      setLoading(false);
    }
  };

  const reserveCount = () => {
    axios.get('http://localhost:5002/reserveTotal')
      .then(result => {
        if (result.data.success) {
          setReserveTotal(result.data.totalReservations);
        } else {
          toast.error('Error fetching total reservations');
        }
      })
      .catch(error => {
        toast.error('Error fetching total reservations');
        console.error('Error fetching total reservations:', error);
      });
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/deleteReservation/${id}`);
      toast.success('Reservation deleted successfully');
      fetchReservedBooks(); // Refresh the list of reserved books after deletion
      reserveCount(); // Refresh the reservation count after deletion
    } catch (error) {
      toast.error('Error deleting reservation');
      console.error('Error deleting reservation:', error);
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
              <Link to="/user-detail">
                <button className="menuButton">User Detail</button>
              </Link>
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
                    <h4 className="reservationTitle">Reservations</h4>
                  </div>
                  <div className=''>
                    <table className="totalReservationTable">
                      <tbody>
                        <tr>
                          <td>Total Reservations</td>
                          <td className="reservationCount">{reserveTotal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <h2 className="searchHeader">Search Books</h2>
              <div className="searchContainer">
                <div className="searchInput">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter search term" />
                  <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
               
                    <option value="bookName">Name</option>
                    <option value="author">Author</option>
                    <option value="shelfId">Shelf</option>
                  </select>
                  <button onClick={handleSearch} className="searchButton">Search</button>
                </div>
              </div>
              <h2 className="heading">Reserved Books</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="tableContainer">
                  <table className="bookTable">
                    <thead>
                      <tr>
                        <th>ISBN</th>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Shelf</th>
                        <th>Member</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.length > 0 ? (
                        // Display search results if available
                        searchResults.map((book) => (
                          <tr key={book.id}>
                            <td>{book.ISBN}</td>
                            <td>{book.bookName}</td>
                            <td>{book.author}</td>
                            <td>{book.Shelf}</td>
                            <td>{book.userUserName}</td>
                            <td>
                              <button className="deleteButton" onClick={() => deleteReservation(book.brid)}>Delete</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Display reserved books if no search results
                        reservedBooks.map((book) => (
                          <tr key={book.id}>
                            <td>{book.ISBN}</td>
                            <td>{book.bookName}</td>
                            <td>{book.author}</td>
                            <td>{book.Shelf}</td>
                            <td>{book.userUserName}</td>
                            <td>
                              <button className="deleteButton" onClick={() => deleteReservation(book.brid)}>Delete</button>
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

export default ViewDataInfo;
