import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import Footer from '../components/Footer';

const Home = ({ health }) => {
  const featuredDoctors = [
    {
      name: 'Dr. Sara Khan',
      specialty: 'Cardiology',
      hospital: 'City General Hospital',
      verified: true,
      yearsExperience: 12,
    },
    {
      name: 'Dr. Ali Hassan',
      specialty: 'Emergency Medicine',
      hospital: 'SafeCare Clinic',
      verified: true,
      yearsExperience: 15,
    },
    {
      name: 'Dr. Ayesha Malik',
      specialty: 'Pediatrics',
      hospital: 'Bright Children Hospital',
      verified: true,
      yearsExperience: 9,
    },
  ];

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-6 space-y-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-900/20">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">Doctor Safety & Trust Network</p>
          <h2 className="text-4xl font-bold text-white">Secure, verified care for doctors, patients, and communities.</h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Connect with verified medical professionals, request emergency support, and report misconduct safely through one trusted platform.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">Verified doctor profiles</span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">SOS support network</span>
            <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-purple-300">Complaint review workflow</span>
          </div>
          <p className="mt-6 text-sm text-slate-500">Backend status: {health || 'Checking connection...'}</p>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold text-white">Find a Verified Doctor</h3>
          <SearchBar />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.name} {...doctor} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Emergency Response</h3>
            <p className="mt-2 text-sm text-slate-400">Doctors can trigger an SOS alert and receive rapid support from retired police officers and local authorities.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Complaint Review</h3>
            <p className="mt-2 text-sm text-slate-400">Reports are collected, verified, and routed to the appropriate authorities only after review.</p>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
