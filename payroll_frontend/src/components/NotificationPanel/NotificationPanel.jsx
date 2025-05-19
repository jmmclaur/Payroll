import { useState, useEffect } from "react";
/*import {
  getNotifications,
  markNotificationsAsRead,
  createNotification,
} from "../../utils/auth/auth"; */
import {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
} from "../../utils/api";
import "./NotificationPanel.css";

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        console.log("Auth token:", localStorage.getItem("jwt"));
        console.log("User role:", localStorage.getItem("userRole"));
        console.log("Company code:", localStorage.getItem("companyCode"));
        const data = await getNotifications();
        console.log("Raw data structure:", JSON.stringify(data, null, 2));
        console.log("Response from getNotifications:", data);

        setNotifications(
          Array.isArray(data.notifications) ? data.notifications : []
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  //creating a test notification to see if it appears on admin's screen
  const handleCreateTestNotification = async () => {
    try {
      const companyCode = localStorage.getItem("companyCode");
      console.log("Creating test notification for company:", companyCode);
      await createNotification(companyCode, "test-contract-id");
      // Refresh notifications after creating a new one
      const data = await getNotifications();
      setNotifications(
        Array.isArray(data.notifications) ? data.notifications : []
      );
    } catch (error) {
      console.error("Error creating test notification:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationsAsRead([notificationId]);
      // Update the local state to reflect the change
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: "read" }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="notification-panel">
      <h3>Notifications</h3>
      <button onClick={handleCreateTestNotification}>
        Create Test Notification
      </button>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`notification-item ${
                notification.status === "unread" ? "unread" : ""
              }`}
            >
              <p>{notification.message}</p>
              {notification.status === "unread" && (
                <button onClick={() => handleMarkAsRead(notification._id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationPanel;
