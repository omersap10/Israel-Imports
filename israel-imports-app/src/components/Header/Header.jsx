import React from 'react';
import './Header.css';
import logo from '../../assets/importLogo.png';

const Header = () => {
  return (
    <header className="custom-header">
      <div className="header-bar">
        <div className="header-text">ייבוא טובין לישראל</div>
      </div>
      <img src={logo} alt="Header Logo" className="header-logo" />
    </header>
  );
};

export default Header;
