
import { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert("Password reset successful ");
      window.location.href = "/auth";
    } catch (error) {
      alert("Invalid OTP ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;