const SearchBar = () => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search for a verified doctor, specialty, or hospital"
        className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0"
      />
    </div>
  );
};

export default SearchBar;
