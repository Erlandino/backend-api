import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import checkToken from "../utils/checkToken";

export async function loader() {
  const ifTokenValid = await checkToken();
  return ifTokenValid;
}

export default function MainNavbar(props) {
  const { setIfLoggedIn, ifLoggedIn } = props;

  const { token } = useLoaderData();

  useEffect(() => {
    if (token) {
      setIfLoggedIn((prevState) => true);
    } else {
      setIfLoggedIn((prevState) => false);
    }
  }, []);

  async function signOut() {
    // Login Api communication
    fetch("http://localhost:9000/api/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    setIfLoggedIn((prevState) => false);
  }
  return (
    <main className="App">
      <Navbar>
        <Nav className="d-flex justify-content-between w-100">
          <Link to="/0" className="nav__item__link text-light">
            Home
          </Link>

          <div>
            {!ifLoggedIn && (
              <>
                <Link to="Signup" className="nav__item__link text-light">
                  Signup
                </Link>
                <Link to="Login" className="nav__item__link text-light">
                  Login
                </Link>
              </>
            )}
            {ifLoggedIn && (
              <Link className="nav__item__link text-light" onClick={signOut}>
                Signout
              </Link>
            )}
            {ifLoggedIn && (
              <Link to="Profile" className="nav__item__link text-light">
                Profile
              </Link>
            )}
          </div>
        </Nav>
      </Navbar>
      <Outlet />
    </main>
  );
}
