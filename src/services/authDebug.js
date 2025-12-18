// Debug utility for authentication issues
import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'ct_users_v1';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Check if a user exists and debug password issues
 */
export function debugUser(username) {
  const users = loadUsers();
  const name = String(username).toLowerCase().trim();
  const user = users[name];
  
  if (!user) {
    console.log(`❌ User "${name}" not found`);
    console.log('Available users:', Object.keys(users));
    return { exists: false, availableUsers: Object.keys(users) };
  }
  
  console.log(`✅ User "${name}" found`);
  console.log('User data:', {
    username: user.username,
    hasPasswordHash: !!user.passwordHash,
    passwordHashLength: user.passwordHash?.length,
    createdAt: new Date(user.createdAt).toLocaleString(),
  });
  
  return { exists: true, user };
}

/**
 * Test password comparison for debugging
 */
export function testPassword(username, password) {
  const users = loadUsers();
  const name = String(username).toLowerCase().trim();
  const pass = String(password).trim();
  const user = users[name];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  if (!user.passwordHash) {
    return { success: false, error: 'Password hash not stored' };
  }
  
  try {
    const isValid = bcrypt.compareSync(pass, user.passwordHash);
    console.log(`Password test for "${name}":`, isValid ? '✅ VALID' : '❌ INVALID');
    return { success: isValid, hash: user.passwordHash.substring(0, 20) + '...' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Reset a user's password
 */
export function resetPassword(username, newPassword) {
  const users = loadUsers();
  const name = String(username).toLowerCase().trim();
  const pass = String(newPassword).trim();
  const user = users[name];
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const hash = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
  users[name].passwordHash = hash;
  saveUsers(users);
  
  console.log(`✅ Password reset for "${name}"`);
  return { success: true, message: 'Password updated' };
}

/**
 * List all users
 */
export function listAllUsers() {
  const users = loadUsers();
  const usernames = Object.keys(users);
  console.log('Users in database:', usernames);
  return usernames;
}
