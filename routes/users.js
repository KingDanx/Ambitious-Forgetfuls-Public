const { User, validateUser, validateLogin } = require("../models/user");
const {
  Task,
  TaskUser,
  PendingRequest,
} = require("../models/task");
const express = require("express");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");

//Creates a new user and uploads image via middleware
router.post("/register", fileUpload.single("image"), async (req, res) => {
  let img;
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
    const salt = await bcrypt.genSalt(10);

    if (typeof req.file === "undefined") {
      img = "uploads/images/troll-face.jpg";
    } else {
      img = req.file.path;
    }
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      image: img,
    });
    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Login a user
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();

    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Get a single user
router.get("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Updates a user's points
router.put("/:userId/points", auth, async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);

    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with id: "${req.params.userId}" does not exist.`);

      user.totalPoints = req.body.totalPoints;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Deletes a user
router.delete("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Send task request -- This is a task owner sending a request to a member through the search
router.post("/:taskId/request/:userId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.taskId}" does not exist.`);

    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);

    let onReq = [];
    user.pendingRequest.map((el) => {
      if (el.taskId.toString() === req.params.taskId) {
        onReq.push(false);
      }
    });
    if (onReq.includes(false)) {
      return res
        .status(400)
        .send(
          `User with ID ${req.params.userId} already has a pending request!`
        );
    }

    let onTask = [];
    task.users.map((el) => {
      if (el.user.toString() === req.params.userId) {
        onTask.push(false);
      }
    });
    if (onTask.includes(false)) {
      return res
        .status(400)
        .send(`User with ID ${req.params.userId} is already on task!`);
    }

    if (!onReq.includes(false) && !onTask.includes(false)) {
      const newRequest = new PendingRequest({
        requestorId: task.creator,
        taskId: req.params.taskId,
      });

      user.pendingRequest.push(newRequest);
      await user.save();
      return res.send(user);
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Accept task -- This is a user accepting a request from a task owner -- Moves the user into the task's user's array and removes task from pending array
router.post("/:taskId/accept/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);

    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.taskId}" does not exist.`);

    let onTask = [];
    task.users.map((el) => {
      if (el.user.toString() === req.params.userId) {
        onTask.push(false);
      }
    });
    if (onTask.includes(false)) {
      task.users.map((el) => {
        if (el.user.toString() === req.params.userId) {
          user.pendingRequest.splice(user.pendingRequest.indexOf(el), 1);
        }
      });
      await user.save();
      return res
        .status(400)
        .send(
          `User with ID ${req.params.userId} is already on task! Removing request from pending request!`
        );
    } else {
      const taskUser = new TaskUser({
        user: req.params.userId,
      });
      task.users.push(taskUser);
      user.pendingRequest.map((el) => {
        if (el.taskId.toString() === req.params.taskId) {
          user.pendingRequest.splice(user.pendingRequest.indexOf(el), 1);
        }
      });
      await user.save();
      await task.save();
      return res.send(task)
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Remove pending request -- This is a user denying a request from a task owner -- deletes request from user pendingRequest array.
router.delete("/:taskId/remove/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);

    const task = await Task.findById(req.params.taskId);
    if (!task)
      return res
        .status(400)
        .send(`The task with id "${req.params.userId}" does not exist.`);

    const testArray = user.pendingRequest.length;
    
    user.pendingRequest.map((el) => {
      if (el.taskId.toString() === req.params.taskId) {
        user.pendingRequest.splice(user.pendingRequest.indexOf(el), 1);
      }
    });
    task.pendingRequest.map((el) => {
      if (el.user.toString() === req.params.userId) {
        task.pendingRequest.splice(user.pendingRequest.indexOf(el), 1);
      }
    });

    if(testArray >= user.pendingRequest.length){
      await user.save();
      return res.send(user);
    }
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
