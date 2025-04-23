//Breakdown update 4.18.2025

//fetch archived contracts (archived and original)
//search for original contracts
//filter contracts based on id
//handle request click (selected contract and contract id)
//handle pay/debit/due date changes
//handle edit form
//select a contract and request it be unarchived
//handle request by contractid
//when submitted, send the contract to the requested page

import "./Payroll.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInactiveContracts, requestContract } from "../../utils/api";
import EditForm from "../EditForm/EditForm";
import AdminSearchBar from "../AdminSearchBar/AdminSearchBar";

function RequestedContracts() {
  //state declarations
  const [archivedContracts, setArchivedContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editPayDate, setEditPayDate] = useState("");
  const [editDebitDate, setEditDebitDate] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [originalContracts, setOriginalContracts] = useState([]);

  //use effect
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

  //handlers
  const handleSearch = (term) => {
    if (!term.trim()) {
      setArchivedContracts(originalContracts);
      return;
    }
    // Filter from original contracts
    const filteredContracts = originalContracts.filter((contract) =>
      contract._id.includes(term)
    );
    setArchivedContracts(filteredContracts);
  };

  const handleRequestClick = (contractId) => {
    const contract = archivedContracts.find((c) => c._id === contractId);
    setSelectedContract(contract);
    setSelectedContractId(contractId);
    setShowConfirmation(true);
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

  //handle request should be exactly like archivecontract, just using different words and endpoint
  const handleRequest = async (contractId) => {
    const dateUpdates = {
      payDate: editPayDate,
      debitDate: editDebitDate,
      dueDate: editDueDate,
    };

    try {
      await requestContract(contractId, dateUpdates);

      const updatedRequestedData = await getInactiveContracts();
      setArchivedContracts(updatedRequestedData);

      console.log("Date values before request:", {
        editPayDate,
        editDebitDate,
        editDueDate,
      });

      setShowConfirmation(false);
      setIsFormVisible(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Error requesting contract:", error);
      // Use the dateUpdates object defined above
      console.error("Error details:", {
        contractId,
        dateUpdates,
      });
    }
  };

  //return section
  return (
    <div className="payroll" id="payroll">
      <div className="Contracts">
        <Link to="/payroll" className="Unarchived">
          Unarchived
        </Link>
        <Link to="/archived" className="Archived">
          Archived
        </Link>
      </div>
      <h2>Requested Payrolls</h2>
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
                      onClick={() => handleRequestClick(contract._id)}
                      className="button-secondary"
                    >
                      Request
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
            <p>Are you sure you want to request this?</p>
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
          handleRequest(selectedContractId);
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

export default RequestedContracts;
