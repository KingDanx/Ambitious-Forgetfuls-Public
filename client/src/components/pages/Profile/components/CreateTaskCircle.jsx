import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import AddCircleIcon from "../../../../assets/images/create.png";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "../styles/CreateTaskCircle.css";
const CreateTaskCircle = () => {
  return (
    <div className="display-circle">
      <Link to="/createTask">
        {" "}
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Link>
    </div>
  );
};

export default CreateTaskCircle;
