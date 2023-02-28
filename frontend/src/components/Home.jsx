// Imports
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

// Component
export default function Home() {
  // usestates
  const [post, setPost] = useState({
    post: "",
  });
  const [responseText, setResponseText] = useState("");

  // Posts comments to api and api to database
  async function postApi() {
    console.log("call start");
    // sends post to api to store in database
    const res = await fetch("http://localhost:9000/api/auth/comment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    let data = await res;
    console.log(data);
    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "Post successfully posted");
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "Something went wrong");
    }
  }

  // jsx
  return (
    <div>
      <h1>Home</h1>

      <Form>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Post</Form.Label>
          <Form.Control
            type="post"
            placeholder="Write here"
            onChange={(e) =>
              setPost((prevState) => {
                return { post: e.target.value };
              })
            }
          />
        </Form.Group>

        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            return postApi();
          }}
        >
          Post
        </Button>
      </Form>
    </div>
  );
}
