import { useEffect, useState, useRef } from "react";
import Loader from "./Loader";
import { useLocation, useNavigate } from "react-router";
import axiosCall from "../AxiosCall";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const serviceId = queryParams.get("serviceId");
  const [check, setCheck] = useState(false);
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!isInitialMount.current) {
      const bookService = async () => {
        try {
          if (!check) {
            await axiosCall("POST", "customer/bookService", {}, serviceId);
          }
          navigate("/viewCustomerBookedServices");
        } catch (error) {
          console.error("Error booking service:", error);
        }
      };
      if (!check) {
        bookService();
        setCheck(true);
      }
    } else {
      isInitialMount.current = false;
    }
    // eslint-disable-next-line
  }, [navigate, serviceId]);

  return <Loader />;
};
export default PaymentSuccess;