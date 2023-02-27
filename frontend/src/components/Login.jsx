// imports
import { useState } from "react";

// Login component
export default function Login(props) {
  const { setIfShowLoginAndSignupNavbarItems } = props;

  const [responseText, setResponseText] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  async function loginApi() {
    // Login Api communication
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
      setIfShowLoginAndSignupNavbarItems((prevState) => !prevState);
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
      <form>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={(e) =>
            setLoginDetails((prevLoginDetails) => {
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
            setLoginDetails((prevLoginDetails) => {
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
