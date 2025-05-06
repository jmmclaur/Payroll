import { useState, useEffect } from "react";
import {
  archiveContract,
  getInactiveContracts,
  getActiveContracts,
  unarchiveContract,
  getNotifications,
  markNotificationsAsRead,
} from "../../utils/api";

const AdminDashboard = () => {
  // state variables
  const [activeContracts, setActiveContracts] = useState([]);
  const [archivedContracts, setArchivedContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]); //add later

  // use effect
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch contracts and notifications in parallel
        const [archivedData, activeData, notificationsData] = await Promise.all(
          [getInactiveContracts(), getActiveContracts(), getNotifications()]
        );

        setArchivedContracts(archivedData);
        setActiveContracts(activeData);
        setNotifications(notificationsData);

        // Mark notifications as read when they're viewed
        if (notificationsData.length > 0) {
          const notificationIds = notificationsData.map(
            (notification) => notification._id
          );
          await markNotificationsAsRead(notificationIds);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleArchiveContract = async (contractId) => {
    try {
      await archiveContract(contractId);

      // Update both active and archived lists
      const [newActiveData, newArchivedData] = await Promise.all([
        getActiveContracts(),
        getInactiveContracts(),
      ]);

      setActiveContracts(newActiveData);
      setArchivedContracts(newArchivedData);
    } catch (error) {
      console.error("Error archiving contract:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/*Notifications Section */}
      <section className="notifications">
        <h3>Notifications</h3>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`notification ${
                    notification.isRead ? "read" : "unread"
                  }`}
                >
                  <span className="notification-message">
                    {notification.message}
                  </span>
                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Active Contracts Section */}
      <section className="active-contracts">
        <h3>Active Contracts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Pay Group</th>
              <th>Frequency</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Pay Date</th>
              <th>Debit Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeContracts.map((contract) => (
              <tr key={contract._id}>
                <td>{contract.payGroup}</td>
                <td>{contract.frequency}</td>
                <td>{contract.startDate.substring(0, 10)}</td>
                <td>{contract.endDate.substring(0, 10)}</td>
                <td>{contract.payDate.substring(0, 10)}</td>
                <td>{contract.debitDate.substring(0, 10)}</td>
                <td>{contract.dueDate.substring(0, 10)}</td>
                <td>
                  <button onClick={() => handleArchiveContract(contract._id)}>
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Archived Contracts Section */}
      <section className="archived-contracts">
        <h3>Archived Contracts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Pay Group</th>
              <th>Frequency</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Pay Date</th>
              <th>Debit Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {archivedContracts.map((contract) => (
              <tr key={contract._id}>
                <td>{contract.payGroup}</td>
                <td>{contract.frequency}</td>
                <td>{contract.startDate.substring(0, 10)}</td>
                <td>{contract.endDate.substring(0, 10)}</td>
                <td>{contract.payDate.substring(0, 10)}</td>
                <td>{contract.debitDate.substring(0, 10)}</td>
                <td>{contract.dueDate.substring(0, 10)}</td>
                <td>
                  <button
                    onClick={() => handleUnarchiveButtonClick(contract._id)}
                  >
                    Request Unarchive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <EditForm
        isOpen={isFormVisible}
        payDate={editPayDate}
        debitDate={editDebitDate}
        dueDate={editDueDate}
        handlePayDate={handlePayDateChange}
        handleDebitDate={handleDebitDateChange}
        handleDueDate={handleDueDateChange}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setIsFormVisible(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default AdminDashboard;

//4.9.2025 admin user was successfully added to mongodb
//next is to add roles: admin and user
//find a way to get archived/unarhcived
