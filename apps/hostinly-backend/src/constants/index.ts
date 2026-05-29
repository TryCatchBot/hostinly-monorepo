export const API_PREFIX = '/api';
export const DEFAULT_PORT = 3333;
export const DEFAULT_HOST = '0.0.0.0';

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['all'],
  ADMIN: ['users', 'properties', 'cohosts', 'payments', 'services'],
  SUPERVISOR: ['properties', 'cohosts', 'services'],
  FACILITY_MANAGER: ['properties', 'services'],
};
