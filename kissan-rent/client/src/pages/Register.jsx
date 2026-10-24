import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", cnicNumber: "", role: "farmer" });
  const [files, setFiles] = useState({ cnicFront: null, cnicBack: null });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (files.cnicFront) data.append("cnicFront", files.cnicFront);
    if (files.cnicBack) data.append("cnicBack", files.cnicBack);
    try {
      await register(data);
      navigate("/");
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-3">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      <select className="input" value={form.role} onChange={set("role")}>
        <option value="farmer">Farmer (machinery kiraye par lena)</option>
        <option value="owner">Owner (machinery kiraye par dena)</option>
      </select>
      <input className="input" placeholder="Poora naam" required value={form.name} onChange={set("name")} />
      <input className="input" type="email" placeholder="Email" required value={form.email} onChange={set("email")} />
      <input className="input" placeholder="Phone (03xxxxxxxxx)" required value={form.phone} onChange={set("phone")} />
      <input className="input" type="password" placeholder="Password (min 6)" required value={form.password} onChange={set("password")} />
      <input className="input" placeholder="CNIC (13 digits, dashes ke baghair)" required maxLength={13}
        value={form.cnicNumber} onChange={set("cnicNumber")} />
      <label className="block text-sm">CNIC front photo
        <input type="file" accept="image/*" required className="input mt-1" onChange={(e) => setFiles({ ...files, cnicFront: e.target.files[0] })} />
      </label>
      <label className="block text-sm">CNIC back photo
        <input type="file" accept="image/*" required className="input mt-1" onChange={(e) => setFiles({ ...files, cnicBack: e.target.files[0] })} />
      </label>
      <button className="btn w-full">Register</button>
    </form>
  );
}
