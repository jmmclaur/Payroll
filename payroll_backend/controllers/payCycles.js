const Contract = require("../models/payCycle");

//set up the archive timer for whenever a contract is created
function scheduleContractArchive(contract) {
  const dueDate = new Date(contract.dueDate);
  dueDate.setHours(23, 59, 0, 0); // Sets to 23:59:00
  console.log("Contract will be archived at:", dueDate);
  const now = new Date();
  const timeUntilDue = dueDate.getTime() - now.getTime();

  if (timeUntilDue > 0) {
    setTimeout(async () => {
      try {
        await Contract.findOneAndUpdate(
          { _id: contract._id, processed: false },
          { processed: true }
        );
        console.log(
          `Contract ${contract._id} automatically archived at due date`
        );
      } catch (error) {
        console.error("Error auto-archiving contract:", error);
      }
    }, timeUntilDue);
  }
}

const createContract = async (req, res) => {
  try {
    console.log("1. Received request body:", req.body);
    console.log("2. User ID from auth:", req.user._id);
    // Get data from request body
    const {
      payGroup,
      frequency,
      startDate,
      endDate,
      payDate,
      debitDate,
      dueDate,
      processed,
    } = req.body;

    const userId = req.user._id; // access user id from auth middleware

    console.log("3. About to create contract with data:", {
      payGroup,
      frequency,
      startDate,
      endDate,
      payDate,
      debitDate,
      dueDate,
      processed,
      owner: userId,
    });
    // Create new contract ///////////////////////////////////////////////////////////////////////
    const newContract = await Contract.create({
      payGroup,
      frequency,
      startDate,
      endDate,
      payDate,
      debitDate,
      dueDate,
      processed: false, //set as false for new contracts
      owner: userId, // Associate the contract with specific user
    });

    // schedule auto-archive
    scheduleContractArchive(newContract);

    console.log("4. Created contract:", newContract);
    // Send successful response
    res.status(201).json(newContract);
  } catch (err) {
    // Handle errors
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating contract", error: err.message });
  }
};

//RETRIEVE ALL/////////////////////////////////////////////////////////////////////////
//4.15.2025 I need to adjust this so admin can also get contracts, not juse userId

//new getContract, still getting 0 matches when searching for contractId
const getContract = async (req, res) => {
  try {
    // Create base query object
    let query = {};

    // If not admin, filter by user ID
    if (req.user.role !== "admin") {
      query.owner = req.user._id;
    }

    // Add status filter if specified
    if (req.query.status === "active") {
      query.processed = false;
    } else if (req.query.status === "archived") {
      query.processed = true;
    }

    const contracts = await Contract.find(query);
    res.status(200).json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving contracts",
      error: err.message,
    });
  }
};

/* original getContract
const getContract = async (req, res) => {
  try {
    // Get the user id from the auth middleware
    const userId = req.user._id; //changed from contractId to userId

    // Create base query object for user's contracts
    const query = { owner: userId }; //changed from owner: contractId to userId

    // filter status of query parameters
    if (req.query.status === "active") {
      query.processed = false;
    } else if (req.query.status === "archived") {
      query.processed = true;
    }
    // If no status listed, get all contracts (no additional filter needed)

    // Find contracts based on query
    const contracts = await Contract.find(query);

    // Send successful response
    res.status(200).json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving contracts",
      error: err.message,
    });
  }
}; */

//RETRIEVE ACTIVE CONTRACTS ///////////////////////////////////////////////////////////////////////

//new
const getActiveContracts = async (req, res) => {
  try {
    console.log("User making request:", req.user);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create base query
    let query = {
      processed: false,
      dueDate: { $gte: today },
    };

    // Add owner filter only if not admin
    if (req.user.role !== "admin") {
      query.owner = req.user._id;
    }

    const activeContracts = await Contract.find(query);
    console.log("Active contracts found:", activeContracts);

    // Update background task should also respect admin status
    let updateQuery = {
      processed: false,
      dueDate: { $lt: today },
    };
    if (req.user.role !== "admin") {
      updateQuery.owner = req.user._id;
    }

    Contract.updateMany(updateQuery, { processed: true }).exec();

    res.status(200).json(activeContracts);
  } catch (err) {
    console.error("Error in getActiveContracts:", err);
    res.status(500).json({
      message: "Error retrieving active contracts",
      error: err.message,
    });
  }
};

