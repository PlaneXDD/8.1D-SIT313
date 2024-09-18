// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';  // Link to navigate between pages

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // State to show login/sign-out success message
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');  // Clear previous success messages

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
        setSuccessMessage('You have successfully logged in!');  // Show login success message
      })
      .catch((error) => {
        setError("Invalid email or password");
        console.error("Login failed:", error);
      });
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setSuccessMessage('You have successfully signed out!');  // Show sign-out success message
        console.log("User signed out");
        setEmail('');  // Clear input fields after signing out
        setPassword('');
        navigate("/login");  // Redirect back to the login page
      })
      .catch((error) => {
        console.error("Sign out failed:", error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      {/* Display login form if the user hasn't logged in */}
      {!successMessage || successMessage === 'You have successfully signed out!' ? (
        <>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
            <button type="submit">Login</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Link to the sign-up page for new account creation */}
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </>
      ) : (
        <>
          {/* Show success message after logging in */}
          <p style={{ color: 'green' }}>{successMessage}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      )}
    </div>
  );
}

export default Login;
