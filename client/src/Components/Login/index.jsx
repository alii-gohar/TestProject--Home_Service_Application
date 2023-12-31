import { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

import axiosCall from "../../Utils/AxiosCall";
import logedInUser from "../../Utils/LoginUser";
import roles from "../../Utils/Roles";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = logedInUser();

  const handlePanel = (role) => {
    if (role === roles.admin) return "/admin_panel";
    else if (role === roles.customer) return "/customer_panel";
    else return "/seller_panel";
  };

  useEffect(() => {
    if (user && user.role) {
      navigate(handlePanel(user.role));
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosCall("POST", "login", formData);
      if (response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            role: response.data.user.role,
          })
        );
        const role = response.data.user.role;
        navigate(handlePanel(role));
      } else {
        setError(response?.response?.data?.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <MDBContainer className=" vh-100">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              className="rounded-start w-100"
              src="Images/Login.jpg"
              alt="LoginImage"
            />
          </MDBCol>
          <MDBCol
            md="6"
            className="d-flex justify-content-center align-items-center"
          >
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <MDBIcon
                  fas
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span className="h1 fw-bold mb-4">Login Into Your Account</span>
              </div>
              <h6 className="text-danger">{error}</h6>
              <form onSubmit={handleLogin}>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <MDBInput
                  wrapperClass="mb-4"
                  type="email"
                  size="lg"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <MDBInput
                  wrapperClass="mb-4"
                  type="password"
                  size="lg"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  className="btn btn-primary mb-4 px-5"
                  color="dark"
                  size="lg"
                  type="submit"
                >
                  Login
                </button>
              </form>
              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                Don't have an account?{" "}
                <a href="/signup" style={{ color: "#393f81" }}>
                  Register here
                </a>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};
export default LoginForm;
