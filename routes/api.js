"use strict";

const { v4: uuidv4 } = require("uuid");

const issueFactory = (
  issue_title,
  issue_text,
  created_by,
  assigned_to,
  status_text
) => {
  const _id = uuidv4();
  const created_on = new Date();
  const updated_on = new Date();
  const open = true;
  return {
    _id,
    issue_title,
    issue_text,
    created_on,
    updated_on,
    created_by,
    assigned_to,
    open,
    status_text,
  };
};

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
