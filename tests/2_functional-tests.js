const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // #1
  test("create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "test issue",
        issue_text: "test text",
        created_by: "Joe",
        assigned_to: "Hachim",
        status_text: "Pending",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "test issue");
        assert.equal(res.body.issue_text, "test text");
        assert.equal(res.body.created_by, "Joe");
        assert.equal(res.body.assigned_to, "Hachim");
        assert.equal(res.body.status_text, "Pending");
        done();
      });
  });
  // #2
  test("create an issue with only requred fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "test 2 issue",
        issue_text: "test text 2",
        created_by: "John",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "test 2 issue");
        assert.equal(res.body.issue_text, "test text 2");
        assert.equal(res.body.created_by, "John");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        done();
      });
  });
  // #3
  test("create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_text: "test text 3",
        created_by: "John",
      })
      .end(function (err, res) {
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  // #4
  test("view issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  // #5
  test("view issues on a project with a filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?open=false")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  // #6
  test("view issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?created_by=Joe&open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  // #7
  // #8
  // #9
  // #10
  // #11
  // #12
  test("delete an issue", function (done) {
    let issue;
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "test delete",
        issue_text: "issue to delete",
        created_by: "John SMith",
      })
      .end(function (err, res) {
        issue = res.body;
        chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({ _id: issue._id })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully deleted");
          });
        done();
      });
  });
  // #13
  test("delete an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: "geronimo" })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "geronimo");
        done();
      });
  });
  // #14
  test("delete an issue with missing _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
