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
      let issueList = projectsArray.filter(
        (element) => element.name === project
      )[0].value;
      const _id = req.query._id ?? undefined;
      const issue_title = req.query.issue_title ?? undefined;
      const issue_text = req.query.issue_text ?? undefined;
      const created_by = req.query.created_by ?? undefined;
      const assigned_to = req.query.assigned_to ?? undefined;
      const status_text = req.query.status_text ?? undefined;
      const created_on = req.query.created_on ?? undefined;
      const updated_on = req.query.updated_on ?? undefined;
      const open = req.query.open ?? undefined;
      if (_id) {
        issueList = issueList.filter((element) => element._id === _id);
      }
      if (issue_title) {
        issueList = issueList.filter(
          (element) => element.issue_title === issue_title
        );
      }
      if (issue_text) {
        issueList = issueList.filter(
          (element) => element.issue_text === issue_text
        );
      }
      if (created_by) {
        issueList = issueList.filter(
          (element) => element.created_by === created_by
        );
      }
      if (assigned_to) {
        issueList = issueList.filter(
          (element) => element.assigned_to === assigned_to
        );
      }
      if (status_text) {
        issueList = issueList.filter(
          (element) => element.status_text === status_text
        );
      }
      if (created_on) {
        issueList = issueList.filter(
          (element) => element.created_on === created_on
        );
      }
      if (updated_on) {
        issueList = issueList.filter(
          (element) => element.updated_on === updated_on
        );
      }
      if (open) {
        issueList = issueList.filter((element) => element.open === open);
      }
      // console.log({ issueList });
      res.send(issueList);
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
      let issueList = projectsArray.filter(
        (element) => element.name === project
      )[0].value;
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let issueList = projectsArray.filter(
        (element) => element.name === project
      )[0].value;
      const _id = req.body._id ?? undefined;
      if (!_id) {
        res.send({ error: "missing _id" });
        return;
      }
      const issue = issueList.filter((element) => element._id === _id);
      if (issue.length === 0) {
        res.send({ error: "could not delete", _id: _id });
        return;
      }
      issueList = issueList.filter((element) => element._id !== _id);
      res.send({ result: "successfully deleted", _id: _id });
    });
};
