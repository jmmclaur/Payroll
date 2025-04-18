const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name, company, cc, email, password
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name must be no longer than 50 characters"],
  },
  company: {
    type: String,
    required: [true, "The company name is required"],
    minlength: [2, "Company name must be at least 2 characters long"],
    maxlength: [50, "Company name must be no longer than 50 characters"],
  },
  companyCode: {
    type: String,
    required: [true, "The company code is required"],
    minlength: [2, "Company code must be at least 2 characters long"],
    maxlength: [30, "Company code must be no longer than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "The email field is required"],
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log("Found user:", user ? "yes" : "no"); // Add this to help identify stuff
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        console.log("Password match:", isMatch); // looking for a password in the system
        if (!isMatch) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
