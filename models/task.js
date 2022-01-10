const mongoose = require('mongoose');
const { commentSchema } = require("../models/comment");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const daySchema = new mongoose.Schema({
  dayNumber: {type: Number, required: true, max: 6, min: 0 },
  dayName: {type: String, required: true },
  completed: { type: Boolean, default: false },
})

const Day = mongoose.model('DaySchema', daySchema);

const validateDay = (request) => {
  const schema = Joi.object({
    dayNumber: Joi.number().required(),
    dayName: Joi.string().required(),
    completed: Joi.boolean(),
  });
  return schema.validate(request);
  }


const pendingRequestSchema = new mongoose.Schema({
  requestorId: { type: mongoose.Types.ObjectId, required: true },
  taskId: { type: mongoose.Types.ObjectId, required: true }
})

const PendingRequest = mongoose.model('PendingRequest', pendingRequestSchema);

const validatePendingRequest = (request) => {
const schema = Joi.object({
  requestorId: Joi.objectId().required(),
  taskId: Joi.objectId().required(),
});
return schema.validate(request);
}


const dailyLogSchema = new mongoose.Schema({
    completed: { type: Boolean, required: true, default: false },
    completedBy: { type: mongoose.Types.ObjectId, required: false },
    struck: {type: mongoose.Types.ObjectId, required: false },
    dateModified: { type: Date, default: Date.now, required: false },
  });

  const DailyLog = mongoose.model('DailyLog', dailyLogSchema);


  const taskUserSchema = new mongoose.Schema({
        user: { type: mongoose.Types.ObjectId, required: true },
        taskPoints: { type: Number, default: 0 },
        taskStrikes: {type: Number, default: 0 },
  });

  const TaskUser = mongoose.model('TaskUser', taskUserSchema);

  const validateTaskUser = (task) => {
    const schema = Joi.object({
      user: Joi.objectId(),
      taskPoints: Joi.number(),
      taskStrikes: Joi.number(),
    })
    return schema.validate(task)
  }

const taskSchema = new mongoose.Schema({
    nameOfTask: { type: String, required: true, minlength: 2, maxlength: 50 },
    creator: { type: mongoose.Types.ObjectId, required: true },
    days: [{ type: daySchema }],
    dailyLog: [{ type: dailyLogSchema }],
    users: [{ type: taskUserSchema }],
    comments: [{ type: commentSchema, required: false }],
    pendingRequest: [{ type: pendingRequestSchema }]
  });
  
  const Task = mongoose.model('Task', taskSchema);
  
  const validateTask = (task) => {
    const schema = Joi.object({
      nameOfTask: Joi.string().min(2).max(50).required(),
    })
    return schema.validate(task)
  }

exports.Task = Task
exports.validateTask = validateTask
exports.taskSchema = taskSchema
exports.DailyLog = DailyLog
exports.dailyLogSchema = dailyLogSchema
exports.TaskUser = TaskUser
exports.validateTaskUser = validateTaskUser
exports.PendingRequest = PendingRequest
exports.validatePendingRequest = validatePendingRequest
exports.pendingRequestSchema = pendingRequestSchema
exports.Day = Day