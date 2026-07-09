import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const baseClass = 'text-sm transition hover:text-white';
  const activeClass = `${baseClass} text-blue-400`;

  return (
    <nav className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-white">DoctorTrust Network</h1>
          <p className="text-sm text-slate-400">Safety • Verification • Support</p>
        </div>
        <div className="flex gap-4 text-slate-300">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : baseClass)}>
            Home
          </NavLink>
          <NavLink to="/doctors" className={({ isActive }) => (isActive ? activeClass : baseClass)}>
            Doctors
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => (isActive ? activeClass : baseClass)}>
            Support
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? activeClass : baseClass)}>
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
