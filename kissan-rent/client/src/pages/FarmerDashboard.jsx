import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import { useAuth } from "../context/AuthContext";

const color = {
  pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800", completed: "bg-blue-100 text-blue-800", cancelled: "bg-gray-100 text-gray-600",
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const load = () => api.get("/bookings/mine").then((res) => setBookings(res.data));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    try { await api.put(`/bookings/${id}/cancel`); load(); } catch (err) { alert(errMsg(err)); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Farmer Dashboard: My Bookings</h1>
      {user.verificationStatus !== "approved" && (
        <p className="rounded bg-yellow-50 p-3 text-sm text-yellow-800">
          Aap ka CNIC verification status: <b>{user.verificationStatus}</b>. Booking ke liye admin ka approve karna zaroori hai.
        </p>
      )}
      {bookings.length === 0 && <p className="text-gray-500">Abhi koi booking nahi.</p>}
      {bookings.map((b) => (
        <div key={b._id} className="card flex items-center justify-between">
          <div>
            <p className="font-semibold">{b.machinery?.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} · Rs {b.totalPrice}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${color[b.status]}`}>{b.status}</span>
            {["pending", "approved"].includes(b.status) && <button className="btn-outline" onClick={() => cancel(b._id)}>Cancel</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
