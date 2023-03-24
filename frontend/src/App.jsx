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
  const [theme, setTheme] = useState("light");

  return (
    <main className="App">
      <MainNavbar ifLoggedIn={ifLoggedIn} setIfLoggedIn={setIfLoggedIn} />

      <Routes>
        <Route
          path="/"
          element={<Home ifLoggedIn={ifLoggedIn} theme={theme} setTheme={setTheme} />}
        />
        <Route path="/Signup" element={<Signup theme={theme} setTheme={setTheme} />} />
        <Route
          path="/Login"
          element={
            <Login
              setIfLoggedIn={setIfLoggedIn}
              ifLoggedIn={ifLoggedIn}
              theme={theme}
              setTheme={setTheme}
            />
          }
        />
        <Route
          path="/Profile"
          element={<Profile ifLoggedIn={ifLoggedIn} theme={theme} setTheme={setTheme} />}
        />
      </Routes>
    </main>
  );
}

export default App;
