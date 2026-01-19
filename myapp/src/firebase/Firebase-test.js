export const testFirebaseConnection = async () => {
  console.group("🧪 Тест подключения Firebase");

  try {
    // Динамический импорт для избежания ошибок при сборке
    const { auth, db } = await import("./config");

    // Проверка auth
    console.log("1. Auth instance:", auth ? "✅ OK" : "❌ FAILED");
    console.log("   - App name:", auth?.app?.name);

    // Проверка конфигурации
    console.log("2. Firebase Config:", {
      projectId: auth?.app?.options?.projectId || "Not found",
      apiKey: auth?.app?.options?.apiKey ? "Present" : "Missing",
    });

    // Тест аутентификации (без реального вызова)
    console.log("3. Auth methods:", {
      signInWithEmailAndPassword: typeof auth.signInWithEmailAndPassword,
      signOut: typeof auth.signOut,
      onAuthStateChanged: typeof auth.onAuthStateChanged,
    });

    // Проверка Firestore
    console.log("4. Firestore instance:", db ? "✅ OK" : "❌ FAILED");

    console.groupEnd();
    return { success: true, auth, db };
  } catch (error) {
    console.error("❌ Тест не пройден:", error);
    console.groupEnd();
    return { success: false, error: error.message };
  }
};
