import { useState, useEffect } from 'react';
import { 
  Users, 
  Scissors, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { dashboardService } from './dashboardService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalServices: 0,
    totalUsers: 0,
    recentBookings: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      
      // If backend returns the full aggregated data
      if (data && data.totalBookings !== undefined) {
        setDashboardData(data);
      } else {
        // Fallback or local calculation if backend doesn't aggregate yet
        // In a real Clean Architecture, the service would handle this.
        setDashboardData({
          totalBookings: data.totalBookings || 0,
          totalServices: data.totalServices || 0,
          totalUsers: data.totalUsers || 0,
          recentBookings: data.recentBookings || [],
          topServices: data.topServices || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback/Mock remains if needed
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Services',
      value: dashboardData.totalServices,
      icon: Scissors,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Revenue',
      value: '$12,450',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of salon operations and metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-md flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
          
            <div className="space-y-3">
              {dashboardData.recentBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                      <p className="text-xs text-gray-500">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900">{booking.time}</p>
                    <div className="flex items-center mt-1">
                      {booking.status === 'confirmed' ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 text-yellow-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Top Services</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(service.bookings / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left">
              <Scissors className="w-6 h-6 text-gray-600 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">Add New Service</h3>
              <p className="text-xs text-gray-500 mt-1">Create a new salon service</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left">
              <Calendar className="w-6 h-6 text-gray-600 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">View Bookings</h3>
              <p className="text-xs text-gray-500 mt-1">Manage appointments</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-left">
              <TrendingUp className="w-6 h-6 text-gray-600 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">View Analytics</h3>
              <p className="text-xs text-gray-500 mt-1">Check performance metrics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
