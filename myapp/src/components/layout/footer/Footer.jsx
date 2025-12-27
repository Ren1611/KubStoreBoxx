import scss from "./Footer.module.scss";

const Footer = () => {
  return (
    <div>
      <div id={scss.footer}>
        <div className="container">
          <div className={scss.footer}>
            <div className={scss.FooterInp}>
              <h1>Exclusive</h1>
              <h2>
                <a href="https://github.com/Ren1611" target="blank">
                  Subscribe
                </a>
              </h2>
              <p>Get 10% off your first order</p>
              <input type="text" placeholder="Enter your email" />
              <button>
                <img src="../src/assets/icons/icon-send.svg" alt="" />
              </button>
            </div>
            <div className={scss.FooterSup}>
              <h1>Support</h1>

              <p>becbolsunofmurzakubat@gmail.com</p>
              <p>+88015-88888-9999</p>
            </div>
            <div className={scss.FooterAcc}>
              <h1>Account</h1>
              <p>My Account</p>
              <p>
                <a href="/login">Login</a> / <a href="/register">Register</a>
              </p>
              <p>
                <a href="/card">Card</a>
              </p>
              <p></p>
            </div>
            <div className={scss.FooterQui}>
              <h1>Quick Link</h1>
              <p>Privacy Policy</p>

              <p>Contact</p>
            </div>
            <div className={scss.FooterDow}>
              <h1>Download App</h1>
              <div className={scss.Quar}>
                <img src="../src/assets/images/Qr Code (1).svg" alt="" />
                <div className={scss.App}>
                  <img src="../src/assets/images/GooglePlay.svg" alt="" />
                  <br />
                  <img src="../src/assets/images/AppStore (1).svg" alt="" />
                </div>
              </div>
              <div className={scss.contacts}>
                <a
                  href="https://www.facebook.com/profile.php?id=61560514741224&mibextid=ZbWKwL"
                  target="blank"
                >
                  <img src="../src/assets/icons/Icon-Facebook (1).svg" alt="" />
                </a>
                <a href="https://x.com/Kioshi_Kubat " target="blank">
                  <img src="../src/assets/icons/Icon-Twitter (1).svg" alt="" />
                </a>
                <a
                  href="https://www.instagram.com/ku.bat2398?igsh=MXFhZDJ1Y3I0dGpteg=="
                  target="blank"
                >
                  <img
                    src="../src/assets/icons/Icon-instagram (1).svg"
                    alt=""
                  />
                </a>
                <a
                  href="https://www.linkedin.com/in/jfuviviv-eyicyccceru-3638ba39b"
                  target="blank"
                >
                  <img src="../src/assets/icons/Icon-Linkedin (1).svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
