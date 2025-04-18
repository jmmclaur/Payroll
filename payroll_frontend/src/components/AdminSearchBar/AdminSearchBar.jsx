//import "./Payroll.css";
import "./AdminSearchBar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInactiveContracts, unarchiveContract } from "../../utils/api";
import EditForm from "../EditForm/EditForm";

const AdminSearchBar = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch(""); // Optional: trigger search with empty string to reset results
  };

  return (
    <form onSubmit={handleSubmit} className="admin-search">
      <input
        type="text"
        placeholder="Search by user name or contract ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="admin-search__input"
        disabled={isLoading}
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="admin-search__clear"
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        className="admin-search__button"
        disabled={isLoading}
      >
        Search
      </button>
    </form>
  );
};

export default AdminSearchBar;
