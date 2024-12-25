import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ role }) => {
  const { accessToken, role: userRole } = useSelector((state) => state.auth); // Get the access token and role from Redux state

  if (!accessToken) {
    // If no access token, redirect to the login page
    return <Navigate to="/" />;
  }

  if (accessToken) {
    // If user has a valid access token, redirect based on their role
    if (userRole === role) {
      return <Outlet />;
    } else {
      return <Navigate to={`/${userRole}`} />;
    }
  }

  // If no access token, redirect to the login page
  return <Navigate to="/" />;
};

export default PrivateRoute;
