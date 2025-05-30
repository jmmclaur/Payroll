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
    const companyCode = req.user.companyCode;

    console.log("User data:", req.user);
    console.log("Company code being used:", req.user.companyCode);

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
      companyCode,
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
      companyCode,
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
//4.15.2025 I need to adjust this so admin can also get contracts, not just userId
//5.1.2025 when a contractId is request, how can I get that number sent to admin so they can search it in the search bar?
//admin needs access to all contractIds

const getContract = async (req, res) => {
  try {
    const { status, payGroup } = req.query; // Add payGroup to query parameters
    let query = {};

    // If admin and payGroup provided, filter by payGroup
    if (req.user.role === "admin" && payGroup) {
      query.payGroup = payGroup;
    }
    // If not admin, filter by user ID as before
    else if (req.user.role !== "admin") {
      query.owner = req.user._id;
    }

    // Add status filter if provided (keep your existing status logic)
    if (status) {
      switch (status) {
        case "active":
          query.processed = false;
          break;
        case "inactive":
          query.processed = true;
          break;
        case "requested":
          query.processed = true;
          query.unarchiveRequested = true;
          break;
      }
    }

    console.log("Query being executed:", query);
    const contracts = await Contract.find(query);
    res.status(200).json(contracts);
    console.log(`Found ${contracts.length} contracts matching criteria`);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving contracts",
      error: err.message,
    });
  }
};

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

    // First, find the contract without owner restriction
    let query = { _id: contractId };

    // Find the contract first
    const contract = await Contract.findOne(query);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // Create update query based on user role
    const updateQuery = { _id: contractId };
    // Only check owner if not admin
    if (req.user.role !== "admin") {
      updateQuery.owner = req.user._id;
    }

    const updatedContract = await Contract.findOneAndUpdate(
      updateQuery,
      {
        processed: false,
        payDate: contract.requestedPayDate || contract.payDate,
        debitDate: contract.requestedDebitDate || contract.debitDate,
        dueDate: contract.requestedDueDate || contract.dueDate,
        unarchiveRequested: false,
        requestedPayDate: null,
        requestedDebitDate: null,
        requestedDueDate: null,
      },
      { new: true }
    );

    if (!updatedContract) {
      return res.status(404).json({
        message:
          "Contract not found or you don't have permission to unarchive it",
      });
    }

    // schedule auto-archive for the unarchived contract
    scheduleContractArchive(updatedContract);

    res.status(200).json(updatedContract);
  } catch (err) {
    console.error("Error in unarchiveContract:", err);
    res.status(500).json({
      message: "Error unarchiving contract",
      error: err.message,
    });
  }
};

//REQUEST CONTRACT TO BE EDITED/UNARCHIVED //////////////////////////////////////////////////S
const requestContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user._id;
    const { payDate, debitDate, dueDate } = req.body; // Get the updated dates

    // Find contract and verify ownership
    const contract = await Contract.findOneAndUpdate(
      {
        _id: contractId,
        owner: userId, // Ensures users can only request their own contracts
        processed: true, // Only archived contracts can be requested
      },
      {
        unarchiveRequested: true,
        requestedPayDate: payDate, // to include requested dates on the requested page
        requestedDebitDate: debitDate,
        requestedDueDate: dueDate,
      },
      { new: true }
    );

    if (!contract) {
      return res.status(404).json({
        message:
          "Contract not found or you don't have permission to request this contract",
      });
    }

    console.log(
      `Contract ${contractId} requested for unarchiving by user ${userId}`
    );
    res.status(200).json(contract);
  } catch (err) {
    console.error("Error in requestContract:", err);
    res.status(500).json({
      message: "Error requesting contract unarchive",
      error: err.message,
    });
  }
};

//GET REQUESTED CONTRACT
const getRequestedContracts = async (req, res) => {
  try {
    let query = {
      processed: true,
      unarchiveRequested: true,
    };

    // If not admin, only show their own contracts
    if (req.user.role !== "admin") {
      query.owner = req.user._id;
    }

    const requestedContracts = await Contract.find(query)
      .select(
        "payGroup frequency startDate endDate payDate debitDate dueDate companyCode requestedPayDate requestedDebitDate requestedDueDate"
      )
      .sort({ payGroup: 1 }); // Optional: sort by payGroup

    res.status(200).json(requestedContracts);
  } catch (err) {
    console.error("Error in getRequestedContracts:", err);
    res.status(500).json({
      message: "Error retrieving requested contracts",
      error: err.message,
    });
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
  getRequestedContracts,
};
