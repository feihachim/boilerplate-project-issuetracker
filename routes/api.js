"use strict";

const Issue = require("../models/issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      Issue.find({ project_name: project })
        .then((issues) => {
          const _id = req.query._id ?? undefined;
          const issue_title = req.query.issue_title ?? undefined;
          const issue_text = req.query.issue_text ?? undefined;
          const created_by = req.query.created_by ?? undefined;
          const assigned_to = req.query.assigned_to ?? undefined;
          const status_text = req.query.status_text ?? undefined;
          const created_on = req.query.created_on ?? undefined;
          const updated_on = req.query.updated_on ?? undefined;
          const open = req.query.open ?? undefined;
          let issueList = issues;
          if (_id) {
            issueList = issueList.filter((element) => element._id == _id);
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
          res.send(issueList);
        })
        .catch((error) => {
          console.log(error);
          res.send({ error: "could not find issues" });
          return;
        });
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        res.send({ error: "required field(s) missing" });
        return;
      }
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to ?? "";
      const status_text = req.body.status_text ?? "";

      const newIssue = new Issue({
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        project_name: project,
      });
      newIssue
        .save()
        .then((issueCreated) => {
          res.status(200).send(issueCreated);
        })
        .catch((err) => {
          res.send({ error: "could not create issue" });
          return;
        });
    })
    .put(function (req, res) {
      let project = req.params.project;
      const _id = req.body._id ?? undefined;
      if (!_id) {
        res.send({ error: "missing _id" });
        return;
      }
      Issue.findOne({ _id: _id })
        .then((issue) => {
          const issue_title = req.body.issue_title ?? undefined;
          const issue_text = req.body.issue_text ?? undefined;
          const created_by = req.body.created_by ?? undefined;
          const assigned_to = req.body.assigned_to ?? undefined;
          const status_text = req.body.status_text ?? undefined;
          const open = req.body.open ?? undefined;
          if (
            !issue_title &&
            !issue_text &&
            !created_by &&
            !assigned_to &&
            !status_text &&
            !open
          ) {
            res.send({ error: "no update field(s) sent", _id: _id });
            return;
          }
          if (issue_title) {
            issue.issue_title = issue_title;
          }
          if (issue_text) {
            issue.issue_text = issue_text;
          }
          if (created_by) {
            issue.created_by = created_by;
          }
          if (assigned_to) {
            issue.assigned_to = assigned_to;
          }
          if (status_text) {
            issue.status_text = status_text;
          }
          if (open) {
            issue.open = open;
          }
          issue.updated_on = new Date();
          issue
            .save()
            .then((issueUpdated) => {
              console.log({ issueUpdated });
              res.json({ result: "successfully updated", _id: _id });
              return;
            })
            .catch((error) => {
              res.send({ error: "could not update", _id: _id });
            });
        })
        .catch((error) => {
          res.send({ error: "could not update", _id: _id });
        });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const _id = req.body._id ?? undefined;
      if (!_id) {
        res.send({ error: "missing _id" });
        return;
      }

      Issue.findByIdAndDelete(_id)
        .then((issue) => {
          console.log({ id: _id, issue: issue });
          if (!issue) {
            res.json({ error: "could not delete", _id: _id });
            return;
          }
          res.json({ result: "successfully deleted", _id: _id });
        })
        .catch((error) => {
          res.json({ error: "could not delete", _id: _id });
        });
    });
};
