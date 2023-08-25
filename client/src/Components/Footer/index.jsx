import React from "react";
import "./index.css";
import { getCurrentYear } from "../../Utils/Date";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {getCurrentYear()} HomeFix All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
