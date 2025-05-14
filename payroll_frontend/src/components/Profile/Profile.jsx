import "./Profile.css";
import { Link } from "react-router-dom";
import ContractModal from "../ContractModal/ContractModal";

const Profile = ({
  name,
  company,
  handleDashboardClick,
  handlePayrollClick,
  activeModal,
  handleContractClick,
  handleLogin,
  closeActiveModal,
}) => {
  if (!name || !company) {
    console.log("Missing - name or company undefined");
  }

  return (
    <div className="profile">
      <section className="profile_sidebar">
        <div className="contract">
          <button className="header_clicks" onClick={handleContractClick}>
            Contract
          </button>
        </div>
        <div className="employment">
          <button className="header_clicks">Employment</button>
        </div>
        <div className="profile-btn">
          <button className="header_clicks">Profile</button>
        </div>
        <div className="pay-history">
          <button className="header_clicks">Pay History</button>
        </div>
        <div className="tafw">
          <button className="header_clicks">TAFW</button>
        </div>
        <div className="taxes-documents">
          <button className="header_clicks">Taxes & Documents</button>
        </div>
      </section>
      <section className="employee">
        <div>
          Employee Profile: Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div>
          Status: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div>
          Tabs: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div>
          Jobs: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </section>
    </div>
  );
};
export default Profile;
