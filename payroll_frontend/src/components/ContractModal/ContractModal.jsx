import React, { useState } from "react";
import FormModal from "../FormModal/FormModal.jsx";

const ContractModal = ({
  activeModal,
  handleContract,
  handleLoginClick,
  onClose,
}) => {
  //paygroup
  const [payGroup, setPayGroup] = useState("");
  const handlePayGroup = (e) => {
    setPayGroup(e.target.value);
  };
  //frequency
  const [frequency, setFrequency] = useState("");
  const handleFrequency = (e) => {
    setFrequency(e.target.value);
  };
  //start
  const [startDate, setStartDate] = useState("");
  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };
  //end
  const [endDate, setEndDate] = useState("");
  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };
  //
  const [payDate, setPayDate] = useState("");
  const handlePayDate = (e) => {
    setPayDate(e.target.value);
  };
  //
  const [debitDate, setDebitDate] = useState("");
  const handleDebitDate = (e) => {
    setDebitDate(e.target.value);
  };
  //
  const [dueDate, setDueDate] = useState("");
  const handleDueDate = (e) => {
    setDueDate(e.target.value);
  };

  //submit
  const handleSubmit = (e) => {
    e.preventDefault();

    /* converting a string to a proper date object, learned something new!
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);
    const formattedPayDate = new Date(payDate);
    const formattedDebitDate = new Date(debitDate);
    const formattedDueDate = new Date(dueDate); */

    handleContract(
      payGroup,
      frequency,
      startDate, // Remove new Date()
      endDate, // Remove new Date()
      payDate, // Remove new Date()
      debitDate, // Remove new Date()
      dueDate, // Remove new Date()
      false
    );
  };

  return (
    <FormModal
      title="Contract"
      buttonText="Contract"
      isOpen={activeModal === "contract-btn"}
      onLinkClick={handleLoginClick}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="modal_label">
        Pay Group:
        <input
          type="text"
          className="modal_input"
          id="payGroup"
          placeholder="Pay Group"
          required
          value={payGroup}
          onChange={handlePayGroup}
        />
      </label>
      <label className="modal_label">
        Start Date:
        <input
          type="date"
          className="modal_input"
          id="startDate"
          placeholder="Start Date"
          required
          value={startDate}
          onChange={handleStartDate}
        />
      </label>
      <label className="modal_label">
        End Date:
        <input
          type="date"
          className="modal_input"
          id="endDate"
          placeholder="End Date"
          required
          value={endDate}
          onChange={handleEndDate}
        />
      </label>
      <div>
        Frequency:
        <select
          value={frequency}
          onChange={handleFrequency}
          className="modal_input"
        >
          <option value="">Select</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
          <option value="semimonthly">Semi-Monthly</option>
        </select>
      </div>

      <label className="modal_label">
        Pay Date:
        <input
          type="date"
          className="modal_input"
          id="payDate"
          placeholder="Pay Date"
          required
          value={payDate}
          onChange={handlePayDate}
        />
      </label>

      <label className="modal_label">
        Debit Date:
        <input
          type="date"
          className="modal_input"
          id="debitDate"
          placeholder="Debit Date"
          required
          value={debitDate}
          onChange={handleDebitDate}
        />
      </label>

      <label className="modal_label">
        Due Date:
        <input
          type="date"
          className="modal_input"
          id="dueDate"
          placeholder="Due Date"
          required
          value={dueDate}
          onChange={handleDueDate}
        />
      </label>
    </FormModal>
  );
};

export default ContractModal;
