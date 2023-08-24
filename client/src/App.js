import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Login";
import SignUp from "./Components/Signup";
import AdminPanel from "./Components/AdminPanel";
import Categories from "./Components/Category/";
import AdminServices from "./Components/Services/adminServices";
import SellerPanel from "./Components/SellerPanel";
import SellerServices from "./Components/Services/sellerServices";
import BookedServices from "./Components/Services/bookedServices";
import CustomerPanel from "./Components/CustomerPanel";
import CustomerServices from "./Components/Services/customerService";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CustomerBookedServices from "./Components/Services/customerBookedServices";
import PaymentSuccess from "./Components/PaymentSuccess";
import PrivateRoutes from "./ProtectedRoutes";
const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoutes role="admin" />}>
            <Route path="/admin_panel" element={<AdminPanel />} />
            <Route path="/viewCategories" element={<Categories />} />
            <Route path="/viewNewServices" element={<AdminServices />} />
            <Route path="/viewRejectedServices" element={<AdminServices />} />
            <Route path="/viewApprovedServices" element={<AdminServices />} />
          </Route>
          <Route element={<PrivateRoutes role={"seller"} />}>
            <Route path="/seller_panel" element={<SellerPanel />} />
            <Route path="/viewSellerServices" element={<SellerServices />} />
            <Route
              path="/viewSellerBookedServices"
              element={<BookedServices />}
            />
          </Route>
          <Route element={<PrivateRoutes role="customer" />}>
            <Route path="/customer_panel" element={<CustomerPanel />} />

            <Route
              path="/viewCustomerServices"
              element={<CustomerServices />}
            />
            <Route path="/successfulPayment" element={<PaymentSuccess />} />

            <Route
              path="/viewCustomerBookedServices"
              element={<CustomerBookedServices />}
            />
          </Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};
export default App;