import auth from "../../utils/auth/auth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  if (!auth.isUser) return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;
