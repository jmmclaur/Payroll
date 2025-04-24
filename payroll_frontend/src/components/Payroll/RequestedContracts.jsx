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
import { getRequestedContracts, unarchiveContract } from "../../utils/api";
import AdminSearchBar from "../AdminSearchBar/AdminSearchBar";

function RequestedContracts() {
  // State declarations
  const [requestedContracts, setRequestedContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [originalContracts, setOriginalContracts] = useState([]);

  // Fetch requested contracts
  useEffect(() => {
    const fetchRequestedContracts = async () => {
      try {
        const data = await getRequestedContracts();
        setRequestedContracts(data);
        setOriginalContracts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching requested contracts:", error);
        setIsLoading(false);
      }
    };

    fetchRequestedContracts();
  }, []);

  // Handlers
  const handleSearch = (term) => {
    if (!term.trim()) {
      setRequestedContracts(originalContracts);
      return;
    }
    const filteredContracts = originalContracts.filter((contract) =>
      contract._id.includes(term)
    );
    setRequestedContracts(filteredContracts);
  };

  const handleUnarchiveClick = (contractId) => {
    setSelectedContractId(contractId);
    setShowConfirmation(true);
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveContract(selectedContractId);
      const updatedData = await getRequestedContracts();
      setRequestedContracts(updatedData);
      setOriginalContracts(updatedData);
      setShowConfirmation(false);
      setSelectedContractId(null);
    } catch (error) {
      console.error("Error unarchiving contract:", error);
    }
  };

  return (
    <div className="payroll" id="payroll">
      <div className="Contracts">
        <Link to="/payroll" className="Unarchived">
          Active
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
            ) : requestedContracts.length === 0 ? (
              <tr>
                <td colSpan="8">No requested payroll cycles found</td>
              </tr>
            ) : (
              requestedContracts.map((contract) => (
                <tr key={contract._id}>
                  <td>{contract.payGroup}</td>
                  <td>{contract.frequency}</td>
                  <td>{contract.startDate.substring(0, 10)}</td>
                  <td>{contract.endDate.substring(0, 10)}</td>
                  <td>
                    {contract.requestedPayDate
                      ? contract.requestedPayDate.substring(0, 10)
                      : contract.payDate.substring(0, 10)}
                  </td>
                  <td>
                    {contract.requestedDebitDate
                      ? contract.requestedDebitDate.substring(0, 10)
                      : contract.debitDate.substring(0, 10)}
                  </td>
                  <td>
                    {contract.requestedDueDate
                      ? contract.requestedDueDate.substring(0, 10)
                      : contract.dueDate.substring(0, 10)}
                  </td>
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
            <p>Are you sure you want to unarchive this contract?</p>
            <div className="popup-buttons">
              <button onClick={handleUnarchive} className="button-primary">
                Yes
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="button-secondary"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestedContracts;
