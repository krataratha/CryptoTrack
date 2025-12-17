const TX_PREFIX = 'ct_tx_v1:';

function keyForUser(username) {
  return `${TX_PREFIX}${username}`;
}

export function getUserTransactions(username) {
  if (!username) return [];
  try {
    const raw = localStorage.getItem(keyForUser(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addUserTransaction(username, tx) {
  if (!username) throw new Error('NO_USER');
  const list = getUserTransactions(username);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    ...tx,
  };
  const next = [entry, ...list].slice(0, 500);
  localStorage.setItem(keyForUser(username), JSON.stringify(next));
  return entry;
}

export function getLatestTransaction(username) {
  const list = getUserTransactions(username);
  return list[0] || null;
}
