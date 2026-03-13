import { useState, useEffect } from 'react';
import { Layers, Plus, CheckCircle, X, Search, RefreshCw } from 'lucide-react';
import { packageService } from './packageService';
import { serviceService } from '../services/serviceService';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPackage, setNewPackage] = useState({
        packageName: '',
        services: [],
        price: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [packageData, serviceData] = await Promise.all([
                packageService.getActivePackages(),
                serviceService.getServices()
            ]);
            setPackages(Array.isArray(packageData) ? packageData : []);
            setServices(Array.isArray(serviceData) ? serviceData : []);
        } catch (error) {
            console.error("Failed to fetch packages/services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleServiceSelection = (serviceId) => {
        setNewPackage(prev => {
            const isSelected = prev.services.includes(serviceId);
            if (isSelected) {
                return { ...prev, services: prev.services.filter(id => id !== serviceId) };
            } else {
                return { ...prev, services: [...prev.services, serviceId] };
            }
        });
    };

    const handleAddPackage = async (e) => {
        e.preventDefault();
        if (newPackage.services.length === 0) {
            alert("Please select at least one service for the package.");
            return;
        }
        try {
            await packageService.addPackage({
                ...newPackage,
                price: Number(newPackage.price)
            });
            setShowAddModal(false);
            setNewPackage({ packageName: '', services: [], price: '' });
            fetchData();
        } catch (error) {
            console.error("Failed to add package:", error);
            alert("Error creating package. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Service Packages</h1>
                    <p className="text-sm text-gray-500 mt-1">Bundled services with discounted pricing</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Package
                </button>
            </div>

            {/* Modal for creating package */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">Design New Package</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPackage} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Bridal Glow Up"
                                        className="input-field w-full"
                                        value={newPackage.packageName}
                                        onChange={(e) => setNewPackage({...newPackage, packageName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Price ($)</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="input-field w-full"
                                        value={newPackage.price}
                                        onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Include Services</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    {services.map(s => (
                                        <div 
                                            key={s._id}
                                            onClick={() => toggleServiceSelection(s._id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                                newPackage.services.includes(s._id)
                                                    ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500'
                                                    : 'bg-white border-gray-200 hover:border-primary-300'
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{s.serviceName}</p>
                                                <p className="text-[10px] text-gray-500">${s.price}</p>
                                            </div>
                                            {newPackage.services.includes(s._id) && (
                                                <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Selected: {newPackage.services.length} services</p>
                            </div>

                            <div className="flex space-x-3 pt-6 flex-shrink-0">
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
                                    Confirm Package
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
                    {packages.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No active packages configured.</p>
                        </div>
                    ) : (
                        packages.map((pkg) => (
                            <div key={pkg._id} className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">{pkg.packageName}</h3>
                                    <span className="text-2xl font-bold text-primary-600">${pkg.price}</span>
                                </div>
                                <div className="space-y-2 mb-6 flex-grow">
                                    {pkg.services?.map((service, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            <span>{service.serviceName || service}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium border border-gray-200">
                                    Edit Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Packages;
