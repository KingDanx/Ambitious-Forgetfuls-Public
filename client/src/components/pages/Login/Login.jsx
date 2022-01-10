import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import useForm from "../../../useForm";
import axios from "axios";
import jwtDecode from "jwt-decode";
import MySwitch from "../../MySwitch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./styles/Login.css";

const Login = ({ setUser, setProfile }) => {
  const [valid, setValid] = useState(true);
  const [checked, setChecked] = React.useState(false);
  const navigate = useNavigate();

  const loginUser = async () => {
    await axios
      .post("http://localhost:5000/api/users/login", {
        email: formValue.email,
        password: formValue.password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data);
        const user = jwtDecode(localStorage.getItem("token"));
        setUser(user);
        setProfile(user);
        setValid(true);
        setChecked(true);
        setTimeout(() => {
          navigate("/profile");
        }, 1300);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
          setValid(false);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const { formValue, handleChange, handleSubmit, setFormValue } =
    useForm(loginUser);

  return (
    <div>
      <div className="login-header">
        {" "}
        <h1>Ambitious Forgetfuls</h1>
      </div>

      <form>
        <div className="login-text-input">
          <TextField
            className="input-width"
            id="email"
            label="E-mail"
            name="email"
            placeholder="E-mail"
            onChange={(event) => handleChange(event)}
          />
          <p></p>
          <TextField
            className="input-width"
            id="password"
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
            onChange={(event) => handleChange(event)}
            helperText={
              valid === true ? (
                " "
              ) : (
                <span style={{ color: "red" }}>Invalid E-mail or Password</span>
              )
            }
          />
        </div>

        <p></p>
        <div className="slider-div">
          {" "}
          <MySwitch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>

        <div className="login-button-div">
          <Button
            style={{
              width: "75%"
          }}
            onClick={(event) => handleSubmit(event)}
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </div>
      </form>
      <div>
      <div className="no-acc-div">Don't have an account?<span style={{marginRight: "4px"}}> </span><Link style={{textDecoration: "none"}} to="/register">Sign  Up</Link></div>
      </div>
    </div>
  );
};

export default Login;
