/* create a table showing pay group, frequency, start/end dates, pay date, debit date, due date */

import "./Payroll.css";
import { Link } from "react-router-dom";
import {
  getContract,
  getActiveContracts,
  archiveContract,
  getInactiveContracts,
  unarchiveContract,
} from "../../utils/api";
import { useState, useEffect } from "react"; //to create a perfect flow with these react hooks
//use state allows you to trigger a component when it's updated, wakes it up from slumber
//use effect triggers the data fetch when the component loads

function Payroll({
  handlePayGroup,
  handleFrequency,
  handleStartDate,
  handleEndDate,
  handlePayDate,
  handleDebitDate,
  handleDueDate,
}) {
  const [contracts, setContracts] = useState([]);
  //contracts is where data is stored
  //setContracts is how we update it, a function
  //[] is the initial value
  const [isLoading, setIsLoading] = useState(true);
  const [archivedContracts, setArchivedContracts] = useState([]);

  //new useEffect
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const [activeData, archivedData] = await Promise.all([
          getActiveContracts(),
          getInactiveContracts(),
        ]);
        setContracts(activeData);
        setArchivedContracts(archivedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handleArchive = async (contractId) => {
    try {
      await archiveContract(contractId);
      // Refresh both tables
      const [activeData, archivedData] = await Promise.all([
        getActiveContracts(),
        getInactiveContracts(),
      ]);
      setContracts(activeData);
      setArchivedContracts(archivedData);
    } catch (error) {
      console.error("Error archiving contract:", error);
      alert("You don't have permission to archive this contract");
    }
  };

  const handleUnarchive = async (contractId) => {
    try {
      await unarchiveContract(contractId);
      // Refresh both tables
      const [activeData, archivedData] = await Promise.all([
        getActiveContracts(),
        getInactiveContracts(),
      ]);
      setContracts(activeData);
      setArchivedContracts(archivedData);
    } catch (error) {
      console.error("Error unarchiving contract:", error);
    }
  };

  return (
    <div className="payroll" id="payroll">
      <div className="Contracts">
        <Link to="/archived" className="Archived">
          Archived
        </Link>
        <Link to="/requested" className="Requested">
          Requested
        </Link>
      </div>
      <h2>Active Payrolls</h2>
      <p>HR+/Customer HR+ Users</p>
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
                <td colSpan="7">Loading...</td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan="7">No payroll cycles found</td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr key={contract._id}>
                  <td>{contract.payGroup}</td>
                  <td>{contract.frequency}</td>
                  <td>{contract.startDate.substring(0, 10)}</td>
                  <td>{contract.endDate.substring(0, 10)}</td>
                  <td>{contract.payDate.substring(0, 10)}</td>
                  <td>{contract.debitDate.substring(0, 10)}</td>
                  <td>{contract.dueDate.substring(0, 10)}</td>
                  <button
                    onClick={() => handleArchive(contract._id)}
                    className="archive-button"
                  >
                    Archive
                  </button>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

//colSpan allows you to set the number of columns, like merging cells in excel
//within td sections I'd do i.e. data.payGroup, data.frequency, data.startDate,
export default Payroll;
