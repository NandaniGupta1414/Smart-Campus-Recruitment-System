import { useNavigate } from "react-router-dom";

export default function BackButton({ to }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-slate-100 font-black text-slate-800 hover:text-blue-600 transition-all text-xs"
    >
      ← Back
    </button>
  );
}
