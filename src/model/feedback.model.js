const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema(
  {
    targetElm: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
      trim: true,
    },
    parentDivClass: {
      type: String,
    },
    tabUrl: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

const Feedback = mongoose.model('Feedback', feedbackSchema)
module.exports = Feedback
