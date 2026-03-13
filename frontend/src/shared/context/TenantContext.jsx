import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [tenantError, setTenantError] = useState(null);

  useEffect(() => {
    // Basic resolution strategy: Check URL path for `/t/:subdomain`
    // Alternatively, check localStorage or fallback to null (Platform view)
    const initTenant = async () => {
      try {
        const pathParts = window.location.pathname.split('/');
        // e.g. /t/test-salon/books
        let subdomain = null;
        
        if (pathParts[1] === 't' && pathParts[2]) {
          subdomain = pathParts[2];
        }

        if (subdomain) {
          // Ideally fetch tenant from backend right here:
          // const res = await apiClient.get(`/tenant/resolve/${subdomain}`);
          // For now, we simulate resolving the tenant and setting standard properties
          
          setTenant({
            id: 'mock-tenant-id-will-be-injected', // We will update API later to resolve properly
            subdomain: subdomain,
            name: subdomain.replace('-', ' ').toUpperCase()
          });
        } else {
          setTenant(null);
        }
      } catch (err) {
        console.error("Failed to resolve tenant", err);
        setTenantError(err.message);
      } finally {
        setLoadingTenant(false);
      }
    };

    initTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loadingTenant, tenantError }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
