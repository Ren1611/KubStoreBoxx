import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Ваша конфигурация KubStore
const firebaseConfig = {
  apiKey: "AIzaSyCyc8o5blCt0FJ9kzuRNPs4siBPQcPYuGQ",
  authDomain: "kubstore-fa5d8.firebaseapp.com",
  projectId: "kubstore-fa5d8",
  storageBucket: "kubstore-fa5d8.firebasestorage.app",
  messagingSenderId: "264202928256",
  appId: "1:264202928256:web:45d63204150459c7332665",
  measurementId: "G-WLC26DXLGB",
};

console.log("🚀 Инициализация Firebase для проекта:", firebaseConfig.projectId);

// Глобальная проверка для Vite
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

let app;
let auth;
let db;

try {
  // Инициализация Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  console.log("✅ Firebase успешно инициализирован!");
  console.log("📱 App Name:", app.name);
  console.log("🔑 API Key:", firebaseConfig.apiKey.substring(0, 10) + "...");

  // Включаем офлайн-поддержку Firestore
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("🗄️ Firestore: офлайн-поддержка включена");
    })
    .catch((err) => {
      if (err.code === "failed-precondition") {
        console.warn(
          "⚠️ Firestore: несколько вкладок открыты, офлайн-режим только в одной"
        );
      } else if (err.code === "unimplemented") {
        console.warn("⚠️ Firestore: браузер не поддерживает офлайн-режим");
      } else {
        console.warn("⚠️ Firestore: офлайн-режим не доступен:", err.message);
      }
    });
} catch (error) {
  console.error("❌ КРИТИЧЕСКАЯ ОШИБКА Firebase:", error);
  console.error("Код ошибки:", error.code);
  console.error("Сообщение:", error.message);

  // Создаем мок-объекты для продолжения разработки
  console.log("⚠️ Используем мок-режим для разработки");

  app = {
    name: "Mock Firebase App",
    options: firebaseConfig,
  };

  auth = {
    currentUser: null,
    createUserWithEmailAndPassword: async (email, password) => {
      console.log("📝 Mock Auth - Signup attempt:", email);

      // Базовая валидация
      if (!email || !password) {
        throw new Error("auth/invalid-email");
      }

      if (password.length < 6) {
        throw new Error("auth/weak-password");
      }

      const mockUser = {
        uid: "mock_user_" + Date.now(),
        email: email,
        displayName: email.split("@")[0],
        emailVerified: false,
        metadata: {},
      };

      console.log("✅ Mock Auth - Signup successful");
      return { user: mockUser };
    },
    signInWithEmailAndPassword: async (email, password) => {
      console.log("🔐 Mock Auth - Login attempt:", email);

      // Принимаем тестовые учетные данные
      if (email === "admin@motoshop.com" && password === "Admin123!") {
        const mockUser = {
          uid: "mock_admin_" + Date.now(),
          email: email,
          displayName: "Mock Administrator",
          emailVerified: true,
          metadata: {},
        };

        console.log("✅ Mock Auth - Login successful");
        return { user: mockUser };
      }

      // Для других пользователей
      const mockUser = {
        uid: "mock_user_" + Date.now(),
        email: email,
        displayName: email.split("@")[0],
        emailVerified: true,
        metadata: {},
      };

      console.log("✅ Mock Auth - Login successful");
      return { user: mockUser };
    },
    signInWithPopup: async () => {
      console.log("🔵 Mock Auth - Google signin");

      const mockUser = {
        uid: "mock_google_" + Date.now(),
        email: "google.user@example.com",
        displayName: "Google User",
        photoURL: "https://lh3.googleusercontent.com/a/default-user",
        emailVerified: true,
        metadata: {},
      };

      return { user: mockUser };
    },
    updateProfile: async (user, profile) => {
      console.log("👤 Mock Auth - Update profile:", profile);
      user.displayName = profile.displayName;
      return Promise.resolve();
    },
    signOut: async () => {
      console.log("🚪 Mock Auth - Logout");
    },
    onAuthStateChanged: (callback) => {
      console.log("👁️ Mock Auth - Listener added");
      setTimeout(() => callback(null), 100);
      return () => {};
    },
  };

  db = {
    collection: (name) => {
      console.log("📂 Mock Firestore - Access collection:", name);
      return {
        doc: (id) => ({
          get: async () => ({
            exists: () => false, // Новые пользователи не существуют
            data: () => null,
          }),
          set: async (data) => {
            console.log("💾 Mock Firestore - Set document:", data);
            return Promise.resolve();
          },
        }),
      };
    },
  };
}

// Экспорт
export { app, auth, db };
export default app;
