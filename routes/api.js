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

let projectsArray = [];

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issueList = projectsArray.filter((value) => value.name === project);
      let newProject;
      if (issueList.length === 0) {
        newProject = {
          name: project,
          value: [],
        };
        projectsArray.push(newProject);
      } else {
        newProject = issueList[0];
      }

      const issue_title = req.body.issue_title ?? undefined;
      const issue_text = req.body.issue_text ?? undefined;
      const created_by = req.body.created_by ?? undefined;
      const assigned_to = req.body.assigned_to ?? "";
      const status_text = req.body.status_text ?? "";
      if (!issue_title || !issue_text || !created_by) {
        res.send({ error: "required field(s) missing" });
        return;
      }
      const newIssue = issueFactory(
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      );
      newProject.value.push(newIssue);
      res.status(200).send(newIssue);
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
