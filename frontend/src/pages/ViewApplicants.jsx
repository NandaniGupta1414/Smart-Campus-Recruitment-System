

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function ViewApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewData, setInterviewData] = useState({ date: "", time: "", period: "AM", link: "" });

  useEffect(() => { fetchApplicants(); }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/applications/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobApps = res.data.filter((app) => app.job && app.job._id === jobId);
      setApplicants(jobApps);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setLoading(false); }
  };

  const formatURL = (url) => {
    if (!url || url === "#") return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleShortlistClick = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleReject = async (appId) => {
    if (window.confirm("Reject candidate?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: "rejected" }, 
        { headers: { Authorization: `Bearer ${token}` } });
        (await import("../utils/notify")).notify("Rejected ❌", { type: 'success' });
        fetchApplicants();
      } catch (err) { (await import("../utils/notify")).notify("Error", { type: 'error' }); }
    }
  };

  const submitShortlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const finalTime = `${interviewData.time} ${interviewData.period}`;
      await axios.put(`http://localhost:5000/api/applications/${selectedApp._id}/status`, {
        status: "shortlisted",
        interviewDate: interviewData.date,
        interviewTime: finalTime,
        interviewLink: interviewData.link
      }, { headers: { Authorization: `Bearer ${token}` } });
      (await import("../utils/notify")).notify("Shortlisted! 📩", { type: 'success' });
      setShowModal(false);
      fetchApplicants();
    } catch (err) { (await import("../utils/notify")).notify("Error", { type: 'error' }); }
  };

  const handleRemoveApplicant = async (applicationId) => {
  if (window.confirm("Are you sure you want to remove this student from the pipeline?")) {
    try {
      const token = localStorage.getItem("token");
      // 🔥 Hume naya route hit karna hai jo bache ko delete nahi karega
      await axios.delete(`http://localhost:5000/api/jobs/applicant/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      (await import("../utils/notify")).notify("Removed from this job! Student account safe. 🗑️", { type: 'success' });
      fetchApplicants(); // List refresh karo
    } catch (err) {
      (await import("../utils/notify")).notify("Error removing applicant", { type: 'error' });
    }
  }
};

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate("/company")} className="bg-white px-8 py-3 rounded-2xl shadow-sm border-2 border-slate-100 font-black text-slate-800 hover:text-blue-600 transition-all uppercase text-xs tracking-widest">
            ← Back to Jobs
          </button>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Applicants Pipeline</h2>
          <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl">{applicants.length} TOTAL</div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black text-slate-400 text-xl uppercase italic animate-pulse">Database Syncing...</div>
        ) : (
          <div className="space-y-12">
            {applicants.length === 0 ? (
              <p className="text-center py-20 text-slate-400 font-black uppercase italic tracking-widest">No applications found.</p>
            ) : applicants.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 transition-all hover:border-blue-300">
                
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  {/* LEFT: Bio Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-4xl font-black uppercase shadow-lg">
                        {app.student?.name[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{app.student?.name}</h3>
                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.25em] mt-2 italic">{app.student?.course} | {app.student?.branch}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner text-sm">
                      <p className="font-black text-slate-800 uppercase flex justify-between"><span className="text-[11px]">📧 Email:</span> <span className="text-[11px]">{app.student?.email}</span></p>
                      <p className="font-black text-slate-800 uppercase flex justify-between"><span className="text-[11px]">📱 Phone:</span> <span className="text-[11px]">{app.student?.phone || "N/A"}</span></p>
                      <p className="font-black text-blue-700 uppercase flex justify-between"><span className="text-[11px]">🆔 College ID:</span> <span className="text-[11px]">{app.student?.collegeId}</span></p>
                      <p className="font-black text-slate-900 uppercase flex justify-between"><span className="text-[11px]">🏛️ University:</span> <span className="text-[11px]">{app.student?.university}</span></p>
                    </div>
                  </div>

                  {/* MIDDLE: Academics & Project */}
                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-3 gap-3">
                      {[{l: "10th", s: app.student?.xthMarks, b: app.student?.xthBoard}, 
                        {l: "12th", s: app.student?.xiithMarks, b: app.student?.xiithBoard}, 
                        {l: "Grad", s: app.student?.gradMarks, b: "Avg"}].map((edu, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{edu.l}</p>
                          <p className="text-xl font-black text-slate-900">{edu.s}%</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{edu.b}</p>
                        </div>
                      ))}
                    </div>

                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest italic"> Project Description</h4>
                        <p className="bg-blue-50/50 p-4 rounded-2xl text-sm font-bold text-slate-700 border border-dashed border-blue-100 italic">"{app.student?.projectDescription}"</p>
                      </div>
                      {/* 🔥 THE CHANGE: Ab thik iske niche Tech Stack wala code yahan daal do */}
<div className="mt-4"> 
  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest italic">Technical Tech Stack</h4>
  <div className="flex flex-wrap gap-2">
    {app.student?.skills ? (
      (Array.isArray(app.student.skills) ? app.student.skills : app.student.skills.split(',')).map((skill, i) => (
        <span key={i} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm">
          #{skill.trim()}
        </span>
      ))
    ) : <span className="text-slate-300 italic text-xs">No skills listed.</span>}
  </div>
</div>
                  </div>

                  {/* RIGHT: Actions & Status */}
                  <div className="lg:w-64 flex flex-col gap-3">
                    <div className="text-center mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Application Status</p>
                       <div className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border-4 ${
                         app.status === 'shortlisted' ? 'bg-green-500 border-green-100 text-white' : 
                         app.status === 'rejected' ? 'bg-red-500 border-red-100 text-white' : 
                         'bg-white border-blue-200 text-blue-700'
                       }`}>{app.status}</div>
                    </div>

                    {/* Interview preview for company */}
                    {app.status === 'shortlisted' && (app.interviewDate || app.interviewTime || app.interviewLink) && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interview</p>
                        <div className="mt-2">
                          {(app.interviewDate || app.interviewTime) && (
                            <div className="text-sm font-black text-slate-900">
                              <span className="mr-2">{app.interviewDate || ''}</span>
                              <span className="text-[13px] font-bold">at {app.interviewTime || ''}</span>
                            </div>
                          )}
                          <div className="text-[10px] italic text-slate-500 mt-1">Start the interview on time.</div>
                          {app.interviewLink && (
                            <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block w-full text-center bg-green-600 text-white py-3 rounded-xl font-black shadow-md">Start Interview →</a>
                          )}
                        </div>
                      </div>
                    )}

                    <a href={`http://localhost:5000/uploads/${app.student?.resume}`} target="_blank" className="w-full bg-emerald-600 text-white py-3 rounded-2xl text-[11px] font-black text-center shadow-sm uppercase tracking-widest hover:bg-slate-900 transition-all">View Resume 📄</a>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <a href={formatURL(app.student?.githubLink)} target="_blank" className="bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black text-center uppercase shadow-md">GitHub</a>
                       <a href={formatURL(app.student?.linkedinLink)} target="_blank" className="bg-[#0077b5] text-white py-4 rounded-2xl text-[10px] font-black text-center uppercase shadow-md">LinkedIn</a>
                    </div>
                    
                      <div className="flex gap-3 mt-2">
                         <button onClick={() => handleShortlistClick(app)} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase shadow hover:bg-slate-900">Shortlist</button>
                         <button onClick={() => handleReject(app._id)} className="flex-1 bg-white border-2 border-red-200 text-red-600 py-4 rounded-2xl font-black text-[11px] uppercase hover:bg-red-600 hover:text-white transition-all">Reject</button>
                         {/* RIGHT: Actions & Status section mein Reject button ke niche */}
  <button 
    onClick={() => handleRemoveApplicant(app._id)} 
    className="w-full bg-slate-100 text-slate-400 py-2 rounded-2xl font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all mt-2"
  >
    Remove from Pipeline 🗑️
  </button>
                    </div>
                  </div>
                </div>

                {/* 🔥 FIXED SKILLS SECTION with Heading */}
                {/* <div className="mt-10 pt-8 border-t border-slate-50">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em] ml-2">Technical Tech Stack</h4>
                   <div className="flex flex-wrap gap-2">
                    {app.student?.skills ? (
                      (Array.isArray(app.student.skills) ? app.student.skills : app.student.skills.split(',')).map((skill, i) => (
                        <span key={i} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg">#{skill.trim()}</span>
                      ))
                    ) : <span className="text-slate-300 italic text-xs">No skills listed.</span>}
                   </div>
                </div> */}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Schedule Interview */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl border-t-8 border-blue-600">
            <h3 className="text-4xl font-black mb-2 text-slate-900 tracking-tighter uppercase">Schedule</h3>
            <p className="text-xs font-bold text-slate-400 mb-10 border-b pb-4 uppercase tracking-widest italic">User: {selectedApp?.student?.name}</p>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Interview Date</label>
                <input type="date" className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-600 outline-none font-bold" onChange={e => setInterviewData({...interviewData, date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Time</label>
                  <input type="text" placeholder="11:00" className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-600 outline-none font-bold" onChange={e => setInterviewData({...interviewData, time: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Period</label>
                  <select className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-600 outline-none font-black" onChange={e => setInterviewData({...interviewData, period: e.target.value})}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Meeting Link</label>
                <input type="text" placeholder="https://meet.google.com/..." className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-600 outline-none font-bold text-sm" onChange={e => setInterviewData({...interviewData, link: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button onClick={submitShortlist} className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-slate-900 transition-all uppercase text-[10px]">Send Invitation 📩</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 py-5 rounded-[1.5rem] font-black text-slate-400 uppercase text-[10px]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewApplicants;