import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

export default function Profile(props) {
  const { ifLoggedIn } = props;

  // useState
  const [profileData, setProfileData] = useState({
    userName: "",
    profileImage: "",
    profileColor: "black",
  });

  // useNavigate
  const navigate = useNavigate();

  // async func
  async function tokenChecker() {
    const res = await fetch("http://localhost:9000/api/auth/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await res.json();

    if (res.ok) {
      setProfileData((prevState) => data);
    } else {
    }
  }

  async function updateProfile() {
    await fetch("http://localhost:9000/api/auth/profile", {
      method: "Post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
  }

  useEffect(() => {
    tokenChecker();
  }, []);

  useEffect(() => {
    if (!ifLoggedIn) navigate("/Login");
  }, [ifLoggedIn]);

  function setProfilePicture() {
    const newImg = prompt("Enter image url");
    if (newImg) {
      setProfileData((prevData) => {
        return { ...prevData, profileImage: newImg };
      });
    }
  }

  const profileColors = ["Blue", "Red", "Green", "Yellow", "Purple", "Pink", "Black"];

  console.log(profileData.profileColor);

  return (
    <>
      {ifLoggedIn && (
        <div className="profile-container">
          <h1>Profile</h1>
          <hr />
          <h3>
            Username: <span className="text-dark">{profileData.userName}</span>
          </h3>
          <hr />
          <h3>Profile picture</h3>
          <img
            src={profileData.profileImage}
            alt=""
            style={{ width: "60px", height: "60px", borderRadius: "100%" }}
          />
          <br />
          <Button onClick={setProfilePicture}>Add new profile picture</Button>
          <hr />
          <h3>Chose profile name color</h3>
          {/* profileColor */}
          <ul className="list-group d-flex flex-row list-group-flush">
            {profileColors.map((element, index) => {
              return (
                <li
                  key={index}
                  className={`list-group-item ${
                    element === profileData.profileColor ? "active" : ""
                  }`}
                  onClick={() =>
                    setProfileData((prevData) => {
                      return { ...prevData, profileColor: element };
                    })
                  }
                >
                  {element}
                </li>
              );
            })}
          </ul>
          <hr />
          <h3>Chat preview</h3>
          <div className="Chat-message">
            <Stack className="d-flex flex-row" gap={3}>
              <img
                src={profileData.profileImage}
                alt=""
                style={{ width: "60px", height: "60px", borderRadius: "100%" }}
              />
              <p style={{ color: profileData.profileColor }}>{profileData.userName}</p>
              <p className="date text-body">Fri Mar 10 2023</p>
            </Stack>
            <p className="text-light">{">"} This is a post</p>
          </div>
          <hr />
          <Button onClick={updateProfile}>Update Profile</Button>
        </div>
      )}
    </>
  );
}
