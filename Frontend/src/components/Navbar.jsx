import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthState, useAuthDispatch } from '../store/AuthContext';
import '../App.css';

const Navbar = () => {
  const { isAuthenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          TaskFlow
        </NavLink>
        <ul className="nav-menu">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink to="/manage-tasks" className="nav-links">
                  Manage Tasks
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/manage-agents" className="nav-links">
                  Manage Agents
                </NavLink>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-links">
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-links">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;