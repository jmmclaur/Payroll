import React, { useContext, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { CurrentUserContext } from "../../utils/contexts/CurrentUserContext";
import "./ProfileEditModal.css"; // We'll create this next

const ProfileEditModal = ({
  closeActiveModal,
  activeModal,
  handleProfileEdit,
}) => {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [error, setError] = useState(""); // Add error state for validation

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError(""); // Clear error when user types
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user types
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    handleProfileEdit({ name, email }); // Send both name and email
    console.log("Changes saved.");
  };

  return (
    <FormModal
      title="Change profile data"
      buttonText="Save changes"
      isOpen={activeModal === "edit-profile"}
      onClose={closeActiveModal}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name*
        <input
          type="text"
          className="modal__input"
          id="profileName"
          placeholder="Enter your name"
          minLength="2"
          maxLength="50"
          required
          value={name}
          onChange={handleNameChange}
        />
      </label>

      <label className="modal__label">
        Email*
        <input
          type="email"
          className="modal__input"
          id="profileEmail"
          placeholder="Enter your email"
          required
          value={email}
          onChange={handleEmailChange}
        />
      </label>

      {error && <p className="modal__error">{error}</p>}
    </FormModal>
  );
};

export default ProfileEditModal;
