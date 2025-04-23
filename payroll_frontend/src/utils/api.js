const baseUrl = "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
}

//USER API
const getUserInfo = () => {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`, //checks local storage for jwt token
    },
  }).then(checkResponse);
};

const updateUserInfo = async (name) => {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`, //same as above, make sure it's the right user
    },
    body: JSON.stringify({ name }),
  });
  return checkResponse(res);
};

//PAYCYCLE API
async function createContract(
  payGroup,
  frequency,
  startDate,
  endDate,
  payDate,
  debitDate,
  dueDate,
  processed
) {
  return fetch(`${baseUrl}/payCycles`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({
      payGroup: String(payGroup),
      frequency: String(frequency),
      startDate: String(startDate),
      endDate: String(endDate),
      payDate: String(payDate),
      debitDate: String(debitDate),
      dueDate: String(dueDate),
      processed: processed === "false" ? false : true, // Convert string to boolean
    }),
  }).then(checkResponse);
}

const getContract = () => {
  return fetch(`${baseUrl}/payCycles/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then(checkResponse);
};

const getActiveContracts = () => {
  return fetch(`${baseUrl}/payCycles/active`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then(checkResponse);
};

const getInactiveContracts = () => {
  return fetch(`${baseUrl}/payCycles/inactive`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then(checkResponse);
};

//new archivecontract
const archiveContract = async (contractId) => {
  const token = localStorage.getItem("jwt"); //verify that jwt exists
  if (!token) {
    return Promise.reject("No authorization token found. Please log in.");
  }

  try {
    const response = await fetch(`${baseUrl}/payCycles/${contractId}/archive`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Enhanced error handling
    if (response.status === 403) {
      throw new Error("You don't have permission to archive this contract");
    } else if (response.status === 401) {
      throw new Error("Please log in to perform this action");
    } else if (response.status === 404) {
      throw new Error("Contract not found");
    }

    return checkResponse(response);
  } catch (error) {
    return Promise.reject(
      error.message || "An error occurred while archiving the contract"
    );
  }
};

const unarchiveContract = (contractId, dateUpdates) => {
  return fetch(`${baseUrl}/payCycles/${contractId}/unarchive`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify(dateUpdates), // send the updated dates
  }).then(checkResponse);
};

const requestContract = (contractId, dateUpdates) => {
  return fetch(`${baseUrl}/payCycles/${contractId}/requested`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify(dateUpdates),
  })
    .then(async (response) => {
      if (!response.ok) {
        // Get the error message from the server
        const errorData = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorData}`
        );
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Detailed error:", error);
      throw error;
    });
};

// Admin: Get all users' contracts
const getAllUsersContracts = () => {
  return fetch(`${baseUrl}/admin/payCycles/all`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then(checkResponse);
};

// Admin: Modify any contract
const modifyContract = (contractId, updates) => {
  return fetch(`${baseUrl}/admin/payCycles/${contractId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify(updates),
  }).then(checkResponse);
};

// Admin: Get all archived contracts
const getAllArchivedContracts = () => {
  return fetch(`${baseUrl}/admin/payCycles/archived`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then(checkResponse);
};

//Notification requests
const createUnarchiveRequest = (contractId) => {
  return fetch(`${baseUrl}/admin/requests/unarchive`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({ contractId }),
  }).then(checkResponse);
};

const getUnarchiveRequests = () => {
  return fetch(`${baseUrl}/admin/requests/unarchive`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  }).then(checkResponse);
};

const handleUnarchiveRequest = (requestId, status) => {
  return fetch(`${baseUrl}/admin/requests/unarchive/${requestId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({ status }),
  }).then(checkResponse);
};

export {
  checkResponse,
  getUserInfo,
  updateUserInfo,
  createContract,
  getContract,
  getActiveContracts,
  getInactiveContracts,
  archiveContract,
  unarchiveContract,
  requestContract,
  getAllUsersContracts,
  modifyContract,
  getAllArchivedContracts,
  createUnarchiveRequest,
  getUnarchiveRequests,
  handleUnarchiveRequest,
};
