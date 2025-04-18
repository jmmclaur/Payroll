import "./Payroll.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getInactiveContracts,
  unarchiveContract,
  getAllArchivedContracts,
  getAllUsersContracts,
} from "../../utils/api";
import EditForm from "../EditForm/EditForm";
import AdminSearchBar from "../AdminSearchBar/AdminSearchBar";

function ArchivedContracts() {
  //existing state declarations
  const [archivedContracts, setArchivedContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editPayDate, setEditPayDate] = useState("");
  const [editDebitDate, setEditDebitDate] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [originalContracts, setOriginalContracts] = useState([]);

  useEffect(() => {
    const fetchArchivedContracts = async () => {
      try {
        const archivedData = await getInactiveContracts();
        setArchivedContracts(archivedData);
        setOriginalContracts(archivedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching archived contracts:", error);
        setIsLoading(false);
      }
    };

    fetchArchivedContracts();
  }, []);

  // Modify the search handler
  const handleSearch = (term) => {
    console.log("Search term:", term);
    console.log("Original contracts:", originalContracts);
    console.log(
      "Contract IDs available:",
      originalContracts.map((contract) => contract._id)
    );
    if (!term.trim()) {
      // If search is empty, restore all contracts
      setArchivedContracts(originalContracts);
      return;
    }

    // Filter from original contracts
    const filteredContracts = originalContracts.filter(
      (contract) => contract._id.includes(term) // Remove toLowerCase since IDs are case-sensitive
    );
    setArchivedContracts(filteredContracts);

    // Log for debugging
    console.log("Searching for:", term);
    console.log("Found matches:", filteredContracts.length);
  };

  const handleUnarchiveClick = (contractId) => {
    const contract = archivedContracts.find((c) => c._id === contractId);
    setSelectedContract(contract);
    setSelectedContractId(contractId);
    setShowConfirmation(true);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handlePayDateChange = (e) => {
    setEditPayDate(e.target.value);
  };

  const handleDebitDateChange = (e) => {
    setEditDebitDate(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setEditDueDate(e.target.value);
  };

  const handleEditForm = () => {
    setShowConfirmation(false); // Hide confirmation popup
    setIsFormVisible(true); // Show edit form

    //take initial contract dates and add them to the edit form for updating
    if (selectedContract) {
      setEditPayDate(selectedContract.payDate.substring(0, 10));
      setEditDebitDate(selectedContract.debitDate.substring(0, 10));
      setEditDueDate(selectedContract.dueDate.substring(0, 10));
    }
  };

  const handleUnarchive = async (contractId) => {
    try {
      const dateUpdates = {
        payDate: editPayDate,
        debitDate: editDebitDate,
        dueDate: editDueDate,
      };

      await unarchiveContract(contractId, dateUpdates);

      // Refresh both active and archived lists
      const updatedArchivedData = await getInactiveContracts();
      setArchivedContracts(updatedArchivedData);

      setShowConfirmation(false);
      setIsFormVisible(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Error unarchiving contract:", error);
    }
  };

  return (
    <div className="payroll" id="payroll">
      <div className="Contracts">
        <Link to="/payroll" className="Unarchived">
          Unarchived
        </Link>
        <Link to="/requested" className="Requested">
          Requested
        </Link>
      </div>
      <h2>Archived Payrolls</h2>
      <AdminSearchBar onSearch={handleSearch} />
      <section className="payroll_list">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Pay Group</th>
              <th>Frequency</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Pay Date</th>
              <th>Debit Date</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8">Loading...</td>
              </tr>
            ) : archivedContracts.length === 0 ? (
              <tr>
                <td colSpan="8">No archived payroll cycles found</td>
              </tr>
            ) : (
              archivedContracts.map((contract) => (
                <tr
                  key={contract._id}
                  className={
                    contract._id === selectedContractId ? "selected-row" : ""
                  }
                >
                  <td>{contract.payGroup}</td>
                  <td>{contract.frequency}</td>
                  <td>{contract.startDate.substring(0, 10)}</td>
                  <td>{contract.endDate.substring(0, 10)}</td>
                  <td>{contract.payDate.substring(0, 10)}</td>
                  <td>{contract.debitDate.substring(0, 10)}</td>
                  <td>{contract.dueDate.substring(0, 10)}</td>
                  <td>
                    <button
                      onClick={() => handleUnarchiveClick(contract._id)}
                      className="button-secondary"
                    >
                      Unarchive
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      {showConfirmation && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to unarchive this?</p>
            <div className="popup-buttons">
              <button onClick={() => handleEditForm()}>Yes</button>
              <button onClick={() => setShowConfirmation(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      <EditForm
        isOpen={isFormVisible}
        payDate={editPayDate}
        debitDate={editDebitDate}
        dueDate={editDueDate}
        handlePayDate={handlePayDateChange}
        handleDebitDate={handleDebitDateChange}
        handleDueDate={handleDueDateChange}
        onSubmit={() => {
          handleUnarchive(selectedContractId);
          setIsFormVisible(false);
          setSelectedContract(null);
        }}
        onClose={() => {
          setIsFormVisible(false);
          setSelectedContract(null);
        }}
      />
    </div>
  );
}

//if yes selected, I want the editform component to pull up and the submit go through from there
//4.7.2025, moving <button onClick={() => handleUnarchive(selectedContractId)}> to the edit form which will finish this request
//update line 111 from above to <button onClick={() => handleEditForm()}>

//4.14.2025 getting a 404 error while retrieving archived contracts in the user and admin profiles
export default ArchivedContracts;
