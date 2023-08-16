import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Login";
import SignUp from "./Components/Signup";
import AdminPanel from "./Components/AdminPanel";
import Categories from "./Components/Category/";
import Services from "./Components/Services";
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin_panel" element={<AdminPanel />} />
          <Route path="/viewCategories" element={<Categories />} />
          <Route path="/viewNewServices" element={<Services />} />
          <Route path="/viewRejectedServices" element={<Services />} />
          <Route path="/viewApprovedServices" element={<Services />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
