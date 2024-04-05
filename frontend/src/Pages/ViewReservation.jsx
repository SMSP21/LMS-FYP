import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profileIcon from "../assets/profileIcon.jpg";
import onlinelibrary from "../assets/onlineLibrary1.png";

const ViewDataInfo = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserveTotal, setReserveTotal] = useState(0);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;

  useEffect(() => {
    fetchReservedBooks();
    reserveCount();
  }, []);

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
          <img src={profileIcon} alt="Profile Icon" />
        </div>
      </div>
      <img src={onlinelibrary} alt="" className="backgroundImage" />
      <section className="banner">
        <div className="wrapper">
          <header className="header">
            <nav className="navigationContainer">
              <Link to="/add-books"><button className="menuButton">Add Books</button></Link>
              <Link to="/book-searchs"><button className="menuButton">Book Search</button></Link>
              <Link to="/RegistrationStaff"><button className="menuButton">Register User</button></Link>
              <Link to="/view-reservations"><button className="menuButton">View Reservation</button></Link>
              <Link to="/Signout"><button className="menuButton">Logout</button></Link>
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
              <h2 className="heading">Reservation Made</h2>
              {loading ? (
                <p>Loading...</p>
              ) : reservedBooks.length > 0 ? (
                <div className="tableContainer">
                  <table className="bookTable">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Shelf</th>
                        <th>Member</th>
                        <th>Action</th> {/* New column for delete button */}
                      </tr>
                    </thead>
                    <tbody>
                      {reservedBooks.map((book) => (
                        <tr key={book.id}>
                          <td>{book.bookName}</td>
                          <td>{book.author}</td>
                          <td>{book.shelf}</td>
                          <td>{book.userUserName}</td>
                          <td>
                            <button className="deleteButton" onClick={() => deleteReservation(book.brid)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="noResults">No reserved books found</p>
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
      `}</style>
    </>
  );
}

export default ViewDataInfo;
