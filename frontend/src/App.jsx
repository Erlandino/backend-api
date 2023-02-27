// imports
import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// components
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Sign-up";

// main component
function App() {
  const [ifShowLoginAndSignupNavbarItems, setIfShowLoginAndSignupNavbarItems] = useState(true);
  const [ifShowSignoutNavbarItem, setIfShowSignoutNavbarItem] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    setIfShowSignoutNavbarItem((prevState) => !ifShowLoginAndSignupNavbarItems);
  }, [ifShowLoginAndSignupNavbarItems]);

  async function signOut() {
    // Login Api communication
    const res = await fetch("http://localhost:9000/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    const data = await res;
    console.log(data);

    setIfShowLoginAndSignupNavbarItems((prevState) => !prevState);
  }

  return (
    <main className="App">
      <Navbar bg="light">
        <Nav bg="light">
          <Link to="/" className="nav__item__link">
            Home
          </Link>

          {ifShowLoginAndSignupNavbarItems && (
            <>
              <Link to="/Signup" className="nav__item__link">
                Signup
              </Link>

              <Link to="/Login" className="nav__item__link">
                Login
              </Link>
            </>
          )}
          {!ifShowLoginAndSignupNavbarItems && (
            <Link to="/Profile" className="nav__item__link">
              Profile
            </Link>
          )}
          {ifShowSignoutNavbarItem && (
            <button className="nav__item__link" onClick={signOut}>
              signOut
            </button>
          )}
        </Nav>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/Login"
          element={
            <Login setIfShowLoginAndSignupNavbarItems={setIfShowLoginAndSignupNavbarItems} />
          }
        />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </main>
  );
}

export default App;
