export const API_PREFIX = '/api';
export const DEFAULT_PORT = 3333;
export const DEFAULT_HOST = '0.0.0.0';

export const ROLE_PERMISSIONS = {
  super_admin: ['all'],
  admin: ['users', 'properties', 'cohosts', 'payments', 'services'],
  supervisor: ['properties', 'cohosts', 'services'],
};
