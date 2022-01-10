import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import TaskHeader from "./coponents/TaskHeader";
import TaskBoard from "./coponents/TaskBoard";
import PieChart from "./coponents/PieChart";
import TaskComments from "./coponents/TaskComments";
import CommentForm from "./coponents/CommentForm";

const Task = ({
  task,
  setTask,
  user,
  getAllTask,
  profile,
  allUsers,
  setProfile,
  allTasks,
  setUser,
}) => {
  const navigate = useNavigate();

  const profileNav = (id) => {
    setProfile(id);
    
  };
  const navAfterProfileSet = (id)=>{
    profileNav(id)
    navigate("/profile");
  }

  useEffect(() => {
    let refreshTask = localStorage.getItem("task");
    setTask(JSON.parse(refreshTask));
  }, []);


  return (
    <div>
      <div>
        <TaskHeader task={task} user={user} allUsers={allUsers} allTasks={allTasks} setTask={setTask} setProfile={setProfile}/>
      </div>
      <div>
        <TaskBoard
          task={task}
          user={user}
          getAllTask={getAllTask}
          setTask={setTask}
          profile={profile}
          allUsers={allUsers}
          setUser={setUser}
          setProfile={setProfile}
        />
      </div>
      <div>
        <PieChart task={task} allUsers={allUsers} />
      </div>
      <div>
        <CommentForm task={task} user={user} setTask={setTask} />
      </div>
      <div>
        <TaskComments
          task={task}
          allUsers={allUsers}
          profileNav={navAfterProfileSet}
          profile={profile}
          setTask={setTask}
          user={user}
        />
      </div>
    </div>
  );
};

export default Task;
