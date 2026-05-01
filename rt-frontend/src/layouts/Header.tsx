import { LogOut, Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  

  const handleLogout = async () => {
  try {
    localStorage.removeItem("token"); 
    
    // Redirect ke login
    window.location.href = "/login";
  } catch (error) {
    console.error("Gagal logout:", error);
  }
};

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="font-black text-gray-900 tracking-tight">
          Sistem Administrasi RT
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifikasi Icon - Opsional untuk pemanis style */}
        <button className="text-gray-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
        </button>

        <div className="h-8 w-[1px] bg-gray-100"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">Admin Utama</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight mt-1">Online</p>
          </div>
          
          <div className="group relative">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 border border-rose-100"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}