import { useState, useEffect } from 'react';
import { UserCheck, Plus, Mail, Shield } from 'lucide-react';
import { stylistService } from './stylistService';

const Stylists = () => {
    const [stylists, setStylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStylist, setNewStylist] = useState({
        name: '',
        email: '',
        commissionRate: ''
    });

    const fetchStylists = async () => {
        setLoading(true);
        try {
            const data = await stylistService.getAllStylists();
            setStylists(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch stylists:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStylists();
    }, []);

    const handleAddStylist = async (e) => {
        e.preventDefault();
        try {
            await stylistService.addStylist({
                ...newStylist,
                commissionRate: Number(newStylist.commissionRate)
            });
            setShowAddModal(false);
            setNewStylist({ name: '', email: '', commissionRate: '' });
            fetchStylists();
        } catch (error) {
            console.error("Failed to add stylist:", error);
            alert("Error registering stylist. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Stylist Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage salon staff, roles, and commissions</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stylist
                </button>
            </div>

            {/* Modal for adding stylist */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Register New Stylist</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddStylist} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="input-field w-full"
                                    value={newStylist.name}
                                    onChange={(e) => setNewStylist({...newStylist, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    className="input-field w-full"
                                    value={newStylist.email}
                                    onChange={(e) => setNewStylist({...newStylist, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                                <input 
                                    type="number" 
                                    required
                                    className="input-field w-full"
                                    value={newStylist.commissionRate}
                                    onChange={(e) => setNewStylist({...newStylist, commissionRate: e.target.value})}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm transition-all"
                                >
                                    Register Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stylists.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No stylists found.</p>
                        </div>
                    ) : (
                        stylists.map((stylist) => (
                            <div key={stylist._id} className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primary-50">
                                        <UserCheck className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{stylist.name}</h3>
                                        <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
                                            <Shield className="w-3 h-3" />
                                            <span>Commission: {stylist.commissionRate}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="truncate">{stylist.email || 'No email set'}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 mr-2">Status:</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Active</span>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium border border-gray-200 text-sm">
                                    Edit Profile
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Stylists;
