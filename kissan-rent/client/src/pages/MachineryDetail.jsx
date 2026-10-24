import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errMsg } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MachineryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [m, setM] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => { api.get(`/machinery/${id}`).then((res) => setM(res.data)); }, [id]);

  const book = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bookings", { machineryId: id, ...dates });
      setMsg({ type: "ok", text: "Booking request bhej di gayi. Owner ke approve karne ka intezar karein." });
    } catch (err) { setMsg({ type: "err", text: errMsg(err) }); }
  };

  if (!m) return <p>Loading...</p>;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card">
        {m.images[0] && <img src={`/uploads/machinery/${m.images[0]}`} alt={m.name} className="mb-4 w-full rounded-lg" />}
        <h1 className="text-2xl font-bold">{m.name}</h1>
        <p className="text-gray-500">{m.category} · {m.district}{m.city && `, ${m.city}`}</p>
        <p className="my-3">{m.description}</p>
        <p className="text-xl font-bold text-green-700">Rs {m.pricePerDay} / din</p>
        <p className="mt-2 text-sm">Owner: {m.owner?.name}</p>
      </div>

      <div className="card h-fit">
        <h2 className="mb-3 text-lg font-semibold">Booking karein</h2>
        {!user ? (
          <p>Booking ke liye pehle <Link to="/login" className="text-green-700 underline">login</Link> karein.</p>
        ) : user.role !== "farmer" ? (
          <p className="text-gray-500">Sirf farmer account booking kar sakta hai.</p>
        ) : (
          <form onSubmit={book} className="space-y-3">
            {msg.text && <p className={`rounded p-2 text-sm ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{msg.text}</p>}
            <label className="block text-sm">Start date
              <input type="date" className="input mt-1" required onChange={(e) => setDates({ ...dates, startDate: e.target.value })} />
            </label>
            <label className="block text-sm">End date
              <input type="date" className="input mt-1" required onChange={(e) => setDates({ ...dates, endDate: e.target.value })} />
            </label>
            <button className="btn w-full">Booking request bhejein</button>
          </form>
        )}
      </div>
    </div>
  );
}
