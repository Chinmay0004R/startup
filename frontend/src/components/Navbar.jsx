const Navbar = () => {
  return (
    <nav className="p-4 bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-semibold">Hospital Management</h1>
        <div className="space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Doctors</a>
          <a href="#" className="hover:underline">Login</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
