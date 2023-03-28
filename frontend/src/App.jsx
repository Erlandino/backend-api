// imports
import React, { useState } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// components
import Home, { loader as homeLoader } from "./pages/Home";
import Login from "./pages/Login";
import Profile, { loader as profileLoader } from "./pages/Profile";
import Signup from "./pages/Sign-up";
import MainNavbar from "./pages/MainNavbar";

// main component
function App() {
  const [ifLoggedIn, setIfLoggedIn] = useState(false);
  const [theme, setTheme] = useState("light");

  const router = createHashRouter([
    {
      path: "/",
      element: <MainNavbar ifLoggedIn={ifLoggedIn} setIfLoggedIn={setIfLoggedIn} />,
      children: [
        {
          path: "/",
          element: <Home ifLoggedIn={ifLoggedIn} theme={theme} setTheme={setTheme} />,
          loader: homeLoader,
        },
        {
          path: ":offset",
          element: <Home ifLoggedIn={ifLoggedIn} theme={theme} setTheme={setTheme} />,
          loader: homeLoader,
        },
        {
          path: "Signup",
          element: <Signup theme={theme} setTheme={setTheme} />,
        },
        {
          path: "Login",
          element: (
            <Login
              setIfLoggedIn={setIfLoggedIn}
              ifLoggedIn={ifLoggedIn}
              theme={theme}
              setTheme={setTheme}
            />
          ),
        },
        {
          path: "/Profile",
          element: <Profile ifLoggedIn={ifLoggedIn} theme={theme} setTheme={setTheme} />,
          loader: profileLoader,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

/* <main className="App">
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
</main> */
