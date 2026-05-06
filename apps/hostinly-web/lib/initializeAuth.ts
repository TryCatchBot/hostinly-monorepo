// This file initializes demo accounts in localStorage for testing
// This runs once when the app first loads

export function initializeDemoAccounts() {
  if (typeof window === 'undefined') return;

  const existingUsers = localStorage.getItem('hostinly_users');
  
  // Only initialize if users don't exist
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 'host-1',
        email: 'host@example.com',
        password: 'password123',
        name: 'John Host',
        userType: 'host' as const,
      },
      {
        id: 'cohost-1',
        email: 'cohost@example.com',
        password: 'password123',
        name: 'Sarah CoHost',
        userType: 'cohost' as const,
      },
    ];

    localStorage.setItem('hostinly_users', JSON.stringify(demoUsers));
  }
}
