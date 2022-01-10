import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import points from "../../../../assets/images/points.png";
import "../styles/TaskHeader.css";
import { Navigate } from "react-router-dom";

const TaskHeader = ({ task, user, allUsers, setTask, setProfile }) => {
  const [creator, setCreator] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
  };

  const getAUser = async (task) => {
    await axios
      .get(`http://localhost:5000/api/users/${task}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        setCreator(res.data.firstName + " " + res.data.lastName);
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

  const pendingArray = [];

  !task.pendingRequest
    ? console.log("no")
    : task.pendingRequest.map((li) => {
        allUsers.map((use) => {
          if (li.requestorId === use._id) {
            pendingArray.push({
              firstName: use.firstName,
              lastName: use.lastName,
              image: use.image,
              points: use.totalPoints,
              requestorId: li.requestorId,
              _id: task._id,
              profile: use,
            });
          }
        });
      });

  const acceptRequestFromUser = async (taskId, userId) => {
    await axios
      .post(
        `http://localhost:5000/api/tasks/${taskId}/accept/${userId}`,
        null,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setTask(res.data);
        console.log("User accepted");
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

  const denyRequestFromUser = async (taskId, userId) => {
    await axios
      .delete(`http://localhost:5000/api/tasks/${taskId}/remove/${userId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        setTask(res.data);
        console.log("User declined");
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
    getAUser(task.creator);
  }, [task]);

  return (
    <div>
      <span className="header-text">
        <div>{task.nameOfTask}</div>
        <div>by {creator}</div>
      </span>
      <div className="mail-icon">
        {user._id !== task.creator ? null : (
          <Badge
            badgeContent={
              !task.pendingRequest ? null : task.pendingRequest.length
            }
            color="primary"
          >
            <MailIcon
              color="action"
              onClick={() => handleOpen()}
              style={{ cursor: "pointer" }}
            />
          </Badge>
        )}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
             <div className="tr-header-tr">Task Requests:</div> 
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {pendingArray.map((el, i) => (
                <div
                  key={i}
                  className={i % 2 === 0 ? "tr-card-tr" : "tr-card-alt-tr"}
                >
                  <div className="pic-name-point-div-task-tr">
                    <div className="img-div-tr">
                      <img
                        className="tr-image"
                        height="75"
                        width="75"
                        src={`http://localhost:5000/${el.image}`}
                        alt=""
                        onClick={()=>handleImgClick(el.profile)}
                      />
                    </div>
                    <div className="text-conent">
                      <div className="span-name-points tx-point-grid-col">
                        <div>
                          {el.firstName} {el.lastName}
                        </div>

                        <div className="points">
                          <img height="25" src={points} alt={`Points icon`}/>
                          <div>{el.points}</div>
                          <div></div>
                        </div>
                      </div>
                      <div>
                        {" "}
                        <div
                          className={
                            i % 2 === 0 ? "task-name-tr" : "task-name-alt-tr"
                          }
                        >
                          <div>Wants to join:</div>
                          <div>{task.nameOfTask}</div>
                        </div>
                      </div>
                    </div>

                    <div className="incons">
                      <div className="accept-deny-tr-task">
                        <AddCircleIcon
                          style={{ color: "green" }}
                          fontSize="large"
                          onClick={() =>
                            acceptRequestFromUser(el._id, el.requestorId)
                          }
                        />
                      </div>
                      <div>
                        {" "}
                        <DoNotDisturbAltIcon
                          style={{ color: "red" }}
                          fontSize="large"
                          onClick={() =>
                            denyRequestFromUser(el._id, el.requestorId)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default TaskHeader;
