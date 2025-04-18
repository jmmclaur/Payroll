const baseUrl = "http://localhost:3001";
import { checkResponse } from "../api";

export function register(name, email, password, company, companyCode) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, company, companyCode }),
  }).then(checkResponse);
}

export const login = (email, password) => {
  console.log("1. Login function called with email:", email);
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    console.log("2. Response received:", response.status);
    return checkResponse(response);
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

//roles ///////////////////
/*
export const isAuthenticated = (user) => !!user;
export const isAllowed = (user, rights) => {
  rights.some((right) => user.rights.includes(right));
};
export const hasRole = (user, roles) => {
  roles.some((role) => user.roles.includes(role));
}; */
