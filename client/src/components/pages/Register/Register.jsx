import React, { useState, useEffect } from "react";
import { Routes, Link, Route, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import useForm from "../../../useForm";
import ImageUpload from "../../ImageUploader";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./styles/Register.css";

const Register = ({ user, setUser, setProfile }) => {
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const [validLastName, setValidLastName] = useState(" ");
  const [validFirstName, setValidFirstName] = useState(" ");
  const [validEmail, setValidEmail] = useState(" ");
  const [validPassword, setValidPassword] = useState(" ");

  const registerUser = async () => {
    if (formValue.password !== formValue.confirmPassword) {
      console.log("Passwords do not match!");
      return;
    }
    if (
      formValue.firstName == "undefined" ||
      formValue.lastName == "undefined"
    ) {
      console.log("Error undefined.");
      return;
    }
    const form = new FormData();
    form.append("firstName", formValue.firstName);
    form.append("lastName", formValue.lastName);
    form.append("email", formValue.email);
    form.append("password", formValue.password);
    form.append("image", file);

    setFormValue(form);
    await axios
      .post("http://localhost:5000/api/users/register", form)
      .then((res) => {
        localStorage.setItem("token", res.headers["x-auth-token"]);
        const user = jwtDecode(localStorage.getItem("token"));
        setUser(user);
        setProfile(user);
        navigate("/profile");
        console.log("token", res.headers["x-auth-token"]);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          setValidFirstName(document.getElementById("firstName").value);
          if (validFirstName == " ") {
            setValidFirstName("Please input a first name.");
          } else {
            setValidFirstName("Please input a first name.");
          }
          setValidLastName(document.getElementById("lastName").value);
          if (validFirstName == " ") {
            setValidLastName("Please input a last name.");
          } else {
            setValidLastName("Please input a last name.");
          }
          setValidEmail(document.getElementById("email").value);
          if (validEmail == " ") {
            setValidEmail("Not a vailid E-mail address.");
          } else {
            setValidEmail("Not a vailid E-mail address.");
          }
          if (error.response.data == "User already registered.") {
            setValidEmail(
              "This E-mail address is already registerd to an account"
            );
          }

          setValidPassword(document.getElementById("password").value);
          if (
            error.response.data ==
              `"password" length must be at least 5 characters long` ||
            validPassword == " "
          ) {
            setValidPassword("Password must be at least 5 characters.");
          } else {
            setValidPassword(" ");
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
    console.log(user);
  };

  useEffect(() => {
    console.log("Checking for user.");
  }, [validFirstName]);

  const { formValue, handleChange, handleSubmit, setFormValue } =
    useForm(registerUser);

  return (
    <div>
      <Link to="/"><ArrowBackIcon style={{color: "white"}} fontSize="large"/></Link>
      <div className="header-register">
        <h1>Ambitious Forgetfuls</h1>
      </div>
      <form className="login-input-text">
        <div>
          <div className="h2-reg">
            <h2>Create an Account</h2>
          </div>
          <div className="register-text-input">
            <div className="expand-text-field">
              <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                onChange={(event) => handleChange(event)}
                variant="outlined"
                required
                helperText={
                  validFirstName == " " ? (
                    " "
                  ) : (
                    <span className="helper-text">{validFirstName}</span>
                  )
                }
              />
            </div>
            <div className="expand-text-field">
              <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                onChange={(event) => handleChange(event)}
                variant="outlined"
                required
                helperText={
                  validLastName == " " ? (
                    " "
                  ) : (
                    <span className="helper-text">{validLastName}</span>
                  )
                }
              />
            </div>
            <div className="expand-text-field">
              <TextField
                id="email"
                name="email"
                label="E-mail"
                onChange={(event) => handleChange(event)}
                variant="outlined"
                helperText={
                  validEmail == " " ? (
                    " "
                  ) : (
                    <span className="helper-text">{validEmail}</span>
                  )
                }
                required
              />
            </div>
            <div className="expand-text-field">
              <TextField
                id="password"
                type="password"
                name="password"
                label="Password"
                onChange={(event) => handleChange(event)}
                variant="outlined"
                helperText={
                  validPassword == " " ? (
                    " "
                  ) : (
                    <span className="helper-text">{validPassword}</span>
                  )
                }
                required
              />
            </div>
            <div className="expand-text-field">
              <TextField
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                onChange={(event) => handleChange(event)}
                variant="outlined"
                helperText={
                  formValue.password !== formValue.confirmPassword ? (
                    <span style={{ color: "red" }}>
                      Passwords do not match.
                    </span>
                  ) : (
                    " "
                  )
                }
                required
              />
            </div>
            <div style={{width: "85%"}}>
              <ImageUpload file={file} setFile={setFile} user={user} />
            </div>
            <div className="expand-text-field">
              <Button
                type="submit"
                onClick={(event) => handleSubmit(event)}
                variant="contained"
              >
                Register
              </Button>
            </div>
            <div className="tos">
              By creating an account you agree to our
              <p>
                Terms of{" "}
                <a
                  target="_blank"
                  href="https://www.youtube.com/watch?v=eh7lp9umG2I"
                >
                  Service and Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
