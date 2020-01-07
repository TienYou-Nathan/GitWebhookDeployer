//git clone process.env.GIT_URL

require("dotenv").config();

var http = require("http");
var Handler = require("./classes/Handler.js");
var nathan = new Handler({
  LocalPath: "La-poissonnerie-de-Samy",
  remotePath:
    "/homez.954/lepoissoog/www/stage/Nathan_Laravel/La-poissonnerie-de-Samy",
  branch: "Nathan_Laravel",
  env: "dev"
});
var master = new Handler({
  LocalPath: "La-poissonnerie-de-Samy",
  remotePath: "/homez.954/lepoissoog/www/prod/La-poissonnerie-de-Samy",
  branch: "master",
  env: "prod"
});

var createHandler = require("github-webhook-handler");
var handler = createHandler({
  path: "/webhook",
  secret: process.env.GIT_SECRET
});

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      console.log("test");
      res.statusCode = 202;
      res.end("ok");
    });
  })
  .listen(7777);

handler.on("error", function(err) {
  console.error("Error:", err.message);
});

handler.on("push", function(event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  var branch = event.payload.ref.replace("refs/heads/", "");
  if (branch == "master") {
    master.run();
  }
  if (branch == "Nathan_Laravel") {
    nathan.run();
  }
});

handler.on("issues", function(event) {
  console.log(
    "Received an issue event for %s action=%s: #%d %s",
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  );
});
