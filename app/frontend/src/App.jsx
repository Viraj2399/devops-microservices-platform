import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-cyan-400">
            DevOps Microservices Platform 🚀
          </h1>
          <p className="mt-2 text-slate-300">
            React + Node.js + Supabase + Docker + CI/CD
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            👥 Users Service
          </h2>

          {/* Loading */}
          {loading && (
            <p className="text-slate-400 animate-pulse">
              Loading users...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400">
              ❌ {error}
            </p>
          )}

          {/* Empty state */}
          {!loading && users.length === 0 && (
            <p className="text-slate-400">
              No users found.
            </p>
          )}

          {/* Users list */}
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-400 transition"
              >
                <span className="font-medium">{u.username}</span>
                <span className="text-xs text-slate-400">
                  ID: {u.id}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-8 text-sm">
          Built for DevOps Internship · GitHub Actions · AKS · GitOps
        </p>
      </div>
    </div>
  );
}
