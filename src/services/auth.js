import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'ct_users_v1';
const SESSION_KEY = 'ct_session_v1';

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

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSessionUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function suggestUsernames(base) {
  const users = loadUsers();
  const suggestions = [];
  const normalized = String(base).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15) || 'user';
  for (let i = 1; i <= 5; i++) {
    const candidate = `${normalized}${i}`;
    if (!users[candidate]) suggestions.push(candidate);
  }
  if (suggestions.length < 5) {
    const variants = ['_x', '_dev', '_crypto', '_ai', '_pro'];
    for (const v of variants) {
      const candidate = `${normalized}${v}`;
      if (!users[candidate]) suggestions.push(candidate);
      if (suggestions.length >= 5) break;
    }
  }
  return suggestions;
}

export async function signupUser(username, password) {
  const users = loadUsers();
  const name = String(username).toLowerCase();
  if (users[name]) {
    const suggestions = suggestUsernames(name);
    const err = new Error('USERNAME_TAKEN');
    err.suggestions = suggestions;
    throw err;
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const profile = { username: name, passwordHash: hash, createdAt: Date.now() };
  users[name] = profile;
  saveUsers(users);
  const sessionUser = { username: name };
  setSessionUser(sessionUser);
  return sessionUser;
}

export async function loginUser(username, password) {
  const users = loadUsers();
  const name = String(username).toLowerCase();
  const profile = users[name];
  if (!profile) throw new Error('INVALID_CREDENTIALS');
  const ok = bcrypt.compareSync(password, profile.passwordHash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  const sessionUser = { username: name };
  setSessionUser(sessionUser);
  return sessionUser;
}
