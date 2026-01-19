import React, { Suspense } from "react";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Mainroutes from "./routes/Mainroutes";
import MainContext from "./MainContext/MainContext";
import { AuthProvider } from "./MainContext/AuthContext";
import "./index.scss";

const App = () => {
  return (
    <AuthProvider>
      <MainContext>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Suspense fallback={<div>Loading...</div>}>
              <Mainroutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </MainContext>
    </AuthProvider>
  );
};

export default App;
