import React, { useState, useEffect, Profiler } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import UserCard from "./components/UserCard";
import CreateTaskCircle from "./components/CreateTaskCircle";
import TaskCard from "./components/TaskCard";
import BarChart from "./components/BarChart";
import "./styles/Profile.css";

const Profie = ({
  user,
  profile,
  task,
  allTasks,
  allUsers,
  setTask,
  getAllTask,
  setProfile,
  getAllUsers,
  setUser,

}) => 
{
  const getAUser = async (userId) => {
    axios
      .get(`http://localhost:5000/api/users/${userId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        setProfile(res.data)
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
  
  

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem("token")));
    setProfile(jwtDecode(localStorage.getItem("token")));
    getAUser(profile._id)
    getAllTask();
    getAllUsers();
    console.log("use effect ran");
  }, []);

  return (
    <div>
      <div className="header">Ambitious Forgetfuls</div>
      <div className="user-card-create-task">
        <UserCard profile={profile}/>
        <CreateTaskCircle />
      </div>
      <div>
        <TaskCard profile={profile} allTasks={allTasks} getAllTask={getAllTask} allUsers={allUsers} setTask={setTask} user={user} task={task} />
      </div>
      <div><BarChart allTasks={allTasks} profile={profile} getAllTask={getAllTask}/></div>
    </div>
  );
};

export default Profie;
