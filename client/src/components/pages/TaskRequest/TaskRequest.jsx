import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import Points from "../../../assets/images/points.png";
import "./styles/TaskRequest.css";

const TaskRequest = ({ user, allUsers, allTasks, getAUser, setProfile }) => {
  const navigate = useNavigate();

  const pendingArray = [];
  allUsers.map((el) => {
    user.pendingRequest.map((li) => {
      allTasks.map((re) => {
        if (el._id === li.requestorId && re._id === li.taskId) {
          pendingArray.push({
            user: el,
            nameOfTask: re.nameOfTask,
            taskId: re._id,
          });
        }
      });
    });
  });

  console.log(pendingArray);

  const acceptRequest = async (taskId) => {
    await axios
      .post(
        `http://localhost:5000/api/users/${taskId}/accept/${user._id}`,
        null,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        getAUser(user._id);
        console.log("Accepted request");
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

  const declineRequest = async (taskId) => {
    await axios
      .delete(`http://localhost:5000/api/users/${taskId}/remove/${user._id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        getAUser(user._id);
        console.log("Declined request");
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

  const handleImgClick = (profile) => {
    setProfile(profile);
    navigate("/profile");    
  }

  useEffect(() => {
    console.log("from taskrequest");
  }, [user]);

  return (
    <div>
      <div>
        <h2 className="tr-header">Task Invites</h2>
        {pendingArray.length === 0 ? (
          <div className="no-requests">
            <div>No task request</div>at this time.<div></div>
          </div>
        ) : (
          pendingArray.map((el, i) => {
            return (
              <div key={i} className={i % 2 === 0 ? "tr-card" : "tr-card-alt"}>
                <div className="pic-name-point-div">
                  <div className="img-div-tr">
                    {" "}
                    <img
                      className="tr-image"
                      height="75"
                      src={`http://localhost:5000/${el.user.image}`}
                      alt={`Image of ${el.user.firstName}`}
                      onClick={()=>handleImgClick(el.user)}
                    />
                  </div>
                  <div className="text-conent">
                    {" "}
                    <div className="span-name-points">
                      <div>
                        {el.user.firstName} {el.user.lastName}
                      </div>

                      <div className="points">
                        <img height="30" src={Points} alt="" />
                        <div>{el.user.totalPoints}</div>
                        <div></div>
                      </div>
                    </div>
                    <div
                      className={i % 2 === 0 ? "task-name" : "task-name-alt"}
                    >
                      <div>Wants you to join:</div>
                      <div>{el.nameOfTask}</div>
                    </div>
                  </div>

                  <div>
                    {" "}
                    <div className="accept-deny-tr">
                      <AddCircleIcon
                        style={{ color: "green" }}
                        fontSize="large"
                        onClick={() => acceptRequest(el.taskId)}
                      />
                    </div>
                    <div>
                      <DoNotDisturbAltIcon
                        style={{ color: "red" }}
                        fontSize="large"
                        onClick={() => declineRequest(el.taskId)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskRequest;
