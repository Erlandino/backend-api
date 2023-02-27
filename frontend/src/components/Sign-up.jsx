// imports
import { useState } from "react";

// Signup component
export default function Signup() {
  const [responseText, setResponseText] = useState("");
  const [signupDetails, setSignupDetails] = useState({
    username: "",
    password: "",
  });

  async function loginApi() {
    // Login Api communication
    const res = await fetch("http://localhost:9000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupDetails),
    });

    let data = await res;

    console.log(data);

    // Puts login response in the class responseText div
    if (data.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "correct account details");
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "incorrect account details");
    }
  }

  console.log(signupDetails);

  return (
    <div>
      <h1>Sign up</h1>
      {/* Login form */}
      <form>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={(e) =>
            setSignupDetails((prevLoginDetails) => {
              return { ...prevLoginDetails, username: e.target.value };
            })
          }
        />

        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          onChange={(e) =>
            setSignupDetails((prevLoginDetails) => {
              return { ...prevLoginDetails, password: e.target.value };
            })
          }
        />

        <input
          type="submit"
          name="submit"
          id="submit"
          onClick={(e) => {
            e.preventDefault();
            return loginApi();
          }}
        />
      </form>

      {/* Login from response text */}
      {responseText && (
        <div>
          <p> {responseText} </p>
        </div>
      )}
    </div>
  );
}
