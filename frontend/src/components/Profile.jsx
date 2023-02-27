import { useEffect } from "react";
export default function Profile() {
  async function tokenChecker() {
    console.log("before call");
    const res = await fetch("http://localhost:9000/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("after call");
    let data = await res;
    console.log(data);

    if (data.ok) {
      console.log("ok");
    } else {
      console.log("nope");
    }
  }
  useEffect(() => {
    tokenChecker();
  }, []);
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
