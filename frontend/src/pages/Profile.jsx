import { useState } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Dropdown from "react-bootstrap/Dropdown";

export async function loader() {
  const profileDataFetch = await fetch("http://localhost:9000/api/auth/profile", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const profileData = await profileDataFetch.json();

  if (!profileDataFetch.ok) {
    return redirect("/login");
  } else {
    return profileData;
  }
}

export default function Profile(props) {
  // props
  const { ifLoggedIn } = props;

  // Loader
  const tokenChecker = useLoaderData();

  // useState
  const [profileData, setProfileData] = useState(tokenChecker);

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

  function setProfilePicture() {
    const newImg = prompt("Enter image url");
    if (newImg) {
      setProfileData((prevData) => {
        return { ...prevData, profileImage: newImg };
      });
    }
  }

  const profileColors = ["Blue", "Red", "Green", "Yellow", "Purple", "Pink", "Black"];

  return (
    <>
      {ifLoggedIn && (
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="d-flex flex-row" style={{ gap: "10px" }}>
            <div className="w-100">
              <h3>User settings</h3>
              <hr />
              <div className="d-flex flex-column gap-2">
                <p>
                  Username: <span>{profileData.userName}</span>
                </p>
                <Button style={{ width: "fit-content" }}>Change username</Button>
                <Button style={{ width: "fit-content" }}>Change password</Button>
              </div>
            </div>

            <div className="w-100">
              <h3>Personalise</h3>
              <hr />
              <div className="d-flex flex-column gap-1">
                <p>Profile picture</p>
                <img
                  src={profileData.profileImage}
                  alt=""
                  style={{ width: "60px", height: "60px", borderRadius: "100%" }}
                />
                <Button style={{ width: "fit-content" }} onClick={setProfilePicture}>
                  Add new profile picture
                </Button>
              </div>
              <br />
              <div>
                <p>Chose profile name color</p>
                {/* profileColor */}
                <Dropdown>
                  <Dropdown.Toggle>
                    {profileData?.profileColor ? profileData?.profileColor : "black"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {profileColors.map((element, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            setProfileData((prevData) => {
                              return { ...prevData, profileColor: element };
                            })
                          }
                        >
                          {element}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

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
            <p>This is a post</p>
          </div>
          <hr />
          <Button onClick={updateProfile}>Update Profile</Button>
        </div>
      )}
    </>
  );
}
