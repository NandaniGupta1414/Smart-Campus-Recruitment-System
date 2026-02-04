import axios from "axios";

export const loadUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await axios.get("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.log("User load failed");
    localStorage.clear();
    return null;
  }
};
