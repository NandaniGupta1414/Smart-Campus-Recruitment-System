

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Auth() {
  const [mode, setMode] = useState("login"); // login, register, forgot
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const selectedRole = localStorage.getItem("selectedRole") || "student";

  // Role-specific label and placeholder for the name field
  const nameLabel = selectedRole === "company" ? "Company Name" : selectedRole === "admin" ? "Admin Name" : "Full Name";
  const namePlaceholder = selectedRole === "company" ? "Enter company name" : selectedRole === "admin" ? "Enter admin name" : "Enter your name";

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
    setName("");
    setEmail("");
    setPassword("");
    setAdminSecret("");
    setShowPassword(false);
    setShowAdminSecret(false);
  };

  // const handleAuth = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setMessage("");

  //   let endpoint = "/api/auth/login";
  //   let payload = { email, password };

  //   if (mode === "register") {
  //     // endpoint = "/api/auth/register";
  //     navigate("/register");
  // return;

  //     // payload = {
  //     //   name,
  //     //   email,
  //     //   password,
  //     //   role: selectedRole,
  //     //   adminSecret: selectedRole === "admin" ? adminSecret : undefined,
  //     // };
  //   } else if (mode === "forgot") {
  //     endpoint = "/api/auth/reset-password";
  //     payload = { email, newPassword: password };
  //   }

  //   try {
  //     const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

  //     if (mode === "login") {
  //       // 1. Role ko temporary save karo
  //       const roleBeforeClear = localStorage.getItem("selectedRole");

  //       // 2. Clear old garbage data
  //       localStorage.clear();

  //       // 3. Save New Login Data
  //       localStorage.setItem("token", res.data.token);
  //       localStorage.setItem("selectedRole", roleBeforeClear);

  //       // 4. Fetch Fresh Profile to decide redirection
  //       const profileRes = await axios.get("http://localhost:5000/api/auth/me", {
  //         headers: { Authorization: `Bearer ${res.data.token}` },
  //       });

  //       const user = profileRes.data;
  //       localStorage.setItem("user", JSON.stringify(user));

  //       // 🔥 STEP-BY-STEP REDIRECT LOGIC
  //       if (user.role === "student") {
  //         // Consider profile complete only when university, specialization and phone are present
  //         const hasDetails = user.university && user.university.trim() !== "" && user.specialization && user.specialization.trim() !== "" && user.phone && user.phone.trim() !== "";

  //         if (hasDetails) {
  //           navigate("/student"); // Dashboard
  //         } else {
  //           navigate("/student/profile"); // Profile Form
  //         }
  //       } else if (user.role === "admin") {
  //         navigate("/admin");
  //       } else {
  //         navigate("/company");
  //       }

  //       // State refresh ke liye reload
  //       window.location.reload();

  //     } else if (mode === "register") {
  //       setMessage("Registration successful! Please login.");
  //       setMode("login");
  //     } else {
  //       setMessage("Password updated successfully! Please login.");
  //       setMode("login");
  //     }
  //   } catch (err) {
  //     let errorMessage = "Operation failed. Check details.";
      
  //     if (mode === "login") {
  //       // For login, show "Invalid Credentials" for auth errors
  //       if (err.response?.status === 401 || err.response?.data?.message?.toLowerCase().includes("password") || err.response?.data?.message?.toLowerCase().includes("email")) {
  //         errorMessage = "Invalid Credentials - Email or Password incorrect";
  //       } else {
  //         errorMessage = err.response?.data?.message || "Login failed";
  //       }
  //     } else if (mode === "register") {
  //       errorMessage = err.response?.data?.message || "Registration failed";
  //     } else {
  //       errorMessage = err.response?.data?.message || "Password reset failed";
  //     }
      
  //     setError(errorMessage);
  //   }
  // };
