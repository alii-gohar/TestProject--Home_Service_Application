import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axiosCall from "../../AxiosCall";
import { useNavigate, useLocation } from "react-router";
const NavbarComponent = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const logout = async () => {
    localStorage.removeItem("user");
    await axiosCall("GET", "logout");
    navigate("/");
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
            {user && (
              <>
                <Nav.Link
                  href={`${
                    user?.role === "admin"
                      ? "/admin_panel"
                      : user?.role === "seller"
                      ? "/seller_panel"
                      : "/customer_panel"
                  }`}
                >
                  Home
                </Nav.Link>
                {user?.role === "admin" ? (
                  <NavDropdown title="Services" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/viewCategories">
                      Categories
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/viewNewServices">
                      New Services
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/viewApprovedServices">
                      Approved Services
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/viewRejectedServices">
                      Rejected Services
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : user?.role === "seller" ? (
                  <NavDropdown title="Services" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/viewSellerServices">
                      My Services
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/viewSellerBookedServices">
                      Booked Services
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown title="Services" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/viewCustomerServices">
                      Available Services
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/viewCustomerBookedServices">
                      Booked Services
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          {user ? (
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          ) : location === "/" ? (
            <Button
              variant="outline-success"
              onClick={() => navigate("/signup")}
            >
              Signup
            </Button>
          ) : (
            <Button variant="outline-primary" onClick={() => navigate("/")}>
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavbarComponent;