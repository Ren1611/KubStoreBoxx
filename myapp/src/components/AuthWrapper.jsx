// components/AuthWrapper.jsx
import React, { memo } from "react";
import { useAuth } from "../contexts/AuthContext";

// Этот компонент не перезапускает проверку при каждом переходе
const AuthWrapper = memo(({ children }) => {
  const { currentUser, userData, isAdmin, initialized } = useAuth();

  // Просто передаем данные детям, не вызывая перепроверку
  return React.cloneElement(children, {
    currentUser,
    userData,
    isAdmin,
    initialized,
  });
});

AuthWrapper.displayName = "AuthWrapper";

export default AuthWrapper;
