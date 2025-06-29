/**
 * Authentication utilities for managing multiple users
 */

export interface User {
  username: string;
  password: string;
  displayName?: string;
  roles?: string[];
  description?: string;
}

export interface UserConfig {
  [username: string]: {
    password: string;
    displayName?: string;
    roles?: string[];
    description?: string;
  };
}

/**
 * Parse users from environment variables
 * Supports multiple formats:
 * 1. AUTH_USERS: 
 *    - "user1:pass1,user2:pass2" (without display names)
 *    - "user1:pass1:Display Name 1,user2:pass2:Display Name 2" (with display names - auto-detected)
 * 2. AUTH_USERS_JSON: JSON string with full user configurations
 * 3. Single user: AUTH_USERNAME, AUTH_PASSWORD, AUTH_DISPLAY_NAME
 * 
 * Note: Passwords should be provided in plain text in environment variables.
 * They will be hashed automatically when compared during login.
 */
export function parseUsers(): UserConfig {
  const users: UserConfig = {};
  
  // Try JSON format first (most flexible)
  const authUsersJson = process.env.AUTH_USERS_JSON;
  if (authUsersJson) {
    try {
      const parsedUsers = JSON.parse(authUsersJson);
      Object.assign(users, parsedUsers);
    } catch (error) {
      console.warn('Failed to parse AUTH_USERS_JSON:', error);
    }
  }
  
  // Smart AUTH_USERS format - auto-detects display names
  const authUsers = process.env.AUTH_USERS;
  if (authUsers) {
    authUsers.split(',').forEach(userEntry => {
      const parts = userEntry.trim().split(':');
      if (parts.length >= 2) {
        const [username, password, ...displayNameParts] = parts;
        
        if (username && password) {
          // If there are 3+ parts, treat the rest as display name
          // If only 2 parts, use username as display name
          const displayName = parts.length >= 3 
            ? displayNameParts.join(':').trim() 
            : username;
            
          const description = parts.length >= 3 
            ? 'User from AUTH_USERS (with display name)'
            : 'User from AUTH_USERS (username as display name)';
          
          users[username] = {
            password,
            displayName,
            roles: ['user'],
            description
          };
        }
      }
    });
  }
  
  // Legacy AUTH_USERS_WITH_NAMES support (for backward compatibility)
  const authUsersWithNames = process.env.AUTH_USERS_WITH_NAMES;
  if (authUsersWithNames) {
    authUsersWithNames.split(',').forEach(userEntry => {
      const parts = userEntry.trim().split(':');
      if (parts.length >= 2) {
        const [username, password, ...displayNameParts] = parts;
        const displayName = displayNameParts.join(':').trim() || username;
        if (username && password) {
          users[username] = {
            password,
            displayName,
            roles: ['user'],
            description: 'User from AUTH_USERS_WITH_NAMES'
          };
        }
      }
    });
  }
  
  // Fallback to single user for backward compatibility
  const singleUsername = process.env.AUTH_USERNAME || "admin";
  const singlePassword = process.env.AUTH_PASSWORD || "password123";
  const singleDisplayName = process.env.AUTH_DISPLAY_NAME || singleUsername;
  if (!users[singleUsername]) {
    users[singleUsername] = {
      password: singlePassword,
      displayName: singleDisplayName,
      roles: ['admin'],
      description: 'Default admin user'
    };
  }
  
  return users;
}

/**
 * Get simple username:password mapping for middleware
 */
export function getValidUsers(): Record<string, string> {
  const users = parseUsers();
  const simpleUsers: Record<string, string> = {};
  
  Object.entries(users).forEach(([username, config]) => {
    simpleUsers[username] = config.password;
  });
  
  return simpleUsers;
}

/**
 * Check if a user has a specific role
 */
export function userHasRole(username: string, role: string): boolean {
  const users = parseUsers();
  const user = users[username];
  
  if (!user || !user.roles) {
    return false;
  }
  
  return user.roles.includes(role) || user.roles.includes('admin');
}

/**
 * Get user information
 */
export function getUserInfo(username: string): UserConfig[string] | null {
  const users = parseUsers();
  return users[username] || null;
}

/**
 * Get user display name
 */
export function getUserDisplayName(username: string): string {
  const userInfo = getUserInfo(username);
  return userInfo?.displayName || username;
}

/**
 * List all configured users (without passwords)
 */
export function listUsers(): Array<{username: string, displayName?: string, roles?: string[], description?: string}> {
  const users = parseUsers();
  
  return Object.entries(users).map(([username, config]) => ({
    username,
    displayName: config.displayName,
    roles: config.roles,
    description: config.description
  }));
}