import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import { useAuth } from "../context/AuthContext";

const empty = { name: "", category: "Tractor", description: "", pricePerDay: "", district: "", city: "" };

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState([]);
  const [machines, setMachines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => {
    api.get("/machinery/mine").then((res) => setMachines(res.data));
    api.get("/bookings/requests").then((res) => setRequests(res.data));
  };
  useEffect(() => { load(); }, []);

  const addMachine = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach((f) => data.append("images", f));
    try {
      await api.post("/machinery", data);
      setForm(empty); setMsg("Machinery add ho gayi"); load();
    } catch (err) { setMsg(errMsg(err)); }
  };

  const setStatus = async (id, status) => {
    try { await api.put(`/bookings/${id}/status`, { status }); load(); } catch (err) { alert(errMsg(err)); }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Owner Dashboard</h1>
      {user.verificationStatus !== "approved" && (
        <p className="rounded bg-yellow-50 p-3 text-sm text-yellow-800">
          CNIC status: <b>{user.verificationStatus}</b>. Machinery add karne ke liye admin ka approve karna zaroori hai.
        </p>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <form onSubmit={addMachine} className="card space-y-3">
          <h2 className="text-lg font-semibold">Add Machinery</h2>
          {msg && <p className="text-sm text-green-700">{msg}</p>}
          <input className="input" placeholder="Naam" required value={form.name} onChange={set("name")} />
          <select className="input" value={form.category} onChange={set("category")}>
            {["Tractor", "Harvester", "Thresher", "Sprayer", "Other"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea className="input" placeholder="Description" value={form.description} onChange={set("description")} />
          <input className="input" type="number" placeholder="Price per day (Rs)" required value={form.pricePerDay} onChange={set("pricePerDay")} />
          <input className="input" placeholder="District" required value={form.district} onChange={set("district")} />
          <input className="input" placeholder="City" value={form.city} onChange={set("city")} />
          <input className="input" type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} />
          <button className="btn w-full">Add</button>
        </form>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">My Machinery ({machines.length})</h2>
          {machines.map((m) => (
            <div key={m._id} className="card">
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-gray-500">{m.category} · {m.district} · Rs {m.pricePerDay}/din</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Booking Requests</h2>
        {requests.length === 0 && <p className="text-gray-500">Koi request nahi.</p>}
        {requests.map((b) => (
          <div key={b._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{b.machinery?.name} · {b.farmer?.name} ({b.farmer?.phone})</p>
              <p className="text-sm text-gray-500">
                {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} · Rs {b.totalPrice} · <b>{b.status}</b>
              </p>
            </div>
            <div className="flex gap-2">
              {b.status === "pending" && (<>
                <button className="btn" onClick={() => setStatus(b._id, "approved")}>Approve</button>
                <button className="btn-outline" onClick={() => setStatus(b._id, "rejected")}>Reject</button>
              </>)}
              {b.status === "approved" && <button className="btn" onClick={() => setStatus(b._id, "completed")}>Mark Completed</button>}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
