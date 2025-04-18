import "./EditForm.css";

function EditForm({
  isOpen,
  onSubmit,
  onClose,
  payDate,
  debitDate,
  dueDate,
  handlePayDate,
  handleDebitDate,
  handleDueDate,
}) {
  return (
    isOpen && (
      <div className="modal_overlay">
        <div className="modal_content">
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

          <div className="modal_actions">
            <button onClick={onSubmit}>Update</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditForm;
