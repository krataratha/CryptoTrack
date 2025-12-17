import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-xl font-bold">User Dashboard</h2>
        {!user && <p className="text-sm muted mt-1">Login or Signup to personalize your experience.</p>}
        {user && <p className="text-sm mt-1">Welcome back, <span className="font-semibold">{user.username}</span>!</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <p className="text-xs muted mt-1">No activity recorded yet.</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Preferences</h3>
          <p className="text-xs muted mt-1">Configure currency, alerts, and privacy in Settings.</p>
        </div>
      </div>
    </div>
  );
}
