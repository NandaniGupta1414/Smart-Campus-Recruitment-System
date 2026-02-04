// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // function StudentProfile() {
// //   const [formData, setFormData] = useState({
// //     name: "", phone: "", university: "", collegeId: "", course: "", branch: "",
// //     skills: "", projectDescription: "", githubLink: "", linkedinLink: "",
// //     xthBoard: "", xthMarks: "", xiithBoard: "", xiithMarks: "", gradMarks: "",
// //     resume: "" 
// //   });
// //   const [resumeFile, setResumeFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         const res = await axios.get("http://localhost:5000/api/students/profile", {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
        
// //         if (res.data) {
// //           // 🔥 SYNC FIX: Backend se githubLink/linkedinLink utha kar frontend state mein dalna
// //           setFormData({
// //             ...res.data,
// //             // Agar backend se 'githubLink' aa raha hai toh wahi lo, varna khali chhoro
// //             githubLink: res.data.githubLink || res.data.github || "",
// //             linkedinLink: res.data.linkedinLink || res.data.linkedin || "",
// //             branch: res.data.branch || "",
// //             skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : (res.data.skills || "")
// //           });
// //         }
// //       } catch (err) { 
// //         console.log("New User Setup: Starting with empty form"); 
// //       }
// //     };
// //     fetchProfile();
// //   }, []);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     const data = new FormData();
    
// //     // 🔥 Send data with EXACT keys that backend (studentRoutes.js) expects
// //     data.append("name", formData.name || "");
// //     data.append("phone", formData.phone || "");
// //     data.append("university", formData.university || "");
// //     data.append("collegeId", formData.collegeId || "");
// //     data.append("course", formData.course || "");
// //     data.append("branch", formData.branch || "");
// //     data.append("xthBoard", formData.xthBoard || "");
// //     data.append("xthMarks", formData.xthMarks || "");
// //     data.append("xiithBoard", formData.xiithBoard || "");
// //     data.append("xiithMarks", formData.xiithMarks || "");
// //     data.append("gradMarks", formData.gradMarks || "");
// //     data.append("projectDescription", formData.projectDescription || "");
// //     data.append("skills", formData.skills || "");
// //     data.append("githubLink", formData.githubLink || ""); 
// //     data.append("linkedinLink", formData.linkedinLink || "");

// //     if (resumeFile) data.append("resume", resumeFile);

// //     try {
// //       const token = localStorage.getItem("token");
// //       const res = await axios.put("http://localhost:5000/api/students/profile", data, {
// //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
// //       });
// //       alert("Profile Updated Successfully! ✅");
// //       localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
// //       navigate("/student");
// //       window.location.reload();
// //     } catch (err) { 
// //       alert(err.response?.data?.message || "Error updating profile"); 
// //     } finally { setLoading(false); }
// //   };

// //   const inputStyle = "w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-0 outline-none mt-2 transition-all text-slate-700 font-medium bg-white";
// //   const labelStyle = "block text-sm font-black text-slate-800 ml-1 mt-4 uppercase tracking-wider";

// //   return (
// //     <div className="min-h-screen bg-[#f0f4f8] py-12 px-4 font-sans">
// //       <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
// //         {/* Header Section */}
// //         <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-12 text-white relative text-center">
// //             <h2 className="text-4xl font-black tracking-tight uppercase">Professional Portfolio Builder</h2>
// //             <p className="mt-2 text-blue-100 text-lg font-medium opacity-90 italic tracking-wide">Update your details for better placement visibility</p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
// //           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
// //             <h3 className="text-xl font-black text-blue-800 mb-6 uppercase tracking-widest flex items-center gap-3">📞 Personal Info</h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div><label className={labelStyle}>Full Name</label><input className={inputStyle} value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Nandani Kumari" /></div>
// //               <div><label className={labelStyle}>Phone Number</label><input className={inputStyle} value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +91 9705xxxxxx" /></div>
// //             </div>
// //           </div>

