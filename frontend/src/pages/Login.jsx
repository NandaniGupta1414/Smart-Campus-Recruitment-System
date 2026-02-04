
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     localStorage.clear();

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
//       const { token, user } = res.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);
//       localStorage.setItem("user", JSON.stringify(user));

//       alert("Login successful! ✨");

//       if (user.role === "student") {
//         // 🔥 AB TEENO CHEEZEIN CHECK HONGI: University, Branch aur Phone
//         const isProfileComplete = 
//           user.university && user.university.trim() !== "" &&
//           user.branch && user.branch.trim() !== "" &&
//           user.phone && user.phone.trim() !== "";

//         if (isProfileComplete) {
//           navigate("/student"); // Purana user jiska sab kuch bhara hai
//         } else {
//           navigate("/student/profile"); // Naya user ya jisne phone/uni nahi bhari
//         }
//       } 
//       else if (user.role === "admin") navigate("/admin");
//       else if (user.role === "company") navigate("/company");

//       setTimeout(() => {
//         window.location.reload();
//       }, 150);

//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 font-sans">
//       <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        
//         <div className="text-center mb-8">
//           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Campus Portal</h2>
//           <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-2">Identity Verification</p>
//         </div>

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="flex flex-col">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
//             <input
//               type="email"
//               placeholder="nandani@student.com"
//               className="w-full p-4 border-2 border-slate-100 rounded-2xl mt-1 focus:border-blue-600 outline-none transition-all font-bold"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
//             <div className="relative flex items-center">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="w-full p-4 pr-12 border-2 border-slate-100 rounded-2xl mt-1 focus:border-blue-600 outline-none transition-all font-bold"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/3 text-xl"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95 mt-4"
//           >
//             {loading ? "VERIFYING..." : "LOGIN"}
//           </button>
//         </form>

//         <p className="text-center mt-8 text-sm font-bold text-slate-400">
//           New student? <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer hover:underline font-black">Register Here</span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

// Inline SVG icons as fallback to guarantee visibility
const EyeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeOffIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.477 10.477A3 3 0 0113.523 13.523" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c1.87 0 3.604.45 5.144 1.237" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.856 14.856C13.604 15.604 12.33 16 12 16c-4.477 0-8.268-2.943-9.542-7 .59-1.879 1.71-3.422 3.077-4.59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
   localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("full API  RESPONSE ",res.data);
      console.log("User profileCompleted:", res.data.user ? res.data.user.profileCompleted : "User object missing");  // 🔥 Check this value
  console.log("User role:", res.data.user ? res.data.user.role : "Role missing");  // 🔥 Additional check

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      (await import("../utils/notify")).notify("Login successful! ✨", { type: 'success' });

      if (user.role === "student") {
        // Determine profile completion using backend fields: university, specialization, phone
        const hasDetails = user.university && user.university.trim() !== "" && user.specialization && user.specialization.trim() !== "" && user.phone && user.phone.trim() !== "";

        if (hasDetails) {
          console.log("Navigating to dashboard: /student");
          navigate("/student");
        } else {
          console.log("Navigating to profile: /student/profile");
          navigate("/student/profile");
        }
      } else if (user.role === "admin") navigate("/admin");
      else if (user.role === "company") navigate("/company");

      setTimeout(() => {
        
      }, 150);

   

    } catch (error) {
      const notify = (await import("../utils/notify")).notify;

      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error || "";

        if (status === 404) {
          notify(serverMessage || "User not found", { type: 'error' });
        } else if (status === 401) {
          notify(serverMessage || "Invalid email or password", { type: 'error' });
        } else {
          notify(serverMessage || `Error: ${status}`, { type: 'error' });
        }
      } else {
        notify("Network Error: Server is not responding", { type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
          <div className="mb-4">
            <BackButton />
          </div>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Campus Portal</h2>
          <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-2">Identity Verification</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="login-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="nandani@student.com"
              className="w-full p-4 border-2 border-slate-100 rounded-2xl mt-1 focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
          <label htmlFor="login-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>

    <div className="flex items-center gap-2 mt-1">
    <input
      id="login-password"
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      className="flex-1 p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-slate-700"
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95 mt-4"
          >
            {loading ? "VERIFYING..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-slate-400">
          New student? <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer hover:underline font-black">Register Here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;