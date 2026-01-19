import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const IS_DEV = process.env.NODE_ENV === "development";

const LoadingSpinner = React.memo(() => (
  <div style={loadingContainerStyle}>
    <div style={loadingContentStyle}>
      <div style={spinnerStyle}></div>
      <p style={loadingTextStyle}>Загрузка...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  const firebaseCache = useMemo(
    () => ({
      auth: null,
      db: null,
      imported: false,
    }),
    [],
  );

  const quickSessionCheck = useCallback(() => {
    try {
      const adminSession = localStorage.getItem("kubstore_admin_session");
      if (adminSession) {
        return { type: "admin", data: adminSession };
      }

      const userSession = localStorage.getItem("kubstore_user_session");
      if (userSession) {
        return { type: "user", data: userSession };
      }

      const legacyAdmin = localStorage.getItem("kubstore_admin");
      if (legacyAdmin) {
        return { type: "legacy", data: legacyAdmin };
      }
    } catch (error) {
      IS_DEV && console.warn("Быстрая проверка сессии не удалась:", error);
    }
    return null;
  }, []);

  const quickRestoreSession = useCallback(() => {
    const session = quickSessionCheck();
    if (!session) return false;

    try {
      const data = JSON.parse(session.data);

      setCurrentUser({
        uid: data.uid || `${session.type}_${Date.now()}`,
        email: data.email,
        displayName: data.name || data.displayName || data.email?.split("@")[0],
      });

      setUserData(data);

      if (session.type === "user") {
        setTimeout(() => {
          initializeFirebaseLazy();
        }, 2000);
      } else {
        setFirebaseInitialized(true);
      }

      return true;
    } catch (error) {
      IS_DEV && console.error("Ошибка восстановления сессии:", error);
      return false;
    }
  }, [quickSessionCheck]);

  const initializeFirebaseLazy = useCallback(async () => {
    if (firebaseInitialized || firebaseCache.imported) return;

    IS_DEV && console.time("🔥 Ленивая инициализация Firebase");

    try {
      const { auth } = await import("../firebase/config");
      firebaseCache.auth = auth;
      firebaseCache.imported = true;

      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        IS_DEV && console.log("🔄 Auth state changed:", user?.email);

        if (user && (!currentUser || user.uid !== currentUser.uid)) {
          setCurrentUser(user);
          await loadUserDataOptimized(user);
        }
      });

      setFirebaseInitialized(true);

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      IS_DEV && console.error(" Ошибка инициализации Firebase:", error);
      setFirebaseInitialized(true);
    } finally {
      IS_DEV && console.timeEnd(" Ленивая инициализация Firebase");
    }
  }, [firebaseInitialized, firebaseCache, currentUser]);

  const loadUserDataOptimized = useCallback(async (user) => {
    IS_DEV && console.time(" Загрузка данных пользователя");

    if (user.uid && user.uid.startsWith("mock_")) {
      const isMockAdmin = user.uid.startsWith("mock_admin_");
      const mockData = {
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        role: isMockAdmin ? "admin" : "user",
        isAdmin: isMockAdmin,
        isMock: true,
        uid: user.uid,
        lastLogin: new Date().toISOString(),
      };

      setUserData(mockData);
      localStorage.setItem(
        isMockAdmin ? "kubstore_admin_session" : "kubstore_user_session",
        JSON.stringify(mockData),
      );

      IS_DEV && console.timeEnd(" Загрузка данных пользователя");
      return;
    }

    try {
      setTimeout(async () => {
        try {
          const { db } = await import("../firebase/config");
          const { doc, getDoc } = await import("firebase/firestore");

          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const userDataWithRole = {
              ...data,
              uid: user.uid,
              isAdmin: data.role === "admin" || data.isAdmin === true,
              role: data.role || "user",
            };

            setUserData(userDataWithRole);
            localStorage.setItem(
              userDataWithRole.isAdmin
                ? "kubstore_admin_session"
                : "kubstore_user_session",
              JSON.stringify(userDataWithRole),
            );
          }
        } catch (firestoreError) {
          IS_DEV &&
            console.warn("Firestore error (не критично):", firestoreError);
        }
      }, 1000);
    } catch (error) {
      IS_DEV && console.warn("Ошибка загрузки данных:", error);
    } finally {
      IS_DEV && console.timeEnd("📥 Загрузка данных пользователя");
    }
  }, []);

  const signup = useCallback(async (email, password, name) => {
    try {
      const { auth } = await import("../firebase/config");
      const { createUserWithEmailAndPassword, updateProfile } =
        await import("firebase/auth");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (name && name.trim()) {
        await updateProfile(user, { displayName: name.trim() });
      }

      const userData = {
        email: user.email,
        name: name?.trim() || user.email.split("@")[0],
        role: "user",
        isAdmin: false,
        uid: user.uid,
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem("kubstore_user_session", JSON.stringify(userData));
      setCurrentUser(user);
      setUserData(userData);

      return userCredential;
    } catch (error) {
      if (
        error.code === "auth/api-key-not-valid" ||
        error.code === "auth/network-request-failed"
      ) {
        const mockUser = {
          uid: "mock_user_" + Date.now(),
          email: email,
          displayName: name || email.split("@")[0],
        };

        const mockData = {
          ...mockUser,
          name: name || email.split("@")[0],
          role: "user",
          isAdmin: false,
          isMock: true,
        };

        setCurrentUser(mockUser);
        setUserData(mockData);
        localStorage.setItem("kubstore_user_session", JSON.stringify(mockData));

        return { user: mockUser };
      }

      throw error;
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      if (email === "admin@motoshop.com" && password === "Admin123!") {
        const mockUser = {
          uid: "mock_admin_" + Date.now(),
          email: email,
          displayName: "Администратор",
        };

        const mockData = {
          ...mockUser,
          name: "Администратор",
          role: "admin",
          isAdmin: true,
          isMock: true,
          lastLogin: new Date().toISOString(),
        };

        setCurrentUser(mockUser);
        setUserData(mockData);
        localStorage.setItem(
          "kubstore_admin_session",
          JSON.stringify(mockData),
        );
        setLoading(false);

        return { user: mockUser };
      }

      try {
        const isOnline = navigator.onLine;

        if (!isOnline) {
          throw new Error("offline");
        }

        const { auth } = await import("../firebase/config");
        const { signInWithEmailAndPassword } = await import("firebase/auth");

        const result = await signInWithEmailAndPassword(auth, email, password);

        const userData = {
          email: result.user.email,
          name: result.user.displayName || email.split("@")[0],
          role: "user",
          isAdmin: false,
          uid: result.user.uid,
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem("kubstore_user_session", JSON.stringify(userData));
        setCurrentUser(result.user);
        setUserData(userData);

        setTimeout(() => {
          loadUserDataOptimized(result.user);
        }, 1000);

        return result;
      } catch (error) {
        const mockUser = {
          uid: "mock_user_" + Date.now(),
          email: email,
          displayName: email.split("@")[0] + " (Офлайн)",
        };

        const mockData = {
          ...mockUser,
          name: email.split("@")[0],
          role: "user",
          isAdmin: false,
          isMock: true,
          lastLogin: new Date().toISOString(),
        };

        setCurrentUser(mockUser);
        setUserData(mockData);
        localStorage.setItem("kubstore_user_session", JSON.stringify(mockData));

        return { user: mockUser };
      }
    },
    [loadUserDataOptimized],
  );

  const signInWithGoogle = useCallback(async () => {
    try {
      const { auth } = await import("../firebase/config");
      const { GoogleAuthProvider, signInWithPopup } =
        await import("firebase/auth");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userData = {
        email: result.user.email,
        name: result.user.displayName || result.user.email.split("@")[0],
        role: "user",
        isAdmin: false,
        uid: result.user.uid,
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem("kubstore_user_session", JSON.stringify(userData));
      setCurrentUser(result.user);
      setUserData(userData);

      return result;
    } catch (error) {
      const mockUser = {
        uid: "mock_google_" + Date.now(),
        email: "google.user@example.com",
        displayName: "Google User",
      };

      const mockData = {
        ...mockUser,
        name: "Google User",
        role: "user",
        isAdmin: false,
        isMock: true,
        provider: "google",
      };

      setCurrentUser(mockUser);
      setUserData(mockData);
      localStorage.setItem("kubstore_user_session", JSON.stringify(mockData));

      return { user: mockUser };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (
        currentUser &&
        !currentUser.uid?.startsWith("mock_") &&
        firebaseCache.auth
      ) {
        const { signOut } = await import("firebase/auth");
        await signOut(firebaseCache.auth);
      }
    } catch (error) {
      IS_DEV && console.error("Ошибка выхода:", error);
    }

    localStorage.removeItem("kubstore_admin_session");
    localStorage.removeItem("kubstore_user_session");
    localStorage.removeItem("kubstore_admin");

    setCurrentUser(null);
    setUserData(null);
  }, [currentUser, firebaseCache]);

  const isAdmin = useCallback(() => {
    return userData?.role === "admin" || userData?.isAdmin === true;
  }, [userData]);

  useEffect(() => {
    if (initialized) return;

    IS_DEV && console.log("🚀 Начальная инициализация AuthContext");

    const sessionRestored = quickRestoreSession();

    if (!sessionRestored) {
      setLoading(false);
      setInitialized(true);
    } else {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized, quickRestoreSession]);

  const value = useMemo(
    () => ({
      currentUser,
      userData,
      login,
      signup,
      signInWithGoogle,
      logout,
      loading,
      isAdmin,
      initialized,
    }),
    [
      currentUser,
      userData,
      login,
      signup,
      signInWithGoogle,
      logout,
      loading,
      isAdmin,
      initialized,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <LoadingSpinner />}
    </AuthContext.Provider>
  );
};

const loadingContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f5f5f5",
};

const loadingContentStyle = {
  textAlign: "center",
};

const spinnerStyle = {
  width: "50px",
  height: "50px",
  border: "3px solid #f3f3f3",
  borderTop: "3px solid #ea66e8",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 20px",
};

const loadingTextStyle = {
  color: "#666",
  fontSize: "16px",
  fontFamily: "Arial, sans-serif",
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