/*original plus a couple new things
const getActiveContracts = async (req, res) => {
  try {
    console.log("User making request:", req.user);
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //start new //////////
    // Create base query
    let query = {
      processed: false,
      dueDate: { $gte: today },
    };
    // Add owner filter only if not admin
    if (req.user.role !== "admin") {
      query.owner = req.user._id;
    }
    //end new //////////

    // single query to get all active contracts
    // combine all our conditions into one query
    const activeContracts = await Contract.find(
      query
      //owner: userId,
      //processed: false,
      //dueDate: { $gte: today },
    );

    console.log("Active contracts found:", activeContracts);

    // Update any contracts whose due date has passed (in the background)
    Contract.updateMany(
      {
        owner: userId,
        processed: false,
        dueDate: { $lt: today },
      },
      {
        processed: true,
      }
    ).exec(); // run in background

    res.status(200).json(activeContracts);
  } catch (err) {
    console.error("Error in getActiveContracts:", err);
    res.status(500).json({
      message: "Error retrieving active contracts",
      error: err.message,
    });
  }
}; */

//RETRIEVE INACTIVE CONTRACTS //////////////////////////////////////////////////////////////////////

// original getInactiveContracts 4.15.2025
const getInactiveContracts = async (req, res) => {
  try {
    // Get the user ID from the auth middleware
    const userId = req.user._id;

    //start new ///////
    // Create base query
    let query = {
      processed: true,
    };
    // Add owner filter only if not admin
    if (req.user.role !== "admin") {
      query.owner = req.user._id;
    }
    //end new ///////

    // Find only archived contracts for this user
    const inactiveContracts = await Contract.find(
      query
      //owner: userId,
      //processed: true, // inactive contracts
    );

    // Send successful response
    res.status(200).json(inactiveContracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving inactive contracts",
      error: err.message,
    });
  }
};

//UPDATE ARCHIVE CONTRACT //////////////////////////////////////////////////////////////////////////
const archiveContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user._id;

    console.log("Attempting to archive contract:", {
      contractId,
      userId,
    });

    // Users can only archive their own contracts
    const query = {
      _id: contractId,
      owner: userId, // This ensures users can only modify their own contracts
    };

    console.log("Query being used:", query);

    const updatedContract = await Contract.findOneAndUpdate(
      query,
      { processed: true },
      { new: true }
    );

    console.log("Updated contract result:", updatedContract);

    if (!updatedContract) {
      return res.status(404).json({
        message:
          "Contract not found or you don't have permission to archive it",
      });
    }

    res.status(200).json(updatedContract);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error archiving contract",
      error: err.message,
    });
  }
};

//UPDATE UNARCHIVE CONTRACT ///////////////////////////////////////////////////////////////////////
// >> check the box > popup to confirm > move payroll to upcoming page (should be top of the list)

const unarchiveContract = async (req, res) => {
  //retrieve specific contract id to unarchive
  //update contract processed status to false
  //return updated contract

  try {
    const { contractId } = req.params;
    const userId = req.user._id;
    const { payDate, debitDate, dueDate } = req.body; // Get the updated dates from request body

    const updatedContract = await Contract.findOneAndUpdate(
      { _id: contractId, owner: userId }, // Find this contract
      {
        processed: false,
        payDate: payDate || undefined, // Only update if provided
        debitDate: debitDate || undefined,
        dueDate: dueDate || undefined,
      },
      { new: true } // Return updated document
    );

    if (!updatedContract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // schedule auto-archive for the unarchived contract
    scheduleContractArchive(updatedContract);

    res.status(200).json(updatedContract);
  } catch (err) {
    console.error("Error in unarchiveContract:", err);
    res.status(500).json({
      message: "Error unarchiving contract",
      error: err.message,
      details:
        "There was a problem processing your request to unarchive the contract",
    });
  }
};

//REQUEST CONTRACT TO BE EDITED/UNARCHIVED //////////////////////////////////////////////////S
const requestContract = async (req, res) => {
  try {
    // Regular users can request unarchive
    const contract = await PayCycle.findByIdAndUpdate(
      req.params.contractId,
      { unarchiveRequested: true },
      { new: true }
    );

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//DELETE CONTRACT (EVENTUALLY ADD THIS)

module.exports = {
  createContract, //CREATE
  getContract, //RETRIEVE
  getActiveContracts, //RETRIEVE
  getInactiveContracts, //RETRIEVE
  archiveContract, //UPDATE
  unarchiveContract, //UPDATE
  requestContract,
};
