const SearchBar = () => {
  return (
    <div className="my-4">
      <input
        type="text"
        placeholder="Search doctors or departments"
        className="w-full max-w-xl border rounded px-4 py-2"
      />
    </div>
  );
};

export default SearchBar;
