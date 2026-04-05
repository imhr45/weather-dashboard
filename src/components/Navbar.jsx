const Navbar = ({ activePage, setActivePage }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-0">
        {["current", "historical"].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`py-3 px-5 text-sm font-medium border-b-2 transition-all ${
              activePage === page
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {page === "current" ? "Current & Hourly" : "Historical"}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;