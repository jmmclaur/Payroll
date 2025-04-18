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

  //add some random sections for grid profile, include profile edit modal button
  return (
    <div className="profile">
      <section className="demo"></section>
      <section className="profile_sidebar">
        <div className="contract">
          <button className="header_clicks" onClick={handleContractClick}>
            Contract
          </button>
        </div>
        <div className="employment">
          <button className="header_clicks">Employment</button>
        </div>
        <div className="profile">
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
    </div>
  );
};
export default Profile;
