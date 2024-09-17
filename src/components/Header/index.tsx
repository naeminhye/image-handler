import React from "react";
import { Link } from "react-router-dom";
import { IoIosMoon, IoIosSunny } from "react-icons/io";

import { useTheme } from "../../contexts/ThemeContext";

import "./style.css";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">ImageHandler</Link>
      </div>
      <nav className="menu">
        <ul>
          <li>
            <Link to="/">Merge Images</Link>
          </li>
          <li>
            <Link to="/split">Split Image</Link>
          </li>
          <li>
            <Link to="/case-converter">Case Converter</Link>
          </li>
          <li>
            <Link to="/generator">Image Generator</Link>
          </li>
        </ul>
      </nav>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "light" ? <IoIosMoon /> : <IoIosSunny />}
          {theme === "light" ? " Dark Mode" : " Light Mode"}
        </button>
      </div>
    </header>
  );
};

export default Header;
