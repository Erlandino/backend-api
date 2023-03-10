// imports
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

// Login component
export default function Login(props) {
  // Prop destructuring
  const { setIfLoggedIn, ifLoggedIn } = props;

  // useStates
  const [responseText, setResponseText] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  // useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    if (ifLoggedIn) {
      navigate("/profile");
    }
  }, [ifLoggedIn]);

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

    let data = await res.json();
    // console.log(data);

    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setIfLoggedIn((prevState) => true);
      navigate("/profile");
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "Incorrect account details");
    }
  }

  return (
    <div className="form_container">
      {/* Login form */}
      <Form className="form">
        <h1 className="form_title">Log in</h1>

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
          className="w-100"
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
  );
}
