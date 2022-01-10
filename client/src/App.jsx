import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Profile from "./components/pages/Profile/Profile";
import Task from "./components/pages/Task/Task";
import TaskRequest from "./components/pages/TaskRequest/TaskRequest";
import Search from "./components/pages/Search/Search";
import CreateTask from "./components/pages/CreateTask/CreateTask";
import EditTask from "./components/pages/EditTask/styles/components/EditTask";
import SideBar from "./components/SideBar";
import "./App.css";

function App() {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [task, setTask] = useState({});
  const render = localStorage.getItem("token");

  const navigate = useNavigate();

  const getAllTask = async () => {
    await axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        setAllTasks(res.data);
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

  const getAllUsers = async () => {
    await axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        setAllUsers(res.data);
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

  const logoutUser = async () => {
    console.log(localStorage.getItem("token"));
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    console.log(localStorage.getItem("token"));
  };

  useEffect(() => {
    getAllTask();
    getAllUsers();
  }, []);

  return (
    <div>
      <p></p>
      <div>
        {window.location.pathname === "/" ||
        window.location.pathname === "/register" ? null : (
          <SideBar
            logoutUser={logoutUser}
            setProfile={setProfile}
            user={user}
            setUser={setUser}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Login setProfile={setProfile} setUser={setUser} user={user} />
            }
          ></Route>
          <Route
            path="register"
            element={
              <Register user={user} setUser={setUser} setProfile={setProfile} />
            }
          ></Route>
          <Route
            path="profile"
            element={
              <Profile
                profile={profile}
                setProfile={setProfile}
                user={user}
                setUser={setUser}
                allTasks={allTasks}
                allUsers={allUsers}
                setTask={setTask}
                getAllTask={getAllTask}
                task={task}
                getAllUsers={getAllUsers}
              />
            }
          ></Route>
          <Route
            path="task"
            element={
              <Task
                task={task}
                setTask={setTask}
                user={user}
                setUser={setUser}
                getAllTask={getAllTask}
                setTask={setTask}
                setProfile={setProfile}
                profile={profile}
                allUsers={allUsers}
                allTasks={allTasks}
              />
            }
          ></Route>
          <Route
            path="taskRequest"
            element={
              <TaskRequest
                user={user}
                allUsers={allUsers}
                allTasks={allTasks}
                setUser={setUser}
                getAUser={getAUser}
                setProfile={setProfile}
              />
            }
          ></Route>
          <Route
            path="search"
            element={
              <Search
                allUsers={allUsers}
                allTasks={allTasks}
                getAllTask={getAllTask}
                setTask={setTask}
                user={user}
                profile={profile}
                setProfile={setProfile}
                getAllUsers={getAllUsers}
              />
            }
          ></Route>
          <Route path="createTask" element={<CreateTask user={user} />}></Route>
          <Route path="editTask" element={<EditTask task={task} />}></Route>
        </Routes>
        <div></div>
      </div>
    </div>
  );
}

export default App;
