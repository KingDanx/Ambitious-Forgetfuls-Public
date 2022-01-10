import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import troll from "../../../../assets/images/create.png";
import "../styles/UserCardSlider.css";

const UserCardSlider = ({ task, allUsers, setProfile }) => {
  const navigate = useNavigate();
  let completedById = [];
  !task.dailyLog
    ? console.log("")
    : task.dailyLog.map((el) => {
        completedById.push({
          completedBy: el.completedBy,
          date: el.dateModified,
          completed: el.completed,
          date: el.dateModified,
        });
      });

  let toCard = [];

  if (true == true) {
    completedById.map((el) => {
      allUsers.map((li) => {
        if (el.completedBy == li._id) {
          toCard.push({
            completedBy: li,
            date: el.date,
          });
        }
      });
    });
  }

  let idAndPoints = [];
  !task.users
    ? console.log("I'm a failure")
    : task.users.map((el) => {
        idAndPoints.push({
          user: el.user,
          points: el.taskPoints,
        });
      });

  let toPie = [];
  if (true == true) {
    allUsers.map((li) => {
      toPie.push({
        user: li,
      });
    });
  }

  let noUser = [];
  let currentTime = new Date();
  let shorty;
  if (!task.dailyLog) {
    console.log("iscu");
  } else {
    if (task.dailyLog.length < 7) {
      shorty = task.dailyLog.length;
      for (let i = shorty; i >= 1; i--) {
        let taskTime = new Date(task.dailyLog[task.dailyLog.length - i].dateModified);
        let compare = new Date(task.dailyLog[task.dailyLog.length - i].dateModified);
        var diff = Math.abs(currentTime - compare);
        if (task.dailyLog[task.dailyLog.length - i].completed == true) {
          noUser.push({
            completed: task.dailyLog[task.dailyLog.length - i].completed,
            user: task.dailyLog[task.dailyLog.length - i].completedBy,
            dayNumber: taskTime.getDay(),
            date: taskTime,
          });
        } else if (diff > 604800000) {
          i = i;
        } else if (task.dailyLog[task.dailyLog.length - i].completed == false) {
          noUser.push({
            completed: task.dailyLog[task.dailyLog.length - i].completed,
            user: {
              firstName: "Not",
              lastName: "Completed",
              image: troll,
            },
            dayNumber: taskTime.getDay(),
            date: taskTime,
          });
        }
      }
    }
    else{
      for (let i = 7; i >= 1; i--) {
        let taskTime = new Date(task.dailyLog[task.dailyLog.length - i].dateModified);
        let compare = new Date(task.dailyLog[task.dailyLog.length - i].dateModified);
        var diff = Math.abs(currentTime - compare);
        if (task.dailyLog[task.dailyLog.length - i].completed == true) {
          noUser.push({
            completed: task.dailyLog[task.dailyLog.length - i].completed,
            user: task.dailyLog[task.dailyLog.length - i].completedBy,
            dayNumber: taskTime.getDay(),
            date: taskTime,
          });
        } else if (diff > 604800000) {
          i = i;
        } else if (task.dailyLog[task.dailyLog.length - i].completed == false) {
          noUser.push({
            completed: task.dailyLog[task.dailyLog.length - i].completed,
            user: {
              firstName: "Not",
              lastName: "Completed",
              image: troll,
            },
            dayNumber: taskTime.getDay(),
            date: taskTime,
          });
        }
      }
    }
  }

  let weekData = [];
  noUser.map((el) => {
    allUsers.map((all) => {
      if (el.user == all._id) {
        weekData.push({
          user: all,
          completed: el.completed,
          dayNumber: el.dayNumber,
          date: el.date,
        });
      }
    });
    if (el.completed == false) {
      weekData.push({
        user: el.user,
        completed: el.completed,
        dayNumber: el.dayNumber,
        date: el.date,
      });
    }
  });

  console.log(noUser);
  console.log(weekData);

  const handleClick = (profile) => {
    setProfile(profile);
    navigate("/profile");
  };

  useEffect(() => {}, []);

  return (
    <div className="card-margins">
      {weekData
        .map((el) => {
          let newTime = new Date(el.date);
          let today = new Date();
          if (
            newTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })[0] == 0
          ) {
            newTime = newTime
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              .substring(1);
          } else {
            newTime = newTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
          return task.days.some((so) => so.dayNumber === el.dayNumber) ===
            false || el.dayNumber > today.getDay() ? null : el.completed ===
              false && el.dayNumber !== today.getDay() ? (
            <div className="card-grid complete-card-bg">
              <DoNotDisturbOnIcon
                style={{ height: "45px", width: "45px" }}
                className="slider-card-image noComplete"
              />
              <div className="user-task-text">
                {el.user.firstName} {el.user.lastName}
              </div>
            </div>
          ) : el.dayNumber === today.getDay() && el.completed === false ? (
            <div className="card-grid complete-card-bg">
              <NotificationsActiveIcon
                style={{ height: "45px", width: "45px" }}
                className="slider-card-image noComplete-today"
              />
              <div className="user-task-text">
                {el.user.firstName} {el.user.lastName}
              </div>
            </div>
          ) : (
            <div className="complete-card-bg">
              <div className="card-grid">
                <img
                  onClick={() => handleClick(el.user)}
                  className="slider-card-image"
                  height="70"
                  src={`http://localhost:5000/${el.user.image}`}
                  alt={`Image of ${el.user.firstName} ${el.user.lastName}`}
                />
                <div className="user-task-text">
                  {el.user.firstName} {el.user.lastName}
                  <div>{newTime}</div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UserCardSlider;
