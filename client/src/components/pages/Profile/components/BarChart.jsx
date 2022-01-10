import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Button from "@mui/material/Button";
import "../styles/BarChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ allTasks, profile, getAllTask }) => {
  const [weekPoints, setPointsWeek] = useState(false);
  const [monthPoints, setPointsMonth] = useState(false);
  const [yearPoints, setPointsYear] = useState(false);
  const [allPointsData, setPointsAllData] = useState(true);
  const [weekStrikes, setStrikesWeek] = useState(false);
  const [monthStrikes, setStrikesMonth] = useState(false);
  const [yearStrikes, setStrikesYear] = useState(false);
  const [allStrikesData, setStrikesAllData] = useState(true);
  let labels = [];
  let pointsData = [];
  let strikesData = [];
  let weekPointsData = [];
  let monthPointsData = [];
  let yearPointsData = [];
  let weekStrikesData = [];
  let monthStrikesData = [];
  let yearStrikesData = [];
  let today;

  today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekButton = () => {
    setPointsWeek(true);
    setPointsMonth(false);
    setPointsYear(false);
    setPointsAllData(false);
    setStrikesWeek(true);
    setStrikesMonth(false);
    setStrikesYear(false);
    setStrikesAllData(false);
  };
  const monthButton = () => {
    setPointsWeek(false);
    setPointsMonth(true);
    setPointsYear(false);
    setPointsAllData(false);
    setStrikesWeek(false);
    setStrikesMonth(true);
    setStrikesYear(false);
    setStrikesAllData(false);
  };
  const yearButton = () => {
    setPointsWeek(false);
    setPointsMonth(false);
    setPointsYear(true);
    setPointsAllData(false);
    setStrikesWeek(false);
    setStrikesMonth(false);
    setStrikesYear(true);
    setStrikesAllData(false);
  };
  const allDataButton = () => {
    setPointsWeek(false);
    setPointsMonth(false);
    setPointsYear(false);
    setPointsAllData(true);
    setStrikesWeek(false);
    setStrikesMonth(false);
    setStrikesYear(false);
    setStrikesAllData(true);
  };

  allTasks.map((el) => {
    el.users.map((li) => {
      if (li.user === profile._id) {
        labels.push(el.nameOfTask);
        pointsData.push(li.taskPoints);
        strikesData.push(li.taskStrikes);
      }
    });
  });

  //Populates week Points
  allTasks.map((el) => {
    let points = 0;
    let shorty;
    if (el.dailyLog.length < 7) {
      shorty = el.dailyLog.length
      for (let i = shorty; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].completedBy ===
          profile._id
        ) {
          points++;
        }
      }
    }
    else {
      for (let i = 7; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].completedBy ===
          profile._id
        ) {
          points++;
        }
      }
    }
    el.users.map((li)=> {
      if(li.user === profile._id){
        weekPointsData.push(points);
      }
    })
  });
  console.log(weekPointsData);

  //Populates month Points
  allTasks.map((el) => {
    let points = 0;
    let shorty;
    if (el.dailyLog.length < 30) {
      shorty = el.dailyLog.length
      for (let i = shorty; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].completedBy ===
          profile._id
        ) {
          points++;
        }
      }
    }
    else {
      for (let i = 30; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].completedBy ===
          profile._id
        ) {
          points++;
        }
      }
    }
    el.users.map((li)=> {
      if(li.user === profile._id){
        monthPointsData.push(points);
      }
    })
  });

  //Populates year Points
  allTasks.map((el) => {
    let points = 0;
    let shorty;
    if (el.dailyLog.length < 365) {
      shorty = el.dailyLog.length
      for (let i = shorty; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].completedBy ===
          profile._id
        ) {
          points++;
        }
      }
    }
    else {
      for (let i = 365; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].completedBy ===
          profile._id
        ) {
          points++;
        }
      }
    }
    el.users.map((li)=> {
      if(li.user === profile._id){
        yearPointsData.push(points);
      }
    })
  });

  //Populates week strikes
  allTasks.map((el) => {
    let points = 0;
    let shorty;
    if (el.dailyLog.length < 7) {
      shorty = el.dailyLog.length
      for (let i = shorty; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].struck ===
          profile._id
        ) {
          points++;
        }
      }
    }
    else {
      for (let i = 7; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].struck ===
          profile._id
        ) {
          points++;
        }
      }
    }
    el.users.map((li)=> {
      if(li.user === profile._id){
        weekStrikesData.push(points);
      }
    })
  });

  //Populates month strikes
  allTasks.map((el) => {
    let points = 0;
    let shorty;
    if (el.dailyLog.length < 30) {
      shorty = el.dailyLog.length
      for (let i = shorty; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].struck ===
          profile._id
        ) {
          points++;
        }
      }
    }
    else {
      for (let i = 30; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].struck ===
          profile._id
        ) {
          points++;
        }
      }
    }
    el.users.map((li)=> {
      if(li.user === profile._id){
        monthStrikesData.push(points);
      }
    })
  });

  //Populates year strikes
  allTasks.map((el) => {
    let points = 0;
    let shorty;
    if (el.dailyLog.length < 365) {
      shorty = el.dailyLog.length
      for (let i = shorty; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].struck ===
          profile._id
        ) {
          points++;
        }
      }
    }
    else {
      for (let i = 365; i >= 1; i--) {
        if (
          el.dailyLog[el.dailyLog.length - i].struck ===
          profile._id
        ) {
          points++;
        }
      }
    }
    el.users.map((li)=> {
      if(li.user === profile._id){
        yearStrikesData.push(points);
      }
    })
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${profile.firstName}'s Points/Strikes`,
      },
    },
  };

  const data = {
    labels,
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
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Strikes",
        data: allStrikesData === true
          ? strikesData
          : weekStrikes === true
            ? weekStrikesData
            : monthStrikes === true
              ? monthStrikesData
              : yearStrikes === true
                ? yearStrikesData
                : strikesData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  useEffect(() => {
    console.log("graph");
  }, [pointsData, weekPointsData, monthPointsData, yearPointsData]);

  return (
    <div>
      <Bar options={options} data={data} />
      <div className="bar-button-div">
        <Button className="bar-buttons" onClick={() => weekButton()} variant="contained">
          7 Days
        </Button>
        <Button className="bar-buttons" onClick={() => monthButton()} variant="contained">
          30 Days
        </Button>
        <Button className="bar-buttons" onClick={() => yearButton()} variant="contained">
          1 Year
        </Button>
        <Button className="bar-buttons" onClick={() => allDataButton()} variant="contained">
          All Data
        </Button>
      </div>
    </div>
  );
};

export default BarChart;
