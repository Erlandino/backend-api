// Imports
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";

// Component
export default function Home(props) {
  const { ifLoggedIn } = props;

  // usestates
  const [postData, setPostData] = useState("");
  const [responseText, setResponseText] = useState(null);
  const [allPosts, setAllPosts] = useState(null);

  // Posts comments to api and api to database
  async function postApi() {
    // gets current date and puts it in a neat string format
    const date = new Date().toDateString();

    // sends post to api to store in database
    const res = await fetch("http://localhost:9000/api/auth/comment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: postData, date: date }),
    });

    let data = await res;
    console.log(data);
    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "Post successfully posted");
      getCommentsApi();
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "Something went wrong");
    }
  }

  async function getCommentsApi() {
    const res = await fetch("http://localhost:9000/api/auth/user-comments", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    setAllPosts((prevPosts) => data);
  }
  useEffect(() => {
    getCommentsApi();
  }, []);

  console.log("test");
  console.log(allPosts);

  // jsx
  return (
    <div className="frontPage_container">
      <h1 className="frontPage_title">Chat</h1>
      {allPosts && (
        <div className="frontPage_posts">
          <hr />
          {allPosts.map((element, index) => {
            return (
              <div key={index}>
                <h3>{element.username}</h3>
                <p>{element.post}</p>
                <p>{element.date}</p>
                <hr />
              </div>
            );
          })}
        </div>
      )}

      {responseText && <p className="responseText">{responseText}</p>}

      <Form className="frontPage_form">
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Control
            type="post"
            disabled={!ifLoggedIn}
            placeholder="Write here"
            onChange={(e) => setPostData((prevState) => e.target.value)}
          />
        </Form.Group>

        <Button
          disabled={!ifLoggedIn}
          className="w-100"
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
