import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logo from './Logo-removebg-preview.png';
export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  
  useEffect(() => {
    let isMounted = true; // Flag to handle component mounted state
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setUserInfo(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch user profile:", err);
      });

    return () => {
      isMounted = false; // Cleanup function to set the flag to false
    };
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(() => setUserInfo(null))
      .catch(err => {
        console.error("Failed to logout:", err);
      });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </Link>
      <nav>
        {username && (
          <>
            <span>Hello,{username}</span>
            <Link to="/create">Create new post</Link>
            <Link onClick={logout}>Logout ({username})</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}