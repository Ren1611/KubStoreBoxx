export const testFirebaseConnection = async () => {
  console.group("🧪 Тест подключения Firebase");

  try {
    const { auth, db } = await import("./config");

    console.log("1. Auth instance:", auth ? "✅ OK" : "❌ FAILED");
    console.log("   - App name:", auth?.app?.name);

    console.log("2. Firebase Config:", {
      projectId: auth?.app?.options?.projectId || "Not found",
      apiKey: auth?.app?.options?.apiKey ? "Present" : "Missing",
    });

    console.log("3. Auth methods:", {
      signInWithEmailAndPassword: typeof auth.signInWithEmailAndPassword,
      signOut: typeof auth.signOut,
      onAuthStateChanged: typeof auth.onAuthStateChanged,
    });

    console.log("4. Firestore instance:", db ? "✅ OK" : "❌ FAILED");

    console.groupEnd();
    return { success: true, auth, db };
  } catch (error) {
    console.error("❌ Тест не пройден:", error);
    console.groupEnd();
    return { success: false, error: error.message };
  }
};
