import React from "react";
import NotificationPanel from "../NotificationPanel/NotificationPanel";
import "./AdminDashboard.css"; // We'll need this for styling

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__content">
        <h1>Welcome to the Dashboard</h1>
        {/* We'll add your home page content here later */}
      </div>
      <NotificationPanel />
    </div>
  );
}

export default AdminDashboard;
