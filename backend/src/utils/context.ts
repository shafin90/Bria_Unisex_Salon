import { AsyncLocalStorage } from 'async_hooks';

export const context = new AsyncLocalStorage<{ tenantId?: string, admin?: any }>();

export const getTenantId = () => context.getStore()?.tenantId;
export const getAdmin = () => context.getStore()?.admin;
