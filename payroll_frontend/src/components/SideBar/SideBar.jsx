import "./SideBar.css";
import { CurrentUserContext } from "../../utils/contexts/CurrentUserContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function SideBar({ handleDashboardClick, handlePayrollClick, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen); // This will toggle between true and false
  };

  //I want the sidebar to close when you
  const handleEscClose = (e) => {
    if (e.key === "Escape") {
      closeActiveModal();
    }
  };

  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="sidebar">
      {/* toggle changes icon based on sidebar state */}
      <span onClick={toggleNav}>{isOpen ? "✕" : "☰"}</span>
      <div
        id="mySidenav"
        className={`sidenav ${isOpen ? "sidenav-open" : "sidenav-closed"}`}
      >
        <Link to="/">
          <button className="header_clicks" onClick={handleDashboardClick}>
            Dashboard
          </button>
        </Link>
        <Link to="/payroll">
          <button
            className="header_clicks divider-top"
            onClick={handlePayrollClick}
          >
            Payroll
          </button>
        </Link>
        <button className="time">Time</button>
        <button className="team divider-top">Team</button>
        <button className="benefits">Benefits</button>
        <button className="taxes divider-top">Taxes</button>
        <button className="reports">Reports</button>
        <button className="documents">Documents</button>
        <button className="settings divider-top">Settings</button>
        <button className="logout divider-top" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
