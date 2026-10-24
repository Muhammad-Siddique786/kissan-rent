import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const categories = ["", "Tractor", "Harvester", "Thresher", "Sprayer", "Other"];

export default function Home() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: "", category: "", district: "", maxPrice: "" });

  const load = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get("/machinery", { params }).then((res) => setItems(res.data));
  };
  useEffect(load, []);

  return (
    <div className="space-y-6">
      <div className="card grid gap-3 sm:grid-cols-5">
        <input className="input" placeholder="Naam search karein" value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          {categories.map((c) => <option key={c} value={c}>{c || "Tamam categories"}</option>)}
        </select>
        <input className="input" placeholder="District" value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })} />
        <input className="input" type="number" placeholder="Max price/din" value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button className="btn" onClick={load}>Search</button>
      </div>

      {items.length === 0 && <p className="text-gray-500">Koi machinery nahi mili.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <Link key={m._id} to={`/machinery/${m._id}`} className="card block hover:shadow-md">
            {m.images[0]
              ? <img src={`/uploads/machinery/${m.images[0]}`} alt={m.name} className="mb-3 h-40 w-full rounded-lg object-cover" />
              : <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400">No image</div>}
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-sm text-gray-500">{m.category} · {m.district}</p>
            <p className="mt-1 font-bold text-green-700">Rs {m.pricePerDay} / din</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
