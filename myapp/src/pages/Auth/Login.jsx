import { useState } from "react";
import scss from "./Login.module.scss";
import { useProduct } from "../../MainContext/MainContext";

const Login = () => {
  const { handleReducer } = useProduct();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div id={scss.login}>
        <div className={scss.snow}>
          <div className="container">
            <div className={scss.login}>
              <div className={scss.hihi}>
                <h1>Добро пожаловать</h1>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                />
                <br />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
                <br />
                <button
                  type="button"
                  onClick={() => handleReducer()}
                  id={scss.ok}
                >
                  войти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
