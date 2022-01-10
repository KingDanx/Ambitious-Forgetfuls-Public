import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Button from "@mui/material/Button";
import "../styles/PieChart.css";

const PieChart = ({ task, allUsers }) => {
  const [weekPoints, setPointsWeek] = useState(false);
  const [monthPoints, setPointsMonth] = useState(false);
  const [yearPoints, setPointsYear] = useState(false);
  const [allPointsData, setPointsAllData] = useState(true);

  let labels = [];
  let pointsData = [];
  let weekPointsData = [];
  let monthPointsData = [];
  let yearPointsData = [];

  const weekButton = () => {
    setPointsWeek(true);
    setPointsMonth(false);
    setPointsYear(false);
    setPointsAllData(false);
  };
  const monthButton = () => {
    setPointsWeek(false);
    setPointsMonth(true);
    setPointsYear(false);
    setPointsAllData(false);
  };
  const yearButton = () => {
    setPointsWeek(false);
    setPointsMonth(false);
    setPointsYear(true);
    setPointsAllData(false);
  };
  const allDataButton = () => {
    setPointsWeek(false);
    setPointsMonth(false);
    setPointsYear(false);
    setPointsAllData(true);
  };

  !task.users
    ? console.log("I'm a failure")
    : task.users.map((el) => {
        pointsData.push(el.taskPoints);
      });

  let idAndPoints = [];
  !task.users
    ? console.log("I'm a failure")
    : task.users.map((el) => {
        idAndPoints.push({
          user: el.user,
          points: el.taskPoints,
      });
  });

  let toPie = [];
  if (true == true) {
    idAndPoints.map((el) => {
      allUsers.map((li) => {
        if (el.user == li._id) {
          toPie.push({
            user: li,
            points: el.points,
          });
        }
      });
    });
  }

  //weekly point break down based on completedBy
  toPie.map((el) => {
    let points = 0;
    let shorty;
    if (task.dailyLog.length < 7) {
      shorty = task.dailyLog.length;
      for (let i = shorty; i >= 1; i--) {
        if (el.user._id === task.dailyLog[task.dailyLog.length - i].completedBy) {
          points++;
        }
      }
    }
    else{
      for (let i = 7; i >= 1; i--){
        if (el.user._id === task.dailyLog[task.dailyLog.length - i].completedBy) {
          points++;
        }
      }
    }
    weekPointsData.push(points);
  });
  console.log(weekPointsData);

  //monthly point break down based on completedBy
  toPie.map((el) => {
    let points = 0;
    let shorty;
    if (task.dailyLog.length < 30) {
      shorty = task.dailyLog.length;
      for (let i = shorty; i >= 1; i--) {
        if (el.user._id == task.dailyLog[task.dailyLog.length - i].completedBy) {
          points++;
        }
      }
    }
    else{
      for (let i = 30; i >= 1; i--){
        if (el.user._id === task.dailyLog[task.dailyLog.length - i].completedBy) {
          points++;
        }
      }
    }
    monthPointsData.push(points);
  });

  //yearly point break down based on completedBy
  toPie.map((el) => {
    let points = 0;
    let shorty;
    if (task.dailyLog.length < 365) {
      shorty = task.dailyLog.length;
      for (let i = shorty; i >= 1; i--) {
        if (el.user._id == task.dailyLog[task.dailyLog.length - i].completedBy) {
          points++;
        }
      }
    }
    else{
      for (let i = 365; i >= 1; i--){
        if (el.user._id === task.dailyLog[task.dailyLog.length - i].completedBy) {
          points++;
        }
      }
    }
    yearPointsData.push(points);
  });

  toPie.map((el) => {
    labels.push(`${el.user.firstName} ${el.user.lastName.charAt(0)}`);
  });

  ChartJS.register(ArcElement, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `User Points`,
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Points",
        data:
          allPointsData === true
            ? pointsData
            : weekPoints === true
            ? weekPointsData
            : monthPoints === true
            ? monthPointsData
            : yearPoints === true
            ? yearPointsData
            : pointsData,

        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div>
        <Pie data={data} options={options} />
      </div>
      <div className="pie-button-div">
        <Button className="pie-buttons" onClick={() => weekButton()} variant="contained">
          7 Days
        </Button>
        <Button className="pie-buttons" onClick={() => monthButton()} variant="contained">
          30 Days
        </Button>
        <Button className="pie-buttons" onClick={() => yearButton()} variant="contained">
          1 Year
        </Button>
        <Button className="pie-buttons" onClick={() => allDataButton()} variant="contained">
          All Data
        </Button>
      </div>
    </div>
  );
};

export default PieChart;
