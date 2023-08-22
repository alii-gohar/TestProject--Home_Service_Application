import React, { useEffect } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
const SellerPanel = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!(user && user?.role === "seller")) navigate("/");
  }, [navigate, user]);
  return (
    <>
      <div className="sp-home d-flex align-items-center justify-content-center mb-5">
        <div>
          <h1 className="display-4 fw-bold">
            Hello! <i>Seller</i>
          </h1>
          <h1 className="ap-txt">We care what we offer </h1>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center bg-dark text-light ad-mdl mb-5">
        <h1>Things We Offer</h1>
      </div>
      <div className="container-fluid row">
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="card">
            <img
              src="/Images/New-service.png"
              className="card-img-top icon-image mt-3"
              alt="Icon"
            />
            <div className="card-body">
              <h4 className="card-title heading text-center">
                <Link to="/viewSellerServices" className="card-link">
                  My Services
                </Link>
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="card">
            <img
              src="/Images/Approved-Services.png"
              className="card-img-top icon-image mt-3"
              alt="Icon"
            />
            <div className="card-body">
              <h4 className="card-title heading text-center">
                <Link to="/viewSellerBookedServices" className="card-link">
                  Booked Services
                </Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SellerPanel;