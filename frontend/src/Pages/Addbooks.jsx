import React, { useState } from 'react';

const BookController = ({ db }) => {
  const [bookData, setBookData] = useState({
    bookName: '',
    alternateTitle: '',
    author: '',
    language: '',
    publisher: '',
    bookCountAvailable: 0,
    bookStatus: '',
    shelf: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookData({ ...bookData, [name]: value });
  };

  const addBook = async () => {
    try {
      const response = await fetch('http://localhost:5002/addbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="book-controller">  {/* Added a class for styling */}
      <h2>Add a Book</h2>
      <form onSubmit={(e) => e.preventDefault()}>  {/* Prevent default form submission */}
        <label>
          Book Name:
          <input
            type="text"
            name="bookName"
            value={bookData.bookName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Alternate Title:
          <input
            type="text"
            name="alternateTitle"
            value={bookData.alternateTitle}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Language:
          <input
            type="text"
            name="language"
            value={bookData.language}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Publisher:
          <input
            type="text"
            name="publisher"
            value={bookData.publisher}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Count Available:
          <input
            type="number"
            name="bookCountAvailable"
            value={bookData.bookCountAvailable}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Book Status:
          <input
            type="text"
            name="bookStatus"
            value={bookData.bookStatus}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Shelf:
          <input
            type="text"
            name="shelf"
            value={bookData.shelf}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={addBook}>Add Book</button>
      </form>
    </div>
  );
};

export default BookController;
