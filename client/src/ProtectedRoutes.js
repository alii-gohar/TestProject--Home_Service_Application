import { Outlet, Navigate } from "react-router-dom";
const PrivateRoutes = ({ role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user?.role === role) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};
export default PrivateRoutes;