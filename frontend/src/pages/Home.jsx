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

  async function replyToPostApi(topId, replyId) {
    // gets current date and puts it in a neat string format
    const date = new Date().toDateString();
    console.log(topId);
    console.log(replyId);

    // sends post to api to store in database
    const res = await fetch("http://localhost:9000/api/auth/reply", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: replyData, date: date, topId: topId, replyId: replyId }),
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

  function postLayout(element, topId) {
    const { username, post, date, profileColor, profileImage, _id } = element;
    return (
      <>
        <Stack className="d-flex flex-row" gap={3}>
          <img
            src={profileImage}
            alt=""
            style={{ width: "60px", height: "60px", borderRadius: "100%" }}
          />
          <div className="dateAndName d-flex flex-column">
            <p className="" style={{ color: profileColor }}>
              {username}
            </p>
            <p className="date text-body">{date}</p>
          </div>
        </Stack>
        <p>{post}</p>
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex gap-1">
            <Button
              onClick={() =>
                setReply((prevReply) => {
                  return prevReply === _id ? null : _id;
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
          style={{ display: reply === _id ? "block" : "none" }}
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
                onChange={(e) => setReplyData((prevState) => e.target.value)}
              />
            </Form.Group>
            {/* Posts comment in input */}
            <Button
              disabled={!ifLoggedIn}
              className="post-button"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                return replyToPostApi(topId, _id);
              }}
            >
              Post
            </Button>
          </Form>
        </div>
      </>
    );
  }

  function repliesToPost(element, topId, allReplies) {
    return (
      <section key={element._id} style={{ width: "95%", marginTop: "20px", marginLeft: "auto" }}>
        <article>{postLayout(element, topId)}</article>
        {element.replyPosts && allReplies
          ? element.replyPosts.map((innerId) => {
              const innerElement = allReplies.find((replyElement) => {
                if (replyElement._id === innerId) {
                  return replyElement;
                }
              });

              return repliesToPost(innerElement, topId, allReplies);
            })
          : ""}
      </section>
    );
  }

  function postsMapping(posts) {
    /* Maps trough posts from api call */
    return posts.posts.map((element, index) => {
      // Destructuring
      const { _id } = element;
      return (
        <section key={_id} className="Chat-message">
          {/* Main post */}
          <article>{postLayout(element)}</article>

          {/* Replies */}
          <section className="d-flex flex-column align-content-end flex-wrap ">
            {element.replyPosts.length > 0
              ? posts.replies[index].map((replyPost) => {
                  if (replyPost.mainPostId === _id && !replyPost.currentNestId) {
                    return repliesToPost(replyPost, _id, posts.replies[index]);
                  }
                })
              : ""}
          </section>
        </section>
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