// //           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
// //             <h3 className="text-xl font-black text-blue-800 mb-6 uppercase tracking-widest flex items-center gap-3">🎓 Academic Records</h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //               <div className="lg:col-span-2"><label className={labelStyle}>University</label><input className={inputStyle} value={formData.university || ""} onChange={e => setFormData({...formData, university: e.target.value})} placeholder="e.g. AKU - CIMAGE PROFESSIONAL" /></div>
// //               <div><label className={labelStyle}>College ID</label><input className={inputStyle} value={formData.collegeId || ""} onChange={e => setFormData({...formData, collegeId: e.target.value})} placeholder="e.g. 97805" /></div>
// //               <div><label className={labelStyle}>Course</label><input className={inputStyle} value={formData.course || ""} onChange={e => setFormData({...formData, course: e.target.value})} placeholder="e.g. BCA or BSc IT" /></div>
// //               <div><label className={labelStyle}>Branch</label><input className={inputStyle} value={formData.branch || ""} onChange={e => setFormData({...formData, branch: e.target.value})} placeholder="e.g. Computer Science" /></div>
// //               <div><label className={labelStyle}>Graduation (%)</label><input className={inputStyle} value={formData.gradMarks || ""} onChange={e => setFormData({...formData, gradMarks: e.target.value})} placeholder="e.g. 89" /></div>
// //             </div>
// //           </div>

// //           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
// //             <h3 className="text-xl font-black text-blue-800 mb-6 uppercase tracking-widest flex items-center gap-3">💻 Technical Portfolio</h3>
// //             <div className="space-y-6">
// //               <div>
// //                 <label className={labelStyle}>GitHub Profile Link</label>
// //                 <input className={inputStyle} value={formData.githubLink || ""} onChange={e => setFormData({...formData, githubLink: e.target.value})} placeholder="e.g. https://github.com/nandani-kumari" />
// //               </div>
// //               <div>
// //                 <label className={labelStyle}>LinkedIn Profile Link</label>
// //                 <input className={inputStyle} value={formData.linkedinLink || ""} onChange={e => setFormData({...formData, linkedinLink: e.target.value})} placeholder="e.g. https://linkedin.com/in/nandani-kumari" />
// //               </div>
// //               <div>
// //                 <label className={labelStyle}>Skills (Comma separated)</label>
// //                 <input className={inputStyle} value={formData.skills || ""} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. JAVA, REACT JS, HTML, CSS" />
// //               </div>
// //               <div>
// //                 <label className={labelStyle}>Project Description</label>
// //                 <textarea className={inputStyle} rows="3" value={formData.projectDescription || ""} onChange={e => setFormData({...formData, projectDescription: e.target.value})} placeholder="e.g. MAKING A PROJECT ON CALCULATOR" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-blue-50 p-10 rounded-[3rem] border-4 border-dashed border-blue-200 text-center">
// //             <h3 className="text-xl font-black text-blue-900 mb-4 uppercase tracking-widest">📄 Professional Resume</h3>
// //             {formData.resume && <p className="text-xs font-black text-green-600 mb-4 bg-white py-2 rounded-xl border border-green-100">FILE ALREADY UPLOADED: {formData.resume}</p>}
// //             <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-blue-600 file:text-white font-black cursor-pointer" onChange={e => setResumeFile(e.target.files[0])} />
// //           </div>

