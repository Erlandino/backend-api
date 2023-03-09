import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Profile(props) {
  const { ifLoggedIn } = props;

  // useState
  const [profileData, setProfileData] = useState({
    userName: "",
    profileImage: "",
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
    console.log(data);

    if (res.ok) {
      setProfileData((prevState) => data);
    } else {
    }
  }

  async function updateProfile() {
    const res = await fetch("http://localhost:9000/api/auth/profile", {
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

  return (
    <>
      {ifLoggedIn && (
        <div className="profile-container">
          <h1>Profile</h1>
          <hr />
          <h3>Username: {profileData.userName}</h3>
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
          <Button onClick={updateProfile}>Update Profile</Button>
        </div>
      )}
    </>
  );
}
