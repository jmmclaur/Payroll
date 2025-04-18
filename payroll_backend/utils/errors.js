const { bad_request } = require("./errors/bad_request");
const { duplicate } = require("./errors/duplicate");
const { forbidden } = require("./errors/forbidden");
const { not_authorized } = require("./errors/not_authorized");
const { not_found } = require("./errors/not_found");
const { server_error } = require("./errors/server_error");

function handleErrors(err, next) {
  if (err.name === "Validation Error" || err.name === "CastError") {
    return next(new bad_request("Bad request"));
  }
  if (err.name === "Not Found Error") {
    return next(new not_found("Not found"));
  }
  if (err.code === 11000) {
    return next(new duplicate("Duplicate error"));
  }
  if (err.statusCode === 401) {
    return next(new not_authorized("Not authorized error"));
  }
  if (err.statusCode === 403) {
    return next(new forbidden("Forbidden error"));
  }
  return next(new server_error("Server error"));
}

module.exports = {
  handleErrors,
  bad_request: 400,
  duplicate: 409,
  forbidden: 403,
  not_authorized: 401,
  not_found: 404,
  server_error: 500,
};
