import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function MainNavbar(props) {
  const { setIfLoggedIn, ifLoggedIn } = props;

  async function tokenChecker() {
    const res = await fetch("http://localhost:9000/verifyToken", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    if (res.ok) {
      setIfLoggedIn((prevState) => true);
    } else {
      setIfLoggedIn((prevState) => false);
    }
  }
  useEffect(() => {
    tokenChecker();
  }, []);

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

    setIfLoggedIn((prevState) => false);
  }
  return (
    <Navbar>
      <Nav className="d-flex justify-content-between w-100">
        <Link
          to="/"
          className="nav__item__link text-light

"
        >
          Home
        </Link>

        <div>
          {!ifLoggedIn && (
            <>
              <Link
                to="/Signup"
                className="nav__item__link text-light

"
              >
                Signup
              </Link>
              <Link
                to="/Login"
                className="nav__item__link text-light

"
              >
                Login
              </Link>
            </>
          )}
          {ifLoggedIn && (
            <Link
              className="nav__item__link text-light

"
              onClick={signOut}
            >
              Signout
            </Link>
          )}
          {ifLoggedIn && (
            <Link
              to="/Profile"
              className="nav__item__link text-light

"
            >
              Profile
            </Link>
          )}
        </div>
      </Nav>
    </Navbar>
  );
}
