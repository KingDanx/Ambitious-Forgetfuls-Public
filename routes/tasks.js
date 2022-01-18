const {
  Task,
  TaskUser,
  DailyLog,
  validateTaskUser,
  PendingRequest,
  Day,
} = require("../models/task");
const { User } = require("../models/user");
const { Comment, validateComment } = require("../models/comment");
const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require('mongoose');
const schedule = require("node-schedule");
const axios = require("axios");

const router = express.Router();

//Create a new Task
router.post("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with ID "${req.params.userId}" does not exist.`);
    const creator = new TaskUser({
      user: user._id,
      taskPoints: 0,
    });

    const log = new DailyLog({});

    const task = new Task({
      nameOfTask: req.body.nameOfTask,
      creator: req.params.userId,
    });

    for (let i = 0; i < req.body.days.length; i++) {
      let j;
      j = new Day({
        dayNumber: req.body.days[i].dayNumber,
        dayName: req.body.days[i].dayName,
      });
      task.days.push(j);
    }

    today = new Date();

    task.dailyLog.push(log);
    task.dailyLog.unshift({
      dateModified: today.setDate(today.getDate() - 1),
      completedBy: new mongoose.Types.ObjectId(),
    });
    task.dailyLog.unshift({
      dateModified: today.setDate(today.getDate() - 1),
      completedBy: new mongoose.Types.ObjectId()
    });
    task.dailyLog.unshift({
      dateModified: today.setDate(today.getDate() - 1),
      completedBy: new mongoose.Types.ObjectId()
    });
    task.dailyLog.unshift({
      dateModified: today.setDate(today.getDate() - 1),
      completedBy: new mongoose.Types.ObjectId()
    });
    task.dailyLog.unshift({
      dateModified: today.setDate(today.getDate() - 1),
      completedBy: new mongoose.Types.ObjectId()
    });
    task.dailyLog.unshift({
      dateModified: today.setDate(today.getDate() - 1),
      completedBy: new mongoose.Types.ObjectId()
    });

    task.users.push(creator);
    await task.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: task._id,
        nameOfTask: task.nameOfTask,
        creator: task.creator,
        days: task.days,
        users: task.users,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Get all tasks
router.get("/", async (req, res) => {
  try {
    const task = await Task.find();
    return res.send(task);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Get a single task
router.get("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`Task with id ${req.params.taskId} does not exist!`);
    return res.send(task);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Delete a task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`User with id ${req.params.taskId} does not exist!`);
    await task.remove();
    return res.send(task);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Add a comment to a task
router.post("/:taskId/comment", auth, async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error);

    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id: "${req.params.userId}" does not exist.`);

    const comment = new Comment({
      userId: req.body.userId,
      body: req.body.body,
    });

    task.comments.push(comment);
    await task.save();

    return res.send(comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Delete a comment
router.delete("/:taskId/deleteComment/:commentId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`Task with id ${req.params.taskId} does not exist!`);

    let comment = task.comments.id(req.params.commentId);
    if (!comment)
      return res
        .status(400)
        .send(`Comment with id ${req.params.commentId} does not exist!`);

    comment = await comment.remove();
    await task.save();
    return res.send(task);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Updates a user's task points
router.put("/:taskId/points/:taskUserId", async (req, res) => {
  try {
    const { error } = validateTaskUser(req.body);
    if (error) return res.status(400).send(error);

    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.taskId}" does not exist.`);

    const taskUser = task.users.id(req.params.taskUserId);
    if (!taskUser)
      return res
        .status(400)
        .send(
          `The task user with id "${req.params.taskUserId}" does not in the task's users.`
        );

    taskUser.user = req.body.user;
    taskUser.taskPoints = req.body.taskPoints;

    await task.save();
    return res.send(task);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Update task name/days
router.put("/:taskId/updateTask/", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.taskId}" does not exist.`);

    task.days = [];

    task.nameOfTask = req.body.nameOfTask;

    for (let i = 0; i < req.body.days.length; i++) {
      let j;
      j = new Day({
        dayNumber: req.body.days[i].dayNumber,
        dayName: req.body.days[i].dayName,
      });
      task.days.push(j);
    }

    if (task.days.length === 0) {
      res.status(400).send("Task must have days.");
    }
    else {
      await task.save();
      return res.send(task);
    }


  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Send task request -- This is a user requesting to join a task
router.post("/:taskId/request/:userId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.taskId}" does not exist.`);
    let onTask = [];
    task.pendingRequest.map((el) => {
      if (el.requestorId.toString() === req.params.userId) {
        onTask.push(false);
      }
    });
    task.users.map((el) => {
      if (el.user.toString() === req.params.userId) {
        onTask.push(false);
      }
    });
    if (onTask.includes(false)) {
      return res.status(400).send("This user is already on task!");
    } else {
      const newRequest = new PendingRequest({
        requestorId: req.params.userId,
        taskId: req.params.taskId,
      });

      task.pendingRequest.push(newRequest);
      await task.save();
      return res.send(task);
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Accept task -- This is a task owner accepting a request from a user
router.post("/:taskId/accept/:requestId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.taskId}" does not exist.`);
    const requestors = task.pendingRequest;
    let reqCheck = [];
    requestors.map((el) => {
      if (el.requestorId.toString() === req.params.requestId) {
        reqCheck.push(el);
      }
    });
    if (reqCheck.length === 0) {
      return res
        .status(400)
        .send(
          `User with ID ${req.params.requestId} does not exisit in pending request.`
        );
    }

    requestors.map((el) => {
      if (el.requestorId.toString() === req.params.requestId) {
        const newUser = new TaskUser({
          user: req.params.requestId,
        });
        task.users.push(newUser);
        task.pendingRequest.splice(task.pendingRequest.indexOf(el), 1);
      }
    });
    let userCheck = true;
    task.users.map((el) => {
      if (el.user.toString() === req.params.requestorId) {
        userCheck = false;
      }
    });
    if (userCheck === false) {
      res
        .status(400)
        .send(`User with ID ${req.params.requestorId} is already on task`);
    } else if (userCheck === true) {
      await task.save();
      return res.send(task);
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Remove pending request -- This is a task owner denying a request from a user
router.delete("/:taskId/remove/:requestId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);
    const requestors = task.pendingRequest;
    let reqCheck = [];
    requestors.map((el) => {
      if (el.requestorId.toString() === req.params.requestId) {
        reqCheck.push(el);
      }
    });
    if (reqCheck.length === 0) {
      return res
        .status(400)
        .send(
          `User with ID ${req.params.requestorId} does not exisit in pending request.`
        );
    }
    requestors.map((el) => {
      if (el.requestorId.toString() === req.params.requestId) {
        task.pendingRequest.splice(task.pendingRequest.indexOf(el), 1);
      }
    });
    let userCheck = true;
    task.users.map((el) => {
      if (el.user.toString() === req.params.requestorId) {
        userCheck = false;
      }
    });
    if (userCheck === false) {
      res
        .status(400)
        .send(`User with ID ${req.params.requestorId} is already on task`);
    } else if (userCheck === true) {
      await task.save();
      return res.send(task);
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Create a new daily log if one is not created by user -- daily
router.post("/:taskId/dailyLog", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);

    const lastLog = task.dailyLog[task.dailyLog.length - 1].dateModified;

    today = new Date();
    dayPopulation = new Date(today);
    today.setHours(0, 0, 0, 0);
    lastLog.setHours(0, 0, 0, 0);

    if (today.getTime() === lastLog.getTime()) {
      console.log(
        `Logs for ${task.nameOfTask} - ${task._id} already updated by a user today.`
      );
      return res.send(
        `Logs for ${task.nameOfTask} - ${task._id} already updated by a user today.`
      );
    } else if (today.getTime() !== lastLog.getTime()) {
      const randomComplete = new mongoose.Types.ObjectId()
      const randomStruck = new mongoose.Types.ObjectId()
      const newLog = new DailyLog({
        completedBy: randomComplete,
        struck: randomStruck,
      });
      task.dailyLog.push(newLog);
      await task.save();
      console.log(
        `New automatic log uploaded for ${task.nameOfTask} - ${task._id}.`
      );
      return res.send(
        `New automatic log uploaded for ${task.nameOfTask} - ${task._id}.`
      );
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

let allTask = [];
let allTaskId = [];
const getAllTaskId = async () => {
  await axios.get(`http://localhost:5000/api/tasks/`).then((res) => {
    allTask = res.data;
    allTask.map((el) => {
      allTaskId.push(el._id);
    });
  });
};

const runLog = async (taskId) => {
  await axios
    .post(`http://localhost:5000/api/tasks/${taskId}/dailyLog`)
    .then((res) => { });
};

schedule.scheduleJob("0 0 0 * * *", () => {
  //daily reset
  getAllTaskId();
  setTimeout(() => {
    allTaskId.map((el) => {
      runLog(el);
    });
    allTaskId = [];
  }, 2000);
});

runWeeklyReset = async (taskId) => {
  await axios
    .put(`http://localhost:5000/api/tasks/${taskId}/weeklyReset`)
    .then((res) => {
      console.log("Weekly reset complete.")
    });
};

//weekly reset
schedule.scheduleJob("10 0 0 * * 0", () => {
  getAllTaskId();
  setTimeout(() => {
    allTaskId.map((el) => {
      runWeeklyReset(el);
    });
    allTaskId = [];
  }, 2000);
});

//User posted dailyLog
router.post("/:taskId/dailyLog/:userId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);

    const lastLog = task.dailyLog[task.dailyLog.length - 1].dateModified;

    today = new Date();
    today.setHours(0, 0, 0, 0);
    lastLog.setHours(0, 0, 0, 0);

    if (today.getTime() === lastLog.getTime()) {
      console.log("Logs already updated by a user today.");
      return res.status(400).send("Logs already updated by a user today.");
    } else {
      const newLog = new DailyLog({
        completed: true,
        completedBy: req.params.userId,
      });
      task.dailyLog.push(newLog);
      await task.save();
      return res.send("New user log uploaded.");
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Weekly task day reset
router.put("/:taskId/weeklyReset", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);

    task.days.map((el) => {
      el.completed = false;
    });
    await task.save();
    return res.send(`Weekly reset on task ${req.params.taskId} completed.`);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Change day complete/incomplete -- only changes the day we are currntly living in.
router.put("/:taskId/dayStatus/", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);

    if (req.body.completed !== true && req.body.completed !== false) {
      return res.send(
        `${req.body.completed} is not a vailid input. please input true or false.`
      );
    }

    let truthCheck = [];
    today = new Date();

    task.days.map((el) => {
      if (el.dayNumber === today.getDay()) {
        el.completed = req.body.completed;
        truthCheck.push(true);
      } else {
        truthCheck.push(false);
      }
    });

    if (truthCheck.includes(true)) {
      await task.save();
      return res.send(`Day completed is ${req.body.completed}.`);
    } else {
      return res.status(400).send("Cannot update a day that is not today.");
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Change daily log and update time complete/incomplete -- only changes the day we are currntly living in.
router.put("/:taskId/dailyLogStatus/:userId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);

    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);

    if (req.body.completed !== true && req.body.completed !== false) {
      return res.send(
        `${req.body.completed} is not a vailid input. please input true or false.`
      );
    }

    let truthCheck = [];
    today = new Date();

    task.dailyLog.map((el) => {
      if (el.dateModified.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
        el.dateModified = new Date();
        el.completed = req.body.completed;
        req.body.completed === true ? el.completedBy = req.params.userId : el.completedBy = new mongoose.Types.ObjectId();
        truthCheck.push(true);
        // console.log(task.dailyLog.indexOf(el) + " true")
      } else {
        truthCheck.push(false);
        // console.log(console.log(task.dailyLog.indexOf(el)+ " false"))
      }
    });

    if (truthCheck.includes(true)) {
      await task.save();
      return res.send(`Day completed is ${req.body.completed} by user ${req.params.userId}.`);
    } else {
      return res.status(400).send("Cannot update a day that is not today.");
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
