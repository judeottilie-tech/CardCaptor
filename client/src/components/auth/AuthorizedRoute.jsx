import { Navigate } from "react-router-dom";

export const AuthorizedRoute = ({ children, loggedInUser, roles, all }) => {
  let authed = false;
  if (loggedInUser) {
    authed = true;
  }

  return authed ? children : <Navigate to="/login" />;
};
