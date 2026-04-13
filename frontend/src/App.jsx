import { Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/roleSelection";
 import Login from "./pages/Login";
 import Register from "./pages/Register";
import Auth from "./pages/Auth";



import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";   
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ViewApplicants from "./pages/ViewApplicants";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />  
      <Route path="/register" element={<Register />} /> 
      <Route path="/auth" element={<Auth />} />

      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/profile" element={<StudentProfile />} />

      <Route path="/company" element={<CompanyDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/company/applicants/:jobId" element={<ViewApplicants />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
