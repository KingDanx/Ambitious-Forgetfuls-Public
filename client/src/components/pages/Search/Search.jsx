import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import points from "../../../assets/images/points.png";
import "./styles/SearchTaskCard.css";

const Search = ({ allUsers, allTasks, getAllTask, user, setProfile, getAllUsers }) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const handleChange = (event) => {
    event.persist();
    setSearchText(event.target.value);
  };

  const userSendInvite = async (taskId, userId) => {
    await axios
      .post(
        `http://localhost:5000/api/users/${taskId}/request/${userId}`,
        null,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        getAllUsers();
        console.log("request sent.");
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };
  let profileTasks = [];
  !allTasks
    ? console.log("I'm dumb")
    : allTasks.map((el) => {
      allUsers.map((user) => {
        if (user._id == el.creator) {
          profileTasks.push({
            _id: el._id,
            nameOfTask: el.nameOfTask,
            creator: `${user.firstName} ${user.lastName}`,
            creatorId: el.creator,
            users: el.users,
            log: el.dailyLog,
            days: el.days,
          });
        }
      });
    });

  console.log(profileTasks)
  let today;
  today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleClickSend = (task, profile) => {
    userSendInvite(task, profile);
  };

  const handleClick = (profile) => {
    setProfile(profile);
    navigate("/profile");
  };

  useEffect(() => {
    getAllTask();
    console.log("search")
    console.log("use effect ran");
  }, [allUsers]);

  return (
    <div>
      <div>
        <h2 className="search-header">Search</h2>
        <div className="form-search-mar">
          <TextField
            sx={{
              width: "100%",
              maxWidth: "100%",
              marginTop: "12px",
            }}
            onChange={(event) => handleChange(event)}
            id="search"
            name="search"
            label=" Search for a user..."
            variant="filled"
          />
        </div>
        <div></div>
        <div>
          {allUsers.map((profile, index) =>
            searchText == "" ? null : user._id ==
              profile._id ? null : profile.firstName
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
                profile.lastName
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ? (
              <div key={index} className={"search-card"}>
                <div className="grid-name-point-spliter">
                  <img
                    className="search-user-photo"
                    onClick={() => handleClick(profile)}
                    height="75"
                    src={`http://localhost:5000/${profile.image}`}
                    alt=""
                  />
                  <div className="name-points-span">
                    <div></div>
                    <div className="points-name-div">
                      {profile.firstName} {profile.lastName}
                      <div className="grid-points">
                        <img
                          height="30"
                          width="30"
                          src={points}
                          alt="points logo"
                        />
                        <div className="points-mar-top">
                          {profile.totalPoints}
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>

                <div>
                  {" "}
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{`Invite ${profile.firstName} to:`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="whole-map">
                          {profileTasks.map((el, i) =>
                            el.creatorId === user._id ? el.users.some((user) => user.user === profile._id) === true ? null : (
                              <div
                                key={i}
                                onClick={() =>
                                  handleClickSend(el._id, profile._id)
                                }
                                className="each-task"
                              >
                                <div style={{ float: "left" }}>
                                  <div className="div-wrapper">
                                    <div className="name-of-task">
                                      {el.nameOfTask}
                                    </div>{" "}
                                    <div className="creator">{el.creator}</div>
                                  </div>
                                  <div className="icons-card">
                                    {profile.pendingRequest.map((li, ki) =>
                                      li.taskId == el._id ? (
                                        <AccessTimeIcon key={ki} />
                                      ) : null
                                    )}
                                    {el.users.map((li, key) =>
                                      li.user.includes(!user._id) ? (
                                        <PlaylistAddIcon key={key} />
                                      ) : null
                                    )}
                                    {el.days.map((li, key) => {
                                      // let lastLogString = li.dateModified;
                                      // let lastLog = new Date(lastLogString);
                                      // lastLog.setHours(0, 0, 0, 0);
                                      return li.completed === true &&
                                        li.dayNumber ===
                                        today.getDay() ? (
                                        <CheckCircleIcon
                                          key={key}
                                          className="completed"
                                        />
                                      ) : null;
                                    })}
                                    {el.days.map((li, key) =>   //this needs to be changed to look at the days completed
                                  
                                      // let lastLog = new Date(lastLogString);
                                      // lastLog.setHours(0, 0, 0, 0);
                                      li.completed === false &&
                                        li.dayNumber === today.getDay() ? (
                                        <div>
                                          <NotificationsActiveIcon
                                            key={key}
                                            className="bell"
                                          />
                                        </div>
                                      ) : null
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : null
                          )}
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
