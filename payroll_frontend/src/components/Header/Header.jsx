import { useContext, useState } from "react";
import "./Header.css";
import { CurrentUserContext } from "../../utils/contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import ProfileEditModal from "../ProfileEditModal/ProfileEditModal";

function Header({
  handleRegisterClick,
  handleLoginClick,
  isLoggedIn,
  handleProfileEditModal,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <header>
      <nav className="header">
        {isLoggedIn ? (
          <>
            <Link className="header_link" to="/profile">
              <div className="header_user">
                <p className="header_username">Profile: {currentUser?.name}</p>
              </div>
            </Link>
            <button className="profile_edit" onClick={handleProfileEditModal}>
              Edit Profile
            </button>
          </>
        ) : (
          <div className="header_auth">
            <button className="header_clicks" onClick={handleRegisterClick}>
              Register
            </button>
            <button className="header_clicks" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
export default Header;
