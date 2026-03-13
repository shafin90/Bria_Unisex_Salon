import { useState, useEffect } from 'react';
import { Package, Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { inventoryService } from './inventoryService';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: '',
        category: '',
        price: '',
        stockQuantity: ''
    });

    useEffect(() => {
    fetchInventory();
  }, []);

  // Animate inventory list
  useEffect(() => {
    if (inventory.length > 0 && !loading) {
      gsap.fromTo('.inventory-item', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [inventory, loading]);

  const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await inventoryService.getAllItems();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await inventoryService.addItem({
                ...newItem,
                price: Number(newItem.price),
                stockQuantity: Number(newItem.stockQuantity)
            });
            setShowAddModal(false);
            setNewItem({ itemName: '', category: '', price: '', stockQuantity: '' });
            fetchInventory();
        } catch (error) {
            console.error("Failed to add item:", error);
            alert("Error adding item. Please try again.");
        }
    };

    const handleUpdateStock = async (id, currentStock) => {
        const adjustment = prompt("Enter stock adjustment (e.g. 5 to add, -3 to subtract):");
        if (!adjustment || isNaN(adjustment)) return;
        
        try {
            await inventoryService.updateStock(id, Number(adjustment));
            fetchInventory();
        } catch (error) {
            console.error("Failed to update stock:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage salon products and stock levels</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                </button>
            </div>

            {/* Modal for adding items */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Inventory Item</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="input-field w-full"
                                    value={newItem.itemName}
                                    onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select 
                                    required
                                    className="input-field w-full"
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Hair Care">Hair Care</option>
                                    <option value="Skin Care">Skin Care</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="input-field w-full"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="input-field w-full"
                                        value={newItem.stockQuantity}
                                        onChange={(e) => setNewItem({...newItem, stockQuantity: e.target.value})}
                                    />
                                </div>
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
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Items</p>
                            <p className="text-2xl font-bold">{items.length}</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Low Stock Alert</p>
                            <p className="text-2xl font-bold">{items.filter(i => i.stockQuantity < 5).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search inventory..." 
                            className="input-field pl-10 w-full"
                        />
                    </div>
                    <button 
                        onClick={fetchInventory}
                        className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-3">Item Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mb-2"></div>
                                        <p>Loading inventory...</p>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No items found in inventory.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.itemName}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-semibold">${item.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                item.stockQuantity < 5 
                                                    ? 'bg-red-50 text-red-700 border border-red-100' 
                                                    : 'bg-green-50 text-green-700 border border-green-100'
                                            }`}>
                                                {item.stockQuantity} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleUpdateStock(item._id, item.stockQuantity)}
                                                className="text-primary-600 hover:text-primary-700 font-bold text-sm"
                                            >
                                                Adjust Stock
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

export default Inventory;
