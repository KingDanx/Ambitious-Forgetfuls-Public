const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    body: { type: String, required: true, minlength: 1, maxLength: 255 },
    dateModified: { type: Date, default: Date.now },
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  const validateComment = (comment) => {
    const schema = Joi.object({
      userId: Joi.objectId().required(),
      body: Joi.string().min(1).max(255).required(),
    })
    return schema.validate(comment)
  }

exports.Comment = Comment
exports.validateComment = validateComment
exports.commentSchema = commentSchema