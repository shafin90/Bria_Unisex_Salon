import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, User, Search, RefreshCw } from 'lucide-react';
import { portfolioService } from './portfolioService';
import { stylistService } from '../stylists/stylistService';

const Portfolio = () => {
    const [gallery, setGallery] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: '',
        stylistId: '',
        image: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [portfolioData, stylistData] = await Promise.all([
                portfolioService.getGallery(),
                stylistService.getAllStylists()
            ]);
            setGallery(Array.isArray(portfolioData) ? portfolioData : []);
            setStylists(Array.isArray(stylistData) ? stylistData : []);
        } catch (error) {
            console.error("Failed to fetch portfolio data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddEntry = async (e) => {
        e.preventDefault();
        try {
            await portfolioService.addWork(newEntry);
            setShowAddModal(false);
            setNewEntry({ title: '', stylistId: '', image: '' });
            fetchData();
        } catch (error) {
            console.error("Failed to add portfolio entry:", error);
            alert("Error adding entry. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Portfolio</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage gallery of salon work and stylist showcases</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Entry
                </button>
            </div>

            {/* Modal for adding portfolio entry */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Portfolio Item</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddEntry} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Summer Blonde Balayage"
                                    className="input-field w-full"
                                    value={newEntry.title}
                                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stylist</label>
                                <select 
                                    required
                                    className="input-field w-full"
                                    value={newEntry.stylistId}
                                    onChange={(e) => setNewEntry({...newEntry, stylistId: e.target.value})}
                                >
                                    <option value="">Select Stylist</option>
                                    {stylists.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input 
                                    type="url" 
                                    required
                                    placeholder="https://..."
                                    className="input-field w-full"
                                    value={newEntry.image}
                                    onChange={(e) => setNewEntry({...newEntry, image: e.target.value})}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">For now, please provide a direct image link.</p>
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
                                    className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm"
                                >
                                    Post to Gallery
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gallery.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No portfolio entries found.</p>
                        </div>
                    ) : (
                        gallery.map((work) => (
                            <div key={work._id} className="group relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-200 hover:shadow-md transition-shadow">
                                <img 
                                    src={work.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400'} 
                                    alt={work.title} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 truncate">{work.title || 'Untitled Work'}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{work.stylistId?.name || 'Stylist Unknown'}</p>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Portfolio;
