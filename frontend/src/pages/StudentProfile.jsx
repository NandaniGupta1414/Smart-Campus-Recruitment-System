

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
    
    // Form Data Sync (append fields to FormData)
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key] || "");
    });

    // Ensure backend receives expected 'branch' field when UI uses 'specialization'
    if (formData.specialization) {
      data.append("branch", formData.specialization);
    }

    // RENAME RESUME WITH USER NAME and append file if provided
    if (resumeFile) {
      const fileExtension = resumeFile.name.split('.').pop(); // Get file extension (pdf, doc, etc)
      const renamedFile = new File(
        [resumeFile], 
        `${formData.name}_resume.${fileExtension}`,
        { type: resumeFile.type }
      );
      data.append("resume", renamedFile);
    } else if (formData.resume) {
      // If there's an existing resume filename/url in the user object, send it as a string
      data.append("resume", formData.resume);
    }

    try {
      const token = localStorage.getItem("token");
      // Do NOT set Content-Type header manually for multipart/form-data - the browser will add the correct boundary
      const res = await axios.put("http://localhost:5000/api/auth/profile", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      (await import("../utils/notify")).notify("Profile Successfully Updated! ✅", { type: 'success' });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/student");
      window.location.reload();
    } catch (err) { 
      // Log full error to console for easier debugging
      console.error("Profile update error:", err.response?.data || err);
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
              <div><label className={labelStyle}>Phone Number</label><input type = "number" className={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
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

              <div><label className={labelStyle}>Graduation (%)</label><input type = "number" className={inputStyle} value={formData.gradMarks} onChange={e => setFormData({...formData, gradMarks: e.target.value})} required /></div>
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200"><label className={labelStyle}>10th Board</label><input className={inputStyle} value={formData.xthBoard} onChange={e => setFormData({...formData, xthBoard: e.target.value})} required /><label className={labelStyle}>10th Marks (%)</label><input type = "number" className={inputStyle} value={formData.xthMarks} onChange={e => setFormData({...formData, xthMarks: e.target.value})} required /></div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200"><label className={labelStyle}>12th Board</label><input className={inputStyle} value={formData.xiithBoard} onChange={e => setFormData({...formData, xiithBoard: e.target.value})} required /><label className={labelStyle}>12th Marks (%)</label><input type = "number" className={inputStyle} value={formData.xiithMarks} onChange={e => setFormData({...formData, xiithMarks: e.target.value})} required /></div>
            </div>
          </div>

          {/* Section 3: Project & Skills */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-3"> Project & Skills</h3>
            <div className="space-y-6">
              <div><label className={labelStyle}>Technical Skills (Comma separated)</label><input className={inputStyle} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. React, Node.js" required /></div>
              <div><label className={labelStyle}> Project Description</label><textarea className={inputStyle} rows="4" value={formData.projectDescription} onChange={e => setFormData({...formData, projectDescription: e.target.value})} required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelStyle}>GitHub Link</label><input type = "url" className={inputStyle} value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} required /></div>
                <div><label className={labelStyle}>LinkedIn Link</label><input type = "url" className={inputStyle} value={formData.linkedinLink} onChange={e => setFormData({...formData, linkedinLink: e.target.value})} required /></div>
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
            {loading ? "SAVING DATA..." : "UPDATE MY PROFILE "}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;