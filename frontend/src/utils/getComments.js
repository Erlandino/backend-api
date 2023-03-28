export default async function getInitialCommentsApi(offset) {
  const res = await fetch(
    `http://localhost:9000/api/auth/user-comments?limit=10&offset=${offset ? offset : 0}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // converts json object to js
  let data = await res.json();

  return data;
}
