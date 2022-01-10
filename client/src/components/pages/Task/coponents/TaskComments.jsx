import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "../styles/TaskComments.css";
import axios from "axios";

const TaskComments = ({ task, allUsers, profileNav, setTask, user }) => {
  let userCommentDate = [];
  !task.comments || task.comments.length === 0
    ? console.log("I'm a failure")
    : task.comments.map((el) => {
        userCommentDate.push({
          user: el.userId,
          body: el.body,
          date: el.dateModified,
          _id: el._id,
        });
      });

  let commentsArray = [];
  !task.comments || task.comments.length === 0
    ? console.log("I'm a failure")
    : userCommentDate.map((el) => {
        allUsers.map((li) => {
          if (el.user == li._id) {
            commentsArray.push({
              user: li,
              body: el.body,
              date: el.date,
              _id: el._id,
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

  const deleteComment = async (commentId) => {
    await axios.delete(`http://localhost:5000/api/tasks/${task._id}/deleteComment/${commentId}`, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    }).then((res)=> {
        getATask(task._id).catch((error) => {
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
    })
  }

  const getFormattedDate = (date) => {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  };

  useEffect(() => {
    console.log("delete update")
  }, [task]);

  return (
    <div>
      {commentsArray.length === 0
        ? null
        : commentsArray
            .slice(0)
            .reverse()
            .map((el, key) => {
              let date = new Date(el.date);
              let time = new Date(el.date);
              date = getFormattedDate(date);
              time =
                time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })[0] == 0
                  ? time
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .substring(1)
                  : time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
              return (
                <div className="over-whole-comment">
                  <div
                    key={key}
                    className={
                      key % 2 === 0 ? "whole-comment" : "whole-comment-alt"
                    }
                  >
                    <div>
                      <img
                        onClick={() => profileNav(el.user)}
                        className="user-pic-comment"
                        height="75"
                        src={`http://localhost:5000/${el.user.image}`}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="name-body">
                        <div className="user-name-comment">
                          {el.user.firstName} {el.user.lastName}
                        </div>
                        <div className={key % 2 === 0 ? "primary-body" : "alt-body"}>{el.body}</div>
                      </div>
                    </div>
                    <div className="date-trash">
                      <div>
                        {el.user._id === user._id ? <Link to="/task"><DeleteForeverIcon onClick={()=>deleteComment(el._id)}/></Link> : null}
                      </div>
                      <div className="date-marg">{date}</div>
                      <div>{time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
    </div>
  );
};

export default TaskComments;
