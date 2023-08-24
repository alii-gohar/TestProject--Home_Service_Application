import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./index.css";
import roles from "../../Utils/Roles";
import logedInUser from "../../Utils/LoginUser";

const CustomerPanel = () => {
  const user = logedInUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!(user && user?.role === roles.customer)) navigate("/");
  }, [navigate, user]);
  return (
    <>
      <div className="sp-home d-flex align-items-center justify-content-center">
        <div>
          <h1 className="display-4 fw-bold">Hello!</h1>
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
                <Link to="/viewCustomerServices" className="card-link">
                  Services
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
                <Link to="/viewCustomerBookedServices" className="card-link">
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
export default CustomerPanel;