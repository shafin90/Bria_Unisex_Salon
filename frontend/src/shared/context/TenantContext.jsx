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
        const hostname = window.location.hostname;
        const pathParts = window.location.pathname.split('/');
        
        let subdomain = null;

        // 1. Try Subdomain Resolution (e.g. salon1.bria.com)
        const hostParts = hostname.split('.');
        if (hostParts.length > 2 && hostParts[0] !== 'www') {
           subdomain = hostParts[0];
        }

        // 2. Fallback to Path Resolution (e.g. localhost:5173/t/salon1)
        if (!subdomain && pathParts[1] === 't' && pathParts[2]) {
          subdomain = pathParts[2];
        }

        if (subdomain) {
          // In a real app, you'd fetch the tenant metadata here
          setTenant({
            id: 'mock-tenant-id', // Scoped by axios interceptor using subdomain
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
