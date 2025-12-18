/**
 * Session sync service for cross-device login
 * Uses a simple sync code mechanism
 */

const SESSION_CODES_KEY = 'ct_sync_codes_v1';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

function generateSyncCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function createSessionSyncCode(username, profilePhoto = null) {
  try {
    const code = generateSyncCode();
    const codes = JSON.parse(localStorage.getItem(SESSION_CODES_KEY) || '{}');
    
    codes[code] = {
      username,
      profilePhoto,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL,
    };
    
    // Clean up expired codes
    Object.keys(codes).forEach((key) => {
      if (codes[key].expiresAt < Date.now()) {
        delete codes[key];
      }
    });
    
    localStorage.setItem(SESSION_CODES_KEY, JSON.stringify(codes));
    return code;
  } catch (err) {
    console.error('Failed to create sync code:', err);
    return null;
  }
}

export function validateAndUseSyncCode(code) {
  try {
    const codes = JSON.parse(localStorage.getItem(SESSION_CODES_KEY) || '{}');
    const syncData = codes[code];
    
    if (!syncData) {
      return { success: false, error: 'Invalid or expired code' };
    }
    
    if (syncData.expiresAt < Date.now()) {
      delete codes[code];
      localStorage.setItem(SESSION_CODES_KEY, JSON.stringify(codes));
      return { success: false, error: 'Code has expired' };
    }
    
    // Use code once and delete it
    delete codes[code];
    localStorage.setItem(SESSION_CODES_KEY, JSON.stringify(codes));
    
    return {
      success: true,
      username: syncData.username,
      profilePhoto: syncData.profilePhoto,
    };
  } catch (err) {
    console.error('Failed to validate sync code:', err);
    return { success: false, error: 'Error validating code' };
  }
}

export function getAllActiveSyncCodes() {
  try {
    const codes = JSON.parse(localStorage.getItem(SESSION_CODES_KEY) || '{}');
    const active = {};
    
    Object.entries(codes).forEach(([code, data]) => {
      if (data.expiresAt > Date.now()) {
        active[code] = {
          username: data.username,
          createdAt: new Date(data.createdAt).toLocaleString(),
          expiresAt: new Date(data.expiresAt).toLocaleString(),
        };
      }
    });
    
    return active;
  } catch {
    return {};
  }
}

export function revokeSyncCode(code) {
  try {
    const codes = JSON.parse(localStorage.getItem(SESSION_CODES_KEY) || '{}');
    delete codes[code];
    localStorage.setItem(SESSION_CODES_KEY, JSON.stringify(codes));
    return true;
  } catch {
    return false;
  }
}

export function revokeAllSyncCodes() {
  try {
    localStorage.removeItem(SESSION_CODES_KEY);
    return true;
  } catch {
    return false;
  }
}
