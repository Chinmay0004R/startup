import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createComplaint, fetchComplaints, fetchDoctors } from '../services/api';

const Support = () => {
  const [doctors, setDoctors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [complaintForm, setComplaintForm] = useState({ reporter_name: '', category: '', details: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      const [doctorData, complaintData] = await Promise.all([fetchDoctors(), fetchComplaints()]);
      setDoctors(doctorData);
      setComplaints(complaintData);
    } catch (error) {
      setMessage('Unable to load doctor information right now.');
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    const searchableText = [
      doctor.name,
      doctor.specialty,
      doctor.hospital,
      doctor.clinic_address,
      doctor.certification,
      doctor.bio,
      doctor.availability,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();
    try {
      const created = await createComplaint(complaintForm);
      setComplaints((current) => [created, ...current]);
      setMessage(`Complaint submitted for review.`);
      setComplaintForm({ reporter_name: '', category: '', details: '' });
    } catch (error) {
      setMessage('Complaint submission failed.');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto space-y-8 p-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <h2 className="text-3xl font-semibold text-white">Patient portal</h2>
          <p className="mt-2 text-slate-400">Find verified doctors, view professional details, and submit complaints securely.</p>
        </section>

        {message ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Find a doctor</h3>
            <input
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              placeholder="Search by doctor name, specialty, clinic, certificate, or availability"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="mt-4 space-y-3">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-left"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{doctor.name}</p>
                    {doctor.verified ? <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Verified</span> : null}
                  </div>
                  <p className="text-sm text-slate-400">{doctor.specialty}</p>
                  <p className="text-sm text-slate-500">{doctor.hospital || 'Pending verification'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Doctor profile</h3>
            {selectedDoctor ? (
              <div className="mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                <p className="text-lg font-semibold text-white">{selectedDoctor.name}</p>
                <p><span className="text-slate-500">Specialty:</span> {selectedDoctor.specialty}</p>
                <p><span className="text-slate-500">Clinic:</span> {selectedDoctor.hospital || 'Pending verification'}</p>
                <p><span className="text-slate-500">Experience:</span> {selectedDoctor.years_experience || 0} years</p>
                <p><span className="text-slate-500">Certificate:</span> {selectedDoctor.certification || 'Not uploaded'}</p>
                <p><span className="text-slate-500">Bio:</span> {selectedDoctor.bio || 'Profile details will be added by the doctor.'}</p>
                <p><span className="text-slate-500">Availability:</span> {selectedDoctor.availability || 'To be confirmed'}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Select a doctor to view the full profile.</p>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Complaint chat</h3>
            <form onSubmit={handleComplaintSubmit} className="mt-4 space-y-4">
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Your name" value={complaintForm.reporter_name} onChange={(event) => setComplaintForm({ ...complaintForm, reporter_name: event.target.value })} required />
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Category" value={complaintForm.category} onChange={(event) => setComplaintForm({ ...complaintForm, category: event.target.value })} required />
              <textarea className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Describe your concern" rows="4" value={complaintForm.details} onChange={(event) => setComplaintForm({ ...complaintForm, details: event.target.value })} required />
              <button className="w-full rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white" type="submit">Send complaint</button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Recent complaints</h3>
            <div className="mt-4 space-y-3">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-medium text-white">{complaint.reporter_name}</p>
                  <p className="text-sm text-slate-400">{complaint.category}</p>
                  <p className="text-sm text-slate-500">{complaint.details}</p>
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

export default Support;
