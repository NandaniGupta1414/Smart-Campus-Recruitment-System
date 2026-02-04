// import { useNavigate } from "react-router-dom";

// function RoleSelection() {
//   const navigate = useNavigate();

//   const handleRoleSelect = (role) => {
//     // Save selected role
//     localStorage.setItem("selectedRole", role);
//     // Redirect to login page
//     navigate("/auth");
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>Login As:</h2>
//       <button onClick={() => handleRoleSelect("student")}>Student</button>
//       <button onClick={() => handleRoleSelect("company")}>Company</button>
//       <button onClick={() => handleRoleSelect("admin")}>Admin</button>
//     </div>
//   );
// }

// export default RoleSelection;
import { useNavigate } from "react-router-dom";
//import BackButton from "../components/BackButton";

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-4">
      {/* <div className="absolute top-6 left-6">
        <BackButton />
      </div> */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
         Campus Connect
      </h1>
      <p className="text-lg text-blue-100 mb-10 text-center max-w-md">
        Welcome! Please select your role to continue to the portal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Student Card */}
        <div 
          onClick={() => handleRoleSelect("student")}
          className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-transform cursor-pointer flex flex-col items-center border-b-8 border-blue-500"
        >
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-2xl font-bold mb-2">Student</h3>
          <p className="text-center text-gray-500 text-sm">Apply for jobs and track your career growth.</p>
        </div>

        {/* Company Card */}
        <div 
          onClick={() => handleRoleSelect("company")}
          className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-transform cursor-pointer flex flex-col items-center border-b-8 border-green-500"
        >
          <div className="text-5xl mb-4">🏢</div>
          <h3 className="text-2xl font-bold mb-2">Company</h3>
          <p className="text-center text-gray-500 text-sm">Post openings and find the best campus talent.</p>
        </div>

        {/* Admin Card */}
        <div 
          onClick={() => handleRoleSelect("admin")}
          className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-transform cursor-pointer flex flex-col items-center border-b-8 border-red-500"
        >
          <div className="text-5xl mb-4">🛡️</div>
          <h3 className="text-2xl font-bold mb-2">Admin</h3>
          <p className="text-center text-gray-500 text-sm">Manage users, jobs, and recruitment stats.</p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;