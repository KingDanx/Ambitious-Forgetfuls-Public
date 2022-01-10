import React, { useState, useEffect } from "react";
import Points from "../../../../assets/images/points.png";
import Strikes from "../../../../assets/images/strikes.png";

import "../styles/UserCard.css";

const UserCard = ({ profile }) => {
  return (
    <div className="layout">
      <div className="name-photo">
        {" "}
        <div>{profile.firstName} {profile.lastName}</div>
        <img
          className="user-image"
          height="100"
          src={`http://localhost:5000/${profile.image}`}
          alt={`Image of ${profile.firstName}`}
        />
      </div>{" "}
      <div className="points-strikes">
        <div className="points-strikes-inner-div">
          <img className="icons" src={Points} alt="" />
          <div className="points-pr">{profile.totalPoints}</div>
        </div>
        <div className="points-strikes-inner-div">
          <img width="35" src={Strikes} alt="" />
          <div className="strikes">{profile.strikes}</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
