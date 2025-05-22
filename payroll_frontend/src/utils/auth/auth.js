const baseUrl = "http://localhost:3001";
import { checkResponse } from "../api";

//creating auth for user roles
const auth = {
  isUser: false,
  isAdmin: false,
  token: null,

  register(name, email, password, company, companyCode) {
    return fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, company, companyCode }),
    }).then(checkResponse);
  },

  login(data) {
    console.log("Setting login data:", data);
    this.isUser = true;
    this.isAdmin = data.user.role === "admin";
    console.log("Is admin value:", this.isAdmin, "Role:", data.role);
    this.token = data.token;
    localStorage.setItem("jwt", data.token);
    localStorage.setItem("userRole", data.user.role); //to store the role in localstorage
    //localStorage.setItem("username", data.user.username);
    localStorage.setItem("companyCode", data.user.companyCode);
    console.log("LocalStorage after setting:", {
      // Add this
      role: localStorage.getItem("userRole"),
      token: localStorage.getItem("jwt"),
    });
  },
  logout() {
    this.isUser = false;
    this.isAdmin = false;
    this.token = null;
    localStorage.removeItem("jwt");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("companyCode");
  },

  checkToken() {
    const token = localStorage.getItem("jwt");
    const role = localStorage.getItem("userRole");
    if (token) {
      this.isUser = true;
      this.isAdmin = role === "admin";
      this.token = token;
      return true;
    }
    return false;
  },
};

/*
export function register(name, email, password, company, companyCode) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, company, companyCode }),
  }).then(checkResponse);
} */

export const login = (email, password) => {
  console.log("1. Login function called with email:", email);
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      console.log("2. Response received:", response.status);
      return checkResponse(response);
    })
    .then((data) => {
      if (data.token) {
        console.log("Login data received:", {
          role: data.user.role,
          token: data.token,
        });
        console.log("Auth state before setting:", {
          isUser: auth.isUser,
          isAdmin: auth.isAdmin,
        });
        auth.login(data);
        console.log(auth.isAdmin);
        console.log("Auth state after login:", {
          isUser: auth.isUser,
          isAdmin: auth.isAdmin,
          storedRole: localStorage.getItem("userRole"),
        });
      }
      return data;
    });
};

//CREATE CONTRACT
export const createContract = (
  payGroup,
  frequency,
  startDate,
  endDate,
  payDate,
  debitDate,
  dueDate
) => {
  console.log("1. Create contract:", payGroup);
  return fetch(`${baseUrl}/contracts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Add this line
    },
    body: JSON.stringify({
      payGroup,
      frequency,
      startDate,
      endDate,
      payDate,
      debitDate,
      dueDate,
    }),
  }).then((response) => {
    console.log("2. Response received:", response.status);
    return checkResponse(response);
  });
};

export default auth;
