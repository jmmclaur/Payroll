const axios = require("axios");

exports.homeRoutes = (req, res) => {
  //make a GET request to api/users and get the promise w/ .then
  axios
    .get("http://localhost:3001/api/users")
    .then(function (response) {
      //render the file via a callback function
      res.render("index", { users: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update_user = (req, res) => {
  axios
    .get("http://localhost:3000/api/users", {
      params: { id: req.query.id },
    })
    .then(function (userdata) {
      res.render("update_user", { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

//PAYCYCLES
exports.homeRoutes = (req, res) => {
  axios
    .get("http://localhost:3001/api/payCycles")
    .then(function (response) {
      res.render("index", { payCycles: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.add_payroll = (req, res) => {
  res.render("add_payroll");
};

exports.update_payroll = (req, res) => {
  axios
    .get("http://localhost:3000/api/payCycles", {
      params: { id: req.query.id },
    })
    .then(function (userdata) {
      res.render("update_payroll", { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
};
