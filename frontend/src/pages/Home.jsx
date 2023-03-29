// Imports
import {
  useLoaderData,
  defer,
  Await,
  Link,
  useParams,
  redirect,
  useNavigate,
} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useRef, Suspense, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import getInitialCommentsApi from "../utils/getComments";

// Loader
export function loader({ params }) {
  if (isNaN(params.offset)) {
    return redirect("/0");
  } else {
    const commentsFetch = getInitialCommentsApi(params.offset);
    return defer({ commentsPromise: commentsFetch });
  }
}

// Component
export default function Home(props) {
  // props
  const { ifLoggedIn } = props;

  // loader
  const loaderData = useLoaderData();

  // useRef
  const postsRef = useRef();

  // usestates
  const [postData, setPostData] = useState("");
  const [responseText, setResponseText] = useState(null);
  const [reply, setReply] = useState(null);
  const [replyData, setReplyData] = useState(null);
  const [postsAmount, setPostsAmount] = useState(null);

  // useParams
  const { offset } = useParams();

  // useNavigate
  const navigate = useNavigate();

  async function totalPostsAmount(promise) {
    const posts = await promise;
    setPostsAmount((prevStat) => posts.totalPosts);
  }

  useEffect(() => {
    totalPostsAmount(loaderData.commentsPromise);
  }, []);

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
      setResponseText((prevState) => "Post successfully posted");
      navigate("/offset");
      // getCommentsApi();
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "Something went wrong");
    }
  }

  async function replyToPostApi(replyId) {
    // gets current date and puts it in a neat string format
    const date = new Date().toDateString();

    // sends post to api to store in database
    const res = await fetch("http://localhost:9000/api/auth/reply", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: replyData, date: date, replyId: replyId }),
    });

    const data = await res.json();

    // Puts login response in the class responseText div
    if (res.ok) {
      /* if correct username/password*/
      setResponseText((prevState) => "Post successfully posted");
      navigate("/offset");
      // getCommentsApi();
    } else {
      /* if incorrect username/password*/
      setResponseText((prevState) => "Something went wrong");
    }
  }

  function postLayout(element, index) {
    return (
      <>
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
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex gap-1">
            <Button
              onClick={() =>
                setReply((prevReply) => {
                  return prevReply === element._id ? null : element._id;
                })
              }
            >
              Reply
            </Button>
            <Button variant="success">Like</Button>
            <Button variant="danger">Dislike</Button>
          </div>
          <div className="d-flex gap-1">
            <Button variant="success">0</Button>
            <Button variant="danger">0</Button>
          </div>
        </div>

        {/* reply to post */}
        <div
          className="mt-2 w-75 align-self-center"
          style={{ display: reply === element._id ? "block" : "none" }}
        >
          {/* Response Text */}
          {responseText && <p className="responseText">{responseText}</p>}
          {/* Post comment form */}
          <Form className="frontPage_form">
            {/* User comment input */}
            <Form.Group controlId="formUsername">
              <Form.Control
                type="post"
                disabled={!ifLoggedIn}
                placeholder="Write here"
                as="textarea"
                rows={3}
                onChange={(e) => setReplyData((_prevState) => e.target.value)}
              />
            </Form.Group>
            {/* Posts comment in input */}
            <Button
              disabled={!ifLoggedIn}
              className="post-button"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                return replyToPostApi(element._id);
              }}
            >
              Post
            </Button>
          </Form>
        </div>
      </>
    );
  }

  function repliesToPost(array) {
    return array.map((element, index) => {
      if (element.replyPost.length > 0) {
        postsMapping(element.replyPost);
      }
      return (
        <div
          key={element._id}
          style={{ width: "80%", marginTop: "20px" }}
          className="align-self-center"
        >
          {postLayout(element, index)}
        </div>
      );
    });
  }

  function postsMapping(posts) {
    /* Maps trough comments from api call */
    return posts.posts.map((element, index) => {
      return (
        <div key={index} className="Chat-message">
          {postLayout(element, index)}

          {/* replies */}
          {repliesToPost(element.replyPost)}
        </div>
      );
    });
  }

  // jsx
  return (
    // main container
    <div className="frontPage_container">
      {/* Title */}
      <h1 className="frontPage_title">Chat</h1>

      <div>
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
      </div>

      {/* Posts */}
      <div
        className="frontPage_posts p-2 d-flex flex-column justify-content-between"
        style={{ height: "100%" }}
        ref={postsRef}
      >
        <Suspense
          fallback={
            <div className="h-100 d-flex flex-column justify-content-center align-items-center">
              <div className="loader-Icon"></div>
              <h1>Loading</h1>
            </div>
          }
        >
          <Await resolve={loaderData.commentsPromise}>{postsMapping}</Await>
        </Suspense>
      </div>

      {/* Buttons to navigate trough more comments */}
      <div className="d-flex flex-row justify-content-between my-2">
        {/* Newer posts */}
        <Button disabled={offset <= 0} className="p-0">
          <Link to={`/${Number(offset) - 10}`} className="offset_button text-light">
            Newer posts
          </Link>
        </Button>

        {/* Older posts */}
        <Button disabled={Number(offset) + 10 >= postsAmount} className="p-0">
          <Link to={`/${Number(offset) + 10}`} className="offset_button text-light">
            Older posts
          </Link>
        </Button>
      </div>
    </div>
  );
}
