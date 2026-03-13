import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

const PlatformLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/platform/dashboard', icon: LayoutDashboard },
    { name: 'Tenants', path: '/platform/tenants', icon: Globe },
    { name: 'Audit Logs', path: '/platform/audit-logs', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700 bg-indigo-600 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-inner">
             <div className="w-6 h-6 bg-indigo-600 rounded"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">Bria Core</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-medium'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-slate-200">
              {user?.email?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-100">Platform Management</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                System Live
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400">
                <LayoutDashboard className="w-5 h-5" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatformLayout;
