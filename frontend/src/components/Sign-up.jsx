// imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Signup component
export default function Signup() {
  // useStates
  const [responseText, setResponseText] = useState("");
  const [signupDetails, setSignupDetails] = useState({
    username: "",
    password: "",
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
    let data = await res;

    // Puts login response in the class responseText div
    if (data.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "correct account details");
      navigate("/Login");
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "incorrect account details");
    }
  }
  return (
    <div className="form_container">
      {/* Signup form */}
      <Form className="form">
        <h1 className="form_title">Sign up</h1>
        {/* username input and label container */}
        <Form.Group className="mb-3" controlId="formUsername">
          {/* username label */}
          <Form.Label>Username</Form.Label>

          {/* username input */}
          <Form.Control
            type="username"
            placeholder="Enter username"
            onChange={(e) =>
              setSignupDetails((prevLoginDetails) => {
                return { ...prevLoginDetails, username: e.target.value };
              })
            }
          />
        </Form.Group>

        {/* Password input and label container */}
        <Form.Group className="mb-3" controlId="formPassword">
          {/* password label */}
          <Form.Label>Password</Form.Label>

          {/* password input */}
          <Form.Control
            type="password"
            placeholder="Enter password"
            onChange={(e) =>
              setSignupDetails((prevLoginDetails) => {
                return { ...prevLoginDetails, password: e.target.value };
              })
            }
          />
        </Form.Group>

        {/* Signup button */}
        <Button
          className="w-100"
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
      {responseText && (
        <div>
          <p> {responseText} </p>
        </div>
      )}
    </div>
  );
}
