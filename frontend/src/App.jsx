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
  const [ifShowSignoutNavbarItem, setIfShowSignoutNavbarItem] = useState(false);

  return (
    <main className="App">
      <MainNavbar
        ifShowSignoutNavbarItem={ifShowSignoutNavbarItem}
        setIfShowSignoutNavbarItem={setIfShowSignoutNavbarItem}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/Login"
          element={<Login setIfShowSignoutNavbarItem={setIfShowSignoutNavbarItem} />}
        />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </main>
  );
}

export default App;
