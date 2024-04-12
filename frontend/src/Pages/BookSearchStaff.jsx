import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onlinelibrary from "../assets/onlineLibrary1.png";

import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";


// BookDetails Component
function BookDetails({ bookId, onDelete }) {
  const handleDeleteBook = async () => {
    try {
      await axios.delete(`http://localhost:5002/books/${bookId}`);
      toast.success('Book deleted successfully!');
      onDelete(bookId); // Notify the parent component about the deletion
    } catch (error) {
      toast.error('Book has been Reserved by a User');
    }
  };

  return (
    <div>
      <button className="deleteButton" onClick={handleDeleteBook}>Delete Book</button>
    </div>
  );
}

// BookUpdate Component
// BookUpdate Component
function BookUpdate({ bookId, onUpdate, initialBook }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedBook, setUpdatedBook] = useState(initialBook || { 
    ISBN:'',
    bookName: '',
    alternateTitle: '',
    author: '',
    publisher: '',
    bookCountAvailable: '',
    bookStatus: '',
    shelfId: ''
  });
  const [showBookDetails, setShowBookDetails] = useState(!isEditing); // Initially hide book details when not editing

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setShowBookDetails(false); // Hide book details when entering edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Turn off editing mode
    setShowBookDetails(true); // Show book details when canceling edit mode
  };

  const handleUpdateField = (field, value) => {
    setUpdatedBook({
      ...updatedBook,
      [field]: value
    });
  };

  const handleUpdateBook = async () => {
    try {
      await axios.put(`http://localhost:5002/books/${bookId}`, updatedBook);
      toast.success('Book updated successfully!');
      onUpdate(bookId, updatedBook); // Notify the parent component about the update
      setIsEditing(false); // Exit edit mode
      setShowBookDetails(true); // Show book details after updating
    } catch (error) {
      toast.error('Error updating book');
    }
  };

  return (
    <td>
      {isEditing ? (
        // Edit mode UI
        <div className="editFieldsContainer">
           <div className="editField">
            <label htmlFor="ISBN">ISBN:</label>
            <input
              id="ISBN"
              type="text"
              value={updatedBook.ISBN}
              onChange={(e) => handleUpdateField('ISBN', e.target.value)}
            />
          </div>
          <div className="editField">
            <label htmlFor="bookName">Book Name:</label>
            <input
              id="bookName"
              type="text"
              value={updatedBook.bookName}
              onChange={(e) => handleUpdateField('bookName', e.target.value)}
            />
          </div>
          {/* Add more input fields for other book properties */}
          {/* Alternative Title */}
          <div className="editField">
            <label htmlFor="alternateTitle">Alternate Title:</label>
            <input
              id="alternateTitle"
              type="text"
              value={updatedBook.alternateTitle}
              onChange={(e) => handleUpdateField('alternateTitle', e.target.value)}
            />
          </div>
          {/* Author */}
          <div className="editField">
            <label htmlFor="author">Author:</label>
            <input
              id="author"
              type="text"
              value={updatedBook.author}
              onChange={(e) => handleUpdateField('author', e.target.value)}
            />
          </div>
        
          {/* Publisher */}
          <div className="editField">
            <label htmlFor="publisher">Publisher:</label>
            <input
              id="publisher"
              type="text"
              value={updatedBook.publisher}
              onChange={(e) => handleUpdateField('publisher', e.target.value)}
            />
          </div>
          {/* Book Count Available */}
          <div className="editField">
            <label htmlFor="bookCountAvailable">Book Count Available:</label>
            <input
              id="bookCountAvailable"
              type="text"
              value={updatedBook.bookCountAvailable}
              onChange={(e) => handleUpdateField('bookCountAvailable', e.target.value)}
            />
          </div>
          {/* Book Status */}
          <div className="editField">
            <label htmlFor="bookStatus">Book Status:</label>
            <select
              id="bookStatus"
              value={updatedBook.bookStatus}
              onChange={(e) => handleUpdateField('bookStatus', e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          {/* Shelf */}
          <div className="editField">
            <label htmlFor="shelfId">ShelfId:</label>
            <input
              id="shelfId"
              type="text"
              value={updatedBook.shelfId}
              onChange={(e) => handleUpdateField('shelfId', e.target.value)}
            />
          </div>
          {/* Save and Cancel Buttons */}
          <div className="buttonGroup">
            <button className="saveButton" onClick={handleUpdateBook}>Save</button>
            <button className="cancelButton" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        // View mode UI
        <div className="editButtonContainer">
          {/* Edit Button */}
          <button className={`editButton ${!initialBook ? "firstEdit" : ""}`} onClick={handleToggleEdit}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {/* Show Book Details */}
        
        </div>
      )}
    </td>
  );
}





function BookSearchS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOption, setSearchOption] = useState('bookName');
  const [showBookDetails, setShowBookDetails] = useState(true); // State variable to manage visibility
  const userData =JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5002/books');
      setSearchResults(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

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

  const handleDelete = async (deletedBookId) => {
    try {
      await axios.delete(`http://localhost:5002/books/${deletedBookId}`);
      toast.success('Book deleted successfully!');
      setSearchResults(searchResults.filter(book => book.id !== deletedBookId));
    } catch (error) {
      toast.error('Book has been Reserved by a User');
    }
  };

  const handleUpdate = (updatedBookId) => {
    fetchAllBooks(); // Refresh the list of books after update
  };

  const handleEdit = (bookId) => {
    // Find the book with the given bookId and toggle its edit mode
    setSearchResults(prevState =>
      prevState.map(book =>
        book.id === bookId ? { ...book, isEditing: !book.isEditing } : book
      )
    );
  };
  // Function to handle hiding book details
const handleHideDetails = () => {
  setShowBookDetails(false);
};


  return (
    <>
      {/* Title and Profile section */}
      <div className="titleAndProfile">
        <h1 className="title">Library Management System</h1>
        <div className="profileIcon">
        <button className="panel-button view-profile-button" onClick={toggleProfileModal}>
        View Profile
      </button>
        </div>
      </div>

      {/* Background Image */}
      <img src={onlinelibrary} alt="" className="backgroundImage" />
      
      {/* Main Content Section */}
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
              <Button >
                Signout
              </Button>
              </Link>
            </nav>
          </header>
          <main className="mainContent">
            <section className="searchSection">
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
              <div>
                <h2>All Books</h2>
                <table className="bookTable">
                  <thead>
                    <tr>
                    <th>ISBN</th>
                      <th>Name</th>
                      <th>Author</th>
                      <th>Shelf</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((book) => (
                      <tr key={book.id}>
                        <td>{book.ISBN}</td>
                        <td>{book.bookName}</td>
                        <td>{book.author}</td>
                        <td>{book.Shelf}</td>
                        <td>
                          {/* Conditionally render BookUpdate */}
                          {book.isEditing ? (
                           <BookUpdate bookId={book.id} initialBook={book} onUpdate={handleUpdate} showBookDetails={showBookDetails} />

                          ) : (
                            <button className="editButton" onClick={() => handleEdit(book.id)}>Edit</button>

                          )}
                          <BookDetails bookId={book.id} onDelete={() => handleDelete(book.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

          .bookTable {
            width: 100%;
            border-collapse: collapse;
          }

          .bookTable th, .bookTable td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          .bookTable th {
            background-color: #f2f2f2;
            color: #333;
          }

          .bookTable tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          .bookTable tr:hover {
            background-color: #f2f2f2;
          }
          .saveButton,
          .editButton {
            background-color: #28a745; /* Green color for save/edit button */
            color: #fff; /* White text color */
            padding: 0.5rem 1rem; /* Larger padding for bigger button */
            font-size: 1.2rem; /* Larger font size */
            border: none; /* No border */
            border-radius: 8px; /* Rounded corners */
            cursor: pointer; /* Show pointer cursor on hover */
          }
          
          .saveButton:hover,
          .editButton:hover {
            background-color: #218838; /* Darker green color on hover */
          }
          
          .cancelButton {
            background-color: #dc3545; /* Red color for cancel button */
            color: #fff; /* White text color */
            padding: 0.5rem 1rem; /* Larger padding for bigger button */
            font-size: 1.2rem; /* Larger font size */
            border: none; /* No border */
            border-radius: 8px; /* Rounded corners */
            cursor: pointer; /* Show pointer cursor on hover */
          }
          
          .cancelButton:hover {
            background-color: #c82333; /* Darker red color on hover */
          }
          .editButton {
            background-color: green;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .editButton:hover {
            background-color: darkgreen;
          }
          
          .cancelButton {
            background-color: red;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .cancelButton:hover {
            background-color: darkred;
          }
          .editFieldsContainer {
            display: flex;
            flex-direction: column;
          }
          
          .editField {
            margin-bottom: 1rem;
          }
          
          .editField label {
            font-weight: bold;
          }
          
          .buttonGroup {
            margin-top: 1rem;
          }
          
          .saveButton,
          .cancelButton {
            margin-right: 1rem;
          }
          
          .editButtonContainer {
            display: flex;
            align-items: center;
          }
          
          .bookDetails {
            margin-top: 1rem;
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

export default BookSearchS;
