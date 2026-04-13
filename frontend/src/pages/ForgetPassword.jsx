
import { useState } from "react";
import axios from "axios";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/forget-password", { email });
      alert("OTP sent to your Gmail ");
      window.location.href = "/reset-password";
    } catch (error) {
      alert("Error sending OTP ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default ForgetPassword;