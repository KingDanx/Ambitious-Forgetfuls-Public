import React, { useState, useEffect } from "react";
import useForm from "../../../../useForm";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import "../styles/CommentForm.css";


const CommentForm = ({ task, user, setTask }) => {
    
    const getATask = async (task) => {
        await axios
          .get(`http://localhost:5000/api/tasks/${task}`, {
            headers: { "x-auth-token": localStorage.getItem("token") },
          })
          .then((res) => {
              setTask(res.data)
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
  
    const postComment = async () => {
    await axios
      .post(
        `http://localhost:5000/api/tasks/${task._id}/comment`,
        {
          userId: user._id,
          body: formValue.comment,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        document.getElementById("comment").value = "";
            getATask(task._id);
            console.log(task)        
        console.log(task)
        
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          document.getElementById("comment").value = "";
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const { formValue, handleChange, handleSubmit, setFormValue } =
    useForm(postComment);

  return (
    <div>
      
      <div className="field-margin">
      <h2 className="comments-text-header">Comments</h2>
        <TextField
           sx={{
            width: "100%",
            maxWidth: '100%',
            marginTop: "12px",
          }}
          onChange={(event) => handleChange(event)}
          id="comment"
          name="comment"
          label="Add a comment..."
          variant="filled"
        />
      </div>
      <div>
        <SendIcon onClick={(event) => handleSubmit(event)} style={{color: "#2699fb"}}  sx={{
            marginBottom: "18px",
          }}fontSize="large"/>
      </div>
    </div>
  );
};

export default CommentForm;
