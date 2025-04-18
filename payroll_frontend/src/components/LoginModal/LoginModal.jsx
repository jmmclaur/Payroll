import React, { useState } from "react";
import FormModal from "../FormModal/FormModal";

const LoginModal = ({
  activeModal,
  handleLogin,
  handleRegisterClick,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //new admin
    try {
      // Just pass email and password, let backend handle role verification
      await handleLogin(email.trim(), password.trim());
    } catch (error) {
      console.error("Login error:", error);
      // You might want to add error handling here
    }
  };

  return (
    <FormModal
      title="Login"
      buttonText="Login"
      isOpen={activeModal === "log-in"}
      onClose={onClose}
      onSubmit={handleSubmit}
      onLinkClick={handleRegisterClick}
    >
      <label className="modal_label">
        Email*{" "}
        <input
          type="email"
          name="email"
          className="modal_input"
          id="user_email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="modal_label">
        Password*{" "}
        <input
          type="password"
          name="password"
          className="modal_input"
          id="user_password"
          placeholder="Password"
          minLength="6"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </FormModal>
  );
};

export default LoginModal;
