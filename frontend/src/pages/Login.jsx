// imports
import { useState } from "react";
import { redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import checkToken from "../utils/checkToken";

export async function loader() {
  const ifTokenValid = await checkToken();
  if (ifTokenValid.ok) {
    return redirect("/profile");
  } else return null;
}

// Login component
export default function Login(props) {
  // Prop destructuring
  const { setIfLoggedIn } = props;

  // useStates
  const [responseText, setResponseText] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  async function loginApi() {
    // Login Api Post username and password for authentication check
    const res = await fetch("http://localhost:9000/api/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });

    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setIfLoggedIn((prevState) => true);
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "Incorrect account details");
    }
  }

  return (
    <>
      <h1 className="form_title">Log in</h1>
      <div className="form_container">
        {/* Login form */}
        <Form className="form">
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              placeholder="Enter username"
              className="py-3 mb-2"
              onChange={(e) =>
                setLoginDetails((prevLoginDetails) => {
                  return { ...prevLoginDetails, username: e.target.value };
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              className="py-3 mb-2"
              onChange={(e) =>
                setLoginDetails((prevLoginDetails) => {
                  return { ...prevLoginDetails, password: e.target.value };
                })
              }
            />
          </Form.Group>

          {/* Login from response text */}
          {responseText && <Alert variant="danger">{responseText}</Alert>}

          <Button
            className=""
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              return loginApi();
            }}
          >
            Login
          </Button>
        </Form>
      </div>
    </>
  );
}
