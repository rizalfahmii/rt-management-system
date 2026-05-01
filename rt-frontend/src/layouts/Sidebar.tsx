import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileBarChart, 
  Wallet, 
  Receipt 
} from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Warga",
    path: "/residents",
    icon: <Users size={20} />,
  },
  {
    label: "Rumah",
    path: "/houses",
    icon: <Home size={20} />,
  },
  {
    label: "Pembayaran",
    path: "/payments",
    icon: <Wallet size={20} />,
  },
  {
    label: "Pengeluaran",
    path: "/expenses",
    icon: <Receipt size={20} />,
  },
  {
    label: "Laporan",
    path: "/reports",
    icon: <FileBarChart size={20} />,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">RT</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none">Sistem RT</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      
    </aside>
  );
}