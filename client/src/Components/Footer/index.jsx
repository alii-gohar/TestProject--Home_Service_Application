import "./index.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} HomeFix All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;