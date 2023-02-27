import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  // useState
  const [ifAuthorized, setIfAuthorized] = useState(false);
  // useNavigate
  const navigate = useNavigate();

  // async func
  async function tokenChecker() {
    console.log("before call");
    const res = await fetch("http://localhost:9000/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    console.log("after call");
    let data = await res;
    console.log(data);

    if (data.ok) {
      console.log("ok");
      setIfAuthorized((prevState) => true);
    } else {
      console.log("nope");
      navigate("/Login");
    }
  }
  useEffect(() => {
    tokenChecker();
  }, []);

  return <div>{ifAuthorized && <h1>Profile</h1>}</div>;
}
