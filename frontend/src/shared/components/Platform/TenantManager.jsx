import React, { useState, useEffect } from 'react';
import { platformService } from '../platform/platformService';
import { BadgeCheck, BadgeAlert, MoreVertical, Globe, Calendar, CreditCard } from 'lucide-react';

const TenantManager = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await platformService.getTenants();
      setTenants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await platformService.updateTenantStatus(id, !currentStatus);
      setTenants(tenants.map(t => t.id === id ? { ...t, active: !currentStatus } : t));
    } catch (err) {
      alert('Failed to update tenant status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col space-y-4">
        <div className="h-8 bg-slate-700 w-48 rounded"></div>
        <div className="h-64 bg-slate-800 rounded-2xl border border-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Salon Tenants</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all salon instances hosted on Bria</p>
        </div>
        <button 
          onClick={fetchTenants}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh List
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Salon / Subdomain</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Member Since</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="px-6 py-4 flex justify-center">
                  <div className={`p-1.5 rounded-lg ${tenant.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {tenant.active ? <BadgeCheck className="w-5 h-5" /> : <BadgeAlert className="w-5 h-5" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-100">{tenant.name}</p>
                      <p className="text-xs text-slate-500">{tenant.subdomain}.bria.salon</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                      tenant.planTier === 'enterprise' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      tenant.planTier === 'pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}>
                      {tenant.planTier}
                    </span>
                    {tenant.subscriptionStatus === 'active' && (
                       <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 opacity-50" />
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                    onClick={() => handleToggleStatus(tenant.id, tenant.active)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      tenant.active 
                        ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' 
                        : 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20'
                    }`}
                   >
                     {tenant.active ? 'Deactivate' : 'Activate'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No tenants found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantManager;
