import React, { useState, useEffect } from 'react';
import { platformService } from '../platform/platformService';
import { Users, Globe, Activity, TrendingUp, Zap, Server } from 'lucide-react';

const PlatformOverview = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalLogs: 0,
    revenue: '$0.00'
  });

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const tenants = await platformService.getTenants();
        const logs = await platformService.getAuditLogs();
        
        setStats({
          totalTenants: tenants.length,
          activeTenants: tenants.filter(t => t.active).length,
          totalLogs: logs.length,
          revenue: `$${(tenants.filter(t => t.active).length * 49).toLocaleString()}.00` // Mock MRR
        });
      } catch (err) {
        console.error(err);
      }
    };
    loadOverview();
  }, []);

  const cards = [
    { name: 'Total Partners', value: stats.totalTenants, icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Active Salons', value: stats.activeTenants, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Monthly Revenue', value: stats.revenue, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'System Events', value: stats.totalLogs, icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Health</h1>
        <p className="text-slate-400 text-sm mt-1">Global ecosystem performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-700">Live</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{card.name}</p>
            <h3 className="text-3xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
             <div className="flex items-center gap-3 mb-6 font-semibold text-slate-200">
                <Server className="text-indigo-400 w-5 h-5" />
                Infrastructure Status
             </div>
             <div className="space-y-4">
                {[
                  { label: 'Cloud Database', status: 'Healthy', val: '99.9%' },
                  { label: 'Stripe API Gateway', status: 'Healthy', val: 'Connected' },
                  { label: 'Mail Server (NodeMailer)', status: 'Active', val: 'Ready' }
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <span className="text-sm text-slate-400">{s.label}</span>
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-mono text-slate-500">{s.val}</span>
                       <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-tighter">{s.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-2xl flex flex-col justify-between overflow-hidden relative group">
             <div className="relative z-10">
                <h4 className="text-white text-xl font-bold mb-2">Platform Scale 2026</h4>
                <p className="text-indigo-100 text-sm opacity-80 max-w-xs">
                   Auto-scaling is enabled. Your ecosystem is prepared for high-traffic weekend peaks.
                </p>
             </div>
             <div className="mt-8 relative z-10">
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-50 transition-colors">
                   View Scaling Logs
                </button>
             </div>
             <Users className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
      </div>
    </div>
  );
};

export default PlatformOverview;
