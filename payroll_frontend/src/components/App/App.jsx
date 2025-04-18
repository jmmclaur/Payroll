import { useState, useEffect, useCallback } from "react";
import "../App/App.css";

import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ArchivedContracts from "../Payroll/ArchivedContracts";
import AdminSearchBar from "../AdminSearchBar/AdminSearchBar";
import Profile from "../Profile/Profile";
import ProfileEditModal from "../ProfileEditModal/ProfileEditModal";
import ContractModal from "../ContractModal/ContractModal";
import Payroll from "../Payroll/Payroll";
import LoginModal from "../LoginModal/LoginModal";
import Header from "../Header/Header";
import Main from "../Main/Main";
import RegisterModal from "../RegisterModal/RegisterModal";
import Sidebar from "../SideBar/SideBar";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { CurrentUserContext } from "../../utils/contexts/CurrentUserContext";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import * as auth from "../../utils/auth/auth";
import * as api from "../../utils/api";

function App() {
  //arrays
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    name: "",
  });
  const [currentContract, setCurrentContract] = useState({
    _id: "",
    name: "",
  });
  const navigate = useNavigate();

  //simple functions
  const handleRegisterClick = () => {
    setActiveModal("sign-up");
  };
  const handleLoginClick = () => {
    setActiveModal("log-in");
  };
  const handlePayrollClick = () => {
    setActiveModal("payroll-list");
  };
  const handleDashboardClick = () => {
    setActiveModal("dashboard-btn");
  };
  const handleContractClick = () => {
    setActiveModal("contract-btn");
  };
  const handleEditClick = () => {
    setActiveModal("edit-profile");
  };
  const closeActiveModal = () => {
    setActiveModal("");
  };

  //complex functions
  const handleLogout = () => {
    navigate("/");
    setIsLoggedIn(false);
    setCurrentUser({});
  };

  //forms
  const handleRegistration = (name, email, password, company, companyCode) => {
    auth
      .register(name, email, password, company, companyCode)
      .then((data) => {
        if (data.user) {
          setCurrentUser({
            name: data.user.name,
          });
          navigate("/profile");
        }
      })
      .then(() => {
        closeActiveModal();
      })
      .catch((error) => console.error(error));
  };

  const handleLogin = (email, password, isAdmin) => {
    auth
      .login(email, password, isAdmin)
      .then((data) => {
        console.log("After login, data received:", data);
        // Add this line to save the token
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        return api.getUserInfo(data);
      })
      .then((userData) => {
        console.log("After getUserInfo, userData received:", userData);

        if (userData != null) {
          setCurrentUser({
            name: userData.name,
            _id: userData._id,
            //role: userData.role,
          });
          closeActiveModal();
          navigate("/profile");
        } else {
          console.log("userData is null");
        }
      })
      .catch((error) => {
        console.error("Error in login process:", error);
      });
  };

  const handleProfileEdit = (data) => {
    api
      .updateUserInfo(data.username, data.email)
      .then((res) => {
        if (res.username) {
          console.log("Profile updated successfully", res);
          setCurrentUser({
            ...currentUser, // Keep existing user data
            username: res.username,
            email: res.email,
          });
          closeActiveModal();
        }
      })
      .catch((error) => console.error(error));
  };

  const handleContract = (
    payGroup,
    frequency,
    startDate,
    endDate,
    payDate,
    debitDate,
    dueDate,
    processed
  ) => {
    api
      .createContract(
        payGroup,
        frequency.toLowerCase(),
        startDate,
        endDate,
        payDate,
        debitDate,
        dueDate,
        processed
      )
      .then((data) => {
        if (data.contract) {
          console.log("Contract created successfully:", data.contract);
          setCurrentContract({
            contract: data.contract,
          });
          navigate("/contracts");
        }
        closeActiveModal();
      })
      .catch((error) => console.error(error));
  };

  //GET CONTRACT
  const getContract = (payGroup) => {
    auth
      .current(payGroup)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        return api.getContract(data);
      })
      .then((userData) => {
        if (userData != null) {
          setCurrentContract({
            payGroup: userData.paygroup,
            _id: userData._id,
          });
          closeActiveModal();
          navigate("/payroll");
        } else {
          console.log("userData is null");
        }
      });
  };

  //use state to monitor state changes
  useEffect(() => {
    console.log("Auth state changed:", { isLoggedIn, currentUser });
  }, [isLoggedIn, currentUser]);

  //profile

  //sidebar
  /* Set the width of the side navigation to 250px */
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  //useEffect section
  //**add an escape here
  useEffect(() => {
    if (!activeModal) return;
    function handleClickOffModal(event) {
      if (event.target.classList.contains("modal")) {
        closeActiveModal();
      }
    }
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeActiveModal();
      }
    };
    document.addEventListener("click", handleClickOffModal); //
    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("click", handleClickOffModal);
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  //page setup
  return (
    <div className="body">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page_content">
          <Header
            handleRegisterClick={handleRegisterClick}
            handleLoginClick={handleLoginClick}
            isLoggedIn={isLoggedIn}
            handleProfileEditModal={handleEditClick}
          />
          <Sidebar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Main isLoggedIn={isLoggedIn} />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  {currentUser ? (
                    <Profile
                      isLoggedIn={isLoggedIn}
                      setIsLoggedIn={setIsLoggedIn}
                      name={currentUser.name}
                      handleLogout={handleLogout}
                      handleDashboardClick={handleDashboardClick}
                      handleContractClick={handleContractClick}
                      handlePayrollClick={handlePayrollClick}
                      activeModal={activeModal} // Add this
                      handleContract={handleContract} // Add this
                      closeActiveModal={closeActiveModal} // Add this
                    />
                  ) : (
                    <div>Loading...</div>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Payroll
                    isLoggedIn={isLoggedIn}
                    handleDashboardClick={handleDashboardClick}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archived"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ArchivedContracts />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <RegisterModal
          activeModal={activeModal}
          handleRegistration={handleRegistration}
          handleLogin={handleLogin}
          onClose={closeActiveModal}
        />
        <LoginModal
          activeModal={activeModal}
          handleLogin={handleLogin}
          handleRegisterClick={handleRegisterClick}
          onClose={closeActiveModal}
        />
        <ContractModal
          activeModal={activeModal}
          handleContract={handleContract}
          handleLogin={handleLogin}
          onClose={closeActiveModal}
        />
        <ProfileEditModal
          activeModal={activeModal}
          closeActiveModal={closeActiveModal}
          handleProfileEdit={handleProfileEdit}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
