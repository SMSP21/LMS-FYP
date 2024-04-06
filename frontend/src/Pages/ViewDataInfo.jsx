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
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;

  useEffect(() => {
    fetchReservedBooks();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, []);
  

  const fetchReservedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5002/reservebookget1', {
        params: {
          memberName: username
        }
      });
      setReservedBooks(response.data.result);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching reserved books');
      setLoading(false);
    }
  };

  const handlePayNow = async (bookId) => {
    try {
      // Implement payment logic here
      console.log("Pay Now clicked for book ID:", bookId);
      await axios.post(`http://localhost:5002/markAsPaid/${bookId}`);
      toast.success('Book marked as paid');
      fetchReservedBooks(); // Refresh the list of reserved books after marking as paid
    } catch (error) {
      toast.error('Error marking book as paid');
      console.error('Error marking book as paid:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/cancelReservation/${id}`);
      toast.success('Reservation canceled successfully');
      fetchReservedBooks(); // Refresh the list of reserved books after cancellation
    } catch (error) {
      toast.error('Error canceling reservation');
      console.error('Error canceling reservation:', error);
    }
  };

  const calculateTotalPrice = async () => {
    try {

       const response = await axios.get('http://localhost:5002/calculateTotalPrice', {
       params: {
        username: username // Replace 'YourMemberName' with actual member name
       }
      });
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      toast.error('Error calculating total price');
      console.error('Error calculating total price:', error);
    }
  };
  

  const handlePayNowTotal = async (totalPrice) => {
    try {
      // Call the backend API to process payment for the total price
      await axios.post('http://localhost:5002/payNowTotal', { totalPrice });
      toast.success('Total price paid successfully');
    } catch (error) {
      toast.error('Error processing payment');
      console.error('Error processing payment:', error);
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
            <section className="reservedBooksSection">
              <div>
                <table className="reservedBooksTable">
                  <thead>
                    <tr>
                      <th>Book Name</th>
                      <th>Author</th>
                      <th>Shelf</th>
                      <th>Cost Per Book</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5">Loading...</td>
                      </tr>
                    ) : reservedBooks.length > 0 ? (
                      reservedBooks.map((book) => (
                        <tr key={book.id}>
                          <td>{book.bookName}</td>
                          <td>{book.author}</td>
                          <td>{book.shelf}</td>
                          <td>100</td>
                          <td>
                            {!book.isPaid && (
                              <button className="payNowButton" onClick={() => handlePayNow(book.id)}>Pay Now</button>
                            )}
                            <button className="cancelButton" onClick={() => handleCancelReservation(book.brid)}>Cancel</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="noResults">No reserved books found</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2"></td>
                      <td>Total Price:</td>
                      <td>{totalPrice}</td>
                      <td>
                        <button className="payNowButton" onClick={() => handlePayNowTotal()}>Pay Now</button>
                      </td>
                    </tr>
                  </tfoot>

                </table>
              </div>
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
          .reservedBooksTable {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
          }
        
          .reservedBooksTable th,
          .reservedBooksTable td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
        
          .reservedBooksTable th {
            background-color: #f2f2f2;
            color: #333;
          }
        
          .reservedBooksTable tbody  {
            background-color: #f9f9f9;
          }
          .reservedBooksTable tfoot {
            background-color: #f9f9f9;
          }
        
          .reservedBooksTable tbody tr:hover {
            background-color: #f2f2f2;
          }
        
          .noResults {
            color: #555;
            text-align: center;
          }
          .payNowButton {
            background-color: #2b27ee;
            color: #fff;
            cursor: pointer;
            padding: 0.5rem 1rem;
            font-size: 16px;
            border: none;
            border-radius: 4px;
          }
  
          .payNowButton:hover {
            background-color: #1a18b6;
          }
          .cancelButton {
            background-color: red; /* Red color */
            color: #fff; /* Text color */
            border: none;
            padding: 10px 20px; /* Increased padding */
            cursor: pointer;
            border-radius: 8px;
            margin-right: 10px; /* Added margin-right */
            font-size: 16px; /* Adjusted font size */
          }
          
          .cancelButton:hover {
            background-color: darkred;
          }
          
      `}</style>
    </>
  );
}
export default ViewDataInfo;