import { useState, useEffect } from 'react';
import { Clock, Calendar, UserCheck, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { waitlistService } from './waitlistService';

const Waitlist = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
    fetchWaitlist();
  }, [selectedDate]);

  // Animate waitlist items
  useEffect(() => {
    if (waitlist.length > 0 && !loading) {
      gsap.fromTo('.waitlist-item', 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [waitlist, loading]);

  const fetchWaitlist = async () => {
        setLoading(true);
        try {
            const data = await waitlistService.getByDate(selectedDate);
            setEntries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch waitlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWaitlist();
    }, [selectedDate]);

    const handleAssign = (entry) => {
        // Mock assignment flow
        alert(`Assigning slot for ${entry.userName}. 
        In a production environment, this would open the booking creation form 
        with ${entry.phoneNumber} and ${entry.preferredTime} pre-selected.`);
    };

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Waitlist Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor and assign slots to customers on the waitlist</p>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                    <button onClick={() => changeDate(-1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                    />
                    <button onClick={() => changeDate(1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-700">Entries for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{entries.length}</span>
                    </div>
                    <button 
                        onClick={fetchWaitlist}
                        className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Preferred Time</th>
                                <th className="px-6 py-4">Phone Number</th>
                                <th className="px-6 py-4">Joined At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-primary-600 border-t-transparent rounded-full mb-3"></div>
                                        <p className="text-gray-500 text-sm">Searching waitlist...</p>
                                    </td>
                                </tr>
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">Waitlist is empty for this date</p>
                                        <button 
                                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                            className="text-primary-600 text-sm mt-2 hover:underline"
                                        >
                                            Return to Today
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-3">
                                                    {entry.userName.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-900">{entry.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {entry.preferredTime}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{entry.phoneNumber}</td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleAssign(entry)}
                                                className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition-all shadow-sm flex items-center ml-auto"
                                            >
                                                <UserCheck className="w-3 h-3 mr-1.5" />
                                                Assign Slot
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Waitlist;
