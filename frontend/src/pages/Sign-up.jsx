// imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

// Signup component
export default function Signup() {
  // useStates
  const [responseText, setResponseText] = useState({
    username: false,
    passwordLength: false,
    confirmPassword: false,
  });
  const [signupDetails, setSignupDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // useNavigate
  const navigate = useNavigate();

  async function loginApi() {
    // Login Api post for account creation of username and password
    const res = await fetch("http://localhost:9000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupDetails),
    });

    // response data
    let data = await res.json();
    console.log(data);

    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "correct account details");
      navigate("/Login");
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => data);
    }
  }
  console.log(responseText.username);
  return (
    <>
      <h1 className="form_title">Sign up</h1>
      <div className="form_container">
        {/* Signup form */}
        <Form className="form">
          {/* username input and label container */}
          <Form.Group className="mb-3" controlId="formUsername">
            {/* username label */}
            <Form.Label>Username</Form.Label>

            {/* username input */}
            <Form.Control
              type="username"
              placeholder="Username here ..."
              className="py-3 mb-2"
              onChange={(e) =>
                setSignupDetails((prevLoginDetails) => {
                  return { ...prevLoginDetails, username: e.target.value };
                })
              }
            />

            {responseText.username && <Alert variant="danger">{responseText.username}</Alert>}
          </Form.Group>

          {/* Password input and label container */}
          <Form.Group className="mb-3">
            {/* password label */}
            <Form.Label>Password</Form.Label>

            {/* password input */}
            <Form.Control
              type="password"
              placeholder="Password here ..."
              className="password-input-one py-3 mb-2"
              onChange={(e) =>
                setSignupDetails((prevLoginDetails) => {
                  return { ...prevLoginDetails, password: e.target.value };
                })
              }
            />
            {/* password label */}
            <Form.Label>Confirm password</Form.Label>

            {/* password input */}
            <Form.Control
              type="password"
              placeholder="Password here ..."
              className="py-3 mb-2"
              onChange={(e) =>
                setSignupDetails((prevLoginDetails) => {
                  return { ...prevLoginDetails, confirmPassword: e.target.value };
                })
              }
            />
            {responseText.confirmPassword && (
              <Alert variant="danger">{responseText.confirmPassword}</Alert>
            )}
            {responseText.passwordLength && (
              <Alert variant="danger">{responseText.passwordLength}</Alert>
            )}
          </Form.Group>

          {/* Signup button */}
          <Button
            className=""
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              return loginApi();
            }}
          >
            Signup
          </Button>
        </Form>

        {/* Signup response text */}
        {/* {responseText && (
        <div>
          <p> {responseText} </p>
        </div>
      )} */}
      </div>
    </>
  );
}
