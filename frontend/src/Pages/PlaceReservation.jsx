import React, { useState } from "react";
import { Link } from 'react-router-dom';
import onlinelibrary from "../assets/onlineLibrary1.png";
import profileIcon from "../assets/profileIcon.jpg"; // Import your profile icon image

function PlaceReservation() {
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const buttons = [
        { id: "booksSearch", text: "Books Search", route: "/book-search" },
        { id: "viewDataInfo", text: "View Data Info" },
        { id: "returnBook", text: "Return Book" },
        { id: "Reservation", text: "Reservation", route: "/Place-reservations" },
        { id: "logout", text: "Logout", route: "/Signout" }
    ];
    const closeProfilePopup = () => {
        setShowProfilePopup(false);
      };
      const closeSearchPopup = () => {
        setShowSearchPopup(false);
      };
    return (
        <>
         <div className="titleAndProfile">
          <h1 className="title">Library Management System</h1>
          {/* Profile icon at the top right */}
          <div className="profileIcon" onClick={() => setShowProfilePopup(true)}>
            <img src={profileIcon} alt="Profile Icon" />
          </div>
        </div>
            <img src={onlinelibrary} alt="Library Background" className="background-image" />
          
            <nav className="navigationContainer">
                {buttons.map((button) => (
                    <Link key={button.id} to={button.route || "/"}>
                        <button className="menuButton">
                            {button.text}
                        </button>
                    </Link>
                ))}
            </nav>
            <main>
            <div className="section-spacing">
                <section className="content-section">
                    <article className="book-info">
                        <form className="searchForm">
                            <label htmlFor="bookName" className="visually-hidden">Book name</label>
                            <input type="text" id="bookName" className="textInput" placeholder="Book name" aria-label="Book name" />
                        </form>
                        <form className="searchForm">
                            <label htmlFor="bookId" className="visually-hidden">Book ID</label>
                            <input type="text" id="bookId" className="textInput" placeholder="Book ID" aria-label="Book ID" />
                        </form>
                    </article>
                    <article className="user-info">
                        <form className="searchForm">
                            <label htmlFor="authorName" className="visually-hidden">Author Name</label>
                            <input type="text" id="authorName" className="textInput" placeholder="Author Name" aria-label="Author Name" />
                        </form>
                    </article>
                    <form className="searchForm">
                        <button type="button" className="searchButton" onClick={() => setShowSearchPopup(true)}>Search</button>
                    </form>
                </section>
                {/* Add spacing between content sections */}
                </div>
                <section className="actions-section">
                    <button type="submit" className="action-button">Reserve</button>
                    <Link to="/Payement">
                        <button className="action-button">Pay Now</button>
                    </Link>
                </section>
            </main>
            {showProfilePopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closeProfilePopup}>
              &times;
            </span>
            <p>User Profile Content</p>
          </div>
        </div>
        )};
         {showSearchPopup && (
            <div className="popup">
              <div className="popup-content">
                <span className="close" onClick={closeSearchPopup}>
                  &times;
                </span>
                <p>Search Popup Content</p>
              </div>
            </div>
          )}
      
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

        .background-image {
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          object-position: center;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          opacity: 0.8; /* Added opacity */
        }

       

        .navigation {
          background-color: rgba(29, 2, 33, .58);
          box-shadow: 0 15px 4px rgba(0, 0, 0, .25);
        }

        .menu {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 38px 39px;
          list-style: none;
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

        .menu-button:hover {
            background-color: #2b27ee;
            color: #fff;
        }

                .menu-button.highlight {
                    color: #e6f624;
                }

                .content-section {
                    display: flex;
                    padding: 20px;
                    z-index: 1;
                }

                .book-info,
                .user-info {
                    flex: 1;
                }

                .info-id {
                    background-color: rgba(217, 217, 217, 1);
                    color: #000;
                    padding: 6px 60px 15px 27px;
                    font-size: 25px;
                    font-weight: 700;
                }

                .actions-section {
                    display: flex;
                    justify-content: space-between;
                    padding: 40px 10px 0 0;
                }

                .action-button {
                    background-color: rgba(29, 2, 33, 0.58); /* Updated color */
                    color: #e6f624;
                    font-size: 30px;
                    font-weight: 700;
                    padding: 16px 30px;
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s;
                }

                .action-button:hover {
                    background-color: #2b27ee;
                    color: #fff;
                }
                
                .section-spacing {
                    flex-basis: 20px; /* Adjust the spacing as needed */
                }
                .searchForm {
                    display: flex;
                    align-items: center;
                }

                .textInput {
                    margin-right: 10px;
                    padding: 0.5rem;
                }

                .searchButton {
                    background-color: rgba(29, 2, 33, 0.58);
                    color: #e6f624;     
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    font-size: 18px;
                    border: none;
                    margin-top: 10px;
                }

                .searchButton:hover {
                    background-color: #2b27ee;
                    color: #fff;
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
            `}</style>
        </>
    );
}

export default PlaceReservation;
