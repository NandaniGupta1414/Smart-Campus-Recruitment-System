// const User = require("../models/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // register 
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // login

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,   // <-- use .env secret
//       { expiresIn: "1d" }
//     );


//     // res.status(200).json({
//     //   message: "Login successful",
//     //   token,
//     // });

//     res.status(200).json({
//   message: "Login successful",
//   token,
//   user: {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role
//   }
// });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Get logged-in user profile
// const getMyProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Mockup Forgot Password
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
    
//     // In a real app, you'd send an email here. For your project, we'll just return success.
//     res.json({ message: "Reset instructions sent to your email!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Reset Password
// const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     await user.save();

//     res.json({ message: "Password updated successfully! You can now login." });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { registerUser, loginUser, getMyProfile, forgotPassword, resetPassword };


const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register 
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role, adminSecret } = req.body;

//     // 🔥 SECURITY: Agar Admin role hai, toh secret key check karo
//     if (role === "admin") {
//       const SECRET_KEY = process.env.ADMIN_SECRET || "ADMIN_123"; // Ise aap change kar sakti ho
//       if (adminSecret !== SECRET_KEY) {
//         return res.status(403).json({ message: "Invalid Admin Secret Key!" });
//       }
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     await User.create({
//       name, email, password: hashedPassword, role,
//     });

//     res.status(201).json({ message: "Registered successfully! " });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// from blackbox ai usse upar wla pehle ka hai 
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // 🔥 SECURITY: Agar Admin role hai, toh secret key check karo
    if (role === "admin") {
      const SECRET_KEY = process.env.ADMIN_SECRET || "Nandu_123"; // Use env var
      if (adminSecret !== SECRET_KEY) {
        return res.status(403).json({ message: "Invalid Admin Secret Key!" });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await User.create({
      name, email, password: hashedPassword, role,
    });

    // 🔥 NEW: Auto-generate token for new user (auto-login)
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ 
      message: "Registered successfully! Redirecting to profile...", 
      token, // Send token for auto-login
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileCompleted: newUser.profileCompleted || false
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Agar user nahi mila (Delete ho chuka hai)
    if (!user) {
      // Direct return karo taaki niche wala code execute hi na ho
      return res.status(404).json({ message: "User  does not exist" }); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 FIX: Backend se university, branch aur phone bhej rahe hain
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university || "", 
        specialization: user.specialization ||"",
        phone: user.phone || "",
        resume: user.resume || "",
         profileCompleted: user.profileCompleted || false
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get logged-in user profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 UPDATE PROFILE FUNCTION (Ab ye student ka saara data save karega)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Sirf wahi fields lo jo actual mein frontend se aa rahi hain
    let updateData = {};
    const possibleFields = [
      "name", "phone", "university", "collegeId", "course", "specialization",
      "projectDescription", "githubLink", "linkedinLink",
      "xthBoard", "xthMarks", "xiithBoard", "xiithMarks", "gradMarks" 
      
    ];

    possibleFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // 2. Skills Handling: Agar string hai toh split karo, warna as it is lo
    if (req.body.skills) {
      updateData.skills = typeof req.body.skills === "string" 
        ? req.body.skills.split(",").map(skill => skill.trim())
        : req.body.skills;
    }

    // 3. Resume Handling: File upload check
    if (req.file) {
      updateData.resume = req.file.filename;
    }

    // 4. Update query (No Overwriting)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData , profileCompleted: true }, 
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile Updated Successfully! ✅",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
// Mockup Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Reset instructions sent to your email!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getMyProfile, updateProfile, forgotPassword, resetPassword };