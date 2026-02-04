// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("student");
//   const [adminSecret, setAdminSecret] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//         adminSecret: role === "admin" ? adminSecret : undefined,
//       });

//       alert("Registration successful! Welcome to the Portal.");
//       navigate("/login");
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 font-sans">
//       <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 border border-slate-100">
//         <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Create Account</h2>
//         <p className="text-slate-400 font-bold text-sm mb-10 uppercase tracking-widest">Join the Smart Campus Network</p>

//         <form onSubmit={handleRegister} className="space-y-6">
//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Full Name</label>
//             <input type="text" placeholder="Nandani Kumari" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" value={name} onChange={(e) => setName(e.target.value)} required />
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Email Address</label>
//             <input type="email" placeholder="name@company.com" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Security Password</label>
//             <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" value={password} onChange={(e) => setPassword(e.target.value)} required />
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Select Role</label>
//             <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-black text-slate-700 uppercase text-xs" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="student">Student</option>
//               <option value="company">Company</option>
//               <option value="admin">System Admin</option>
//             </select>
//           </div>

//           {role === "admin" && (
//             <div className="animate-in slide-in-from-top-4 duration-300">
//               <label className="block text-[10px] font-black text-blue-600 uppercase ml-2 mb-1 tracking-tighter">Admin Secret Key Required *</label>
//               <input type="text" placeholder="Enter Secret Code" className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl focus:border-blue-600 outline-none font-black text-blue-700" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
//             </div>
//           )}

//           <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all mt-4">
//             Register Now
//           </button>
//         </form>

//         <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase">
//           Already have an account? <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">Login here</span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;


// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react"; // 🔥 Icons import kiye

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // 🔥 Password toggle state
//   const [role, setRole] = useState("student");
//   const [adminSecret, setAdminSecret] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//         adminSecret: role === "admin" ? adminSecret : undefined,
//       });

//       alert("Registration successful! Welcome to the Portal.");
//       navigate("/login");
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 font-sans">
//       <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 border border-slate-100">
//         <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Create Account</h2>
//         <p className="text-slate-400 font-bold text-sm mb-10 uppercase tracking-widest">Join the Smart Campus Network</p>

//         <form onSubmit={handleRegister} className="space-y-6">
//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Full Name</label>
//             <input type="text" placeholder="Nandani Kumari" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" value={name} onChange={(e) => setName(e.target.value)} required />
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Email Address</label>
//             <input type="email" placeholder="name@company.com" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           </div>

//           {/* 🔥 FIXED PASSWORD SECTION */}
//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Security Password</label>
//             <div className="relative flex items-center">
//               <input 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder="••••••••" 
//                 className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700 pr-14" 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 required 
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 text-slate-400 hover:text-blue-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Select Role</label>
//             <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-black text-slate-700 uppercase text-xs" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="student">Student</option>
//               <option value="company">Company</option>
//               <option value="admin">System Admin</option>
//             </select>
//           </div>

//           {role === "admin" && (
//             <div className="animate-in slide-in-from-top-4 duration-300">
//               <label className="block text-[10px] font-black text-blue-600 uppercase ml-2 mb-1 tracking-tighter">Admin Secret Key Required *</label>
//               <input type="text" placeholder="Enter Secret Code" className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl focus:border-blue-600 outline-none font-black text-blue-700" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
//             </div>
//           )}

//           <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all mt-4">
//             Register Now
//           </button>
//         </form>

//         <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase">
//           Already have an account? <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">Login here</span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;
// from gemini 
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); 
//   const [role, setRole] = useState("student");
//   const [adminSecret, setAdminSecret] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//         adminSecret: role === "admin" ? adminSecret : undefined,
//       });

//       alert("Registration successful! Welcome to the Portal.");
//       navigate("/login");
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed!");
//     }
//   };

// from blackbox ai 
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); 
//   const [role, setRole] = useState("student");
//   const [adminSecret, setAdminSecret] = useState("");
//   const [loading, setLoading] = useState(false); // 🔥 NEW: Loading state
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//         adminSecret: role === "admin" ? adminSecret : undefined, // 🔥 FIXED: No trailing comma
//       });

//       const { token, user } = res.data;

//       // 🔥 NEW: Auto-login - Store in localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);
//       localStorage.setItem("user", JSON.stringify(user));

//       alert("Registration successful! Completing your profile...");
      
//       // 🔥 NEW: Direct navigation to profile (since profileCompleted is false)
//       if (user.role === "student") {
//         navigate("/student/profile");
//       } else if (user.role === "admin") {
//         navigate("/admin");
//       } else if (user.role === "company") {
//         navigate("/company");
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 font-sans">
//       <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 border border-slate-100">
//         <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Create Account</h2>
//         <p className="text-slate-400 font-bold text-sm mb-10 uppercase tracking-widest">Join the Smart Campus Network</p>

