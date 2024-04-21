import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import onlinelibrary from '../assets/onlineLibrary1.png';
import { ToastContainer, toast } from 'react-toastify';
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";

const BookController = ({ db }) => {
  const initialBookData = {
    ISBN: '',
    bookName: '',
    alternateTitle: '',
    author: '',
    publisher: '',
    bookCountAvailable: 0,
    bookStatus: '',
    shelfId: '',
  };

  const [bookData, setBookData] = useState(initialBookData);
  
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookData({ ...bookData, [name]: value });
  };

  const addBook = async () => {
    // Check if any required fields are empty
    const requiredFields = ['ISBN', 'bookName', 'author', 'publisher', 'bookCountAvailable', 'bookStatus', 'shelfId'];
    const emptyFields = requiredFields.filter(field => !bookData[field]);
  
    if (emptyFields.length > 0) {
      setValidationErrors({ message: 'Please fill out all required fields.' });
      setShowSearchPopup(true);
      return;
    }
  
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await axios.post('http://localhost:5002/addbook', { ...bookData, username: userData.username });
      console.log(response.data);
      toast.success('Book added successfully.');
      
      setBookData(initialBookData);
      setValidationErrors({});
    } catch (error) {
      console.error(error);
      setValidationErrors({ message: 'Failed to add book. Please try again.' });
      setShowSearchPopup(true);
    }
  };
  



  const closePopup = () => {
    setShowSearchPopup(false);
    setSuccessMessage('');
    setValidationErrors({});
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
              <button className="menuButton">Add Books</button>
              <Link to="/book-searchs">
                <button className="menuButton">Books Search</button>
              </Link>
              <Link to="/RegistrationStaff">
                <button className="menuButton">Register User</button>
              </Link>
              <Link to="/view-reservations">
                <button className="menuButton">View Reservation</button>
              </Link>
              <Link to="/user-detail">
                <button className="menuButton">User Detail</button>
              </Link>
              <Link to="/Signout">
              <Button >
                Signout
              </Button>
              </Link>
            </nav>
          </header>
          <main className="mainContent">
            <section className="searchSection">
              <h2>Add a Book</h2>
              <form onSubmit={(e) => e.preventDefault()} className="searchForm">
              <label htmlFor="ISBN" className="visually-hidden">
                  ISBN
                </label>
                <input
                  type="text"
                  id="ISBN"
                  className="textInput"
                  placeholder="ISBN"
                  aria-label="ISBN"
                  name="ISBN"
                  value={bookData.ISBN}
                  onChange={handleInputChange}
                />
                <label htmlFor="bookName" className="visually-hidden">
                  Book name
                </label>
                <input
                  type="text"
                  id="bookName"
                  className="textInput"
                  placeholder="Book name"
                  aria-label="Book name"
                  name="bookName"
                  value={bookData.bookName}
                  onChange={handleInputChange}
                />

                <label htmlFor="alternateTitle" className="visually-hidden">
                  Alternate Title
                </label>
                <input
                  type="text"
                  id="alternateTitle"
                  className="textInput"
                  placeholder="Alternate Title"
                  aria-label="Alternate Title"
                  name="alternateTitle"
                  value={bookData.alternateTitle}
                  onChange={handleInputChange}
                />

                <label htmlFor="author" className="visually-hidden">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  className="textInput"
                  placeholder="Author"
                  aria-label="Author"
                  name="author"
                  value={bookData.author}
                  onChange={handleInputChange}
                />

           

                <label htmlFor="publisher" className="visually-hidden">
                  Publisher
                </label>
                <input
                  type="text"
                  id="publisher"
                  className="textInput"
                  placeholder="Publisher"
                  aria-label="Publisher"
                  name="publisher"
                  value={bookData.publisher}
                  onChange={handleInputChange}
                />

                <label htmlFor="bookCountAvailable" className="visually-hidden">
                  Count Available
                </label>
                <input
                  type="number"
                  id="bookCountAvailable"
                  className="textInput"
                  placeholder="Count Available"
                  aria-label="Count Available"
                  name="bookCountAvailable"
                  value={bookData.bookCountAvailable}
                  onChange={handleInputChange}
                />

                <label htmlFor="bookStatus" className="visually-hidden">
                  Book Status
                </label>
                <select
                  id="bookStatus"
                  className="selectInput"
                  aria-label="Book Status"
                  name="bookStatus"
                  value={bookData.bookStatus}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>

                <label htmlFor="shelfId" className="visually-hidden">
                  ShelfId
                </label>
                <input
                  type="number"
                  id="shelfId"
                  className="textInput"
                  placeholder="Shelf"
                  aria-label="Shelf"
                  name="shelfId"
                  value={bookData.shelfId}
                  onChange={handleInputChange}
                />

<button onClick={addBook} className="searchButton">
                  Add Book
                </button>
              </form>
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

      {/* Popup for success message or validation errors */}
      {showSearchPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            {successMessage && <p>{successMessage}</p>}
            {validationErrors.message && <p>{validationErrors.message}</p>}
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
          width: 15px; /* Adjust size as needed */
          margin-left: 15rem;
        }

        .backgroundImage {
          width: 100vw;
          height: 100vh;
          object-fit: cover; /* Ensure the image covers the entire container */
          object-position: center;
          position: fixed; /* Change position to fixed */
          top: 0;
          left: 0;
          z-index: -1;
          opacity: 0.7; /* Added opacity */
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
          padding: 50px;
          border-radius: 10px;
          margin-top: 50px;
        }

        .searchSection h2 {
          margin-top: 0;
        }

        .textInput {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .searchButton {
          width: 100%;
          padding: 10px;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .searchButton:hover {
          background-color: #555;
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
     `}</style>
   </>
    
  );
};

export default BookController;
