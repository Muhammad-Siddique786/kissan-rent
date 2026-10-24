import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";

const labels = {
  users: "Total Users", owners: "Machine Owners", machinery: "Machinery", bookings: "Bookings",
  active: "Active Rentals", completed: "Completed", pendingUsers: "Pending Verification",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  const load = () => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/users", { params: { status: "pending" } }).then((res) => setUsers(res.data));
  };
  useEffect(() => { load(); }, []);

  const verify = async (id, status) => {
    try { await api.put(`/admin/users/${id}/verify`, { status }); load(); } catch (err) { alert(errMsg(err)); }
  };

  // CNIC image token ke saath chahiye, is liye blob ke taur par kholte hain
  const viewCnic = async (id, side) => {
    try {
      const res = await api.get(`/admin/users/${id}/cnic/${side}`, { responseType: "blob" });
      window.open(URL.createObjectURL(res.data), "_blank");
    } catch (err) { alert(errMsg(err)); }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(labels).map(([k, label]) => (
          <div key={k} className="card text-center">
            <p className="text-3xl font-bold text-green-700">{stats[k] ?? 0}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">CNIC Verification Pending</h2>
        {users.length === 0 && <p className="text-gray-500">Koi pending user nahi.</p>}
        {users.map((u) => (
          <div key={u._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{u.name} <span className="text-sm text-gray-500">({u.role})</span></p>
              <p className="text-sm text-gray-500">{u.email} · {u.phone} · CNIC {u.cnicNumber}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={() => viewCnic(u._id, "front")}>Front</button>
              <button className="btn-outline" onClick={() => viewCnic(u._id, "back")}>Back</button>
              <button className="btn" onClick={() => verify(u._id, "approved")}>Approve</button>
              <button className="btn-outline" onClick={() => verify(u._id, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
