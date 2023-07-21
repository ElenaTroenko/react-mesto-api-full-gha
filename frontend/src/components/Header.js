import React from "react";
import logo from '../images/logo.svg';
import { Link } from "react-router-dom";


export default function Header({loggedIn, email, onSignOut, showLogin, showRegister}) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      {loggedIn && 
        <div className="header__inner">
          <span className="header__email">{email}</span>
          <Link onClick={onSignOut} className="header__logoff">Выйти</Link>
        </div>
      }
      {!loggedIn && showLogin &&
        <Link className="header__link" to="/signin">Войти</Link>
      }
      {!loggedIn && showRegister &&
        <Link className="header__link" to="/signup">Регистрация</Link>
      }
     </header>
  );
}