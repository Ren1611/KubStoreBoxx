// ProtectedRoute.jsx
import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../MainContext/AuthContext";

const ProtectedRoute = memo(({ children, requireAdmin = false }) => {
  const { currentUser, userData, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            border: "2px solid #f3f3f3",
            borderTop: "2px solid #ea66e8",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
});

ProtectedRoute.displayName = "ProtectedRoute";

export default ProtectedRoute;
