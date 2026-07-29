import { Navigate } from "react-router-dom";

export const GuestRoute = ({ children, loggedInUser }) => {
  return loggedInUser ? <Navigate to="/" /> : children;
};