const handleAuth = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

  if (mode === "forgot") {
    // keep forgot password as is
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", { email, newPassword: password });
      setMessage("Password updated successfully! Please login.");
      setMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    }
    return;
  }

  if (mode === "register") {
    navigate("/register");
    return;
  }

  // ---- LOGIN ONLY BELOW ----
  try {
    console.log("STEP 1: Attempting login with", { email, password });

    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

    console.log("STEP 2: Login response:", res.data);

    const token = res.data.token;
    if (!token) {
      setError("Login response has no token. Check backend.");
      return;
    }

    const roleBeforeClear = localStorage.getItem("selectedRole");
    console.log("STEP 3: selectedRole from localStorage:", roleBeforeClear);

    localStorage.clear();
    localStorage.setItem("token", token);
    localStorage.setItem("selectedRole", roleBeforeClear);

    console.log("STEP 4: Fetching profile...");

    const profileRes = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("STEP 5: Profile response:", profileRes.data);

    const user = profileRes.data;
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "student") {
      const hasDetails = 
  String(user.university || "").trim() !== "" && 
  String(user.specialization || "").trim() !== "" && 
  String(user.phone || "").trim() !== "";
      navigate(hasDetails ? "/student" : "/student/profile");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/company");
    }

    window.location.reload();

  } catch (err) {
    // 🔥 THIS IS KEY - log everything
    console.error("ERROR OBJECT:", err);
    console.error("ERROR RESPONSE:", err.response);
    console.error("ERROR STATUS:", err.response?.status);
    console.error("ERROR DATA:", err.response?.data);
    console.error("ERROR MESSAGE:", err.response?.data?.message);

    setError(`DEBUG: Status=${err.response?.status} | Message=${err.response?.data?.message || err.message}`);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        <div className="mb-4">
          <BackButton />
        </div>
        <h2 className="text-4xl font-black text-center text-slate-900 mb-2 tracking-tighter">
          {mode === "login" ? "Welcome" : mode === "register" ? "Join Us" : "Reset"}
        </h2>
        <p className="text-center text-blue-600 mb-8 uppercase tracking-[0.3em] text-[10px] font-black italic opacity-80">
          {selectedRole} Portal
        </p>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold border-l-4 border-red-500">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6 text-xs font-bold border-l-4 border-green-500">{message}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* {mode === "register" && (
            <div className="space-y-1">
              <label htmlFor="auth-name" className="text-[10px] font-black text-slate-400 uppercase ml-2">{nameLabel}</label>
              <input id="auth-name" name="name" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold" type="text" placeholder={namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )} */}
          
          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-[10px] font-black text-slate-400 uppercase ml-2">Email Address</label>
            <input id="auth-email" name="email" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold" type="email" placeholder="abc@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="space-y-1 relative">
            <label htmlFor="auth-password" className="text-[10px] font-black text-slate-400 uppercase ml-2">{mode === "forgot" ? "New Password" : "Password"}</label>
            <input
              id="auth-password"
              name="password"
              className="w-full pr-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 0 1 1.175-4.125M6.88 6.879A9.96 9.96 0 0 1 12 5c5.523 0 10 4.477 10 10 0 .824-.102 1.625-.295 2.387M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* {mode === "register" && selectedRole === "admin" && (
            <div className="space-y-1 relative">
              <label htmlFor="admin-secret" className="text-[10px] font-black text-slate-400 uppercase ml-2">Admin Secret Key</label>
              <input id="admin-secret" name="adminSecret" className="w-full pr-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold" type={showAdminSecret ? "text" : "password"} placeholder="Enter admin secret key" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
              <button
                type="button"
                onClick={() => setShowAdminSecret(s => !s)}
                aria-label={showAdminSecret ? "Hide secret" : "Show secret"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              >
                {showAdminSecret ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 0 1 1.175-4.125M6.88 6.879A9.96 9.96 0 0 1 12 5c5.523 0 10 4.477 10 10 0 .824-.102 1.625-.295 2.387M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          )} */}

          {mode === "login" && (
            <p className="text-right text-xs text-blue-600 cursor-pointer hover:underline font-black uppercase tracking-tighter" onClick={() => navigate("/forget-password")}>
              Forgot Password?
            </p>
          )}

          {/* <button className="w-full bg-blue-700 text-white p-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95">
            {mode === "login" ? "Login to Portal" : mode === "register" ? "Create Account" : "Update Password"}
          </button> */}
          <button className="w-full bg-blue-700 text-white p-5 rounded-[1.5rem]">
  Login to Portal
</button>
        </form>

        <p className="text-center mt-10 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
          {mode === "login" ? (
            <>New here? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/register")}>Register Now</span></>
          ) : (
            <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleModeChange("login")}>Back to Login</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;