//         <form onSubmit={handleRegister} className="space-y-6">
//           <div>
//             {/* 🔥 DYNAMIC LABEL FIXED */}
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 italic">
//               {role === "company" ? "🏢 Company Name" : role === "admin" ? "🛡️ Admin Name" : "👤 Full Name"}
//             </label>
//             <input 
//               type="text" 
//               placeholder={role === "company" ? "Enter Company Name" : role === "admin" ? "Enter Admin Name" : "Your Name"} 
//               className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" 
//               value={name} 
//               onChange={(e) => setName(e.target.value)} 
//               required 
//             />
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Email Address</label>
//             <input type="email" placeholder="name@domain.com" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Security Password</label>
//             <div className="relative flex items-center">
//               <input 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder="••••••••" 
//                 className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700 pr-20" 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 required 
//               />
//               {/* 🔥 NEW TEXT-BASED TOGGLE (No Icons Needed) */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 bg-slate-200 px-3 py-1 rounded-lg text-[10px] font-black text-slate-600 hover:bg-blue-600 hover:text-white transition-all uppercase"
//               >
//                 {showPassword ? "HIDE" : "SHOW"}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Select Role</label>
//             <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-black text-slate-700 uppercase text-xs cursor-pointer" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="student">Student</option>
//               <option value="company">Company</option>
//               <option value="admin">System Admin</option>
//             </select>
//           </div>

//           {role === "admin" && (
//             <div className="animate-in slide-in-from-top-4 duration-300">
//               <label className="block text-[10px] font-black text-blue-600 uppercase ml-2 mb-1 tracking-tighter">Admin Secret Key Required *</label>
//               <input type="password" placeholder="Enter Secret Code" className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl focus:border-blue-600 outline-none font-black text-blue-700" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
//             </div>
//           )}

//           <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all mt-4">
//             Register Now
//           </button>
//         </form>

//         <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase">
//           Already have an account? <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">Login here</span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;

// from blackbox ai with loading state on button
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

// Inline SVG icons as fallback to guarantee visibility
const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.477 10.477A3 3 0 0113.523 13.523" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c1.87 0 3.604.45 5.144 1.237" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.856 14.856C13.604 15.604 12.33 16 12 16c-4.477 0-8.268-2.943-9.542-7 .59-1.879 1.71-3.422 3.077-4.59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [role, setRole] = useState("student");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 NEW: Loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔥 NEW: Start loading
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
        adminSecret: role === "admin" ? adminSecret : undefined, // 🔥 FIXED: No trailing comma
      });

      const { token, user } = res.data; // 🔥 NEW: Extract token and user

      // 🔥 NEW: Auto-login - Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      (await import("../utils/notify")).notify("Registration successful! Completing your profile...", { type: 'success' });
      
      // 🔥 NEW: Direct navigation
      if (user.role === "student") {
        navigate("/student/profile");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "company") {
        navigate("/company");
      }
    } catch (error) {
      (await import("../utils/notify")).notify(error.response?.data?.message || "Registration failed!", { type: 'error' });
    } finally {
      setLoading(false); // 🔥 NEW: Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 border border-slate-100">
        <div className="mb-4">
          <BackButton />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Create Account</h2>
        <p className="text-slate-400 font-bold text-sm mb-10 uppercase tracking-widest">Join the Smart Campus Network</p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="register-name" className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 italic">
              {role === "company" ? "🏢 Company Name" : role === "admin" ? "🛡️ Admin Name" : "👤 Full Name"}
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder={role === "company" ? "Enter Company Name" : role === "admin" ? "Enter Admin Name" : "Your Name"}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Email Address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="name@domain.com"
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Security Password</label>
            <div className="flex items-center gap-2">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-blue-600 transition-all flex items-center gap-1 whitespace-nowrap"
              >
                {showPassword ? (
                  <>
                    <span>🙈</span>
                    <span>HIDE</span>
                  </>
                ) : (
                  <>
                    <span>👁️</span>
                    <span>SHOW</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="register-role" className="block text-[10px] font-black text-slate-400 uppercase ml-2 mb-1">Select Role</label>
            <select
              id="register-role"
              name="role"
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-black text-slate-700 uppercase text-xs cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          {role === "admin" && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <label className="block text-[10px] font-black text-blue-600 uppercase ml-2 mb-1 tracking-tighter">Admin Secret Key Required *</label>
              <input
                id="register-admin-secret"
                name="adminSecret"
                type="password"
                placeholder="Enter Secret Code"
                className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl focus:border-blue-600 outline-none font-black text-blue-700"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all mt-4"
          >
            {loading ? "REGISTERING..." : "Register Now"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase">
          Already have an account? <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;