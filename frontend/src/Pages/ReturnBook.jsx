import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profileIcon from "../assets/profileIcon.jpg";
import onlinelibrary from "../assets/onlineLibrary1.png";
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";


const ReturnBook = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFinePopup, setShowFinePopup] = useState(false);
  const [bookName, setbookName] = useState(0);
  const [reserveId, setreserveId] = useState(0);
  const [fineAmount, setFineAmount] = useState(0);
  const [daysOverdue, setDueDays] = useState(0); // State to store due days
  const [showFineErrorMessage, setShowFineErrorMessage] = useState(false); // State to show fine error message
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  useEffect(() => {
    fetchReservedBooks();
  }, []);



  // useEffect hook to handle clicks outside the finePopup element
useEffect(() => {
  // Event handler function to handle clicks outside the finePopup
  const handleOutsideClick = (event) => {
    // Check if showFinePopup is true and the clicked target is not inside the finePopup
    if (showFinePopup && !event.target.closest(".finePopup")) {
      // If conditions are met, hide the finePopup by setting showFinePopup to false
      setShowFinePopup(false);
    }
  };

  // Add event listener for mousedown event on the document
  document.addEventListener("mousedown", handleOutsideClick);

  // Cleanup function to remove the event listener when the component unmounts or when showFinePopup changes
  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, [showFinePopup]); // Dependency array with showFinePopup, so useEffect runs when showFinePopup changes


  const fetchReservedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5002/Issuedbookget', {
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

  const handlereturnNow = async (reservationId, daysOverdue, bookName) => { // Passing daysOverdue parameter
    try {
      const response = await axios.post('http://localhost:5002/returnbook', {
        reserveId: reservationId
      });
      const responseData = response.data;
      if (responseData.success) {
        toast.success('Book returned');
        fetchReservedBooks();
      } else {
        // If a fine is needed to be paid, show the fine popup
        if (responseData.fine) {
          setFineAmount(responseData.fine);
          setDueDays(responseData.daysOverdue); // Set due days in the state
          setreserveId(responseData.reserveId);
          setbookName(bookName)
          setShowFinePopup(true);
          console.log(responseData.reserveId)
          
        } else {
          // Show error message if fine is required but not provided
          setShowFineErrorMessage(true);
        }
      }
    } catch (error) {
      toast.error('Error returning book');
      console.error('Error returning book:', error);
    }
  };
  const khaltiCall = (data) => {
    console.log(data)
    window.location.href = data.payment_url;
  };
  const booksWithFine = reservedBooks.filter(book => book.fineAmount > 0);

// Now booksWithFine contains an array of books that have fines associated with them
// You can then use this array to display information about these books

  const handlePayFine = async () => {

    const url = "http://localhost:5002/api/epayment/initiate1/";
    const data = {
      id: reserveId,
      products:  {product: bookName, amount: fineAmount}, UserDetail: username
      
    };
    
    try {
      console.log("hi")
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed
        },
        body: JSON.stringify(data),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.data.payment_url);
  
      
          khaltiCall(responseData.data);
        
      } else {
        console.error("Failed to fetch:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
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
              <Link to="/book-search"><button className="menuButton">Book Search</button></Link>
              <Link to="/View-Data-Info"><button className="menuButton">View Data Info</button></Link>
              <Link to="/Return-book"><button className="menuButton">Return Book</button></Link>
              <Link to="/Signout">
              <Button >
                Signout
              </Button>
              </Link>
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
                      <th>Issued At</th>
                      <th>Valid Till</th>
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
                          <td>{new Date(book.ReservedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          
                          <td>{new Date(new Date(book.ReservedAt).setDate(new Date(book.ReservedAt).getDate() + 7)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          <td>
                          <button className="returnButton" onClick={() => handlereturnNow(book.brid, book.daysOverdue, book.bookName)}>Return</button> {/* Pass due days */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="noResults">No reserved books found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </section>
    
      {showFinePopup && (
        <div className="finePopup">
          <div className="fineContent">
            <h2>Fine Amount: {fineAmount}</h2>
            <h2>Due Days: {daysOverdue - 7 }</h2> {/* Display due days */}
            <button className="payNowButton" onClick={handlePayFine}>Pay Now</button>
            <button className="closeButton" onClick={() => setShowFinePopup(false)}>Close</button>
          </div>
        </div>
      )}

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
          .finePopup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 40px; /* Increased padding */
            border-radius: 10px; /* Increased border-radius */
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3); /* Increased box-shadow */
            z-index: 9999; /* Adjust the z-index value as needed */
          }
          
  
          .fineContent h2 {
            margin-bottom: 20px;
            font-size: 1.5rem; /* Increased font size */
            color: #333; /* Adjust color */
          }
  
          .fineContent h2 {
            margin-bottom: 20px;
          }
  
      
  
        
          .closeButton {
            background-color: red;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            margin-left: 10px;
          }
  
          .closeButton:hover {
            background-color: darkred;
          }
          .returnButton {
            background-color: #2b27ee; /* Blue color */
            color: #fff;
            cursor: pointer;
            padding: 0.8rem 1.2rem; /* Adjust button size */
            font-size: 1rem; /* Adjust font size */
            border: none;
            border-radius: 4px;
          }
          
          .returnButton:hover {
            background-color: #1a18b6; /* Darker shade of blue on hover */
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
          .panel-button.view-profile-button:hover {
            background-color: #1a18b6;
          }
      `}</style>
    </>
  );
}
export default ReturnBook;