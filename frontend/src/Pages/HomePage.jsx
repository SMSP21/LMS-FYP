import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import staff from "../assets/staff.png";
import member from "../assets/member.png";
import onlinelibrary from "../assets/onlineLibrary1.png";

const roles = [
  { name: "Staff", image: staff, altText: "Image representing staff", link: "/staff" },
  { name: "Member", image: member, altText: "Image representing member", link: "/member" }
];

function RoleCard({ roleImage, roleName, imageAlt, link }) {
  return (
    <Link to={link} className="role-link">
      <div className="role-container">
        <div className="button-content">
          <img src={roleImage} alt={imageAlt} className="role-image" />
          <div className="role-name">{roleName}</div>
          <div className="role-description">Click Here {roleName.toLowerCase()}</div>
        </div>
      </div>
    </Link>
  );
}

function HomePage() {
  return (
    <>
      <div className="header-container">
        <h1 className="page-heading">Library Management System</h1>
        <img src={onlinelibrary} className="background-image" alt="Library themed decoration" />
        <div className="header-content">
          <section className="info-section">
            <div className="info-header">
              <div className="info-content">
                {roles.map((role, idx) => (
                  <RoleCard key={idx} roleImage={role.image} roleName={role.name} imageAlt={role.altText} link={role.link} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <style jsx>{`
        .header-container {
          position: relative;
          height: 100vh;
          padding: 20px; /* Equal padding on all sides */
          text-align: center;
        }
        .background-image {
          width: 100%;
          object-fit: cover;
          height: 100%;
          opacity: 0.8; /* Adjust opacity as needed */
          position: absolute;
          inset: 0;
        }
        .page-heading {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 60px; /* Adjust font size as needed */
          color: #fff;
          margin: 0;
          letter-spacing: 2px; /* Add letter spacing for style */
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add text shadow for style */
          position: relative;
          z-index: 4;
          margin-bottom: 20px; /* Add margin below the title */
        }
        .header-content {
          position: relative;
          z-index: 2;
        }
        .info-section {
          background-color: rgba(119, 51, 51, 0.99);
          box-shadow: 0 15px 4px rgba(0, 0, 0, 0.25);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0px; /* Padding on all sides */
          margin: 0 auto;
          max-width: 1200px;
        }
        .info-content {
          display: flex;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .info-content {
            flex-direction: column;
            align-items: center;
          }
        }
        .role-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 30px; /* Adjust font size as needed */
          color: #000;
          font-weight: 500;
          width: 50%; /* Make the role container smaller */
          margin-bottom: 20px; /* Add margin between role containers */
          padding: 70px; /* Add padding below to maintain gap */
          border: none; /* Remove default button styles */
          cursor: pointer;
          background: none; /* Remove default button background */
          text-align: center; /* Center text */
          transition: background-color 0.3s, transform 0.3s;
        }
        .role-container:hover {
          background-color: #ffcccb; /* Change background color on hover */
          transform: scale(1.05); /* Add a slight scale effect on hover */
        }
        .button-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .role-image {
          width: 100%;
          max-width: 250px; /* Set a specific size for consistency */
          height: 200px; /* Set a specific height for consistency */
          object-fit: cover;
          border-radius: 8px; /* Add border radius for style */
          margin-bottom: 10px; /* Add margin between role images */
        }
        .role-name {
          font-family: Inter, sans-serif;
          font-style: italic;
          margin-top: 5px;
        }
        .role-description {
          font-family: Inter, sans-serif;
          font-size: 16px; /* Adjust font size for description */
          margin-top: 10px; /* Add space between role name and description */
          color: #666; /* Adjust color for description */
        }
        @media (max-width: 991px) {
          .role-container {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}

export default HomePage;
