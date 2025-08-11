import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <div className="background-container">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80"
          alt="background"
          className="background-image"
        />
        <div className="background-overlay" />
      </div>
      <Navbar />
      <main className="centered-container">{children}</main>
    </>
  );
};

export default Layout;