export default async function tokenChecker() {
  const res = await fetch("http://localhost:9000/verifyToken", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  });

  // converts json object to js
  const data = await res.json();

  return data;
}
