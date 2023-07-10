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
  test("update one field on an issue", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "test update issue field",
        issue_text: "Beta",
        created_by: "Betadine",
      })
      .end(function (err, res) {
        const _id = res.body._id;
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({ _id: _id, issue_text: "Better test for text" })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, _id);
            done();
          });
      });
  });
  // #8
  test("update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "last test",
        issue_text: "bad text",
        created_by: "Megan",
      })
      .end(function (err, res) {
        const _id = res.body._id;
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: _id,
            issue_title: "ending",
            issue_text: "Hopefully done",
          })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, _id);
            done();
          });
      });
  });
  // #9
  test("update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ issue_title: "Majin Boo" })
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  // #10
  test("update an issue with no fields to update", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "test no update",
        issue_text: "random text",
        created_by: "Alpha",
      })
      .end(function (err, res) {
        const _id = res.body._id;
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({ _id: _id })
          .end(function (err, res) {
            assert.equal(res.body.error, "no update field(s) sent");
            assert.equal(res.body._id, _id);
            done();
          });
      });
  });
  // #11
  test("update an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: "gogeta", issue_title: "Ryu specter" })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "gogeta");
        done();
      });
  });
  // #12
  test("delete an issue", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "test delete",
        issue_text: "issue to delete",
        created_by: "John SMith",
      })
      .end(function (err, res) {
        chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({ _id: res.body._id })
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
