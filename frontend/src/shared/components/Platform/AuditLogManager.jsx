import React, { useState, useEffect } from 'react';
import { platformService } from '../platform/platformService';
import { ShieldCheck, History, Info, Filter, Trash2, Edit, PlusCircle } from 'lucide-react';

const AuditLogManager = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await platformService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('CREATE')) return <PlusCircle className="w-4 h-4 text-emerald-400" />;
    if (action.includes('EDIT')) return <Edit className="w-4 h-4 text-indigo-400" />;
    if (action.includes('DELETE')) return <Trash2 className="w-4 h-4 text-red-400" />;
    return <Info className="w-4 h-4 text-slate-400" />;
  };

  if (loading) return <div className="text-slate-400">Loading audit trail...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
             <ShieldCheck className="text-indigo-400 h-8 w-8" />
             System Audit Trail
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time oversight of all sensitive platform operations</p>
        </div>
        <button onClick={fetchLogs} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <History className="text-slate-400 h-5 w-5" />
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-4">
           <div className="flex-1 relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
           </div>
        </div>

        <div className="divide-y divide-slate-700/50">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-700/20 transition-colors flex items-start gap-4 group">
               <div className="mt-1">
                  {getActionIcon(log.action)}
               </div>
               <div className="flex-1">
                  <div className="flex items-center justify-between">
                     <p className="text-sm font-medium text-slate-200">
                        <span className="text-indigo-400 uppercase text-[11px] font-bold tracking-wider mr-2">{log.action}</span>
                        {log.model} entry {log.targetId && `#${log.targetId.slice(-6)}`}
                     </p>
                     <span className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                     <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                        <span className="text-[10px] text-slate-400 font-mono">By UID: {log.perfomedBy?.slice(-6) || 'System'}</span>
                     </div>
                     <span className="text-xs text-slate-600 truncate max-w-lg">
                        {log.details?.url}
                     </span>
                  </div>
               </div>
               <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-slate-300 transition-all">
                  <Info className="w-4 h-4" />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogManager;
