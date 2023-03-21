// Imports
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useRef } from "react";
import Stack from "react-bootstrap/Stack";

// Component
export default function Home(props) {
  // props
  const { ifLoggedIn } = props;

  // useRef
  const postsRef = useRef();

  // usestates
  const [postData, setPostData] = useState("");
  const [responseText, setResponseText] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [postsAmount, setPostsAmount] = useState(null);
  const [offset, setOffset] = useState(0);

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

    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setResponseText((_prevState) => "Post successfully posted");
      getCommentsApi();
    } else {
      /* if incorrect username/password*/
      setResponseText((_prevState) => "Something went wrong");
    }
  }

  // async function, sends get request to api link and receives comments and posts ammount from database
  async function getCommentsApi() {
    // fetch request
    const res = await fetch(
      `http://localhost:9000/api/auth/user-comments?limit=10&offset=${offset}`,
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

    // console.log(data);

    // stores comments and posts amount in states
    setAllPosts((_prevPosts) => data.posts);
    setPostsAmount((_prevPosts) => data.totalPosts);
  }

  // useEffect, content will only run on component mount and offset state change,
  useEffect(() => {
    getCommentsApi();
  }, [offset]);

  function scrollToTopPosts() {
    postsRef.current.scrollTop = 0;
  }

  // jsx
  return (
    // main container
    <div className="frontPage_container">
      {/* Title */}
      <h1 className="frontPage_title">Chat</h1>

      {/* Response Text */}
      {responseText && <p className="responseText">{responseText}</p>}

      {/* Post comment form */}
      <Form className="frontPage_form">
        {/* User comment input */}
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Control
            type="post"
            disabled={!ifLoggedIn}
            placeholder="Write here"
            as="textarea"
            rows={3}
            onChange={(e) => setPostData((_prevState) => e.target.value)}
          />
        </Form.Group>

        {/* Posts comment in input */}
        <Button
          disabled={!ifLoggedIn}
          className="post-button"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            return postApi();
          }}
        >
          Post
        </Button>
      </Form>

      {/* Posts */}
      {allPosts && (
        <>
          <div
            className="frontPage_posts p-2 d-flex flex-column justify-content-between"
            style={{ height: "100%" }}
            ref={postsRef}
          >
            {/* Maps trough comments from api call */}
            {allPosts.map((element, index) => {
              return (
                <div key={index} className="Chat-message">
                  <Stack className="d-flex flex-row" gap={3}>
                    <img
                      src={element.profileImage}
                      alt=""
                      style={{ width: "60px", height: "60px", borderRadius: "100%" }}
                    />
                    <div className="dateAndName d-flex flex-column">
                      <p className="" style={{ color: element.profileColor }}>
                        {element.username}
                      </p>
                      <p className="date text-body">{element.date}</p>
                    </div>
                  </Stack>
                  <p>{element.post}</p>
                </div>
              );
            })}
          </div>

          {/* Buttons to navigate trough more comments */}
          <div className="d-flex flex-row justify-content-between my-2">
            {/* Newer posts */}
            <Button
              disabled={offset <= 0}
              className=""
              onClick={() => {
                setOffset((prevState) => prevState - 10);
                scrollToTopPosts();
              }}
            >
              Newer posts
            </Button>

            {/* Older posts */}
            <Button
              disabled={offset >= postsAmount}
              className=""
              onClick={() => {
                setOffset((prevState) => prevState + 10);
                scrollToTopPosts();
              }}
            >
              Older posts
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
