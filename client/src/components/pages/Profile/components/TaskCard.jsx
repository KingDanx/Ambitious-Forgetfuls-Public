import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TaskCard.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

const TaskCard = ({
  allTasks,
  allUsers,
  setTask,
  user,
  profile,
  getAllTask,
}) => {
  const navigate = useNavigate();

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
              pending: el.pendingRequest,
              days: el.days,
            });
          }
        });
      });

  const getATask = async (task) => {
    await axios
      .get(`http://localhost:5000/api/tasks/${task}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        localStorage.setItem("task", JSON.stringify(res.data));
        setTask(res.data);
      })
      .catch((error) => {
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

  const deleteATask = async (taskId) => {
    await axios
      .delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data);
        getAllTask();
      })
      .catch((error) => {
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

  const requestToJoinTask = async (taskId) => {
    await axios
      .post(
        `http://localhost:5000/api/tasks/${taskId}/request/${user._id}`,
        null,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        console.log(res.data);
        getAllTask();
      })
      .catch((error) => {
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

  let today;
  today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="whole-map">
      {profileTasks.map((el, i) => {
        return (
          <Link style={{ textDecoration: "none" }} to={el.users.some((so)=> so.user === user._id) === true ? "/task" : "/profile"}>
            {el.users.map((li) =>
              li.user.toString() === profile._id ? (
                <div key={i}    onClick={() => getATask(el._id)} className="each-task">
                  <div style={{ float: "left" }}>
                    <div
                      className="div-wrapper"
                    >
                      <div className="name-of-task">{el.nameOfTask}</div>{" "}
                      <div className="creator">{el.creator}</div>
                    </div>

                    <div className="icons-card">
                      {el.users.some(
                        (li) => li.user === user._id
                      ) ? null : el.pending.some(
                          (li) => li.requestorId === user._id
                        ) ? (
                        <AccessTimeIcon />
                      ) : (
                        <Link to="/profile"><PlaylistAddIcon onClick={()=>requestToJoinTask(el._id)}/></Link>
                      )}
                      {user._id !== el.creatorId || el.pending.length === 0 ? null : (
                        <Badge
                          badgeContent={
                            !el.pending ? null : el.pending.length
                          }
                          style={{ cursor: "pointer", marginRight: "8px" }}
                          color="primary"
                        >
                          <MailIcon
                            color="action"
                            onClick={()=>navigate("/task")}
                            style={{ cursor: "pointer" }}
                          />
                        </Badge>
                      )}
                      {el.days.map((li, key) => {
                        // let lastLogString = li.dateModified;
                        // let lastLog = new Date(lastLogString);
                        // lastLog.setHours(0, 0, 0, 0);
                        return li.completed === true &&
                          li.dayNumber === today.getDay() ? (
                          <CheckCircleIcon key={key} className="completed" />
                        ) : null;
                      })}
                      {el.days.map((li, key) => {  //this needs to be changed to look at the days completed
                        let lastLogString = li.dateModified;
                        // let lastLog = new Date(lastLogString);
                        // lastLog.setHours(0, 0, 0, 0);
                        return li.completed === false &&
                          li.dayNumber === today.getDay() ? (
                          <div>
                            <NotificationsActiveIcon
                              key={key}
                              className="bell"
                            />
                          </div>
                        ) : null;
                      })}
                      {user._id === el.creatorId ? (
                        <Link to="/editTask">
                          <EditIcon onClick={() => getATask(el._id)} />
                        </Link>
                      ) : null}
                      {user._id === el.creatorId ? (
                        <Link to="/profile">
                          <DeleteForeverIcon
                            onClick={() => deleteATask(el._id)}
                            style={{ color: "grey" }}
                          />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default TaskCard;
