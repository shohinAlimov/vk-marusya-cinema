/* Important Imports */
import type React from "react";

/* Icons */
import IconVK from "../../assets/images/icon-vk.svg?react";
import IconYoutube from "../../assets/images/icon-youtube.svg?react";
import IconOk from "../../assets/images/icon-ok.svg?react";
import IconTelegram from "../../assets/images/icon-telegram.svg?react";

/* Styles */
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wrapper">
          <ul className="footer__socials">
            <li className="footer__socials-item">
              <a className="footer__socials-link" href="#">
                <IconVK className="footer__socials-icon" width={36} height={36} aria-hidden={true} />
              </a>
            </li>

            <li className="footer__socials-item">
              <a className="footer__socials-link" href="#">
                <IconYoutube className="footer__socials-icon" width={36} height={36} aria-hidden={true} />
              </a>
            </li>

            <li className="footer__socials-item">
              <a className="footer__socials-link" href="#">
                <IconOk className="footer__socials-icon" width={36} height={36} aria-hidden={true} />
              </a>
            </li>

            <li className="footer__socials-item">
              <a
                className="footer__socials-link"
                href="https://t.me/ShohinAlimov"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconTelegram
                  className="footer__socials-icon"
                  width={36} height={36}
                  aria-label="Перейти в Telegram" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer;