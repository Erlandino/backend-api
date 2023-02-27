import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";

export default function MainNavbar(props) {
  const { ifShowSignoutNavbarItem, setIfShowSignoutNavbarItem } = props;
  const [ifShowLoginAndSignupNavbarItems, setIfShowLoginAndSignupNavbarItems] = useState(true);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    setIfShowLoginAndSignupNavbarItems((prevState) => !ifShowSignoutNavbarItem);
  }, [ifShowSignoutNavbarItem]);

  async function signOut() {
    // Login Api communication
    const res = await fetch("http://localhost:9000/api/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    const data = await res;
    console.log(data);

    setIfShowSignoutNavbarItem((prevState) => !prevState);
  }
  return (
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
  );
}
