


const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


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
// const sendRegisterOtp = async (req, res) => {

//   const { name, email, password, role } = req.body;

//   try {

//     const userExists = await User.findOne({ email });

//     if (userExists ) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // const newUser = new User({
//     //   name,
//     //   email,
//     //   password: hashedPassword,
//     //   role,
//     //   otp,
//     //   otpExpiry: Date.now() + 5 * 60 * 1000
//     // });

//    await User.findOneAndUpdate(
//       { email },
//       { name, password: hashedPassword, role, otp, otpExpiry: Date.now() + 5 * 60 * 1000 },
//       { upsert: true }
//     );
//     await newUser.save();


//  // 🔥 Email send
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Registration OTP",
//       text: `Your OTP is ${otp}`,
//     });

//     res.json({ message: "OTP sent to email" });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const sendRegisterOtp = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    // Agar user pehle se hai aur verify ho chuka hai
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ FIX: findOneAndUpdate use kiya hai, extra .save() ki zaroorat nahi hai
    await User.findOneAndUpdate(
      { email },
      { 
        name, 
        email,
        password: hashedPassword, 
        role, 
        otp, 
        otpExpiry: Date.now() + 5 * 60 * 1000,
        isVerified: false 
      },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Registration OTP",
      text: `Your OTP is ${otp}`,
    });

    // Success response - isse frontend ka setOtpSent(true) chal jayega
    res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const verifyRegisterOtp = async (req, res) => {

  const { email, otp } = req.body;

  try {

    const user = await User.findOne({ email });

   if (!user || user.otp != otp || user.otpExpiry < Date.now()) {
  return res.status(400).json({ message: "Invalid or expired OTP" });
}
    // OTP clear
    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;

    await user.save();

    // token generate
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Registration successful",
      token,
      user
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
      message: "Profile Updated Successfully! ",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
// Mockup Forgot Password
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "Reset instructions sent to your email!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // 🔥 Email send
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Registration OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent to your Gmail " });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
// const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     await user.save();
//     res.json({ message: "Password updated successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    // 🔥 OTP verify
    if (!user || user.otp != Number(otp) || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP " });
    }

    // 🔥 password hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 🔥 OTP clear
    user.otp = null;

    await user.save();

    res.json({ message: "Password reset successful " });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {  registerUser, loginUser, getMyProfile, updateProfile, forgotPassword, resetPassword,sendRegisterOtp,verifyRegisterOtp };