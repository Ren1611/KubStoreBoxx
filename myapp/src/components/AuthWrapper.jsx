import React, { memo } from "react";
import { useAuth } from "../contexts/AuthContext";

const AuthWrapper = memo(({ children }) => {
  const { currentUser, userData, isAdmin, initialized } = useAuth();

  return React.cloneElement(children, {
    currentUser,
    userData,
    isAdmin,
    initialized,
  });
});

AuthWrapper.displayName = "AuthWrapper";

export default AuthWrapper;
