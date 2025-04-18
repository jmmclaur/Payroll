//maybe import roles into users? 4.15.2025
//import useRole from "../../payroll_frontend/src/components/Role/Role";

const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/token");
const User = require("../models/user");
const {
  bad_request,
  not_found,
  server_error,
  duplicate,
} = require("../utils/errors");

//CREATE
const createUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can't be empty" });
  }

  //should I add a role here and in the schema?
  const { name, email, password, company, companyCode } = req.body;

  try {
    // Check for existing user first
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(duplicate).send({
        message: "User with this email already exists",
      });
    }

    // Hash the password to add security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      company,
      companyCode,
    });

    // Remove password from response, conceals it
    const { password: pwd, ...userWithoutPassword } = newUser.toObject();
    return res.status(201).send({ data: userWithoutPassword });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(bad_request).send({ message: "Invalid data" });
    }
    if (err.code === 11000) {
      return res.status(duplicate).send({
        message: "User with this email already exists",
      });
    }
    return res.status(server_error).send({
      message: "An error has occurred on the server",
    });
  }
};

//RETRIEVE USERS
const login = (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with:", { email, password });
  if (!email || !password) {
    return res.status(bad_request).send({
      message: "The email and password fields are required",
    });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Handle successful login
      console.log("User found:", user);
      // Generate token
      const token = createToken({ _id: user._id });
      // Remove password from response
      const { password: pwd, ...userWithoutPassword } = user.toObject();
      res.status(200).send({ user: userWithoutPassword, token });
    })
    .catch((err) => {
      // Handle login error
      console.log("Login error:", err.message);
      res.status(401).send({ message: err.message });
    });
};

//RETRIEVE USER BY ID
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(not_found).send({ message: "Item id not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res
      .status(server_error)
      .send({ error: "Could not find user from getCurrentUser controller" });
  }
};

//UPDATE
const modifyUserData = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
    };
    const updateUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      const error = new Error("User id not found from modifyUserData");
      error.statusCode = not_found;
      throw error;
    });
    return res.status(200).send(updateUser);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(error).send({ message: error.message });
    }
    if (error.name === "Validation Error") {
      return res
        .status(bad_request)
        .send({ message: "provided data is incorrect" });
    }
    return res
      .status(server_error)
      .send({ error: "Could not update user from modifyUserData" });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  modifyUserData,
};
