import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import useForm from "../../../../../useForm";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./EditTask.css";

const EditTask = ({ task }) => {
  const [validTaskName, setValidTaskName] = useState(" ");
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  let userDays = [];

  const updateTask = async (taskId) => {
    if (formValue.sunday === true) {
      userDays.push({
        dayNumber: 0,
        dayName: "Sun",
      });
    }
    if (formValue.monday === true) {
      userDays.push({
        dayNumber: 1,
        dayName: "Mon",
      });
    }
    if (formValue.tuesday === true) {
      userDays.push({
        dayNumber: 2,
        dayName: "Tue",
      });
    }
    if (formValue.wednesday === true) {
      userDays.push({
        dayNumber: 3,
        dayName: "Wed",
      });
    }
    if (formValue.thursday === true) {
      userDays.push({
        dayNumber: 4,
        dayName: "Thu",
      });
    }
    if (formValue.friday === true) {
      userDays.push({
        dayNumber: 5,
        dayName: "Fri",
      });
    }
    if (formValue.saturday === true) {
      userDays.push({
        dayNumber: 6,
        dayName: "Sat",
      });
    }
    if (userDays.length === 0) {
      console.log("Task must have at least one day.");
      return;
    }
    axios
      .put(
        `http://localhost:5000/api/tasks/${taskId}/updateTask`,
        {
          nameOfTask: formValue.nameOfTaskUpdate,
          days: userDays,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((res) => {
        navigate("/profile");
      })
      .catch((error) => {
        if (checked === true) {
          setChecked(false);
        } else if (checked === false) {
          setChecked(true);
        }
        if (error.response) {
          console.log(error.response.data);
          if (
            error.response.data ===
            "Internal Server Error: ValidationError: nameOfTask: Path `nameOfTaskUpdate` is required., dailyLog.0.completedBy: Path `completedBy` is required., dailyLog.0.struck: Path `struck` is required."
          ) {
            setValidTaskName(
              "Task name is required and must be at least 2 characters. Please uncheck and recheck your days. Task must have at least one day selected"
            );
          }
          console.log(error.response.status);
          if (error.response.status === 500) {
            setValidTaskName(
              "Task name is required and must be at least 2 characters. Please uncheck and recheck your days. Task must have at least one day selected"
            );
          }
          console.log(error.response.headers);
        }
      });
  };

  const { formValue, handleChange, handleSubmit, setFormValue, handleCheck } =
    useForm(updateTask);

  return (
    <div>
      <div className="et-header">
        {" "}
        <h2 className="editing-et">Editing </h2>
        <h2 className="dec-name">{task.nameOfTask}</h2>
      </div>

      <FormGroup>
        <div className="txt-field-et">
          <TextField
            id="nameOfTaskUpdate"
            onChange={(event) => handleChange(event)}
            name="nameOfTaskUpdate"
            label="Task Name"
            variant="outlined"
            helperText={
              validTaskName == " " ? (
                " "
              ) : (
                <span className="helper-text">{validTaskName}</span>
              )
            }
          />
        </div>

        <FormControlLabel
          control={
            <Checkbox
              id="sunday"
              name="sunday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Sunday"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="monday"
              name="monday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Monday"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="tuesday"
              name="tuesday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Tuesday"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="wednesday"
              name="wednesday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Wednesday"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="thursday"
              name="thursday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Thursday"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="friday"
              name="friday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Friday"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="saturday"
              name="saturday"
              onChange={(event) => handleCheck(event)}
            />
          }
          label="Saturday"
        />
        <div style={{height: "24px"}}>
          
        </div>
        <Button
          type="submit"
          onClick={(event) => handleSubmit(event, task._id)}
          variant="contained"
        >
          Update Task
        </Button>
      </FormGroup>
    </div>
  );
};

export default EditTask;
