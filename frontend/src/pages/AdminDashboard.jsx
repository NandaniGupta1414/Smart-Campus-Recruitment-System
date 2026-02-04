import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function AdminDashboard() {
  const [stats, setStats] = useState({ studentCount: 0, companyCount: 0, jobCount: 0, applicationCount: 0 });
  const [data, setData] = useState([]);
  const [view, setView] = useState("students");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    fetchData(view);
  }, [view]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) { console.error("Stats Error", err); }
  };

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) { console.error("Fetch Error", err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (item, type) => {
    try {
      let deleteUrl = "";
      let confirmMsg = "";

      // 🔥 SMART DELETE LOGIC (Fixes your issue)
      if (type === "applications") {
        // Remove only the application record — do NOT delete the student account
        confirmMsg = item.student?.name ? `Remove application by ${item.student.name} for job '${item.job?.title || ''}'?` : "Remove this application record?";
        deleteUrl = `application/${item._id}`;
      } else if (type === "jobs") {
        confirmMsg = `Delete Job: ${item.title}?`;
        deleteUrl = `job/${item._id}`;
      } else {
        confirmMsg = `Permanently remove ${item.name}?`;
        deleteUrl = `user/${item._id}`;
      }

      if (window.confirm(confirmMsg)) {
        await axios.delete(`http://localhost:5000/api/admin/${deleteUrl}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        (await import("../utils/notify")).notify("Action Successful! ✨", { type: 'success' });
        fetchStats();
        fetchData(view);
      }
    } catch (err) {
      (await import("../utils/notify")).notify("System Error: Check backend routes.", { type: 'error' });
    }
  };

  const SidebarContent = () => (
    <>
      <h2 className="text-3xl font-black mb-12 tracking-tighter text-blue-400">ADMIN CORE</h2>
      <nav className="space-y-4 flex-1">
        {["students", "companies", "jobs", "admins", "applications"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setView(tab); setIsSidebarOpen(false); }}
            className={`w-full text-left p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
              view === tab ? "bg-blue-600 shadow-xl scale-105" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
      <button onClick={() => {localStorage.clear(); navigate("/");}} className="bg-red-600 text-white p-5 rounded-2xl font-black text-xs uppercase shadow-lg">Logout 🚪</button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans relative">
      
      {/* Desktop Sidebar */}
      <div className="w-72 bg-slate-900 text-white flex flex-col p-8 hidden lg:flex shadow-2xl sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900 z-50 p-8 flex flex-col lg:hidden animate-in fade-in slide-in-from-left duration-300">
          <button onClick={() => setIsSidebarOpen(false)} className="text-white self-end mb-8 font-black border-2 border-white/20 px-4 py-2 rounded-xl">CLOSE ✕</button>
          <SidebarContent />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <BackButton />
          </div>
          
          <header className="mb-10 flex justify-between items-center">
              <div className="border-l-8 border-blue-600 pl-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-2 font-bold italic">Cloud Control Center</p>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">System</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden bg-slate-900 text-white p-4 rounded-xl font-black text-xs uppercase shadow-xl">Menu ☰</button>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { label: "Students", val: stats.studentCount, color: "text-blue-700" },
              { label: "Companies", val: stats.companyCount, color: "text-indigo-700" },
              { label: "Active Jobs", val: stats.jobCount, color: "text-slate-900" },
              { label: "Applications", val: stats.applicationCount, color: "text-green-700" }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border-b-8 border-slate-200 hover:-translate-y-1 transition-transform">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{s.label}</p>
                <p className={`text-2xl md:text-5xl font-black ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Manage: {view}</h3>
               <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg">{data.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-slate-900 border-b-2 border-slate-100 bg-slate-50/50">
                    <th className="px-6 md:px-10 py-6 text-[11px] font-black uppercase tracking-widest">Profile Identity</th>
                    {view === "applications" && <th className="px-6 md:px-10 py-6 text-[11px] font-black uppercase tracking-widest text-blue-600">Company Pipeline</th>}
                    <th className="px-6 md:px-10 py-6 text-[11px] font-black uppercase tracking-widest text-right">System Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="p-24 text-center font-black text-slate-900 animate-pulse text-2xl uppercase italic tracking-widest">Syncing Database...</td></tr>
                  ) : data.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-6 md:px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-blue-600 transition-colors">
                            {(item.name || item.student?.name || item.title || "A")[0]}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 text-lg block uppercase leading-tight">
                                {view === "jobs" ? item.title : (item.name || item.student?.name || "ORPHAN RECORD")}
                            </span>
                            <span className="text-[11px] font-black text-blue-600 tracking-tight">
                                {item.email || item.student?.email || item.companyName || "No Linked Account"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {view === "applications" && (
                        <td className="px-6 md:px-10 py-6">
                           <div className="flex flex-col gap-1">
                              <p className="text-[12px] font-black text-slate-900 uppercase">ROLE: <span className="text-blue-600">{item.job?.title || "N/A"}</span></p>
                              <p className="text-[11px] font-bold text-slate-500 italic">Company: {item.job?.companyName || "DELETED"}</p>
                           </div>
                        </td>
                      )}

                      <td className="px-6 md:px-10 py-6 text-right">
                        {/* Protection for you */}
                        {(view === "admins" && (item.email === "nandani@gmail.com" || item.email === "divya@gmail.com")) ? (
                           <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-xl text-[10px] font-black border border-blue-200 uppercase tracking-widest shadow-sm">MASTER ADMIN</span>
                        ) : (
                          <button 
                            onClick={() => handleDelete(item, view)}
                            className="bg-red-100 text-red-700 px-8 py-3 rounded-2xl font-black text-[10px] uppercase border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;