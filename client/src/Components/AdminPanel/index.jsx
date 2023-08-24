import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./index.css";
import roles from "../../Utils/Roles";
import logedInUser from "../../Utils/LoginUser";

const AdminPanel = () => {
  const user = logedInUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!(user && user?.role === roles.admin)) navigate("/");
  }, [navigate, user]);
  return (
    <>
      <div className="ap-home d-flex align-items-center justify-content-center mb-5">
        <div>
          <h1 className="display-4 fw-bold">
            Hello! <i>Admin</i>
          </h1>
          <h1 className="ap-txt">We care what we offer </h1>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center bg-dark text-light mb-5">
        <h1>Things We Offer</h1>
      </div>
      <div className="container-fluid row">
        <div className="col-lg-3 col-md-3 col-sm-6">
          <div className="card">
            <img
              src="/Images/checklist.png"
              className="card-img-top icon-image mt-3"
              alt="Icon"
            />
            <div className="card-body">
              <h4 className="card-title heading text-center">
                <Link to="/viewCategories" className="card-link">
                  Categories
                </Link>
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6">
          <div className="card">
            <img
              src="/Images/New-service.png"
              className="card-img-top icon-image mt-3"
              alt="Icon"
            />
            <div className="card-body">
              <h4 className="card-title heading text-center">
                <Link to="/viewNewServices" className="card-link">
                  New Services
                </Link>
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6">
          <div className="card">
            <img
              src="/Images/Approved-Services.png"
              className="card-img-top icon-image mt-3"
              alt="Icon"
            />
            <div className="card-body">
              <h4 className="card-title heading text-center">
                <Link to="/viewApprovedServices" className="card-link">
                  Approved Services
                </Link>
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6">
          <div className="card">
            <img
              src="/Images/denied.png"
              className="card-img-top icon-image mt-3"
              alt="Icon"
            />
            <div className="card-body">
              <h4 className="card-title heading text-center">
                <Link to="/viewRejectedServices" className="card-link">
                  Rejected Services
                </Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminPanel;