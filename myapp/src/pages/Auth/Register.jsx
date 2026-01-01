import { useState } from "react";
import scss from "./Register.module.scss";
import { useProduct } from "../../MainContext/MainContext";

const Register = () => {
  const { reducer2, signUpWithGoogle } = useProduct();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReducer() {
    setError("");

    const emailTrim = (email || "").trim();
    const nameTrim = (name || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError("Введите корректный email");
      return;
    }
    if (!password || password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);
    try {
      await reducer2(emailTrim, password, nameTrim);
      setEmail("");
      setPassword("");
      setName("");
      console.log("User created");
    } catch (err) {
      console.log("error" + err.message);
      setError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signUpWithGoogle();
      console.log("Google sign-in success");
    } catch (err) {
      console.log("Google sign-in error", err.message);
      setError(err.message || "Ошибка Google входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div id={scss.register}>
        <div className="container">
          <div className={scss.register}>
            <div className={scss.registerBox}>
              <div className={scss.resImg}>
                <img src="../src/assets/images/" alt="" />
              </div>
              <div className={scss.inpRes}>
                <h1>Create an account</h1>
                <h3>Enter your details below</h3>

                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  value={name}
                />
                <br />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                />
                <br />

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  value={password}
                />
                <br />
                {error && <p id={scss.errorBot}>{error}</p>}
                <button
                  type="button"
                  onClick={handleReducer}
                  id={scss.ok}
                  disabled={loading}
                >
                  {loading ? "Подождите..." : "Create Account"}
                </button>
                <br />
                <button
                  type="button"
                  onClick={handleGoogle}
                  id={scss.google}
                  disabled={loading}
                >
                  <img src="../src/assets/icons/Icon-Google (1).svg" alt="" />
                  Sign up with Google
                </button>
                <div className={scss.perehod}>
                  <h2>Already have account?</h2>
                  <a href="/products">Log in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
