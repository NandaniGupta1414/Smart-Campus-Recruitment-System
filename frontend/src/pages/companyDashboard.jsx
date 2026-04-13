import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", location: "", salary: "", description: "" });
  
  const user = JSON.parse(localStorage.getItem("user")); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/jobs/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) { 
      console.error("Error fetching jobs:", err); 
    }
  };

  // 🔥 CASCADE DELETE LOGIC: Job aur uski applications dono saaf!
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("WARNING: Are you sure? This will delete this job and ALL student applications received for it. This cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        (await import("../utils/notify")).notify("Job and all related data removed! ", { type: 'success' });
        fetchMyJobs(); // List refresh karo
      } catch (err) {
        (await import("../utils/notify")).notify(err.response?.data?.message || "Error deleting job", { type: 'error' });
      }
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/jobs", newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });

      (await import("../utils/notify")).notify("Job Posted Successfully! ", { type: 'success' });
      setShowForm(false);
      setNewJob({ title: "", location: "", salary: "", description: "" });
      fetchMyJobs();
    } catch (err) {
      (await import("../utils/notify")).notify(err.response?.data?.message || "Error posting job", { type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <BackButton />
          </div>
        
        {/* TOP WELCOME CARD */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-8 mb-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">
                Welcome, {user?.name || "Company"}! 
              </h1>
              <p className="text-blue-100 text-lg opacity-90">Manage your recruitment and job openings in real-time.</p>
              <div className="mt-6 flex gap-4">
                <div className="bg-white/10 inline-block px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                  <span className="block text-3xl font-black">{jobs.length}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Active Jobs</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { localStorage.clear(); navigate("/"); }}
              className="bg-red-500/20 hover:bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition border border-red-500/30"
            >
              Logout 🚪
            </button>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
            <span className="w-2 h-8 bg-blue-700 rounded-full"></span>
            Manage Openings
          </h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase transition shadow-lg ${showForm ? "bg-slate-800 text-white" : "bg-blue-700 text-white hover:bg-blue-800"}`}
          >
            {showForm ? "✕ Close Form" : "+ Post New Job"}
          </button>
        </div>

        {/* POST JOB FORM */}
        {showForm && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl mb-12 border-2 border-blue-50 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Post New Opening</h2>
            <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="Job Title (e.g. MERN Developer)" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} required />
              <input className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} required />
              <input className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="Salary Package (e.g. 10 LPA)" value={newJob.salary} onChange={(e) => setNewJob({...newJob, salary: e.target.value})} required />
              <textarea className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl md:col-span-2 outline-none focus:border-blue-500 font-bold" rows="4" placeholder="Job Description & Requirements" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} required />
              <button className="w-full bg-blue-700 text-white p-5 rounded-2xl font-black text-lg uppercase hover:bg-slate-900 transition md:col-span-2 shadow-xl">Confirm & Launch Job Opening</button>
            </form>
          </div>
        )}

        {/* ACTIVE JOBS LIST */}
        <div className="grid grid-cols-1 gap-6">
          {jobs.length === 0 ? (
            <div className="bg-white p-16 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
              <p className="text-slate-300 text-xl font-bold uppercase tracking-widest italic">No jobs posted yet.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:bg-blue-600 transition-colors">🏢</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{job.title}</h3>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1">📍 {job.location} • 💰 {job.salary}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 md:mt-0">
                  <button 
                    onClick={() => navigate(`/company/applicants/${job._id}`)}
                    className="bg-blue-50 text-blue-700 px-8 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                  >
                    View Applicants
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job._id)}
                    className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all border border-red-100"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default CompanyDashboard;