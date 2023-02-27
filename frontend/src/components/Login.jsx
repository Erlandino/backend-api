// imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Login component
export default function Login(props) {
  // Prop destructuring
  const { setIfShowSignoutNavbarItem } = props;

  // useStates
  const [responseText, setResponseText] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  // useNavigate
  const navigate = useNavigate();

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

    // let data = await res.json();
    let data = await res;
    console.log(data);

    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "correct account details");
      setIfShowSignoutNavbarItem((prevState) => !prevState);
      navigate("/profile");
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "incorrect account details");
    }
  }

  console.log(loginDetails);

  return (
    <div>
      <h1>Log in</h1>
      {/* Login form */}
      <Form>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
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
            onChange={(e) =>
              setLoginDetails((prevLoginDetails) => {
                return { ...prevLoginDetails, password: e.target.value };
              })
            }
          />
        </Form.Group>

        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            return loginApi();
          }}
        >
          Login
        </Button>
      </Form>

      {/* Login from response text */}
      {responseText && (
        <div>
          <p> {responseText} </p>
        </div>
      )}
    </div>
  );
}
