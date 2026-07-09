import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createDoctor, fetchDoctors } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    email: '',
    hospital: '',
    clinic_address: '',
    years_experience: 0,
    certification: '',
    bio: '',
    availability: '',
    verified: false,
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      setStatus('Unable to load doctors right now.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        years_experience: Number(form.years_experience),
      };
      const created = await createDoctor(payload);
      setDoctors((current) => [created, ...current]);
      setStatus(`Doctor registered: ${created.name}`);
      setForm({
        name: '',
        specialty: '',
        email: '',
        hospital: '',
        clinic_address: '',
        years_experience: 0,
        certification: '',
        bio: '',
        availability: '',
        verified: false,
      });
    } catch (error) {
      setStatus('Registration failed.');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto space-y-8 p-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <h2 className="text-3xl font-semibold text-white">Doctor registration</h2>
          <p className="mt-2 text-slate-400">Create a profile that can be reviewed and trusted by patients and peers.</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Specialty" value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} required />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Hospital or affiliated clinic" value={form.hospital} onChange={(event) => setForm({ ...form, hospital: event.target.value })} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Clinic address" value={form.clinic_address} onChange={(event) => setForm({ ...form, clinic_address: event.target.value })} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" type="number" placeholder="Years of experience" value={form.years_experience} onChange={(event) => setForm({ ...form, years_experience: event.target.value })} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Medical certification / license" value={form.certification} onChange={(event) => setForm({ ...form, certification: event.target.value })} />
            <textarea className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Short professional biography" rows="3" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Availability (e.g. Mon-Fri, 9am-5pm)" value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })} />
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" checked={form.verified} onChange={(event) => setForm({ ...form, verified: event.target.checked })} />
              Verified doctor
            </label>
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white" type="submit">Create profile</button>
            {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
          </form>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Verified doctors</h3>
            <div className="mt-4 space-y-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{doctor.name}</p>
                    {doctor.verified ? <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Verified</span> : null}
                  </div>
                  <p className="text-sm text-slate-400">{doctor.specialty}</p>
                  <p className="text-sm text-slate-500">{doctor.hospital || 'Pending verification'}</p>
                  {doctor.certification ? <p className="mt-1 text-xs text-slate-500">{doctor.certification}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
