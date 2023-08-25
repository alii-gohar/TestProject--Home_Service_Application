import { useNavigate, useLocation } from "react-router";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import axiosCall from "../../Utils/AxiosCall";
import roles from "../../Utils/Roles";

const panels = {
  [roles.admin]: "/admin_panel",
  [roles.customer]: "/customer_panel",
  [roles.seller]: "/seller_panel",
};

const navbarItems = {
  [roles.admin]: [
    { text: "Categories", link: "/viewCategories" },
    { text: "New Services", link: "/viewNewServices" },
    { text: "Approved Services", link: "/viewApprovedServices" },
    { text: "Rejected Services", link: "/viewRejectedServices" },
  ],
  [roles.seller]: [
    { text: "My Services", link: "/viewSellerServices" },
    { text: "Booked Services", link: "/viewSellerBookedServices" },
  ],
  [roles.customer]: [
    { text: "Available Services", link: "/viewCustomerServices" },
    { text: "Booked Services", link: "/viewCustomerBookedServices" },
  ],
};

const NavbarComponent = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const logout = async () => {
    localStorage.removeItem("user");
    await axiosCall("GET", "logout");
    navigate("/");
  };

  const handlePanel = (role) => panels[role] || "/";

  const handleNavbarItems = (role) => {
    const items = navbarItems[role] || [];
    return (
      <NavDropdown title="Services" id="navbarScrollingDropdown">
        {items.map((item, index) => (
          <NavDropdown.Item key={index} href={item.link}>
            {item.text}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    );
  };

  const getButton = () => {
    if (user.role) {
      return (
        <Button variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      );
    } else if (location === "/") {
      return (
        <Button variant="outline-success" onClick={() => navigate("/signup")}>
          Signup
        </Button>
      );
    } else {
      return (
        <Button variant="outline-primary" onClick={() => navigate("/")}>
          Login
        </Button>
      );
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container fluid>
        <Navbar.Brand href="#">HomeFix</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {user.role && (
              <>
                <Nav.Link href={handlePanel(user.role)}>Home</Nav.Link>
                {handleNavbarItems(user.role)}
              </>
            )}
          </Nav>
          {getButton()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
