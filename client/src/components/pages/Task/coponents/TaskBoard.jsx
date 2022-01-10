import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import TaskSlider from "./TaskSlider";
import UserCardSlider from "./UserCardSlider";
import axios from "axios";
import "../styles/TaskBoard.css";

const { DateTime } = require("luxon");

const TaskBoard = ({ task, user, allUsers, setTask, setUser, setProfile }) => {
  const [checked, setChecked] = React.useState(false);
  const [newCard, setNewCard] = useState([]);
  const todayDate = new Date();
  const [time, setTime] = useState(
    todayDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [userPress, setUserPress] = useState({});
  const todayString = DateTime.now().toFormat("MMMM dd");

  const useStyles = makeStyles((theme) => ({
    toggle: {
      "& .MuiSwitch-track": {
        backgroundColor: "#dc1212e0",
      },
    },
  }));

  const classes = useStyles();

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

  //clicking slider sends axios request to modify a log
  const upDateDailyLog = async () => {
    await axios
      .put(
        `http://localhost:5000/api/tasks/${task._id}/dailyLogStatus/${user._id}`,
        {
          completed:
            task.dailyLog[task.dailyLog.length - 1].completed === true
              ? false
              : task.dailyLog[task.dailyLog.length - 1].completed === false
              ? true
              : null,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        updateDay();
        userCompletionTime();
        getATask(task._id);
        getAUser(user._id);
        updateUserTotalPoints();
        updateUserTaskPoints();
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

  const updateDay = async () => {
    await axios
      .put(
        `http://localhost:5000/api/tasks/${task._id}/dayStatus`,
        {
          completed: !task.dailyLog[task.dailyLog.length - 1].completed,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        getATask(task._id);
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

  const updateUserTotalPoints = async () => {
    await axios
      .put(
        `http://localhost:5000/api/users/${user._id}/points`,
        {
          ...(task.dailyLog[task.dailyLog.length - 1].completed === false
            ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                totalPoints: user.totalPoints + 1,
              }
            : {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                totalPoints: user.totalPoints - 1,
              }),
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {})
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

  const updateUserTaskPoints = async () => {
    await axios
      .put(
        `http://localhost:5000/api/tasks/${task._id}/points/${
          !task
            ? null
            : task.users[task.users.findIndex((el) => el.user === user._id)]
                .user === user._id
            ? task.users[task.users.findIndex((el) => el.user === user._id)]._id
            : null
        }`,
        {
          ...(task.dailyLog[task.dailyLog.length - 1].completed === false
            ? {
                user: user._id,
                taskPoints:
                  task.users[task.users.findIndex((el) => el.user === user._id)]
                    .user === user._id
                    ? task.users[
                        task.users.findIndex((el) => el.user === user._id)
                      ].taskPoints + 1
                    : null,
              }
            : {
                user: user._id,
                taskPoints:
                  task.users[task.users.findIndex((el) => el.user === user._id)]
                    .user === user._id
                    ? task.users[
                        task.users.findIndex((el) => el.user === user._id)
                      ].taskPoints - 1
                    : null,
              }),
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        console.log("task points increased");
        console.log(task.users);
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

  const userCompletionTime = () => {
    const today = new Date();
    if (
      today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })[0] ==
      0
    ) {
      setTime(
        today
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          .substring(1)
      );
    } else {
      setTime(
        today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  const getAUser = async (userId) => {
    axios
      .get(`http://localhost:5000/api/users/${userId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        setUser(res.data);
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

  const sliderHandle = (event) => {
    setChecked(event.target.checked);
    upDateDailyLog();
  };

  useEffect(() => {
    getAUser(user._id);
  }, [task]);

  return (
    <div>
      <div className="task-grid-layout">
        <div className="date-temp-rows whole-task-border">
          <div className="date-text">
            {todayDate.toLocaleDateString("en-US", { weekday: "long" })},{" "}
            <div>{todayString}</div>
          </div>
          <div className="day-names-sliders-layout">
            <div className="day-names">
              {!task.days
                ? null
                : task.days.map((el, key) => <div key={key}>{el.dayName}</div>)}
            </div>
            <div>
              {!task.days
                ? null
                : task.days.map((el, key) => {
                    return (
                      <div className="sliders-div" key={key}>
                        {
                          //clicking slider sends axios request to modify a log
                          <TaskSlider
                            className={
                              todayDate.getDay() !== el.dayNumber &&
                              el.completed === false &&
                              el.dayNumber < todayDate.getDay()
                                ? classes.toggle
                                : null
                            }
                            onClick={
                              (todayDate.getDay() === el.dayNumber &&
                                user._id ===
                                  task.dailyLog[task.dailyLog.length - 1]
                                    .completedBy) ||
                              (todayDate.getDay() === el.dayNumber &&
                                task.dailyLog[task.dailyLog.length - 1]
                                  .completed === false)
                                ? (event) => sliderHandle(event)
                                : null
                            }
                            checked={el.completed}
                          />
                        }
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        <div>
          <UserCardSlider
            userPress={userPress}
            time={time}
            allUsers={allUsers}
            task={task}
            getATask={getATask}
            setProfile={setProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