// //           <button disabled={loading} className="w-full bg-blue-700 text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:bg-slate-400 uppercase tracking-widest">
// //             {loading ? "SYNCING DATABASE..." : "UPDATE MY PORTFOLIO ✅"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default StudentProfile;
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function StudentProfile() {
//   const [formData, setFormData] = useState({
//     name: "", phone: "", university: "", collegeId: "", course: "", Specialization: "",
//     skills: "", projectDescription: "", githubLink: "", linkedinLink: "",
//     xthBoard: "", xthMarks: "", xiithBoard: "", xiithMarks: "", gradMarks: "",
//     resume: "" 
//   });
//   const [resumeFile, setResumeFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/students/profile", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (res.data) {
//           setFormData({
//             ...res.data,
//             githubLink: res.data.githubLink || "",
//             linkedinLink: res.data.linkedinLink || "",
//             skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : (res.data.skills || ""),
//             projectDescription: res.data.projectDescription || ""
//           });
//         }
//       } catch (err) { console.log("New User Setup"); }
//     };
//     fetchProfile();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const data = new FormData();
    
//     // 🔥 Backend sync
//     Object.keys(formData).forEach(key => {
//       data.append(key, formData[key] || "");
//     });

//     if (resumeFile) data.append("resume", resumeFile);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put("http://localhost:5000/api/students/profile", data, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
//       });
//       alert("Profile Successfully Updated! ✅");
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/student");
//       window.location.reload();
//     } catch (err) { 
//       alert("Error updating profile."); 
//     } finally { setLoading(false); }
//   };

//   const inputStyle = "w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-0 outline-none mt-2 transition-all text-slate-700 font-medium bg-white";
//   const labelStyle = "block text-sm font-black text-slate-800 ml-1 mt-4 uppercase tracking-wider";

//   return (
//     <div className="min-h-screen bg-[#f0f4f8] py-12 px-4 font-sans">
//       <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
//         <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-12 text-white text-center">
//             <h2 className="text-4xl font-black uppercase">Portfolio Builder</h2>
//             <p className="mt-2 text-blue-100 opacity-90 italic">Showcase your skills to top recruiters</p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
//           {/* Section 1: Contact */}
//           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
//             <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3">📞 Personal Info</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div><label className={labelStyle}>Full Name</label><input className={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="name" /></div>
//               <div><label className={labelStyle}>Phone Number</label><input className={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91..." /></div>
//             </div>
//           </div>

//           {/* Section 2: Education */}
//           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
//             <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3">🎓 Academics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-2"><label className={labelStyle}>University Name</label><input className={inputStyle} value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} /></div>
//               <div><label className={labelStyle}>College ID / Roll No</label><input className={inputStyle} value={formData.collegeId} onChange={e => setFormData({...formData, collegeId: e.target.value})} /></div>
//               <div><label className={labelStyle}>Course</label><input className={inputStyle} value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} /></div>
//               <div><label className={labelStyle}>Specialization</label><input className={inputStyle} value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} /></div>
//               <div><label className={labelStyle}>Graduation (%)</label><input className={inputStyle} value={formData.gradMarks} onChange={e => setFormData({...formData, gradMarks: e.target.value})} /></div>
              
//               <div className="p-4 bg-white rounded-2xl border border-slate-200"><label className={labelStyle}>10th Board</label><input className={inputStyle} value={formData.xthBoard} onChange={e => setFormData({...formData, xthBoard: e.target.value})} /><label className={labelStyle}>10th Marks (%)</label><input className={inputStyle} value={formData.xthMarks} onChange={e => setFormData({...formData, xthMarks: e.target.value})} /></div>
//               <div className="p-4 bg-white rounded-2xl border border-slate-200"><label className={labelStyle}>12th Board</label><input className={inputStyle} value={formData.xiithBoard} onChange={e => setFormData({...formData, xiithBoard: e.target.value})} /><label className={labelStyle}>12th Marks (%)</label><input className={inputStyle} value={formData.xiithMarks} onChange={e => setFormData({...formData, xiithMarks: e.target.value})} /></div>
//             </div>
//           </div>

//           {/* 🔥 FIXED SECTION 3: SKILLS & PROJECT DESCRIPTION (YE MISSING THA!) */}
//           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
//             <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3">💻 Project & Skills</h3>
//             <div className="space-y-6">
//               <div>
//                 <label className={labelStyle}>Technical Skills (Comma separated)</label>
//                 <input className={inputStyle} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. React, Node.js, Java, SQL" />
//               </div>
//               <div>
//                 <label className={labelStyle}>Final Year Project Description</label>
//                 <textarea className={inputStyle} rows="4" value={formData.projectDescription} onChange={e => setFormData({...formData, projectDescription: e.target.value})} placeholder="Explain your project modules and tools used..." />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div><label className={labelStyle}>GitHub Link</label><input className={inputStyle} value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} placeholder="https://github.com/..." /></div>
//                 <div><label className={labelStyle}>LinkedIn Link</label><input className={inputStyle} value={formData.linkedinLink} onChange={e => setFormData({...formData, linkedinLink: e.target.value})} placeholder="https://linkedin.com/in/..." /></div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-blue-50 p-10 rounded-[3rem] border-4 border-dashed border-blue-200 text-center">
//             <h3 className="text-xl font-black text-blue-900 mb-4 uppercase tracking-widest">📄 Upload Resume</h3>
//             {formData.resume && <p className="text-xs font-black text-green-600 mb-4 uppercase italic">Current: {formData.resume}</p>}
//             <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-blue-600 file:text-white font-black cursor-pointer shadow-lg" onChange={e => setResumeFile(e.target.files[0])} />
//           </div>

//           <button disabled={loading} className="w-full bg-blue-700 text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-slate-900 transition-all uppercase">
//             {loading ? "SAVING DATA..." : "UPDATE MY PROFILE ✅"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default StudentProfile;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function StudentProfile() {
  const [formData, setFormData] = useState({
    name: "", phone: "", university: "", collegeId: "", course: "", 
    specialization: "", // 🔥 Hum ise 'branch' hi rakhenge database ke liye
    skills: "", projectDescription: "", githubLink: "", linkedinLink: "",
    xthBoard: "", xthMarks: "", xiithBoard: "", xiithMarks: "", gradMarks: "",
    resume: "" 
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setFormData({
            name: res.data.name || "",
            phone: res.data.phone || "",
            university: res.data.university || "",
            collegeId: res.data.collegeId || "",
            course: res.data.course || "",
            // 🔥 FIX: Backend se chahe Specialization aaye ya branch, hum usey 'branch' state mein save karenge
            specialization: res.data.specialization  || res.data.branch || "",
            githubLink: res.data.githubLink || "",
            linkedinLink: res.data.linkedinLink || "",
            skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : (res.data.skills || ""),
            projectDescription: res.data.projectDescription || "",
            xthBoard: res.data.xthBoard || "",
            xthMarks: res.data.xthMarks || "",
            xiithBoard: res.data.xiithBoard || "",
            xiithMarks: res.data.xiithMarks || "",
            gradMarks: res.data.gradMarks || "",
            resume: res.data.resume || ""
          });
        }
      } catch (err) { console.log("New User Setup - Fetch failed"); }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile && !formData.resume) {
      (await import("../utils/notify")).notify("Resume is mandatory! Please upload your resume to proceed. 📄", { type: 'error' });
      return;
    }
    setLoading(true);
    const data = new FormData();
    
    // Form Data Sync
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key] || "");
    });

    // 🔥 RENAME RESUME WITH USER NAME
    if (resumeFile) {
      const fileExtension = resumeFile.name.split('.').pop(); // Get file extension (pdf, doc, etc)
      const renamedFile = new File(
        [resumeFile], 
        `${formData.name}_resume.${fileExtension}`,
        { type: resumeFile.type }
      );
      data.append("resume", renamedFile);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/auth/profile", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      (await import("../utils/notify")).notify("Profile Successfully Updated! ✅", { type: 'success' });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/student");
      window.location.reload();
    } catch (err) { 
      (await import("../utils/notify")).notify(err.response?.data?.message || "Error updating profile.", { type: 'error' }); 
    } finally { setLoading(false); }
  };

  const inputStyle = "w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:ring-0 outline-none mt-2 transition-all text-slate-700 font-medium bg-white";
  const labelStyle = "block text-sm font-black text-slate-800 ml-1 mt-4 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-6">
          <BackButton />
        </div>
        
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-12 text-white text-center">
            <h2 className="text-4xl font-black uppercase">Portfolio Builder</h2>
            <p className="mt-2 text-blue-100 opacity-90 italic">Showcase your skills to top recruiters</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {/* Section 1: Personal Info */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3">📞 Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className={labelStyle}>Full Name</label><input className={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div><label className={labelStyle}>Phone Number</label><input className={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
            </div>
          </div>

          {/* Section 2: Academics */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3">🎓 Academics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2"><label className={labelStyle}>University Name</label><input className={inputStyle} value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} required /></div>
              <div><label className={labelStyle}>College ID / Roll No</label><input className={inputStyle} value={formData.collegeId} onChange={e => setFormData({...formData, collegeId: e.target.value})} required /></div>
              <div><label className={labelStyle}>Course</label><input className={inputStyle} value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required /></div>
              
              {/* 🔥 FIXED INPUT: Mapping specialization UI to branch state */}
              <div>
                <label className={labelStyle}>specialization </label>
                <input 
                  className={inputStyle} 
                  value={formData.specialization} 
                  onChange={e => setFormData({...formData, specialization: e.target.value})} 
                  required 
                />
              </div>

              <div><label className={labelStyle}>Graduation (%)</label><input className={inputStyle} value={formData.gradMarks} onChange={e => setFormData({...formData, gradMarks: e.target.value})} required /></div>
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200"><label className={labelStyle}>10th Board</label><input className={inputStyle} value={formData.xthBoard} onChange={e => setFormData({...formData, xthBoard: e.target.value})} required /><label className={labelStyle}>10th Marks (%)</label><input className={inputStyle} value={formData.xthMarks} onChange={e => setFormData({...formData, xthMarks: e.target.value})} required /></div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200"><label className={labelStyle}>12th Board</label><input className={inputStyle} value={formData.xiithBoard} onChange={e => setFormData({...formData, xiithBoard: e.target.value})} required /><label className={labelStyle}>12th Marks (%)</label><input className={inputStyle} value={formData.xiithMarks} onChange={e => setFormData({...formData, xiithMarks: e.target.value})} required /></div>
            </div>
          </div>

          {/* Section 3: Project & Skills */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3">💻 Project & Skills</h3>
            <div className="space-y-6">
              <div><label className={labelStyle}>Technical Skills (Comma separated)</label><input className={inputStyle} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. React, Node.js" required /></div>
              <div><label className={labelStyle}> Project Description</label><textarea className={inputStyle} rows="4" value={formData.projectDescription} onChange={e => setFormData({...formData, projectDescription: e.target.value})} required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelStyle}>GitHub Link</label><input className={inputStyle} value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} required /></div>
                <div><label className={labelStyle}>LinkedIn Link</label><input className={inputStyle} value={formData.linkedinLink} onChange={e => setFormData({...formData, linkedinLink: e.target.value})} required /></div>
              </div>
            </div>
          </div>

          {/* Section 4: Resume */}
          <div className="bg-blue-50 p-10 rounded-[3rem] border-4 border-dashed border-blue-200 text-center">
            <h3 className="text-xl font-black text-blue-900 mb-2 uppercase tracking-widest">📄 Upload Resume</h3>
            <p className="text-xs font-black text-slate-600 mb-4 italic">📌 Will be saved as: <span className="text-blue-700">{formData.name}_resume</span></p>
            {formData.resume && <p className="text-xs font-black text-green-600 mb-4 uppercase italic font-bold">✅ Current: {formData.resume}</p>}
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-blue-600 file:text-white font-black cursor-pointer shadow-lg" 
              onChange={e => setResumeFile(e.target.files[0])} 
            />
          </div>

          <button disabled={loading} className="w-full bg-blue-700 text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-slate-900 transition-all uppercase">
            {loading ? "SAVING DATA..." : "UPDATE MY PROFILE ✅"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;