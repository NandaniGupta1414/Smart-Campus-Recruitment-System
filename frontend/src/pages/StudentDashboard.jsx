

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [appliedJobsData, setAppliedJobsData] = useState([]); 
  const [dismissedJobs, setDismissedJobs] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const jobsRes = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsRes.data);

        const appRes = await axios.get("http://localhost:5000/api/applications/student", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobsData(appRes.data);

        const savedDismissed = JSON.parse(localStorage.getItem("dismissedJobs") || "[]");
        setDismissedJobs(savedDismissed);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/jobs/apply", { jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the student's applications without reloading the page
      const appRes = await axios.get("http://localhost:5000/api/applications/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobsData(appRes.data);
      // notify success without blocking UI
      (await import("../utils/notify")).notify("Applied Successfully! 🚀", { type: 'success' });
    } catch (err) {
      (await import("../utils/notify")).notify(err.response?.data?.message || "Error applying", { type: 'error' });
    }
  };

  const handleDismiss = (jobId) => {
    const updated = [...dismissedJobs, jobId];
    setDismissedJobs(updated);
    localStorage.setItem("dismissedJobs", JSON.stringify(updated));
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to withdraw this application? You can apply again later.")) {
      try {
        const token = localStorage.getItem("token");
        // Try primary delete route
        try {
          await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          // Fallback: some backends expose jobs/applicant delete route
          await axios.delete(`http://localhost:5000/api/jobs/applicant/${applicationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        // Optimistically update local state so UI reflects change without full reload
        setAppliedJobsData(prev => prev.filter(a => a._id !== applicationId));
        (await import("../utils/notify")).notify("Application withdrawn successfully! ✓", { type: 'success' });
      } catch (err) {
        (await import("../utils/notify")).notify(err.response?.data?.message || "Error withdrawing application", { type: 'error' });
      }
    }
  };

  const formatURL = (url) => {
    if (!url || url.trim() === "" || url === "#") return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10 font-sans text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <BackButton />
          </div>
        
        {/* Header - ORIGINAL */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black text-black tracking-tighter leading-none uppercase italic">
              Welcome, <span className="text-blue-700">{user?.name}</span>
            </h1>
            <p className="text-black font-black text-[12px] tracking-[0.2em] mt-2 uppercase border-l-4 border-blue-700 pl-3">Student Control Center</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate("/student/profile")} className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs shadow-2xl hover:bg-black transition-all uppercase">EDIT PROFILE</button>
            <button onClick={handleLogout} className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs shadow-2xl hover:bg-red-700 transition-all uppercase">LOGOUT 🚪</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
               <div className="col-span-full border-b-4 border-black pb-3 mb-2 flex justify-between items-center">
                  <h2 className="font-black text-black uppercase text-sm tracking-widest">Contact & Identification</h2>
               </div>
               <div><p className="text-[11px] font-black text-blue-700 uppercase mb-1 italic">Email Address</p><p className="font-black text-base text-black">📧 {user?.email}</p></div>
               <div><p className="text-[11px] font-black text-blue-700 uppercase mb-1 italic">Phone Number</p><p className="font-black text-base text-black">📱 {user?.phone || "N/A"}</p></div>
               <div><p className="text-[11px] font-black text-blue-700 uppercase mb-1 italic">University</p><p className="font-black text-base text-black">🏛️ {user?.university || "N/A"}</p></div>
               <div><p className="text-[11px] font-black text-blue-700 uppercase mb-1 italic">College ID / Roll No</p><p className="font-black text-base text-black underline decoration-blue-700">🆔 {user?.collegeId || "NOT ADDED"}</p></div>
            </div>

            {/* 🔥 EDUCATION & MARKS SECTION - FULLY RESTORED */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="col-span-full border-b-4 border-black pb-3 mb-2">
                  <h2 className="font-black text-black uppercase text-sm tracking-widest">Academic Records</h2>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border-b-4 border-blue-700">
                  <p className="text-[10px] font-black text-blue-700 uppercase italic mb-1">10th Grade</p>
                  <p className="font-black text-sm text-black">{user?.xthBoard || "N/A"}</p>
                  <p className="font-black text-xl text-blue-700">{user?.xthMarks ? `${user.xthMarks}%` : "N/A"}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border-b-4 border-blue-700">
                  <p className="text-[10px] font-black text-blue-700 uppercase italic mb-1">12th Grade</p>
                  <p className="font-black text-sm text-black">{user?.xiithBoard || "N/A"}</p>
                  <p className="font-black text-xl text-blue-700">{user?.xiithMarks ? `${user.xiithMarks}%` : "N/A"}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border-b-4 border-black">
                  <p className="text-[10px] font-black text-blue-700 uppercase italic mb-1">Graduation</p>
                  <p className="font-black text-sm text-black">{user?.course || "N/A"}</p>
                  <p className="font-black text-xl text-black">{user?.gradMarks ? `${user.gradMarks}%` : "N/A"}</p>
               </div>
               <div className="col-span-full pt-2">
                  <p className="text-[11px] font-black text-blue-700 uppercase italic">Specialization</p>
                  <p className="font-black text-lg text-black uppercase tracking-tight">🎓 {user?.branch || user?.specialization || "N/A"}</p>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-slate-200">
               <h2 className="font-black text-black uppercase text-sm tracking-widest mb-6 border-l-8 border-blue-700 pl-4 italic">Major Project Description</h2>
               <div className="bg-blue-50 p-8 rounded-3xl italic text-black text-base font-black border-2 border-dashed border-blue-200 leading-relaxed italic">
                  "{user?.projectDescription || "Project details have not been updated yet."}"
               </div>
            </div>

            {/* 🔥 TECH STACK RESTORED */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-slate-200">
               <h2 className="font-black text-black uppercase text-sm tracking-widest mb-6 border-l-8 border-blue-700 pl-4 italic">🛠️ Technical Tech Stack</h2>
               <div className="flex flex-wrap gap-3">
                 {user?.skills ? (
                   (Array.isArray(user.skills) ? user.skills : user.skills.split(',')).map((skill, i) => (
                     <span key={i} className="bg-black text-white px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-tighter shadow-lg border-b-4 border-blue-700">#{skill.trim()}</span>
                   ))
                 ) : <span className="text-red-600 text-sm font-black uppercase italic">No skills added yet!</span>}
               </div>
            </div>
          </div>

          {/* Right Column Links & Resume */}
          <div className="space-y-6">
            <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl border-t-[12px] border-blue-700">
              <h2 className="font-black text-blue-400 uppercase text-xs tracking-[0.2em] mb-8 text-center italic border-b border-blue-900 pb-4">Professional Ecosystem</h2>
              <div className="space-y-5">
                {formatURL(user?.linkedinLink) ? (
                  <a href={formatURL(user.linkedinLink)} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#0077b5] py-5 rounded-2xl text-center font-black text-xs hover:scale-105 transition-all shadow-xl">VIEW LINKEDIN PROFILE</a>
                ) : <div className="py-5 text-center border-2 border-slate-700 rounded-2xl text-slate-400 font-black text-xs uppercase italic">LinkedIn: Not Linked</div>}

                {formatURL(user?.githubLink) ? (
                  <a href={formatURL(user.githubLink)} target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-black py-5 rounded-2xl text-center font-black text-xs hover:scale-105 transition-all shadow-xl border-b-4 border-blue-700">ACCESS GITHUB REPO</a>
                ) : <div className="py-5 text-center border-2 border-slate-700 rounded-2xl text-slate-400 font-black text-xs uppercase italic">GitHub: Not Linked</div>}

                <div className={`py-5 rounded-2xl text-center font-black text-xs border-4 ${user?.resume ? 'bg-green-700 border-green-400 text-white' : 'border-red-700 text-red-500 bg-black'}`}>
                  {user?.resume ? "RESUME VERIFIED ✅" : "RESUME MISSING ❌"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🏢 OPPORTUNITIES SECTION */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-black mb-10 flex items-center gap-4 uppercase italic"><span className="w-16 h-4 bg-blue-700 rounded-full"></span> Available Careers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.length === 0 ? <p className="text-black font-black uppercase italic text-xl">No active hiring.</p> : 
              jobs
              .filter(job => !dismissedJobs.includes(job._id))
              .map((job) => {
              const application = appliedJobsData.find(app => app.job?._id === job._id || app.job === job._id);
              const isApplied = !!application;
              const status = application?.status || "applied";

              return (
                <div key={job._id} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-2 border-slate-100 relative group hover:border-blue-700 transition-all flex flex-col justify-between">
                  
                  {/* 🔥 DISMISS BUTTON FIXED (No Overlap, Bold) */}
                  <button 
                    onClick={() => handleDismiss(job._id)}
                    className="absolute top-4 right-4 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-400 hover:bg-red-600 hover:text-white transition-all z-10 shadow-sm"
                  >
                    ✕
                  </button>

                {/* Reserve a fixed area for status to avoid layout jumps when status appears */}
                <div className="h-20 mb-4">
                  {isApplied && (
                    <div className={`h-full flex items-center justify-center py-2 text-center text-[10px] font-black uppercase tracking-widest rounded-2xl ${
                      status === 'shortlisted' ? 'bg-green-600 text-white' : 
                      status === 'rejected' ? 'bg-red-700 text-white' : 
                      'bg-blue-700 text-white'
                    }`}>
                      <div className="w-full px-3">
                        <div>
                          {status === 'shortlisted' ? "🔥 SHORTLISTED" : 
                           status === 'rejected' ? "❌ REJECTED" : 
                           "⏳ UNDER REVIEW"}
                        </div>
                        {status === 'shortlisted' && application && (
                          <div className="text-[10px] font-black mt-1">
                            {(application.interviewDate || application.interviewTime) && (
                              <div>
                                <span className="uppercase text-[10px] tracking-widest text-white/90">Interview Scheduled</span>
                                <div className="mt-1">
                                  <span className="text-[12px] font-extrabold mr-2">{application.interviewDate || ''}</span>
                                  <span className="text-[11px] font-black">at {application.interviewTime || ''}</span>
                                </div>
                                <div className="text-[10px] italic mt-1 text-white/90">Please join the interview on time.</div>
                              </div>
                            )}
                            {application.interviewLink && (
                              <a href={application.interviewLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block w-full text-center bg-white text-green-700 py-2 rounded-xl font-black shadow-md">Join Interview →</a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:bg-blue-700 transition-all">🏢</div>
                      <div className="text-right pr-6"> {/* 🔥 Padding added to avoid button overlap */}
                        <p className="text-[10px] font-black text-green-700 uppercase">💰 {job.salary}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase">📍 {job.location}</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-black mb-1 uppercase tracking-tighter italic leading-none truncate">{job.title}</h3>
                    <p className="text-blue-700 font-black text-[11px] mb-4 uppercase tracking-[0.1em]">{job.companyName}</p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 h-28 overflow-y-auto">
                       <h4 className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Role Description</h4>
                       <p className="text-[11px] text-black font-bold leading-relaxed whitespace-pre-line">
                         {job.description}
                       </p>
                    </div>

                    <button 
                      disabled={isApplied} 
                      onClick={() => handleApply(job._id)} 
                      className={`w-full py-4 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all tracking-widest ${
                        isApplied 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-black text-white hover:bg-blue-700 border-b-4 border-blue-900"
                      }`}
                    >
                      {isApplied ? "APPLIED ✅" : "APPLY NOW "}
                    </button>

                    {isApplied && (
                      <button 
                        onClick={() => handleWithdrawApplication(application._id)}
                        className="w-full py-3 rounded-xl font-black text-[10px] uppercase shadow-md transition-all mt-2 bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-600 hover:text-white"
                      >
                        WITHDRAW APPLICATION ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

