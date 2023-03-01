// imports
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// components
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Sign-up";
import MainNavbar from "./components/MainNavbar";

// main component
function App() {
  const [ifLoggedIn, setIfLoggedIn] = useState(false);

  return (
    <main className="App">
      <MainNavbar ifLoggedIn={ifLoggedIn} setIfLoggedIn={setIfLoggedIn} />

      <Routes>
        <Route path="/" element={<Home ifLoggedIn={ifLoggedIn} />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login setIfLoggedIn={setIfLoggedIn} />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </main>
  );
}

export default App;
