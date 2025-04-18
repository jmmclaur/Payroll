import "./FormModal.css";

function FormModal({
  children,
  title,
  buttonText,
  isOpen,
  onSubmit,
  showLink,
  linktext,
  onLinkClick,
  onClose,
}) {
  return (
    <div className={isOpen ? `modal modal_opened` : `modal_closed`}>
      <div className="modal_container modal_form">
        <h2 className="modal_title">{title}</h2>
        <button onClick={onClose} className="modal_close"></button>
        <form className="modal_form" onSubmit={onSubmit}>
          {children}
          <div className="modal_actions">
            <button type="submit" className="modal_submit">
              {buttonText}
            </button>
            {showLink && (
              <span onClick={onLinkClick} className="modal_link">
                {linktext}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;
