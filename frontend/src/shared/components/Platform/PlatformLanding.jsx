import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlatformLanding = () => {
  const navigate = useNavigate();

  const handleSalonSelection = (subdomain) => {
    // Navigate to the salon's public page which will trigger TenantContext resolution
    window.location.href = `/t/${subdomain}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Bria Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select a salon to explore or manage.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <button
              onClick={() => handleSalonSelection('test-salon')}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Enter 'Test Salon'
            </button>
            <button
              onClick={() => handleSalonSelection('bria-premium')}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Enter 'Bria Premium'
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformLanding;
