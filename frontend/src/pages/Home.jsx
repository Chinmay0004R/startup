import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Find a Doctor</h2>
        <SearchBar />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DoctorCard name="Dr. Sara Khan" specialty="Cardiology" />
          <DoctorCard name="Dr. Ali Hassan" specialty="Neurology" />
          <DoctorCard name="Dr. Ayesha Malik" specialty="Pediatrics" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
