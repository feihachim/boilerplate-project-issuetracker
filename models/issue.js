const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
  },
  project_name: {
    type: String,
  },
});

module.exports = mongoose.model("Issue", issueSchema);
