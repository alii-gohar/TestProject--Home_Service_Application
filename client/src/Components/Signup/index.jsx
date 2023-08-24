import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import Loader from "../Loader";
import axiosCall from "../../AxiosCall";
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosCall("POST", "signup", formData);
      if (response.status === 200) {
        const data = response.data;
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "male",
          role: "customer",
        });
        alert(data.message);
        navigate("/");
      } else setError(response?.response?.data?.error);
    } catch (error) {
      // Handle any errors here
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
    setLoading(false);
  };
  return (
    <MDBContainer className="d-flex justify-content-center align-items-center">
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol md="10" lg="8">
          <MDBCard className="rounded-3">
            <MDBCardImage
              src="Images/Signup.jpg"
              className="w-100 rounded-top"
              alt="Sample photo"
            />
            {loading === true ? (
              <Loader />
            ) : (
              <form onSubmit={handleSubmit}>
                <MDBCardBody className="px-5">
                  <h1 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-center">
                    Sign Up
                  </h1>
                  <h6 className="text-danger">{error}</h6>
                  <MDBInput
                    wrapperClass="mb-1"
                    label="Name"
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <MDBInput
                    wrapperClass="mb-1"
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <MDBInput
                    wrapperClass="mb-1"
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        wrapperClass="mb-1"
                        label="Age"
                        id="age"
                        name="age"
                        type="number"
                        required
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </MDBCol>
                    <MDBCol md="6" lg="6">
                      <select
                        className="form-select mb-0"
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <label htmlFor="gender" className="form-label mb-4">
                        Gender
                      </label>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <label className="form-label mx-2">Role:</label>
                      <div className="form-check form-check-inline mb-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="customerRadio"
                          value="customer"
                          required
                          checked={formData.role === "customer"}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customerRadio"
                        >
                          Customer
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="sellerRadio"
                          value="seller"
                          required
                          checked={formData.role === "seller"}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="sellerRadio"
                        >
                          Seller
                        </label>
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <button
                    color="success"
                    className="btn btn-lg btn-success mb-4 px-5"
                    size="lg"
                    type="submit"
                  >
                    Submit
                  </button>
                </MDBCardBody>
              </form>
            )}
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
export default SignUp;