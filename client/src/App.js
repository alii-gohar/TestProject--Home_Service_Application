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
import PrivateRoutes from "./Utils/ProtectedRoutes";
const App = () => {

  const sellerRoutes = [
    { path: "/seller_panel", element: <SellerPanel /> },
    { path: "/viewSellerServices", element: <SellerServices /> },
    { path: "/viewSellerBookedServices", element: <BookedServices /> },
  ];
  const adminRoutes = [
    { path: "/admin_panel", element: <AdminPanel /> },
    { path: "/viewCategories", element: <Categories /> },
    { path: "/viewNewServices", element: <AdminServices /> },
    { path: "/viewRejectedServices", element: <AdminServices /> },
    { path: "/viewApprovedServices", element: <AdminServices /> },
  ];
  const customerRoutes = [
    { path: "/customer_panel", element: <CustomerPanel /> },
    { path: "/viewCustomerServices", element: <CustomerServices /> },
    { path: "/successfulPayment", element: <PaymentSuccess /> },
    {
      path: "/viewCustomerBookedServices",
      element: <CustomerBookedServices />,
    },
  ];
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<PrivateRoutes role="admin" />}>
            {adminRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route element={<PrivateRoutes role="seller" />}>
            {sellerRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route element={<PrivateRoutes role="customer" />}>
            {customerRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>

        </Routes>
      </div>
      <Footer />
    </Router>
  );
};
export default App;
