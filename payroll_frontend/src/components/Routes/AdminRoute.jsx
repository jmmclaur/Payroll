import auth from "../../utils/auth/auth";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  console.log("AdminRoute Check:", {
    isUser: auth.isUser,
    isAdmin: auth.isAdmin,
  });

  console.log("AdminRoute Full Check:", {
    isUser: auth.isUser,
    isAdmin: auth.isAdmin,
    localStorage: {
      userRole: localStorage.getItem("userRole"),
      jwt: localStorage.getItem("jwt"),
    },
    authObject: auth,
  });

  if (auth.isUser && auth.isAdmin) return children;
  return <Navigate to={"/payroll"} />;
};

export default AdminRoute;
